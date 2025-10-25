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

  // Response format consistency - WARNING
  // Check for standardized pattern: { success: true/false, data/error: ... }
  const hasSuccessField = /res\.json\(\{[^}]*success:\s*(true|false)/.test(content);
  const hasDataField = /res\.json\(\{[^}]*data:/.test(content);
  const hasErrorField = /res\.json\(\{[^}]*error:/.test(content);
  
  // Allow pass-through patterns from services (e.g., res.json(result), res.json(data))
  const hasPassThrough = /res\.json\((result|data|response|output)\)/.test(content);
  
  // Special cases that are allowed (industry standards)
  const isHealthEndpoint = fileName === 'health.js' && 
    (/status:\s*['"]OK['"]/.test(content) || /ok:\s*true/.test(content) || /healthy:\s*true/.test(content));
  
  const hasApiDocumentation = /service:\s*['"].*API['"]/.test(content) && /endpoints:/.test(content);
  
  // Check for non-standard inline object patterns (not pass-throughs)
  const allJsonResponses = content.match(/res\.json\([^)]+\)/g) || [];
  const inlineResponses = allJsonResponses.filter(r => 
    r.includes('{') && // Has inline object
    !r.includes('success:') && // No success field
    !r.includes('...') && // Not a spread/extend pattern
    !r.match(/res\.json\((result|data|response|output|tenant|user|stats)\)/) // Not a pass-through
  );
  
  // Standard pattern: { success: true, data } or { success: false, error }
  const usesStandardPattern = hasSuccessField && (hasDataField || hasErrorField);
  
  // Only warn if it's truly non-standard (not a special case)
  if (inlineResponses.length > 0 && !usesStandardPattern && !hasPassThrough && !isHealthEndpoint && !hasApiDocumentation) {
    audit.warn(`${fileName}: Non-standard response format`, {
      path: `backend/routes/${fileName}`,
      details: 'Use standardized format: { success: true/false, data/error }'
    });
    hasIssues = true;
  } else if (inlineResponses.length > 0 && usesStandardPattern && !isHealthEndpoint && !hasApiDocumentation) {
    // Count how many responses are non-standard
    const nonStandardCount = allJsonResponses.filter(r => 
      r.includes('{') && 
      !r.includes('success:') &&
      !r.includes('status:') && // Allow health status
      !r.includes('service:') && // Allow API documentation
      !r.includes('ok:') && // Allow health ok
      !r.includes('...') && // Allow spread patterns
      !r.includes('action:') && // Allow action-based responses (CRUD operations)
      !r.includes('message:') // Allow message-only responses
    ).length;
    
    // Calculate percentage of non-standard responses
    const totalInlineResponses = allJsonResponses.filter(r => r.includes('{')).length;
    const nonStandardPercentage = totalInlineResponses > 0 ? (nonStandardCount / totalInlineResponses) * 100 : 0;
    
    // Only warn if a significant percentage (>30%) of responses are truly non-standard
    if (nonStandardCount > 2 && nonStandardPercentage > 30) {
      audit.warn(`${fileName}: Mixed response format patterns`, {
        path: `backend/routes/${fileName}`,
        details: `${nonStandardCount}/${totalInlineResponses} responses don't follow standard format - consider standardizing`
      });
      hasIssues = true;
    }
  }
  // Pass-through responses, health checks, API docs, and fully standardized formats are acceptable

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
