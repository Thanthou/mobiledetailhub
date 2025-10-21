#!/usr/bin/env node

/**
 * API Contract Audit
 * 
 * Ensures consistent request/response shapes across endpoints
 * Priority: 🟡 Medium - Makes frontend integration easier
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAuditResult, saveReport, finishAudit } from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const audit = createAuditResult('API Contracts', process.env.AUDIT_SILENT === 'true');

// Standard response patterns
const STANDARD_RESPONSE_PATTERNS = {
  success: {
    pattern: /res\.json\(\s*\{\s*success:\s*true/i,
    description: 'Success responses should have { success: true }'
  },
  error: {
    pattern: /res\.json\(\s*\{\s*success:\s*false/i,
    description: 'Error responses should have { success: false }'
  },
  message: {
    pattern: /res\.json\(\s*\{\s*[^}]*message:/i,
    description: 'Responses should include message field'
  },
  data: {
    pattern: /res\.json\(\s*\{\s*[^}]*data:/i,
    description: 'Success responses should include data field'
  }
};

// HTTP status code patterns
const STATUS_CODE_PATTERNS = {
  success: [200, 201],
  clientError: [400, 401, 403, 404, 422],
  serverError: [500, 502, 503]
};

audit.section('Route Files Analysis');
analyzeRouteFiles();

audit.section('Controller Patterns');
analyzeControllerPatterns();

audit.section('Response Consistency');
checkResponseConsistency();

audit.section('Error Handling');
checkErrorHandling();

audit.section('Request Validation');
checkRequestValidation();

audit.section('API Documentation');
checkApiDocumentation();

function analyzeRouteFiles() {
  const routesDir = path.join(projectRoot, 'backend/routes');
  
  if (!fs.existsSync(routesDir)) {
    audit.error('Routes directory not found', { path: 'backend/routes' });
    return;
  }

  const routeFiles = fs.readdirSync(routesDir)
    .filter(file => file.endsWith('.js') && !file.includes('__tests__'))
    .map(file => ({
      name: file,
      path: path.join(routesDir, file)
    }));

  audit.info(`Found ${routeFiles.length} route files: ${routeFiles.map(f => f.name).join(', ')}`);

  let totalEndpoints = 0;
  let endpointsWithValidation = 0;

  for (const file of routeFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Count endpoints
    const endpointMatches = content.match(/router\.(get|post|put|patch|delete)\(/g);
    const endpointCount = endpointMatches ? endpointMatches.length : 0;
    totalEndpoints += endpointCount;

    // Check for validation middleware
    if (content.includes('validation') || content.includes('validate') || content.includes('zod')) {
      endpointsWithValidation++;
      audit.pass(`Route file has validation: ${file.name}`);
    } else {
      audit.warn(`Route file missing validation: ${file.name}`, file.path);
    }

    // Check for proper HTTP methods
    const methods = ['get', 'post', 'put', 'patch', 'delete'];
    for (const method of methods) {
      const methodPattern = new RegExp(`router\\.${method}\\(`, 'g');
      const matches = content.match(methodPattern);
      if (matches) {
        audit.info(`Found ${matches.length} ${method.toUpperCase()} endpoints in ${file.name}`);
      }
    }
  }

  audit.info(`Total endpoints across all routes: ${totalEndpoints}`);
  audit.info(`Routes with validation: ${endpointsWithValidation}/${routeFiles.length}`);
}

function analyzeControllerPatterns() {
  const controllersDir = path.join(projectRoot, 'backend/controllers');
  
  if (!fs.existsSync(controllersDir)) {
    audit.error('Controllers directory not found', { path: 'backend/controllers' });
    return;
  }

  const controllerFiles = fs.readdirSync(controllersDir)
    .filter(file => file.endsWith('.js'))
    .map(file => ({
      name: file,
      path: path.join(controllersDir, file)
    }));

  audit.info(`Found ${controllerFiles.length} controller files`);

  let controllersWithAsync = 0;
  let controllersWithErrorHandling = 0;
  let controllersWithValidation = 0;

  for (const file of controllerFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Check for async/await patterns
    if (content.includes('async') && content.includes('await')) {
      controllersWithAsync++;
      audit.pass(`Controller uses async/await: ${file.name}`);
    } else {
      audit.warn(`Controller missing async/await: ${file.name}`, file.path);
    }

    // Check for error handling
    if (content.includes('try') && content.includes('catch')) {
      controllersWithErrorHandling++;
      audit.pass(`Controller has error handling: ${file.name}`);
    } else {
      audit.warn(`Controller missing error handling: ${file.name}`, file.path);
    }

    // Check for validation
    if (content.includes('validate') || content.includes('validation') || content.includes('req.body')) {
      controllersWithValidation++;
      audit.pass(`Controller has validation: ${file.name}`);
    } else {
      audit.warn(`Controller missing validation: ${file.name}`, file.path);
    }

    // Check for proper exports
    if (content.includes('module.exports') || content.includes('export')) {
      audit.pass(`Controller has proper exports: ${file.name}`);
    } else {
      audit.error(`Controller missing exports: ${file.name}`, file.path);
    }
  }

  audit.info(`Controllers with async/await: ${controllersWithAsync}/${controllerFiles.length}`);
  audit.info(`Controllers with error handling: ${controllersWithErrorHandling}/${controllerFiles.length}`);
  audit.info(`Controllers with validation: ${controllersWithValidation}/${controllerFiles.length}`);
}

function checkResponseConsistency() {
  const controllersDir = path.join(projectRoot, 'backend/controllers');
  
  if (!fs.existsSync(controllersDir)) {
    return;
  }

  const controllerFiles = fs.readdirSync(controllersDir)
    .filter(file => file.endsWith('.js'));

  let consistentResponses = 0;
  let totalResponses = 0;

  for (const file of controllerFiles) {
    const content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
    
    // Find all res.json() calls
    const jsonResponses = content.match(/res\.json\([^)]+\)/g) || [];
    totalResponses += jsonResponses.length;

    // Check for standard response patterns
    for (const pattern of Object.values(STANDARD_RESPONSE_PATTERNS)) {
      if (pattern.pattern.test(content)) {
        audit.pass(`${pattern.description} found in ${file}`);
        consistentResponses++;
      }
    }

    // Check for status codes
    const statusCodes = content.match(/res\.status\(\s*(\d{3})\s*\)/g) || [];
    for (const statusCode of statusCodes) {
      const code = parseInt(statusCode.match(/\d{3}/)[0]);
      if (STATUS_CODE_PATTERNS.success.includes(code)) {
        audit.pass(`Success status code ${code} found in ${file}`);
      } else if (STATUS_CODE_PATTERNS.clientError.includes(code)) {
        audit.pass(`Client error status code ${code} found in ${file}`);
      } else if (STATUS_CODE_PATTERNS.serverError.includes(code)) {
        audit.pass(`Server error status code ${code} found in ${file}`);
      }
    }
  }

  audit.info(`Consistent response patterns: ${consistentResponses}/${totalResponses}`);
}

function checkErrorHandling() {
  const controllersDir = path.join(projectRoot, 'backend/controllers');
  
  if (!fs.existsSync(controllersDir)) {
    return;
  }

  const controllerFiles = fs.readdirSync(controllersDir)
    .filter(file => file.endsWith('.js'));

  let controllersWithProperErrorHandling = 0;

  for (const file of controllerFiles) {
    const content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
    
    // Check for proper error handling patterns
    const hasTryCatch = content.includes('try') && content.includes('catch');
    const hasErrorResponse = content.includes('success: false') || content.includes('error:');
    const hasStatusCodes = content.includes('res.status(');
    
    if (hasTryCatch && hasErrorResponse && hasStatusCodes) {
      controllersWithProperErrorHandling++;
      audit.pass(`Proper error handling in ${file}`);
    } else {
      const missing = [];
      if (!hasTryCatch) missing.push('try/catch');
      if (!hasErrorResponse) missing.push('error response format');
      if (!hasStatusCodes) missing.push('status codes');
      
      audit.warn(`Incomplete error handling in ${file}: missing ${missing.join(', ')}`, path.join(controllersDir, file));
    }
  }

  audit.info(`Controllers with proper error handling: ${controllersWithProperErrorHandling}/${controllerFiles.length}`);
}

function checkRequestValidation() {
  const routesDir = path.join(projectRoot, 'backend/routes');
  
  if (!fs.existsSync(routesDir)) {
    return;
  }

  const routeFiles = fs.readdirSync(routesDir)
    .filter(file => file.endsWith('.js') && !file.includes('__tests__'));

  let routesWithValidation = 0;
  let totalRoutes = 0;

  for (const file of routeFiles) {
    const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    
    // Count routes
    const routeMatches = content.match(/router\.(get|post|put|patch|delete)\(/g);
    const routeCount = routeMatches ? routeMatches.length : 0;
    totalRoutes += routeCount;

    // Check for validation middleware
    if (content.includes('validation') || content.includes('validate') || content.includes('zod')) {
      routesWithValidation += routeCount;
      audit.pass(`Route file has validation middleware: ${file}`);
    } else {
      audit.warn(`Route file missing validation middleware: ${file}`, path.join(routesDir, file));
    }

    // Check for body parsing
    if (content.includes('req.body')) {
      if (content.includes('validation') || content.includes('validate')) {
        audit.pass(`Body parsing with validation in ${file}`);
      } else {
        audit.warn(`Body parsing without validation in ${file}`, path.join(routesDir, file));
      }
    }
  }

  audit.info(`Routes with validation: ${routesWithValidation}/${totalRoutes}`);
}

function checkApiDocumentation() {
  // Check for API documentation files
  const docsDir = path.join(projectRoot, 'docs');
  const apiDocs = [
    'API.md',
    'api.md',
    'endpoints.md',
    'routes.md'
  ];

  let foundDocs = 0;
  for (const doc of apiDocs) {
    const docPath = path.join(docsDir, doc);
    if (fs.existsSync(docPath)) {
      foundDocs++;
      audit.pass(`API documentation found: ${doc}`);
    }
  }

  if (foundDocs === 0) {
    audit.warn('No API documentation found', { path: 'docs/' });
  }

  // Check for OpenAPI/Swagger files
  const swaggerFiles = [
    'swagger.json',
    'openapi.json',
    'api-spec.json'
  ];

  for (const swagger of swaggerFiles) {
    const swaggerPath = path.join(projectRoot, swagger);
    if (fs.existsSync(swaggerPath)) {
      audit.pass(`OpenAPI/Swagger spec found: ${swagger}`);
    }
  }

  // Check for route comments/documentation
  const routesDir = path.join(projectRoot, 'backend/routes');
  if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.js') && !file.includes('__tests__'));

    let filesWithComments = 0;
    for (const file of routeFiles) {
      const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
      if (content.includes('/**') || content.includes('//') || content.includes('* @')) {
        filesWithComments++;
        audit.pass(`Route file has documentation: ${file}`);
      }
    }

    audit.info(`Route files with documentation: ${filesWithComments}/${routeFiles.length}`);
  }
}

// Calculate score
const totalChecks = audit.passed + audit.warnings + audit.errors;
const score = totalChecks > 0 ? Math.round((audit.passed / totalChecks) * 100) : 0;

audit.section('Summary');
audit.info(`Total API contract checks: ${totalChecks}`);
audit.info(`Score: ${score}/100`);

// Save report and finish
saveReport(audit, 'API_CONTRACTS_AUDIT.md', {
  description: 'Validates consistent request/response shapes across API endpoints',
  recommendations: [
    'Ensure all responses use standard format: { success: true/false, data: ..., message: ... }',
    'Add request validation middleware to all POST/PUT/PATCH endpoints',
    'Document API contracts in docs/api.md or OpenAPI spec',
    'Use consistent HTTP status codes (200, 201, 400, 401, 404, 500)',
    'Add JSDoc comments to all controller functions'
  ]
});

finishAudit(audit);
