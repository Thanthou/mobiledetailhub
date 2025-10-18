#!/usr/bin/env node
/**
 * Phase 4.1: Express Routes Consistency Audit
 * Scans all route files for consistency issues and provides cleanup recommendations
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.resolve(__dirname, '../backend/routes');

const issues = {
  mixedImports: [],
  inconsistentLogging: [],
  missingErrorHandling: [],
  disabledValidation: [],
  legacyPoolImport: [],
  inconsistentResponses: [],
  missingDocumentation: []
};

async function scanRouteFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  
  const fileIssues = {
    path: relativePath,
    fileName,
    issues: []
  };

  // Check for mixed import/require patterns
  const hasImport = content.includes('import ');
  const hasRequire = content.includes('require(');
  if (hasImport && hasRequire) {
    fileIssues.issues.push('Mixed import/require patterns');
    issues.mixedImports.push(relativePath);
  }

  // Check for inconsistent logging
  const hasConsoleLog = content.includes('console.log') || content.includes('console.error');
  const hasLoggerImport = content.includes('import') && content.includes('logger');
  const hasLoggerUsage = content.includes('logger.');
  
  if (hasConsoleLog && !hasLoggerUsage) {
    fileIssues.issues.push('Uses console.log instead of logger');
    issues.inconsistentLogging.push(relativePath);
  }

  // Check for missing error handling
  const hasAsyncRoutes = content.includes('async (req, res)');
  const hasAsyncHandler = content.includes('asyncHandler');
  if (hasAsyncRoutes && !hasAsyncHandler) {
    fileIssues.issues.push('Async routes without asyncHandler');
    issues.missingErrorHandling.push(relativePath);
  }

  // Check for disabled validation
  const hasCommentedValidation = content.includes('// TODO: Re-enable validation') || 
                                content.includes('// import { validate');
  if (hasCommentedValidation) {
    fileIssues.issues.push('Validation middleware disabled');
    issues.disabledValidation.push(relativePath);
  }

  // Check for legacy pool import
  const hasLegacyPool = content.includes("import { pool } from '../database/pool.js'") ||
                       content.includes("const { pool } = require('../database/pool')");
  if (hasLegacyPool) {
    fileIssues.issues.push('Uses legacy pool import pattern');
    issues.legacyPoolImport.push(relativePath);
  }

  // Check for inconsistent response formats
  const responsePatterns = [
    content.match(/res\.json\(\{[^}]*success[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*data[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*error[^}]*\}/g) || []
  ];
  
  const hasMultipleResponseFormats = responsePatterns.some(pattern => pattern.length > 0) && 
                                   responsePatterns.filter(pattern => pattern.length > 0).length > 1;
  if (hasMultipleResponseFormats) {
    fileIssues.issues.push('Inconsistent response format patterns');
    issues.inconsistentResponses.push(relativePath);
  }

  // Check for missing documentation
  const hasJSDoc = content.includes('/**') && content.includes('*/');
  const hasRouteComments = content.includes('// GET') || content.includes('// POST');
  if (!hasJSDoc && !hasRouteComments) {
    fileIssues.issues.push('Missing API documentation');
    issues.missingDocumentation.push(relativePath);
  }

  return fileIssues;
}

async function auditExpressRoutes() {
  console.log('🔍 Phase 4.1: Express Routes Consistency Audit');
  console.log('==============================================\n');

  try {
    const files = await fs.readdir(routesDir);
    const routeFiles = files.filter(file => file.endsWith('.js'));

    console.log(`1️⃣ Scanning ${routeFiles.length} route files...`);
    
    const fileResults = [];
    for (const file of routeFiles) {
      const filePath = path.join(routesDir, file);
      const result = await scanRouteFile(filePath);
      fileResults.push(result);
    }

    console.log('\n2️⃣ Route File Analysis:');
    fileResults.forEach(result => {
      if (result.issues.length === 0) {
        console.log(`   ✅ ${result.fileName}: Clean`);
      } else {
        console.log(`   ⚠️  ${result.fileName}: ${result.issues.length} issue(s)`);
        result.issues.forEach(issue => {
          console.log(`      - ${issue}`);
        });
      }
    });

    console.log('\n3️⃣ Summary by Issue Type:');
    
    console.log(`\n   🔴 Mixed Import/Require Patterns (${issues.mixedImports.length}):`);
    issues.mixedImports.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Inconsistent Logging (${issues.inconsistentLogging.length}):`);
    issues.inconsistentLogging.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Missing Error Handling (${issues.missingErrorHandling.length}):`);
    issues.missingErrorHandling.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Disabled Validation (${issues.disabledValidation.length}):`);
    issues.disabledValidation.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Legacy Pool Import (${issues.legacyPoolImport.length}):`);
    issues.legacyPoolImport.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Inconsistent Responses (${issues.inconsistentResponses.length}):`);
    issues.inconsistentResponses.forEach(file => console.log(`      - ${file}`));
    
    console.log(`\n   🟡 Missing Documentation (${issues.missingDocumentation.length}):`);
    issues.missingDocumentation.forEach(file => console.log(`      - ${file}`));

    // Calculate overall health score
    const totalFiles = routeFiles.length;
    const filesWithIssues = fileResults.filter(r => r.issues.length > 0).length;
    const healthScore = Math.round(((totalFiles - filesWithIssues) / totalFiles) * 100);

    console.log('\n4️⃣ Overall Health Score:');
    console.log(`   Files with issues: ${filesWithIssues}/${totalFiles}`);
    console.log(`   Health Score: ${healthScore}/100`);
    
    if (healthScore >= 90) {
      console.log('   Status: ✅ Excellent');
    } else if (healthScore >= 70) {
      console.log('   Status: ⚠️  Needs Improvement');
    } else {
      console.log('   Status: ❌ Requires Major Cleanup');
    }

    console.log('\n5️⃣ Recommended Actions:');
    console.log('   1. Convert all routes to ES6 imports');
    console.log('   2. Replace console.log with structured logging');
    console.log('   3. Add asyncHandler to all async routes');
    console.log('   4. Re-enable validation middleware');
    console.log('   5. Update pool imports to use getPool()');
    console.log('   6. Standardize response formats');
    console.log('   7. Add comprehensive API documentation');

    console.log('\n🎉 Express Routes Audit Complete!');

  } catch (error) {
    console.error('Error during audit:', error);
    process.exit(1);
  }
}

auditExpressRoutes();
