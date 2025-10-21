#!/usr/bin/env node
/**
 * audit-routes.js — Express Routes Consistency Audit
 * --------------------------------------------------------------
 * ✅ Scans backend route files for:
 *  - Mixed import/require syntax
 *  - Improper logging usage
 *  - Missing async error handling
 *  - Disabled validation
 *  - Legacy database pool patterns
 *  - Inconsistent response structures
 *  - Missing documentation/comments
 * --------------------------------------------------------------
 */

import { promises as fs } from "fs";
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
const routesDir = path.resolve(root, "backend/routes");

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🔍 Scan individual route file
//──────────────────────────────────────────────────────────────
async function scanRouteFile(audit, filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  
  let hasIssues = false;

  // Mixed imports - ERROR (critical consistency issue)
  const hasImport = content.includes("import ");
  const hasRequire = content.includes("require(");
  if (hasImport && hasRequire) {
    audit.error(`${fileName}: Mixed import/require patterns`, {
      path: `backend/routes/${fileName}`,
      details: 'Convert all routes to ES6 imports for consistency'
    });
    hasIssues = true;
  }

  // Logging - WARNING
  const hasConsoleLog = /console\.(log|error|warn)/.test(content);
  const hasLogger = content.includes("logger.") || content.includes("createModuleLogger");
  if (hasConsoleLog && !hasLogger) {
    audit.warn(`${fileName}: Uses console.log instead of structured logger`, {
      path: `backend/routes/${fileName}`,
      details: 'Replace console.log with createModuleLogger'
    });
    hasIssues = true;
  }

  // Error handling - WARNING
  const hasAsyncRoutes = /async\s*\(\s*req,\s*res/.test(content);
  const hasAsyncHandler = content.includes("asyncHandler");
  if (hasAsyncRoutes && !hasAsyncHandler) {
    audit.warn(`${fileName}: Async route without asyncHandler wrapper`, {
      path: `backend/routes/${fileName}`,
      details: 'Wrap async routes with asyncHandler middleware to catch errors'
    });
    hasIssues = true;
  }

  // Disabled validation - WARNING
  if (content.match(/\/\/\s*TODO: Re-enable validation/i) || content.match(/\/\/\s*import { validate/)) {
    audit.warn(`${fileName}: Validation middleware commented out or disabled`, {
      path: `backend/routes/${fileName}`,
      details: 'Re-enable and enforce request validation middleware'
    });
    hasIssues = true;
  }

  // Legacy pool - WARNING
  if (
    content.includes("import { pool } from '../database/pool.js'") ||
    content.includes("const { pool } = require('../database/pool')")
  ) {
    audit.warn(`${fileName}: Uses legacy pool import (should use getPool)`, {
      path: `backend/routes/${fileName}`,
      details: 'Use getPool() instead of direct pool import'
    });
    hasIssues = true;
  }

  // Inconsistent responses - WARNING
  const responsePatterns = [
    content.match(/res\.json\(\{[^}]*success[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*data[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*error[^}]*\}/g) || [],
  ];
  const uniqueResponseTypes = responsePatterns.filter(p => p.length > 0).length;
  if (uniqueResponseTypes > 1) {
    audit.warn(`${fileName}: Inconsistent response format patterns`, {
      path: `backend/routes/${fileName}`,
      details: 'Standardize response JSON structure: { success, data/error }'
    });
    hasIssues = true;
  }

  // Documentation - INFO (not critical, just nice to have)
  const hasJSDoc = content.includes("/**") && content.includes("*/");
  const hasRouteComments = content.match(/\/\/\s*(GET|POST|PUT|DELETE)/);
  if (!hasJSDoc && !hasRouteComments) {
    audit.warn(`${fileName}: Missing API documentation`, {
      path: `backend/routes/${fileName}`,
      details: 'Add JSDoc or route-level comments for each endpoint'
    });
    hasIssues = true;
  }

  // If no issues, log success
  if (!hasIssues) {
    audit.pass(`${fileName}: Clean`);
  }
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Audit Runner
//──────────────────────────────────────────────────────────────
async function auditExpressRoutes() {
  const audit = createAuditResult('Backend Routes', isSilent);

  audit.section('Route File Scanning');

  // Check if routes directory exists
  if (!fileExists(routesDir)) {
    audit.error('Routes directory not found', {
      path: routesDir,
      details: 'Expected backend/routes/ directory'
    });
    
    saveReport(audit, 'ROUTES_AUDIT.md', {
      description: 'Validates Express route files for consistency, error handling, and code quality.',
      recommendations: [
        'Create backend/routes/ directory',
        'Organize route files by feature',
        'Follow consistent patterns across all routes'
      ]
    });
    
    finishAudit(audit);
    return;
  }

  try {
    const files = await fs.readdir(routesDir);
    const routeFiles = files.filter(f => f.endsWith(".js") && !f.startsWith("__"));
    
    audit.debug(`Found ${routeFiles.length} route files to scan`);

    // Scan each file
    for (const f of routeFiles) {
      await scanRouteFile(audit, path.join(routesDir, f));
    }

    // Generate report
    saveReport(audit, 'ROUTES_AUDIT.md', {
      description: 'Validates Express route files for consistency in imports, logging, error handling, validation, and response formats.',
      recommendations: [
        'Convert all routes to ES6 imports (no require)',
        'Replace console.log with createModuleLogger',
        'Wrap async routes with asyncHandler middleware',
        'Re-enable and enforce request validation middleware',
        'Use getPool() instead of direct pool imports',
        'Standardize response JSON structure: { success, data/error }',
        'Add JSDoc or route-level comments for API documentation'
      ]
    });

    // Finish and exit
    finishAudit(audit);

  } catch (err) {
    audit.error(`Audit failed: ${err.message}`, {
      details: err.stack
    });
    
    saveReport(audit, 'ROUTES_AUDIT.md', {
      description: 'Route audit failed during execution.',
      recommendations: ['Check error details and retry']
    });
    
    finishAudit(audit);
  }
}

auditExpressRoutes();
