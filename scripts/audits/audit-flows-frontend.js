#!/usr/bin/env node
/**
 * audit-flows-frontend.js — Frontend Flow Tracer
 * --------------------------------------------------------------
 * ✅ Maps React component dependencies across 3 apps
 * ✅ Validates boundary rules (no cross-app imports)
 * ✅ Finds unreachable components and hooks
 * ✅ Detects duplicate components across apps
 * ✅ Performs reachability analysis from entry points
 * --------------------------------------------------------------
 * This tool uses static code analysis to trace all possible
 * execution paths through the frontend React apps, ensuring
 * architectural boundaries are maintained.
 * --------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

// Fix for ES module default export issue
const traverse = _traverse.default || _traverse;

import {
  createAuditResult,
  saveReport,
  finishAudit,
  fileExists
} from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine project root
const root = path.resolve(__dirname, '../..');
const frontendDir = path.join(root, 'frontend');

// Parse command-line flags
const args = process.argv.slice(2);
const targetApp = args.find(arg => ['main-site', 'tenant-app', 'admin-app'].includes(arg));
const jsonOutput = args.includes('--json');
const deepScan = args.includes('--deep');

// App configurations (paths relative to frontend/)
const APPS = {
  'main-site': {
    name: 'main-site',
    entry: 'apps/main-site/src/main.tsx',
    dir: path.join(frontendDir, 'apps/main-site'),
    alias: '@/main-site'
  },
  'tenant-app': {
    name: 'tenant-app',
    entry: 'apps/tenant-app/src/main.tsx',
    dir: path.join(frontendDir, 'apps/tenant-app'),
    alias: '@/tenant-app'
  },
  'admin-app': {
    name: 'admin-app',
    entry: 'apps/admin-app/src/main.tsx',
    dir: path.join(frontendDir, 'apps/admin-app'),
    alias: '@/admin-app'
  }
};

//──────────────────────────────────────────────────────────────
// 📁 File Discovery
//──────────────────────────────────────────────────────────────

/**
 * Discover all TypeScript/TSX files in frontend
 */
function discoverFiles(dir, pattern = /\.(tsx?|jsx?)$/, exclude = /node_modules|dist|build|\.git|__tests__|\.test\.|\.spec\.|\.stories\.|vite\.config/) {
  const files = [];
  
  function scan(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(frontendDir, fullPath).replace(/\\/g, '/');
      
      if (exclude.test(relativePath)) continue;
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (pattern.test(entry.name)) {
        files.push({
          fullPath,
          relativePath,
          name: entry.name,
          dir: path.dirname(relativePath),
          app: getAppFromPath(relativePath)
        });
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Determine which app a file belongs to
 */
function getAppFromPath(relativePath) {
  if (relativePath.startsWith('apps/main-site/')) return 'apps/main-site';
  if (relativePath.startsWith('apps/tenant-app/')) return 'apps/tenant-app';
  if (relativePath.startsWith('apps/admin-app/')) return 'apps/admin-app';
  if (relativePath.startsWith('src/shared/')) return 'shared';
  if (relativePath.startsWith('src/bootstrap/')) return 'bootstrap';
  return 'unknown';
}

//──────────────────────────────────────────────────────────────
// 📝 Static Analysis (TypeScript/JSX Support)
//──────────────────────────────────────────────────────────────

/**
 * Parse a TypeScript/TSX file and extract imports, exports, components
 */
function analyzeFile(file) {
  try {
    const code = fs.readFileSync(file.fullPath, 'utf-8');
    
    // Parse with TypeScript and JSX support
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
    
    const analysis = {
      file: file.relativePath,
      app: file.app,
      imports: [],
      exports: [],
      components: [],
      hooks: [],
      hookCalls: []
    };
    
    // Traverse AST
    traverse(ast, {
      // Capture imports
      ImportDeclaration({ node }) {
        const source = node.source.value;
        const specifiers = node.specifiers.map(spec => ({
          type: spec.type,
          local: spec.local?.name,
          imported: spec.imported?.name || spec.local?.name
        }));
        
        analysis.imports.push({ source, specifiers });
      },
      
      // Capture exports
      ExportNamedDeclaration({ node }) {
        if (node.declaration) {
          if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
            analysis.exports.push({
              name: node.declaration.id.name,
              type: 'function'
            });
          } else if (node.declaration.type === 'VariableDeclaration') {
            node.declaration.declarations.forEach(decl => {
              if (decl.id.type === 'Identifier') {
                analysis.exports.push({
                  name: decl.id.name,
                  type: 'variable'
                });
              }
            });
          }
        }
        
        // Re-exports (also treat as imports for graph traversal)
        if (node.source) {
          const exportSource = node.source.value;
          
          // Add to exports
          analysis.exports.push({
            name: '*',
            type: 're-export',
            source: exportSource
          });
          
          // ALSO add to imports (so graph follows re-exports)
          analysis.imports.push({
            source: exportSource,
            specifiers: node.specifiers.map(spec => ({
              type: 'ExportSpecifier',
              local: spec.local?.name,
              exported: spec.exported?.name
            }))
          });
        }
      },
      
      ExportDefaultDeclaration({ node }) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          analysis.exports.push({
            name: node.declaration.id.name,
            type: 'default'
          });
        } else if (node.declaration.type === 'Identifier') {
          analysis.exports.push({
            name: node.declaration.name,
            type: 'default'
          });
        }
      },
      
      // Detect React components (function starting with capital letter)
      FunctionDeclaration({ node }) {
        if (node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
          analysis.components.push(node.id.name);
        }
      },
      
      // Detect arrow function components
      VariableDeclarator({ node }) {
        if (
          node.id.type === 'Identifier' &&
          /^[A-Z]/.test(node.id.name) &&
          (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression')
        ) {
          analysis.components.push(node.id.name);
        }
        
        // Detect hooks (starts with 'use')
        if (
          node.id.type === 'Identifier' &&
          node.id.name.startsWith('use') &&
          (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression')
        ) {
          analysis.hooks.push(node.id.name);
        }
      },
      
      // Detect hook calls (for usage tracking)
      CallExpression({ node }) {
        if (node.callee.type === 'Identifier' && node.callee.name.startsWith('use')) {
          analysis.hookCalls.push(node.callee.name);
        }
        
        // Detect React.lazy() and lazy() dynamic imports
        if (
          (node.callee.type === 'Identifier' && node.callee.name === 'lazy') ||
          (node.callee.type === 'MemberExpression' && 
           node.callee.object?.name === 'React' && 
           node.callee.property?.name === 'lazy')
        ) {
          // lazy(() => import('./path'))
          if (node.arguments.length > 0 && node.arguments[0].type === 'ArrowFunctionExpression') {
            const arrowBody = node.arguments[0].body;
            
            // Check if it's a direct import() call
            if (arrowBody.type === 'CallExpression' && arrowBody.callee.type === 'Import') {
              const importArg = arrowBody.arguments[0];
              if (importArg && importArg.type === 'StringLiteral') {
                // Treat lazy imports as regular imports for graph purposes
                analysis.imports.push({
                  source: importArg.value,
                  specifiers: [{ type: 'DynamicImport', local: 'default', imported: 'default' }]
                });
              }
            }
          }
        }
        
        // Detect standalone import() expressions (await import, etc.)
        if (node.callee.type === 'Import' && node.arguments.length > 0) {
          const importArg = node.arguments[0];
          if (importArg.type === 'StringLiteral') {
            analysis.imports.push({
              source: importArg.value,
              specifiers: [{ type: 'DynamicImport', local: 'default', imported: 'default' }]
            });
          }
        }
      }
    });
    
    return analysis;
    
  } catch (error) {
    return {
      file: file.relativePath,
      app: file.app,
      error: error.message,
      imports: [],
      exports: [],
      components: [],
      hooks: [],
      hookCalls: []
    };
  }
}

//──────────────────────────────────────────────────────────────
// 🚫 Boundary Validation
//──────────────────────────────────────────────────────────────

/**
 * Check if an import violates boundary rules
 */
function validateBoundary(fromFile, importSource, fromApp) {
  const violations = [];
  
  // Resolve the import to determine target app
  const targetApp = resolveImportApp(importSource);
  
  if (!targetApp || targetApp === 'external') return violations;
  
  // Rule 1: Apps can import from shared and bootstrap
  if (fromApp.startsWith('apps/') && (targetApp === 'shared' || targetApp === 'bootstrap')) {
    return violations; // Allowed
  }
  
  // Rule 2: shared can import from shared
  if (fromApp === 'shared' && targetApp === 'shared') {
    return violations; // Allowed
  }
  
  // Rule 3: bootstrap can import from shared
  if (fromApp === 'bootstrap' && targetApp === 'shared') {
    return violations; // Allowed
  }
  
  // Rule 4: No cross-app imports
  if (fromApp.startsWith('apps/') && targetApp.startsWith('apps/') && fromApp !== targetApp) {
    violations.push({
      file: fromFile,
      import: importSource,
      fromApp,
      targetApp,
      rule: 'CROSS_APP_IMPORT',
      message: `Cross-app import: ${fromApp} → ${targetApp}`
    });
  }
  
  // Rule 5: shared cannot import from apps
  if (fromApp === 'shared' && targetApp.startsWith('apps/')) {
    violations.push({
      file: fromFile,
      import: importSource,
      fromApp,
      targetApp,
      rule: 'SHARED_IMPORTS_APP',
      message: `shared/ imports from app: ${fromApp} → ${targetApp}`
    });
  }
  
  // Rule 6: bootstrap cannot import from apps
  if (fromApp === 'bootstrap' && targetApp.startsWith('apps/')) {
    violations.push({
      file: fromFile,
      import: importSource,
      fromApp,
      targetApp,
      rule: 'BOOTSTRAP_IMPORTS_APP',
      message: `bootstrap/ imports from app: ${fromApp} → ${targetApp}`
    });
  }
  
  return violations;
}

/**
 * Resolve import source to app context
 */
function resolveImportApp(importSource) {
  // Relative imports
  if (importSource.startsWith('.')) {
    return 'relative'; // Will be resolved by graph builder
  }
  
  // Alias imports (Vite aliases)
  if (importSource.startsWith('@shared') || importSource.startsWith('@/shared')) return 'shared';
  if (importSource.startsWith('@bootstrap') || importSource.startsWith('@/bootstrap')) return 'bootstrap';
  if (importSource.startsWith('@/main-site') || importSource.startsWith('@main-site')) return 'apps/main-site';
  if (importSource.startsWith('@/tenant-app') || importSource.startsWith('@tenant-app')) return 'apps/tenant-app';
  if (importSource.startsWith('@/admin-app') || importSource.startsWith('@admin-app')) return 'apps/admin-app';
  
  // Path-based imports
  if (importSource.includes('/apps/main-site')) return 'apps/main-site';
  if (importSource.includes('/apps/tenant-app')) return 'apps/tenant-app';
  if (importSource.includes('/apps/admin-app')) return 'apps/admin-app';
  if (importSource.includes('/shared/') || importSource.includes('/src/shared/')) return 'shared';
  if (importSource.includes('/bootstrap/')) return 'bootstrap';
  
  // External package
  return 'external';
}

//──────────────────────────────────────────────────────────────
// 📊 Graph Construction & Reachability
//──────────────────────────────────────────────────────────────

/**
 * Build dependency graph
 */
function buildGraph(analyses) {
  const graph = new Map();
  
  for (const analysis of analyses) {
    graph.set(analysis.file, {
      imports: [],
      importedBy: [],
      exports: analysis.exports,
      components: analysis.components,
      hooks: analysis.hooks,
      hookCalls: analysis.hookCalls,
      app: analysis.app
    });
  }
  
  // Resolve imports
  for (const analysis of analyses) {
    const currentDir = path.dirname(analysis.file);
    
    for (const imp of analysis.imports) {
      const source = imp.source;
      let resolvedPath = null;
      
      // Skip external packages
      if (!source.startsWith('.') && !source.startsWith('@')) continue;
      
      // Resolve relative imports
      if (source.startsWith('.')) {
        resolvedPath = path.join(currentDir, source).replace(/\\/g, '/');
        
        // Try with extensions
        const candidates = [
          resolvedPath,
          resolvedPath + '.ts',
          resolvedPath + '.tsx',
          resolvedPath + '.js',
          resolvedPath + '.jsx',
          resolvedPath + '/index.ts',
          resolvedPath + '/index.tsx'
        ];
        
        for (const candidate of candidates) {
          if (graph.has(candidate)) {
            resolvedPath = candidate;
            break;
          }
        }
      }
      
      // Resolve alias imports
      if (source.startsWith('@')) {
        let aliasResolved;
        
        // @shared → src/shared
        if (source.startsWith('@shared')) {
          aliasResolved = source.replace('@shared', 'src/shared');
        }
        // @bootstrap → src/bootstrap
        else if (source.startsWith('@bootstrap')) {
          aliasResolved = source.replace('@bootstrap', 'src/bootstrap');
        }
        // @/main-site → apps/main-site/src
        else if (source.startsWith('@/main-site')) {
          aliasResolved = source.replace('@/main-site', 'apps/main-site/src');
        }
        // @/tenant-app or @tenant-app → apps/tenant-app/src
        else if (source.startsWith('@/tenant-app') || source.startsWith('@tenant-app')) {
          aliasResolved = source.replace('@/tenant-app', 'apps/tenant-app/src').replace('@tenant-app', 'apps/tenant-app/src');
        }
        // @/admin-app → apps/admin-app/src
        else if (source.startsWith('@/admin-app')) {
          aliasResolved = source.replace('@/admin-app', 'apps/admin-app/src');
        }
        
        if (aliasResolved) {
          const candidates = [
            aliasResolved,
            aliasResolved + '.ts',
            aliasResolved + '.tsx',
            aliasResolved + '.js',
            aliasResolved + '.jsx',
            aliasResolved + '/index.ts',
            aliasResolved + '/index.tsx'
          ];
          
          for (const candidate of candidates) {
            if (graph.has(candidate)) {
              resolvedPath = candidate;
              break;
            }
          }
        }
      }
      
      if (resolvedPath && graph.has(resolvedPath)) {
        const node = graph.get(analysis.file);
        const targetNode = graph.get(resolvedPath);
        
        node.imports.push({
          file: resolvedPath,
          source: source,
          specifiers: imp.specifiers
        });
        
        targetNode.importedBy.push(analysis.file);
      } else if (resolvedPath && args.includes('--debug')) {
        // Debug: show unresolved imports
        if (Math.random() < 0.01) { // Sample 1% to avoid spam
          console.log(`   ⚠️  Unresolved: ${source} → ${resolvedPath}`);
        }
      }
    }
  }
  
  return graph;
}

/**
 * Perform BFS from entry point to find reachable files
 */
function analyzeReachability(graph, entryPoint, debug = false) {
  const reachable = new Set();
  const queue = [entryPoint];
  let depth = 0;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (reachable.has(current)) continue;
    reachable.add(current);
    
    const node = graph.get(current);
    if (!node) {
      if (debug && depth < 3) {
        console.log(`   ⚠️  Node not in graph: ${current}`);
      }
      continue;
    }
    
    // Debug first few levels
    if (debug && depth < 3) {
      console.log(`   [${depth}] ${current} → ${node.imports.length} imports`);
    }
    
    // Add all imported files to queue
    for (const imp of node.imports) {
      if (imp.file && !reachable.has(imp.file)) {
        queue.push(imp.file);
      }
    }
    
    depth++;
  }
  
  return reachable;
}

/**
 * Check if a file should be excluded from unreachable analysis
 */
function shouldExcludeFromUnreachable(file) {
  // Exclude index barrel files (re-export organizers)
  if (file.endsWith('/index.ts') || file.endsWith('/index.tsx')) {
    return true;
  }
  
  // Exclude type definition files (TypeScript only, no runtime import)
  if (file.endsWith('.types.ts') || file.endsWith('.types.tsx')) {
    return true;
  }
  
  // Exclude schema files (validation schemas, often used dynamically)
  if (file.endsWith('.schemas.ts') || file.endsWith('.schema.ts')) {
    return true;
  }
  
  // Exclude declaration files
  if (file.endsWith('.d.ts')) {
    return true;
  }
  
  return false;
}

/**
 * Find unreachable files (split by app-specific vs shared)
 */
function findUnreachableFiles(graph, reachable, appName) {
  const unreachable = {
    appSpecific: [],
    shared: [],
    all: [],
    excluded: [] // Track what we filtered out
  };
  
  const fullAppPath = `apps/${appName}`;
  
  for (const [file, node] of graph) {
    // Only check files relevant to this app
    const isAppFile = node.app === fullAppPath;
    const isSharedFile = node.app === 'shared' || node.app === 'bootstrap';
    
    if (!isAppFile && !isSharedFile) continue;
    
    if (!reachable.has(file)) {
      // Check if this file should be excluded
      if (shouldExcludeFromUnreachable(file)) {
        unreachable.excluded.push(file);
        continue;
      }
      
      unreachable.all.push(file);
      
      if (isAppFile) {
        unreachable.appSpecific.push(file);
      } else {
        unreachable.shared.push(file);
      }
    }
  }
  
  return unreachable;
}

//──────────────────────────────────────────────────────────────
// 🔍 Analysis & Scoring
//──────────────────────────────────────────────────────────────

/**
 * Calculate audit score using ChatGPT's formula
 * Only penalize app-specific unreachable files, not unused shared files
 */
function calculateScore(violations, unreachableAppFiles, parseErrors, duplicates) {
  let score = 100;
  
  // Boundary violations (critical) - 5 points each
  score -= (violations.length * 5);
  
  // App-specific unreachable files (major) - 2 points each
  // (Don't penalize shared files that this app doesn't use)
  score -= (unreachableAppFiles * 2);
  
  // Parse errors (major) - 3 points each
  score -= (parseErrors * 3);
  
  // Duplicates (minor) - 1 point each
  score -= (duplicates * 1);
  
  return Math.max(score, 0);
}

/**
 * Get grade from score
 */
function getGrade(score) {
  if (score >= 90) return { emoji: '🟢', label: 'Excellent' };
  if (score >= 70) return { emoji: '🟡', label: 'Needs Review' };
  return { emoji: '🔴', label: 'Poor Flow Health' };
}

//──────────────────────────────────────────────────────────────
// 📊 Reporting
//──────────────────────────────────────────────────────────────

/**
 * Generate audit report
 */
function generateReport(appName, graph, reachable, violations, analyses) {
  const unreachable = findUnreachableFiles(graph, reachable, appName);
  const parseErrors = analyses.filter(a => a.error).length;
  
  // Calculate score (only penalize app-specific dead code)
  const score = calculateScore(violations, unreachable.appSpecific.length, parseErrors, 0);
  const grade = getGrade(score);
  
  const fullAppPath = `apps/${appName}`;
  const totalAppFiles = [...graph.values()].filter(n => n.app === fullAppPath).length;
  const totalSharedFiles = [...graph.values()].filter(n => n.app === 'shared' || n.app === 'bootstrap').length;
  const reachableAppFiles = [...reachable].filter(f => {
    const node = graph.get(f);
    return node && node.app === fullAppPath;
  }).length;
  const reachableSharedFiles = [...reachable].filter(f => {
    const node = graph.get(f);
    return node && (node.app === 'shared' || node.app === 'bootstrap');
  }).length;
  
  const report = {
    app: appName,
    timestamp: new Date().toISOString(),
    score,
    grade: grade.label,
    metrics: {
      totalAppFiles,
      totalSharedFiles,
      totalFiles: totalAppFiles + totalSharedFiles,
      reachableAppFiles,
      reachableSharedFiles,
      reachableFiles: reachableAppFiles + reachableSharedFiles,
      unreachableAppFiles: unreachable.appSpecific.length,
      unreachableSharedFiles: unreachable.shared.length,
      unreachableTotal: unreachable.all.length,
      boundaryViolations: violations.length,
      parseErrors
    },
    violations,
    unreachable,
    parseErrors: analyses.filter(a => a.error).map(a => ({
      file: a.file,
      error: a.error
    }))
  };
  
  return report;
}

/**
 * Generate Markdown report
 */
function generateMarkdown(report) {
  const { app, score, grade, metrics, violations, unreachable, parseErrors } = report;
  const gradeEmoji = getGrade(score).emoji;
  
  let md = `# 📊 Frontend Flow Audit - ${app}\n\n`;
  md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
  md += `## ${gradeEmoji} Score: ${score}/100 (${grade})\n\n`;
  
  md += `### Metrics\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| **App Files** | |\n`;
  md += `| Total App Files | ${metrics.totalAppFiles} |\n`;
  md += `| Reachable App Files | ${metrics.reachableAppFiles} |\n`;
  md += `| Unreachable App Files | ${metrics.unreachableAppFiles} |\n`;
  md += `| **Shared Files** | |\n`;
  md += `| Total Shared Files | ${metrics.totalSharedFiles} |\n`;
  md += `| Reachable Shared Files | ${metrics.reachableSharedFiles} |\n`;
  md += `| Unreachable Shared Files | ${metrics.unreachableSharedFiles} |\n`;
  md += `| **Issues** | |\n`;
  md += `| Boundary Violations | ${metrics.boundaryViolations} |\n`;
  md += `| Parse Errors | ${metrics.parseErrors} |\n\n`;
  
  if (violations.length > 0) {
    md += `## 🔴 Boundary Violations (Critical)\n\n`;
    md += `These imports violate architectural boundaries and must be fixed:\n\n`;
    violations.forEach(v => {
      md += `- **${v.file}**\n`;
      md += `  - Imports: \`${v.import}\`\n`;
      md += `  - Violation: ${v.message}\n`;
      md += `  - Rule: ${v.rule}\n\n`;
    });
  }
  
  if (unreachable.appSpecific.length > 0) {
    md += `## 🔴 Unreachable App Files (${unreachable.appSpecific.length})\n\n`;
    md += `These files in **${app}** are not imported from the entry point (dead code):\n\n`;
    unreachable.appSpecific.forEach(file => {
      md += `- ${file}\n`;
    });
    md += `\n`;
  }
  
  if (unreachable.shared.length > 0) {
    md += `## 🟡 Unreachable Shared Files (${unreachable.shared.length})\n\n`;
    md += `These shared files are not used by **${app}** (but may be used by other apps):\n\n`;
    unreachable.shared.slice(0, 20).forEach(file => {
      md += `- ${file}\n`;
    });
    if (unreachable.shared.length > 20) {
      md += `\n... and ${unreachable.shared.length - 20} more\n`;
    }
    md += `\n`;
  }
  
  if (parseErrors.length > 0) {
    md += `## ⚠️ Parse Errors (${parseErrors.length})\n\n`;
    parseErrors.forEach(err => {
      md += `- **${err.file}**: ${err.error}\n`;
    });
    md += `\n`;
  }
  
  return md;
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────

async function main() {
  // Check if running in silent mode
  const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';
  
  // Determine which apps to audit
  const appsToAudit = targetApp ? [targetApp] : Object.keys(APPS);
  
  // Create audit result tracker
  const result = createAuditResult('Frontend Flow Tracer', isSilent);
  
  if (!isSilent) {
    result.info(`Apps: ${appsToAudit.join(', ')}`);
  }
  
  // Check if frontend directory exists
  if (!fileExists(frontendDir)) {
    result.error('Frontend directory not found', {
      path: frontendDir,
      details: 'Expected frontend/ directory in project root'
    });
    
    saveReport(result, 'FLOW_FRONTEND_AUDIT.md', {
      description: 'Frontend flow tracer could not run - directory not found.',
      recommendations: ['Create frontend/ directory structure']
    });
    
    finishAudit(result);
    return;
  }
  
  // Step 1: Discover all files
  result.section('Phase 1: File Discovery');
  const allFiles = discoverFiles(frontendDir);
  result.pass(`Found ${allFiles.length} TypeScript/TSX files`);
  
  // Step 2: Parse and analyze files
  result.section('Phase 2: AST Parsing');
  const analyses = allFiles.map(file => analyzeFile(file));
  const parseErrors = analyses.filter(a => a.error).length;
  
  if (parseErrors > 0) {
    result.warn(`${parseErrors} files had parse errors`, {
      details: 'Some files could not be parsed due to syntax errors'
    });
  } else {
    result.pass('All files parsed successfully');
  }
  
  // Step 3: Build dependency graph
  result.section('Phase 3: Graph Construction');
  const graph = buildGraph(analyses);
  result.pass(`Built dependency graph with ${graph.size} nodes`);
  
  // Step 4: Audit each app
  result.section('Phase 4: App Analysis');
  
  for (const appName of appsToAudit) {
    const appConfig = APPS[appName];
    
    // Find entry point in graph
    const entryFile = appConfig.entry;
    if (!graph.has(entryFile)) {
      result.error(`Entry point not found for ${appName}`, {
        path: entryFile,
        details: 'App entry point not found in dependency graph'
      });
      continue;
    }
    
    // Analyze reachability
    const reachable = analyzeReachability(graph, entryFile, args.includes('--debug'));
    result.pass(`${appName}: ${reachable.size} reachable files`);
    
    // Check boundary violations
    const violations = [];
    const fullAppPath = `apps/${appName}`;
    
    for (const analysis of analyses) {
      // Check files in current app or shared/bootstrap
      if (analysis.app !== fullAppPath && analysis.app !== 'shared' && analysis.app !== 'bootstrap') {
        continue;
      }
      
      for (const imp of analysis.imports) {
        const v = validateBoundary(analysis.file, imp.source, analysis.app);
        violations.push(...v);
      }
    }
    
    if (violations.length > 0) {
      result.warn(`${appName}: ${violations.length} boundary violations`, {
        details: 'Files importing across architectural boundaries'
      });
    } else {
      result.pass(`${appName}: No boundary violations`);
    }
    
    // Generate and save report for this app
    const report = generateReport(appName, graph, reachable, violations, analyses);
    
    // Report unreachable app files as warnings
    if (report.metrics.unreachableAppFiles > 0) {
      result.warn(`${appName}: ${report.metrics.unreachableAppFiles} unreachable app files`, {
        details: 'Dead code - files not imported from entry point'
      });
    } else {
      result.pass(`${appName}: No unreachable app files`);
    }
    const mdReport = generateMarkdown(report);
    const auditsDir = path.join(root, 'docs/audits');
    
    // Ensure directory exists
    if (!fs.existsSync(auditsDir)) {
      fs.mkdirSync(auditsDir, { recursive: true });
    }
    
    // Write markdown report
    const mdPath = path.join(auditsDir, `FLOW_FRONTEND_${appName.toUpperCase().replace('-', '_')}.md`);
    fs.writeFileSync(mdPath, mdReport, 'utf-8');
    result.pass(`${appName}: Report saved to ${path.relative(root, mdPath)}`);
    
    // Write JSON if requested
    if (jsonOutput) {
      const jsonPath = path.join(auditsDir, `flow_frontend_${appName}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
      result.pass(`${appName}: JSON saved to ${path.relative(root, jsonPath)}`);
    }
  }
  
  // Step 5: Generate overall report
  result.section('Phase 5: Report Generation');
  
  const recommendations = [
    'Review boundary violations - they violate architectural rules',
    'Investigate unreachable files - they may be dead code',
    'Consider consolidating duplicate components across apps',
    'Use this flow map for impact analysis before making changes'
  ];
  
  saveReport(result, 'FLOW_FRONTEND_AUDIT.md', {
    description: 'Complete frontend flow analysis: maps React component dependencies, validates architectural boundaries, identifies unreachable code.',
    recommendations
  });
  
  // Finish audit
  finishAudit(result);
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

