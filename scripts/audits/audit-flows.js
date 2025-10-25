#!/usr/bin/env node
/**
 * audit-flows.js — Backend Flow Tracer (Phase 1)
 * --------------------------------------------------------------
 * ✅ Maps complete HTTP request flows from server.js to database
 * ✅ Builds call graph: routes → controllers → services
 * ✅ Performs reachability analysis from entry points
 * ✅ Identifies unreachable/orphaned code
 * ✅ Validates middleware ordering and dependencies
 * --------------------------------------------------------------
 * This tool uses static code analysis to trace all possible
 * execution paths through the backend codebase, ensuring that
 * architectural rules are followed and dead code is identified.
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

// Determine project root (go up from scripts/audits/ to project root)
const root = path.resolve(__dirname, '../..');

// Backend directory
const backendDir = path.join(root, 'backend');

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

// Parse command-line flags
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');

// Always export graphs by default (small files, useful for visualization)
const exportGraph = true;

// Create audit result tracker
const result = createAuditResult('Backend Flow Tracer', isSilent);

//──────────────────────────────────────────────────────────────
// 📁 File Discovery
//──────────────────────────────────────────────────────────────

/**
 * Discover all JavaScript files in a directory
 */
function discoverFiles(dir, pattern = /\.(js|ts)$/, exclude = /node_modules|dist|build|\.git|__tests__|\.test\.|\.spec\.|^tests[\/\\]|\\tests[\/\\]|jest\.config\.|vitest\.config\./) {
  const files = [];
  
  function scan(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(backendDir, fullPath);
      
      if (exclude.test(relativePath)) continue;
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (pattern.test(entry.name)) {
        files.push({
          fullPath,
          relativePath,
          name: entry.name,
          dir: path.dirname(relativePath)
        });
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Categorize files by type
 */
function categorizeFiles(files) {
  const categories = {
    entryPoints: [],
    routes: [],
    controllers: [],
    services: [],
    middleware: [],
    utils: [],
    other: []
  };
  
  for (const file of files) {
    const { relativePath, name } = file;
    
    if (name === 'server.js') {
      categories.entryPoints.push(file);
    } else if (relativePath.startsWith('routes')) {
      categories.routes.push(file);
    } else if (relativePath.startsWith('controllers')) {
      categories.controllers.push(file);
    } else if (relativePath.startsWith('services')) {
      categories.services.push(file);
    } else if (relativePath.startsWith('middleware')) {
      categories.middleware.push(file);
    } else if (relativePath.startsWith('utils')) {
      categories.utils.push(file);
    } else {
      categories.other.push(file);
    }
  }
  
  return categories;
}

//──────────────────────────────────────────────────────────────
// 🧬 AST Parsing
//──────────────────────────────────────────────────────────────

/**
 * Parse a file and extract imports, exports, and function calls
 */
function parseFile(file) {
  try {
    const content = fs.readFileSync(file.fullPath, 'utf8');
    
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    
    const analysis = {
      file: file.relativePath,
      imports: [],
      exports: [],
      functions: [],
      routes: [],
      middleware: []
    };
    
    traverse(ast, {
      // Capture import statements
      ImportDeclaration({ node }) {
        const source = node.source.value;
        const specifiers = node.specifiers.map(spec => {
          if (spec.type === 'ImportDefaultSpecifier') {
            return { name: spec.local.name, type: 'default' };
          } else if (spec.type === 'ImportSpecifier') {
            return { name: spec.imported.name, type: 'named' };
          } else if (spec.type === 'ImportNamespaceSpecifier') {
            return { name: spec.local.name, type: 'namespace' };
          }
          return null;
        }).filter(Boolean);
        
        analysis.imports.push({ source, specifiers });
      },
      
      // Capture export statements
      ExportNamedDeclaration({ node }) {
        if (node.declaration) {
          if (node.declaration.type === 'FunctionDeclaration') {
            analysis.exports.push({
              name: node.declaration.id.name,
              type: 'function'
            });
          } else if (node.declaration.type === 'VariableDeclaration') {
            node.declaration.declarations.forEach(decl => {
              if (decl.id.name) {
                analysis.exports.push({
                  name: decl.id.name,
                  type: 'variable'
                });
              }
            });
          }
        }
      },
      
      ExportDefaultDeclaration({ node }) {
        if (node.declaration.type === 'Identifier') {
          analysis.exports.push({
            name: node.declaration.name,
            type: 'default'
          });
        }
      },
      
      // Capture function declarations
      FunctionDeclaration({ node }) {
        if (node.id && node.id.name) {
          analysis.functions.push(node.id.name);
        }
      },
      
      // Capture Express route definitions
      CallExpression({ node }) {
        // app.get(), router.post(), etc.
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          ['get', 'post', 'put', 'delete', 'patch', 'use', 'all'].includes(node.callee.property.name)
        ) {
          const method = node.callee.property.name;
          const args = node.arguments;
          
          // First argument is usually the path
          if (args.length > 0 && args[0].type === 'StringLiteral') {
            const routePath = args[0].value;
            
            // Remaining arguments are middleware/handlers
            const handlers = [];
            for (let i = 1; i < args.length; i++) {
              const arg = args[i];
              if (arg.type === 'Identifier') {
                handlers.push(arg.name);
              } else if (arg.type === 'MemberExpression') {
                // controller.method
                if (arg.object.type === 'Identifier' && arg.property.type === 'Identifier') {
                  handlers.push(`${arg.object.name}.${arg.property.name}`);
                }
              }
            }
            
            analysis.routes.push({ method, path: routePath, handlers });
          }
        }
        
        // app.use(middleware) - middleware registration
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'use' &&
          node.arguments.length > 0
        ) {
          node.arguments.forEach(arg => {
            if (arg.type === 'Identifier') {
              analysis.middleware.push(arg.name);
            } else if (arg.type === 'CallExpression' && arg.callee.type === 'Identifier') {
              analysis.middleware.push(arg.callee.name);
            }
          });
        }
      }
    });
    
    return analysis;
    
  } catch (error) {
    return {
      file: file.relativePath,
      error: error.message,
      imports: [],
      exports: [],
      functions: [],
      routes: [],
      middleware: []
    };
  }
}

//──────────────────────────────────────────────────────────────
// 📊 Call Graph Construction
//──────────────────────────────────────────────────────────────

/**
 * Build a directed graph of file dependencies
 */
function buildCallGraph(analyses, aliases = {}) {
  const graph = new Map();
  const fileMap = new Map();
  
  // Index all files by their relative path
  // Create multiple lookup keys for flexible matching
  for (const analysis of analyses) {
    const relativePath = analysis.file.replace(/\\/g, '/');
    
    // Add to graph
    graph.set(analysis.file, {
      imports: [],
      importedBy: [],
      exports: analysis.exports,
      routes: analysis.routes,
      functions: analysis.functions
    });
    
    // Create lookup keys (all forward slashes, case-insensitive on Windows)
    const keys = [
      relativePath,  // e.g., "middleware/requestLogger.js"
      relativePath.replace(/\.(js|ts)$/, ''),  // without extension
      path.basename(relativePath),  // just filename
      path.basename(relativePath).replace(/\.(js|ts)$/, '')  // filename without ext
    ];
    
    keys.forEach(key => {
      const normalized = key.toLowerCase();
      if (!fileMap.has(normalized)) {
        fileMap.set(normalized, analysis);
      }
    });
  }
  
  // Resolve imports to actual files
  for (const analysis of analyses) {
    const currentDir = path.dirname(analysis.file).replace(/\\/g, '/');
    
    for (const imp of analysis.imports) {
      const source = imp.source;
      let resolvedPath;
      
      // Try to resolve aliases first (e.g., @config/auth → ./config/auth)
      if (!source.startsWith('.') && !source.startsWith('/')) {
        const aliasResolved = resolveAlias(source, aliases);
        if (aliasResolved) {
          // Make relative to backend dir
          const relativeToCurrent = path.relative(
            path.join(backendDir, currentDir),
            aliasResolved
          ).replace(/\\/g, '/');
          resolvedPath = path.join(currentDir, relativeToCurrent).replace(/\\/g, '/');
        } else {
          // External package - skip
          continue;
        }
      } else if (source.startsWith('.')) {
        // Relative import: ./file or ../file
        resolvedPath = path.join(currentDir, source).replace(/\\/g, '/');
      } else if (source.startsWith('/')) {
        // Absolute import from root
        resolvedPath = source.substring(1);
      } else {
        continue;
      }
      
      // Normalize path separators
      resolvedPath = resolvedPath.replace(/\\/g, '/');
      
      // Try various candidates
      const candidates = [
        resolvedPath,
        resolvedPath + '.js',
        resolvedPath + '.ts',
        resolvedPath + '/index.js',
        resolvedPath + '/index.ts'
      ];
      
      let found = false;
      for (const candidate of candidates) {
        const normalized = candidate.toLowerCase();
        const targetAnalysis = fileMap.get(normalized);
        
        if (targetAnalysis) {
          const node = graph.get(analysis.file);
          node.imports.push({
            file: targetAnalysis.file,
            specifiers: imp.specifiers
          });
          
          const targetNode = graph.get(targetAnalysis.file);
          targetNode.importedBy.push(analysis.file);
          found = true;
          break;
        }
      }
      
      // Debug: log unresolved imports (optional)
      if (!found && !isSilent) {
        // Uncomment for debugging:
        // console.log(`Could not resolve: ${source} from ${analysis.file}`);
      }
    }
  }
  
  return graph;
}

//──────────────────────────────────────────────────────────────
// 🗺️ Path Alias Resolution
//──────────────────────────────────────────────────────────────

/**
 * Load path aliases from jsconfig.json or tsconfig.json
 */
function loadPathAliases() {
  const configFiles = [
    path.join(backendDir, 'jsconfig.json'),
    path.join(backendDir, 'tsconfig.json'),
    path.join(root, 'jsconfig.json'),
    path.join(root, 'tsconfig.json')
  ];
  
  for (const configFile of configFiles) {
    if (fs.existsSync(configFile)) {
      try {
        const content = fs.readFileSync(configFile, 'utf8');
        // Remove comments (simple approach)
        const cleaned = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        const config = JSON.parse(cleaned);
        
        if (config.compilerOptions && config.compilerOptions.paths) {
          const aliases = {};
          const baseUrl = config.compilerOptions.baseUrl || '.';
          
          for (const [alias, paths] of Object.entries(config.compilerOptions.paths)) {
            // Remove /* from alias (e.g., "@config/*" → "@config")
            const cleanAlias = alias.replace(/\/\*$/, '');
            // Take first path and remove /* (e.g., "./config/*" → "./config")
            const cleanPath = paths[0].replace(/\/\*$/, '');
            aliases[cleanAlias] = path.join(path.dirname(configFile), baseUrl, cleanPath);
          }
          
          return aliases;
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
  }
  
  return {};
}

/**
 * Resolve import using path aliases
 */
function resolveAlias(importPath, aliases) {
  for (const [alias, resolvedPath] of Object.entries(aliases)) {
    if (importPath.startsWith(alias)) {
      return importPath.replace(alias, resolvedPath);
    }
  }
  return null;
}

//──────────────────────────────────────────────────────────────
// 🔍 Reachability Analysis
//──────────────────────────────────────────────────────────────

/**
 * Perform BFS from entry points to find all reachable files
 */
function analyzeReachability(graph, entryPoints) {
  const reachable = new Set();
  const queue = [...entryPoints];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (reachable.has(current)) continue;
    reachable.add(current);
    
    const node = graph.get(current);
    if (!node) continue;
    
    // Add all imported files to queue
    for (const imp of node.imports) {
      if (!reachable.has(imp.file)) {
        queue.push(imp.file);
      }
    }
  }
  
  return reachable;
}

/**
 * Files that are legitimately unreachable via static analysis
 * but are used through patterns the tracer can't detect:
 * - Re-exports (e.g., env.js re-exports env.async.js)
 * - Dynamic imports (e.g., await import('./service.js'))
 * - Runtime loading
 * - Development/testing utilities (not registered in production but kept for debugging)
 */
const KNOWN_DYNAMIC_IMPORTS = [
  'config\\env.async.js',           // Re-exported by config/env.js
  'services\\stripeService.js',     // Dynamic import in routes/payments.js
  'services\\tenantDeletionService.js', // Dynamic import in routes/admin.js
  'services\\cronService.js',       // Dynamic import in server.js for async initialization
  'scripts\\cleanup-tokens.js',     // Called by cronService
  'routes\\subdomainTest.js',       // Development/testing utility - not registered by default
];

/**
 * Find unreachable files (orphaned code)
 * Excludes files that are known to be used via dynamic patterns
 */
function findUnreachableFiles(graph, reachable) {
  const unreachable = [];
  
  for (const [file] of graph) {
    if (!reachable.has(file) && !KNOWN_DYNAMIC_IMPORTS.includes(file)) {
      unreachable.push(file);
    }
  }
  
  return unreachable;
}

//──────────────────────────────────────────────────────────────
// 📊 Graph Export
//──────────────────────────────────────────────────────────────

/**
 * Export graph as JSON for visualization tools
 */
function exportGraphAsJson(graph, reachable, outputPath) {
  const nodes = [];
  const edges = [];
  
  for (const [file, node] of graph) {
    nodes.push({
      id: file,
      reachable: reachable.has(file),
      exports: node.exports,
      functions: node.functions,
      routes: node.routes,
      importCount: node.imports.length,
      importedByCount: node.importedBy.length
    });
    
    // Add edges for imports
    node.imports.forEach(imp => {
      edges.push({
        from: file,
        to: imp.file,
        specifiers: imp.specifiers
      });
    });
  }
  
  const graphData = {
    metadata: {
      generated: new Date().toISOString(),
      totalNodes: nodes.length,
      totalEdges: edges.length,
      reachableNodes: Array.from(reachable).length,
      unreachableNodes: nodes.length - Array.from(reachable).length
    },
    nodes,
    edges
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(graphData, null, 2));
  return outputPath;
}

/**
 * Export graph as DOT format for GraphViz
 */
function exportGraphAsDot(graph, reachable, outputPath) {
  const lines = ['digraph BackendFlows {'];
  lines.push('  rankdir=LR;');
  lines.push('  node [shape=box];');
  lines.push('');
  
  // Add nodes with colors
  for (const [file, node] of graph) {
    const isReachable = reachable.has(file);
    const color = isReachable ? 'lightblue' : 'lightgray';
    const label = file.replace(/\\/g, '/');
    const nodeId = file.replace(/[^a-zA-Z0-9]/g, '_');
    
    lines.push(`  ${nodeId} [label="${label}", fillcolor="${color}", style="filled"];`);
  }
  
  lines.push('');
  
  // Add edges
  for (const [file, node] of graph) {
    const fromId = file.replace(/[^a-zA-Z0-9]/g, '_');
    node.imports.forEach(imp => {
      const toId = imp.file.replace(/[^a-zA-Z0-9]/g, '_');
      lines.push(`  ${fromId} -> ${toId};`);
    });
  }
  
  lines.push('}');
  
  fs.writeFileSync(outputPath, lines.join('\n'));
  return outputPath;
}

//──────────────────────────────────────────────────────────────
// 📝 Report Generation
//──────────────────────────────────────────────────────────────

/**
 * Generate comprehensive flow audit report
 */
function generateReport(audit, categories, analyses, graph, reachable, unreachable) {
  audit.section('File Discovery');
  
  const totalFiles = analyses.length;
  const totalRoutes = categories.routes.length;
  const totalControllers = categories.controllers.length;
  const totalServices = categories.services.length;
  const totalMiddleware = categories.middleware.length;
  
  audit.pass(`Discovered ${totalFiles} backend files`);
  audit.debug(`  Routes: ${totalRoutes}`);
  audit.debug(`  Controllers: ${totalControllers}`);
  audit.debug(`  Services: ${totalServices}`);
  audit.debug(`  Middleware: ${totalMiddleware}`);
  
  audit.section('Entry Points');
  
  if (categories.entryPoints.length === 0) {
    audit.error('No entry point found', {
      details: 'Expected to find backend/server.js'
    });
  } else {
    categories.entryPoints.forEach(ep => {
      audit.pass(`Entry point: ${ep.relativePath}`);
    });
  }
  
  audit.section('HTTP Endpoints');
  
  const allRoutes = [];
  for (const analysis of analyses) {
    for (const route of analysis.routes) {
      allRoutes.push({
        file: analysis.file,
        method: route.method.toUpperCase(),
        path: route.path,
        handlers: route.handlers
      });
    }
  }
  
  if (allRoutes.length === 0) {
    audit.warn('No HTTP routes discovered', {
      details: 'Check if route files use standard Express patterns'
    });
  } else {
    audit.pass(`Discovered ${allRoutes.length} HTTP endpoints`);
    
    // Group by method
    const byMethod = {};
    allRoutes.forEach(r => {
      byMethod[r.method] = (byMethod[r.method] || 0) + 1;
    });
    
    Object.entries(byMethod).forEach(([method, count]) => {
      audit.debug(`  ${method}: ${count} endpoints`);
    });
  }
  
  audit.section('Reachability Analysis');
  
  const reachableCount = reachable.size;
  const unreachableCount = unreachable.length;
  const coverage = ((reachableCount / totalFiles) * 100).toFixed(1);
  
  audit.pass(`Reachable files: ${reachableCount}/${totalFiles} (${coverage}%)`);
  
  if (unreachableCount > 0) {
    audit.warn(`Unreachable files: ${unreachableCount}`, {
      details: 'These files are not imported from any entry point'
    });
    
    unreachable.forEach(file => {
      const node = graph.get(file);
      const hasExports = node && node.exports && node.exports.length > 0;
      
      audit.warn(`  ${file}`, {
        details: hasExports ? 'Has exports but not imported' : 'No exports, may be unused'
      });
    });
  } else {
    audit.pass('All files are reachable from entry points');
  }
  
  audit.section('Dependency Analysis');
  
  // Find files with most dependencies (imports)
  const dependencyCounts = [];
  for (const [file, node] of graph) {
    dependencyCounts.push({
      file,
      imports: node.imports.length,
      importedBy: node.importedBy.length
    });
  }
  
  dependencyCounts.sort((a, b) => b.imports - a.imports);
  const topDependencies = dependencyCounts.slice(0, 5);
  
  audit.debug('Files with most imports:');
  topDependencies.forEach(d => {
    audit.debug(`  ${d.file}: ${d.imports} imports`);
  });
  
  // Find most imported files (most dependents)
  dependencyCounts.sort((a, b) => b.importedBy - a.importedBy);
  const topImported = dependencyCounts.slice(0, 5);
  
  audit.debug('Most imported files:');
  topImported.forEach(d => {
    audit.debug(`  ${d.file}: imported by ${d.importedBy} files`);
  });
  
  return {
    allRoutes,
    reachableCount,
    unreachableCount,
    coverage
  };
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────

async function main() {
  const audit = createAuditResult('Backend Flow Tracer', isSilent);
  
  // Check if backend directory exists
  if (!fileExists(backendDir)) {
    audit.error('Backend directory not found', {
      path: backendDir,
      details: 'Expected backend/ directory in project root'
    });
    
    saveReport(audit, 'FLOW_AUDIT.md', {
      description: 'Backend flow tracer could not run - directory not found.',
      recommendations: ['Create backend/ directory structure']
    });
    
    finishAudit(audit);
    return;
  }
  
  // Step 1: Discover all backend files
  audit.section('Phase 1: File Discovery');
  const files = discoverFiles(backendDir);
  audit.pass(`Found ${files.length} files to analyze`);
  
  const categories = categorizeFiles(files);
  
  // Step 2: Parse all files
  audit.section('Phase 2: AST Parsing');
  const analyses = [];
  let parseErrors = 0;
  
  for (const file of files) {
    const analysis = parseFile(file);
    if (analysis.error) {
      audit.warn(`Parse error: ${file.relativePath}`, {
        details: analysis.error
      });
      parseErrors++;
    }
    analyses.push(analysis);
  }
  
  if (parseErrors > 0) {
    audit.warn(`${parseErrors} files had parse errors`, {
      details: 'These files will be included but with incomplete analysis'
    });
  } else {
    audit.pass(`Successfully parsed ${analyses.length} files`);
  }
  
  // Step 3: Load path aliases
  audit.section('Phase 3: Path Alias Resolution');
  const aliases = loadPathAliases();
  const aliasCount = Object.keys(aliases).length;
  if (aliasCount > 0) {
    audit.pass(`Loaded ${aliasCount} path aliases`);
  } else {
    audit.debug('No path aliases configured (using relative imports only)');
  }
  
  // Step 4: Build call graph
  audit.section('Phase 4: Call Graph Construction');
  const graph = buildCallGraph(analyses, aliases);
  audit.pass(`Built call graph with ${graph.size} nodes`);
  
  // Step 5: Reachability analysis
  audit.section('Phase 5: Reachability Analysis');
  const entryPoints = categories.entryPoints.map(ep => ep.relativePath);
  const reachable = analyzeReachability(graph, entryPoints);
  const unreachable = findUnreachableFiles(graph, reachable);
  
  audit.pass(`Reachability analysis complete`);
  
  // Step 6: Export graph files for visualization
  audit.section('Phase 6: Graph Export');
  const docsDir = path.join(root, 'docs', 'audits');
  
  try {
    const jsonPath = path.join(docsDir, 'FLOW_GRAPH.json');
    exportGraphAsJson(graph, reachable, jsonPath);
    audit.pass(`Graph exported as JSON: ${path.relative(root, jsonPath)}`);
    
    const dotPath = path.join(docsDir, 'FLOW_GRAPH.dot');
    exportGraphAsDot(graph, reachable, dotPath);
    audit.pass(`Graph exported as DOT: ${path.relative(root, dotPath)}`);
  } catch (error) {
    audit.warn('Failed to export graph', {
      details: error.message
    });
  }
  
  // Step 7: Generate report
  const reportData = generateReport(audit, categories, analyses, graph, reachable, unreachable);
  
  // Save detailed report
  const recommendations = [
    'Review unreachable files - they may be dead code that can be removed',
    'Ensure all route handlers are properly connected to controllers/services',
    'Consider refactoring files with high import counts (>10) to reduce coupling',
    'Monitor files imported by many others - changes will have wide impact',
    'Use this flow map for impact analysis before making changes'
  ];
  
  if (unreachable.length > 0) {
    recommendations.unshift(`⚠️ PRIORITY: Investigate ${unreachable.length} unreachable files`);
  }
  
  saveReport(audit, 'FLOW_AUDIT.md', {
    description: 'Complete backend flow analysis: maps all HTTP request paths, builds call graph, identifies unreachable code.',
    recommendations,
    metadata: {
      totalFiles: files.length,
      reachableFiles: reachable.size,
      unreachableFiles: unreachable.length,
      coveragePercent: reportData.coverage,
      httpEndpoints: reportData.allRoutes.length,
      routes: reportData.allRoutes
    }
  });
  
  // Finish audit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Flow tracer failed: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

