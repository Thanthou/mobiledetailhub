#!/usr/bin/env node
/**
 * audit-boundaries.js — Frontend Import Boundary Audit
 * --------------------------------------------------------------
 * ✅ Enforces architecture rules from .cursorrules:
 *  - Apps (admin-app, tenant-app, main-site) cannot import from each other
 *  - shared/ cannot import from any app
 *  - bootstrap/ cannot import from any app
 *  - Apps CAN import from shared/ and bootstrap/
 * --------------------------------------------------------------
 * This audit prevents architectural violations and technical debt
 * by ensuring strict import boundaries between frontend applications.
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists
} from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend");
const appsDir = path.join(root, "frontend/apps");
const sharedDir = path.join(root, "frontend/src/shared");

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🧩 App and Layer Definitions
//──────────────────────────────────────────────────────────────
const APPS = ['admin-app', 'tenant-app', 'main-site'];

//──────────────────────────────────────────────────────────────
// 🔍 Find All Import Statements
//──────────────────────────────────────────────────────────────
function findAllImports() {
  const imports = [];

  function scanDirectory(currentDir, basePath) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git', 'public'].includes(entry.name)) {
          scanDirectory(fullPath, basePath);
        }
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const relativePath = path.relative(basePath, fullPath);
          
          // Find all import statements
          const importMatches = content.matchAll(/import\s+(?:{[^}]+}|[^'"]+)\s+from\s+['"]([^'"]+)['"]/g);
          
          for (const match of importMatches) {
            const importPath = match[1];
            imports.push({
              file: relativePath,
              fullPath,
              importPath,
              line: content.substring(0, match.index).split('\n').length,
              basePath,
            });
          }
        } catch (err) {
          // Skip files that can't be read
        }
      }
    }
  }

  // Scan apps directory
  scanDirectory(appsDir, appsDir);
  
  // Scan shared directory
  scanDirectory(sharedDir, sharedDir);

  return imports;
}

//──────────────────────────────────────────────────────────────
// 🏗️ Determine File Location (which app/layer)
//──────────────────────────────────────────────────────────────
function getFileLocation(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  
  // Check if in apps directory
  for (const app of APPS) {
    if (normalized.startsWith(`${app}/`)) {
      return { type: 'app', name: app };
    }
  }
  
  // Check if in shared directory
  if (normalized.startsWith('bootstrap/')) {
    return { type: 'layer', name: 'bootstrap' };
  }
  
  // Everything else in shared is the shared layer
  return { type: 'layer', name: 'shared' };
}

//──────────────────────────────────────────────────────────────
// 🎯 Resolve Import Target
//──────────────────────────────────────────────────────────────
function resolveImportTarget(importPath, importRecord) {
  // Skip external packages
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return null;
  }
  
  // Handle relative imports
  if (importPath.startsWith('.')) {
    const currentDir = path.dirname(importRecord.fullPath);
    const resolved = path.resolve(currentDir, importPath);
    const relative = path.relative(importRecord.basePath, resolved);
    return relative.replace(/\\/g, '/');
  }
  
  // Handle @ alias (maps to frontend/src or frontend/apps based on context)
  if (importPath.startsWith('@/')) {
    return importPath.substring(2); // Remove @/
  }
  
  return null;
}

//──────────────────────────────────────────────────────────────
// ✅ Validate Import Boundaries
//──────────────────────────────────────────────────────────────
function validateImportBoundaries(audit, imports) {
  audit.section('App Import Boundaries');

  const violations = [];

  for (const imp of imports) {
    const sourceLocation = getFileLocation(imp.file);
    const targetPath = resolveImportTarget(imp.importPath, imp);
    
    // Skip external packages
    if (!targetPath) continue;
    
    const targetLocation = getFileLocation(targetPath);

    let isViolation = false;
    let reason = '';

    // Rule 1: Apps cannot import from other apps
    if (sourceLocation.type === 'app' && targetLocation.type === 'app') {
      if (sourceLocation.name !== targetLocation.name) {
        isViolation = true;
        reason = `${sourceLocation.name} importing from ${targetLocation.name} (cross-app import forbidden)`;
      }
    }

    // Rule 2: Shared layer cannot import from apps
    if (sourceLocation.name === 'shared' && targetLocation.type === 'app') {
      isViolation = true;
      reason = `shared/ importing from ${targetLocation.name} (shared must remain pure)`;
    }

    // Rule 3: Bootstrap layer cannot import from apps  
    if (sourceLocation.name === 'bootstrap' && targetLocation.type === 'app') {
      isViolation = true;
      reason = `bootstrap/ importing from ${targetLocation.name} (bootstrap must remain pure)`;
    }

    if (isViolation) {
      violations.push({
        source: imp.file,
        target: targetPath,
        importPath: imp.importPath,
        line: imp.line,
        reason,
      });
    }
  }

  return violations;
}

//──────────────────────────────────────────────────────────────
// 📊 Validate Allowed Imports
//──────────────────────────────────────────────────────────────
function validateAllowedImports(audit, imports) {
  audit.section('Allowed Import Paths');

  // Check that apps DO import from shared
  const appImports = imports.filter(imp => {
    const loc = getFileLocation(imp.file);
    return loc.type === 'app';
  });

  const appsUsingShared = new Set();

  appImports.forEach(imp => {
    const loc = getFileLocation(imp.file);
    
    // Check if import goes to shared (will have ../../../src/shared or @/shared pattern)
    if (imp.importPath.includes('/src/shared/') || 
        imp.importPath.includes('shared/') ||
        imp.importPath.startsWith('@/shared')) {
      appsUsingShared.add(loc.name);
    }
  });

  // It's OK if apps don't use shared (they might be simple)
  // Just report stats, not warnings
  APPS.forEach(app => {
    if (appsUsingShared.has(app)) {
      audit.pass(`${app} imports from shared/ (correct)`);
    } else {
      audit.debug(`${app} doesn't import from shared/ (may be simple app)`);
    }
  });

  audit.debug(`Apps using shared/: ${appsUsingShared.size}/${APPS.length}`);
}

//──────────────────────────────────────────────────────────────
// 🧱 Check Layer Isolation
//──────────────────────────────────────────────────────────────
function checkLayerIsolation(audit, imports) {
  audit.section('Layer Isolation');

  // Check shared/ layer doesn't import from apps
  const sharedImports = imports.filter(imp => {
    const loc = getFileLocation(imp.file);
    return loc.name === 'shared' || loc.name === 'bootstrap';
  });

  let sharedViolations = 0;

  sharedImports.forEach(imp => {
    // Check if import goes back to apps directory
    if (imp.importPath.includes('/apps/') || 
        imp.importPath.includes('../apps/') ||
        imp.importPath.includes('../../apps/')) {
      
      audit.error(`shared/ imports from apps: ${imp.importPath}`, {
        path: imp.file,
        details: 'Shared layer must remain pure and reusable'
      });
      sharedViolations++;
    }
  });

  if (sharedViolations === 0) {
    audit.pass('shared/ layer is pure (no app imports)');
  }
}

//──────────────────────────────────────────────────────────────
// 📈 Summary Statistics
//──────────────────────────────────────────────────────────────
function generateStatistics(audit, imports) {
  audit.section('Import Statistics');

  const totalImports = imports.length;
  const appImports = imports.filter(imp => getFileLocation(imp.file).type === 'app').length;
  const sharedImports = imports.filter(imp => getFileLocation(imp.file).name === 'shared').length;
  const bootstrapImports = imports.filter(imp => getFileLocation(imp.file).name === 'bootstrap').length;

  audit.pass(`Total imports analyzed: ${totalImports}`);
  audit.debug(`  App imports: ${appImports}`);
  audit.debug(`  Shared imports: ${sharedImports}`);
  audit.debug(`  Bootstrap imports: ${bootstrapImports}`);

  // Import targets (check for null before calling startsWith)
  const toShared = imports.filter(imp => {
    const target = resolveImportTarget(imp.importPath, imp);
    return target && (target.includes('shared/') || imp.importPath.includes('shared/'));
  }).length;

  const toBootstrap = imports.filter(imp => {
    const target = resolveImportTarget(imp.importPath, imp);
    return target && (target.includes('bootstrap/') || imp.importPath.includes('bootstrap/'));
  }).length;

  audit.debug(`  Imports to shared/: ${toShared}`);
  audit.debug(`  Imports to bootstrap/: ${toBootstrap}`);
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
async function main() {
  const audit = createAuditResult('Import Boundaries', isSilent);

  // Check if frontend/apps and frontend/src/shared exist
  if (!fileExists(appsDir)) {
    audit.error('Frontend apps directory not found', {
      path: appsDir,
      details: 'Expected frontend/apps/ directory'
    });
    
    saveReport(audit, 'BOUNDARIES_AUDIT.md', {
      description: 'Frontend not found - cannot validate import boundaries.',
      recommendations: ['Create frontend/apps/ directory structure']
    });
    
    finishAudit(audit);
    return;
  }

  if (!fileExists(sharedDir)) {
    audit.warn('Frontend shared directory not found', {
      path: sharedDir,
      details: 'Expected frontend/src/shared/ directory'
    });
  }

  // Find all imports
  const imports = findAllImports();
  
  if (imports.length === 0) {
    audit.warn('No imports found', {
      details: 'Frontend may be empty or pattern matching failed'
    });
  } else {
    audit.pass(`Found ${imports.length} import statements to analyze`);
  }

  // Check for violations
  const violations = validateImportBoundaries(audit, imports);

  if (violations.length === 0) {
    audit.pass('No import boundary violations detected');
  } else {
    // Group violations by type
    const crossAppViolations = violations.filter(v => v.reason.includes('cross-app'));
    const sharedViolations = violations.filter(v => v.reason.includes('shared/'));
    const bootstrapViolations = violations.filter(v => v.reason.includes('bootstrap/'));

    if (crossAppViolations.length > 0) {
      crossAppViolations.forEach(violation => {
        audit.error(violation.reason, {
          path: violation.source,
          details: `Line ${violation.line}: import from '${violation.importPath}'`
        });
      });
    }

    if (sharedViolations.length > 0) {
      sharedViolations.forEach(violation => {
        audit.error(violation.reason, {
          path: violation.source,
          details: `Line ${violation.line}: import from '${violation.importPath}'`
        });
      });
    }

    if (bootstrapViolations.length > 0) {
      bootstrapViolations.forEach(violation => {
        audit.error(violation.reason, {
          path: violation.source,
          details: `Line ${violation.line}: import from '${violation.importPath}'`
        });
      });
    }
  }

  // Validate that apps are using shared/bootstrap
  validateAllowedImports(audit, imports);

  // Check layer isolation
  checkLayerIsolation(audit, imports);

  // Generate statistics
  generateStatistics(audit, imports);

  // Generate report
  const recommendations = [
    'Apps may depend on shared/ or bootstrap/, but never import from each other',
    'Shared layer must remain pure - no imports from admin-app, tenant-app, or main-site',
    'Bootstrap layer must remain pure - no imports from any app',
    'Extract shared functionality to shared/ instead of duplicating across apps',
    'Use shared/ui/ for common components',
    'Use shared/hooks/ for common React hooks',
    'Use shared/utils/ for pure utility functions',
  ];

  if (violations.length > 0) {
    recommendations.unshift('FIX VIOLATIONS: Remove all cross-app imports immediately');
    recommendations.push('Refactor cross-app imports to use shared/ abstractions');
  }

  saveReport(audit, 'BOUNDARIES_AUDIT.md', {
    description: 'Enforces frontend architecture rules: apps remain independent, shared/bootstrap layers stay pure, no cross-app imports allowed.',
    recommendations
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Import boundary audit failed: ${err.message}`);
  process.exit(1);
});

