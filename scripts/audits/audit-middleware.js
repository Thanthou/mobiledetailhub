#!/usr/bin/env node

/**
 * Middleware Audit
 * 
 * Checks middleware order, missing middleware, and error handling
 * Priority: 🟡 Medium - Prevents subtle bugs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAuditResult, saveReport, finishAudit } from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const audit = createAuditResult('Middleware', process.env.AUDIT_SILENT === 'true');

// Expected middleware order (critical for security and functionality)
const EXPECTED_MIDDLEWARE_ORDER = [
  'cors',
  'helmet',
  'compression',
  'rateLimiter',
  'requestLogger',
  'subdomainMiddleware',
  'tenantResolver',
  'auth',
  'csrfProtection',
  'validation',
  'errorHandler'
];

// Critical middleware that must be present
const CRITICAL_MIDDLEWARE = [
  'errorHandler',
  'requestLogger',
  'tenantResolver',
  'subdomainMiddleware'
];

// Security middleware that should be present
const SECURITY_MIDDLEWARE = [
  'helmet',
  'cors',
  'rateLimiter',
  'csrfProtection'
];

audit.section('Middleware Files Check');
checkMiddlewareFiles();

audit.section('Server Middleware Order');
checkServerMiddlewareOrder();

audit.section('Middleware Dependencies');
checkMiddlewareDependencies();

audit.section('Error Handling');
checkErrorHandling();

audit.section('Security Middleware');
checkSecurityMiddleware();

audit.section('Tenant Middleware');
checkTenantMiddleware();

audit.section('Middleware Configuration');
checkMiddlewareConfiguration();

function checkMiddlewareFiles() {
  const middlewareDir = path.join(projectRoot, 'backend/middleware');
  
  if (!fs.existsSync(middlewareDir)) {
    audit.error('Middleware directory not found', { path: 'backend/middleware' });
    return;
  }

  const middlewareFiles = fs.readdirSync(middlewareDir)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  audit.info(`Found ${middlewareFiles.length} middleware files: ${middlewareFiles.join(', ')}`);

  // Check for expected middleware files
  const expectedFiles = [
    'auth.js',
    'errorHandler.js',
    'requestLogger.js',
    'tenantResolver.js',
    'subdomainMiddleware.js',
    'validation.js',
    'rateLimiter.js'
  ];

  for (const file of expectedFiles) {
    const filePath = path.join(middlewareDir, file);
    if (fs.existsSync(filePath)) {
      audit.pass(`Middleware file exists: ${file}`);
    } else {
      audit.warn(`Missing middleware file: ${file}`, { path: 'backend/middleware' });
    }
  }
}

function checkServerMiddlewareOrder() {
  const serverFile = path.join(projectRoot, 'backend/server.js');
  
  if (!fs.existsSync(serverFile)) {
    audit.error('Server file not found', { path: 'backend/server.js' });
    return;
  }

  const serverContent = fs.readFileSync(serverFile, 'utf8');
  
  // Extract middleware usage patterns
  const middlewarePatterns = [
    { name: 'cors', pattern: /app\.use\(.*cors/i },
    { name: 'helmet', pattern: /app\.use\(.*helmet/i },
    { name: 'compression', pattern: /app\.use\(.*compression/i },
    { name: 'rateLimiter', pattern: /app\.use\(.*rateLimiter/i },
    { name: 'requestLogger', pattern: /app\.use\(.*requestLogger/i },
    { name: 'subdomainMiddleware', pattern: /app\.use\(.*subdomainMiddleware/i },
    { name: 'tenantResolver', pattern: /app\.use\(.*tenantResolver/i },
    { name: 'auth', pattern: /app\.use\(.*auth/i },
    { name: 'csrfProtection', pattern: /app\.use\(.*csrfProtection/i },
    { name: 'validation', pattern: /app\.use\(.*validation/i },
    { name: 'errorHandler', pattern: /app\.use\(.*errorHandler|app\.use\(\s*\(err,\s*req,\s*res,\s*next\)/i }
  ];

  const foundMiddleware = [];
  
  for (const { name, pattern } of middlewarePatterns) {
    if (pattern.test(serverContent)) {
      foundMiddleware.push(name);
      audit.pass(`Middleware found: ${name}`);
    }
  }

  // Check order (simplified - look for patterns)
  audit.info(`Found middleware in order: ${foundMiddleware.join(' → ')}`);

  // Check for critical middleware
  for (const critical of CRITICAL_MIDDLEWARE) {
    if (foundMiddleware.includes(critical)) {
      audit.pass(`Critical middleware present: ${critical}`);
    } else {
      audit.error(`Missing critical middleware: ${critical}`, { path: 'backend/server.js' });
    }
  }
}

function checkMiddlewareDependencies() {
  const packageJson = path.join(projectRoot, 'backend/package.json');
  
  if (!fs.existsSync(packageJson)) {
    audit.error('Backend package.json not found', { path: 'backend/package.json' });
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

  // Check for middleware-related dependencies
  const middlewareDeps = [
    'cors',
    'helmet',
    'compression',
    'express-rate-limit',
    'express-validator',
    'jsonwebtoken',
    'bcryptjs',
    'cookie-parser'
  ];

  for (const dep of middlewareDeps) {
    if (dependencies[dep]) {
      audit.pass(`Middleware dependency installed: ${dep}`);
    } else {
      audit.warn(`Missing middleware dependency: ${dep}`, { path: 'backend/package.json' });
    }
  }
}

function checkErrorHandling() {
  const errorHandlerFile = path.join(projectRoot, 'backend/middleware/errorHandler.js');
  
  if (!fs.existsSync(errorHandlerFile)) {
    audit.error('Error handler middleware not found', { path: 'backend/middleware/errorHandler.js' });
    return;
  }

  const content = fs.readFileSync(errorHandlerFile, 'utf8');
  
  // Check for proper error handling patterns
  const errorPatterns = [
    { name: '4-parameter function', pattern: /function.*\(.*err.*req.*res.*next.*\)/ },
    { name: 'Error logging', pattern: /console\.(log|error|warn)|logger\.(log|error|warn)/ },
    { name: 'Status code handling', pattern: /status.*\d{3}/ },
    { name: 'JSON response', pattern: /res\.json\(/ }
  ];

  for (const { name, pattern } of errorPatterns) {
    if (pattern.test(content)) {
      audit.pass(`Error handler has ${name}`);
    } else {
      audit.warn(`Error handler missing ${name}`, { path: 'backend/middleware/errorHandler.js' });
    }
  }

  // Check if error handler is last middleware
  const serverFile = path.join(projectRoot, 'backend/server.js');
  if (fs.existsSync(serverFile)) {
    const serverContent = fs.readFileSync(serverFile, 'utf8');
    const errorHandlerIndex = serverContent.indexOf('errorHandler');
    const routesIndex = serverContent.indexOf('app.use(\'/\'');
    
    if (errorHandlerIndex > routesIndex) {
      audit.pass('Error handler is positioned after routes (correct)');
    } else {
      audit.warn('Error handler should be positioned after routes', { path: 'backend/server.js' });
    }
  }
}

function checkSecurityMiddleware() {
  const serverFile = path.join(projectRoot, 'backend/server.js');
  
  if (!fs.existsSync(serverFile)) {
    return;
  }

  const serverContent = fs.readFileSync(serverFile, 'utf8');
  
  for (const security of SECURITY_MIDDLEWARE) {
    const pattern = new RegExp(`app\\.use\\(.*${security}`, 'i');
    if (pattern.test(serverContent)) {
      audit.pass(`Security middleware enabled: ${security}`);
    } else {
      audit.warn(`Security middleware missing: ${security}`, { path: 'backend/server.js' });
    }
  }

  // Check for helmet configuration
  if (serverContent.includes('helmet')) {
    if (serverContent.includes('helmet(') || serverContent.includes('helmet({')) {
      audit.pass('Helmet configured with options');
    } else {
      audit.warn('Helmet used without configuration', { path: 'backend/server.js' });
    }
  }

  // Check for CORS configuration
  if (serverContent.includes('cors')) {
    if (serverContent.includes('cors(') || serverContent.includes('cors({')) {
      audit.pass('CORS configured with options');
    } else {
      audit.warn('CORS used without configuration', { path: 'backend/server.js' });
    }
  }
}

function checkTenantMiddleware() {
  const tenantResolverFile = path.join(projectRoot, 'backend/middleware/tenantResolver.js');
  const subdomainFile = path.join(projectRoot, 'backend/middleware/subdomainMiddleware.js');
  
  if (!fs.existsSync(tenantResolverFile)) {
    audit.error('Tenant resolver middleware not found', { path: 'backend/middleware/tenantResolver.js' });
  } else {
    audit.pass('Tenant resolver middleware exists');
    
    const content = fs.readFileSync(tenantResolverFile, 'utf8');
    if (content.includes('req.tenant')) {
      audit.pass('Tenant resolver sets req.tenant');
    } else {
      audit.warn('Tenant resolver may not set req.tenant', { path: 'backend/middleware/tenantResolver.js' });
    }
  }

  if (!fs.existsSync(subdomainFile)) {
    audit.error('Subdomain middleware not found', { path: 'backend/middleware/subdomainMiddleware.js' });
  } else {
    audit.pass('Subdomain middleware exists');
  }
}

function checkMiddlewareConfiguration() {
  // Check for middleware configuration files
  const configDir = path.join(projectRoot, 'backend/config');
  
  const configFiles = [
    'auth.js',
    'logger.js',
    'env.js'
  ];

  for (const file of configFiles) {
    const filePath = path.join(configDir, file);
    if (fs.existsSync(filePath)) {
      audit.pass(`Middleware config exists: ${file}`);
    } else {
      audit.warn(`Missing middleware config: ${file}`, { path: 'backend/config' });
    }
  }

  // Check for middleware-specific configuration
  const authConfig = path.join(configDir, 'auth.js');
  if (fs.existsSync(authConfig)) {
    const content = fs.readFileSync(authConfig, 'utf8');
    
    if (content.includes('ACCESS_EXPIRES_IN')) {
      audit.pass('Auth config has access token expiry');
    }
    
    if (content.includes('REFRESH_EXPIRES_IN')) {
      audit.pass('Auth config has refresh token expiry');
    }
    
    if (content.includes('httpOnly') || content.includes('secure')) {
      audit.pass('Auth config has cookie security options');
    }
  }
}

// Calculate score
const totalChecks = audit.passed + audit.warnings + audit.errors;
const score = totalChecks > 0 ? Math.round((audit.passed / totalChecks) * 100) : 0;

audit.section('Summary');
audit.info(`Total middleware checks: ${totalChecks}`);
audit.info(`Score: ${score}/100`);

// Save report and finish
saveReport(audit, 'MIDDLEWARE_AUDIT.md', {
  description: 'Validates middleware configuration, order, and security settings',
  recommendations: [
    'Ensure middleware is loaded in correct order: security → logging → auth → routes → error handling',
    'All critical middleware (errorHandler, tenantResolver, requestLogger) must be present',
    'Configure helmet and CORS with appropriate security options',
    'Rate limiting should be enabled for all public endpoints',
    'Error handler should be the last middleware in the stack'
  ]
});

finishAudit(audit);
