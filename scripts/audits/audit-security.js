#!/usr/bin/env node
/**
 * audit-security.js — Security & Authentication Audit
 * --------------------------------------------------------------
 * ✅ Validates:
 *  - JWT configuration (secrets, TTL, rotation)
 *  - CSRF protection on sensitive endpoints
 *  - Rate limiting on auth routes
 *  - Cookie security settings
 *  - No hardcoded secrets in code
 *  - SQL injection prevention
 *  - CORS configuration
 *  - Log redaction
 *  - Password reset security
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists,
  readJson
} from './shared/audit-utils.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🔐 JWT Configuration Checks
//──────────────────────────────────────────────────────────────
async function checkJWTConfiguration(audit) {
  audit.section('JWT Configuration');

  // Check JWT secrets
  if (!process.env.JWT_SECRET) {
    audit.error('JWT_SECRET not set', {
      details: 'Required for access token signing'
    });
  } else if (process.env.JWT_SECRET.length < 32) {
    audit.warn('JWT_SECRET is too short', {
      details: 'Should be at least 32 characters for security'
    });
  } else {
    audit.pass('JWT_SECRET is configured');
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    audit.error('JWT_REFRESH_SECRET not set', {
      details: 'Required for refresh token signing'
    });
  } else if (process.env.JWT_REFRESH_SECRET.length < 32) {
    audit.warn('JWT_REFRESH_SECRET is too short', {
      details: 'Should be at least 32 characters for security'
    });
  } else {
    audit.pass('JWT_REFRESH_SECRET is configured');
  }

  // Check same secrets aren't being used
  if (process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET) {
    if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
      audit.error('JWT_SECRET and JWT_REFRESH_SECRET are identical', {
        details: 'Use different secrets for access and refresh tokens'
      });
    } else {
      audit.pass('Access and refresh tokens use different secrets');
    }
  }

  // Check AUTH_CONFIG for proper TTL
  const authConfigPath = path.join(root, 'backend/config/auth.js');
  if (fileExists(authConfigPath)) {
    const content = fs.readFileSync(authConfigPath, 'utf8');
    
    // Check access token TTL
    const accessTTLMatch = content.match(/ACCESS_EXPIRES_IN:\s*['"](\w+)['"]/);
    if (accessTTLMatch) {
      const ttl = accessTTLMatch[1];
      if (ttl === '15m') {
        audit.pass('Access token TTL is 15m (secure)');
      } else if (ttl === '24h' || ttl === '1h') {
        audit.error(`Access token TTL is ${ttl} (should be 15m)`, {
          path: 'backend/config/auth.js',
          details: 'Short-lived access tokens reduce attack surface'
        });
      } else {
        audit.warn(`Access token TTL is ${ttl}`, {
          path: 'backend/config/auth.js',
          details: 'Recommended: 15m'
        });
      }
    }

    // Check refresh token TTL
    const refreshTTLMatch = content.match(/REFRESH_EXPIRES_IN:\s*['"](\w+)['"]/);
    if (refreshTTLMatch) {
      const ttl = refreshTTLMatch[1];
      if (ttl === '30d' || ttl === '7d') {
        audit.pass(`Refresh token TTL is ${ttl} (reasonable)`);
      } else {
        audit.warn(`Refresh token TTL is ${ttl}`, {
          details: 'Recommended: 7-30 days'
        });
      }
    }
  } else {
    audit.error('auth.js config file not found', {
      path: authConfigPath
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🔄 Token Rotation Check
//──────────────────────────────────────────────────────────────
function checkTokenRotation(audit) {
  audit.section('Refresh Token Rotation');

  const authServicePath = path.join(root, 'backend/services/authService.js');
  
  if (!fileExists(authServicePath)) {
    audit.error('authService.js not found', {
      path: authServicePath
    });
    return;
  }

  const content = fs.readFileSync(authServicePath, 'utf8');

  // Check if refreshAccessToken function exists
  if (!content.includes('refreshAccessToken')) {
    audit.error('refreshAccessToken function not found', {
      path: authServicePath,
      details: 'Required for token refresh flow'
    });
    return;
  }

  // Check for token rotation pattern
  const hasRevoke = content.includes('revokeRefreshToken');
  const hasStoreNew = content.includes('storeRefreshToken');
  const hasGenerateNew = content.includes('generateTokenPair');

  if (hasRevoke && hasStoreNew && hasGenerateNew) {
    audit.pass('Refresh token rotation is implemented');
    
    // Check if it's in the right function
    const refreshFunctionMatch = content.match(/async function refreshAccessToken[\s\S]*?^}/m);
    if (refreshFunctionMatch) {
      const funcBody = refreshFunctionMatch[0];
      if (funcBody.includes('revokeRefreshToken') && 
          funcBody.includes('storeRefreshToken') &&
          funcBody.includes('generateTokenPair')) {
        audit.pass('Token rotation logic is in refreshAccessToken function');
      } else {
        audit.warn('Token rotation logic may not be complete in refreshAccessToken');
      }
    }
  } else {
    audit.error('Refresh token rotation not fully implemented', {
      path: authServicePath,
      details: 'Missing: ' + [
        !hasRevoke ? 'revokeRefreshToken' : null,
        !hasStoreNew ? 'storeRefreshToken' : null,
        !hasGenerateNew ? 'generateTokenPair' : null
      ].filter(Boolean).join(', ')
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🛡️ CSRF Protection Check
//──────────────────────────────────────────────────────────────
function checkCSRFProtection(audit) {
  audit.section('CSRF Protection');

  const csrfMiddlewarePath = path.join(root, 'backend/middleware/csrfProtection.js');
  const authRoutesPath = path.join(root, 'backend/routes/auth.js');

  // Check if CSRF middleware exists
  if (!fileExists(csrfMiddlewarePath)) {
    audit.error('CSRF protection middleware not found', {
      path: csrfMiddlewarePath,
      details: 'Create csrfProtection middleware for sensitive endpoints'
    });
    return;
  }

  audit.pass('CSRF protection middleware exists');

  // Check if it's applied to refresh endpoint
  if (fileExists(authRoutesPath)) {
    const content = fs.readFileSync(authRoutesPath, 'utf8');
    
    if (content.includes("import") && content.includes("csrfProtection")) {
      audit.pass('CSRF middleware imported in auth routes');
      
      // Check if applied to /refresh endpoint
      if (content.match(/router\.post\(['"]\/refresh['"],.*csrfProtection/)) {
        audit.pass('CSRF protection applied to /refresh endpoint');
      } else {
        audit.error('CSRF protection NOT applied to /refresh endpoint', {
          path: authRoutesPath,
          details: 'Add csrfProtection middleware to refresh route'
        });
      }
    } else {
      audit.error('CSRF middleware not imported in auth routes', {
        path: authRoutesPath,
        details: "Add: import { csrfProtection } from '../middleware/csrfProtection.js'"
      });
    }
  }
}

//──────────────────────────────────────────────────────────────
// ⏱️ Rate Limiting Check
//──────────────────────────────────────────────────────────────
function checkRateLimiting(audit) {
  audit.section('Rate Limiting');

  const rateLimiterPath = path.join(root, 'backend/middleware/rateLimiter.js');
  const authRoutesPath = path.join(root, 'backend/routes/auth.js');

  if (!fileExists(rateLimiterPath)) {
    audit.error('Rate limiter middleware not found', {
      path: rateLimiterPath
    });
    return;
  }

  audit.pass('Rate limiter middleware exists');

  // Check if applied to auth routes
  if (fileExists(authRoutesPath)) {
    const content = fs.readFileSync(authRoutesPath, 'utf8');
    
    const sensitiveEndpoints = [
      { route: '/login', limiter: 'sensitiveAuthLimiter' },
      { route: '/register', limiter: 'sensitiveAuthLimiter' },
      { route: '/refresh', limiter: 'refreshTokenLimiter' },
      { route: '/request-password-reset', limiter: 'authLimiter' },
    ];

    let allProtected = true;
    
    sensitiveEndpoints.forEach(endpoint => {
      const hasRoute = content.includes(`'${endpoint.route}'`) || content.includes(`"${endpoint.route}"`);
      const hasLimiter = content.includes(endpoint.limiter);
      
      if (hasRoute && hasLimiter) {
        audit.pass(`${endpoint.route} has rate limiting (${endpoint.limiter})`);
      } else if (hasRoute && !hasLimiter) {
        audit.warn(`${endpoint.route} missing rate limiter`, {
          path: authRoutesPath,
          details: `Should use ${endpoint.limiter}`
        });
        allProtected = false;
      }
    });

    if (allProtected) {
      audit.pass('All sensitive auth endpoints are rate-limited');
    }
  }
}

//──────────────────────────────────────────────────────────────
// 🍪 Cookie Security Check
//──────────────────────────────────────────────────────────────
function checkCookieSecurity(audit) {
  audit.section('Cookie Security');

  const authConfigPath = path.join(root, 'backend/config/auth.js');
  
  if (!fileExists(authConfigPath)) {
    audit.error('auth.js config not found', {
      path: authConfigPath
    });
    return;
  }

  const content = fs.readFileSync(authConfigPath, 'utf8');

  // Check cookie options
  const cookieOptions = [
    { property: 'httpOnly: true', name: 'httpOnly flag' },
    { property: 'sameSite', name: 'sameSite attribute' },
  ];

  cookieOptions.forEach(opt => {
    if (content.includes(opt.property)) {
      audit.pass(`Cookies have ${opt.name} set`);
    } else {
      audit.error(`Cookies missing ${opt.name}`, {
        path: authConfigPath,
        details: `Add ${opt.property} to cookie options`
      });
    }
  });

  // Check production secure flag
  if (content.includes("secure: env.NODE_ENV === 'production'") ||
      content.includes('secure: process.env.NODE_ENV === "production"')) {
    audit.pass('Secure flag enabled in production');
  } else {
    audit.warn('Secure flag may not be conditionally set', {
      path: authConfigPath,
      details: 'Cookies should have secure:true in production'
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🔒 Hardcoded Secrets Check
//──────────────────────────────────────────────────────────────
function checkHardcodedSecrets(audit) {
  audit.section('Hardcoded Secrets Scan');

  // More specific patterns to reduce false positives
  const patterns = [
    // Look for actual hardcoded credentials (not descriptions or messages)
    { regex: /(?:password|pwd)\s*[:=]\s*['"](?!Please |Enter |Your |Database |Admin |Set )[a-zA-Z0-9@#$%^&*]{8,}['"]/i, name: 'password' },
    { regex: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{32,}['"]/i, name: 'API key' },
    { regex: /(?:secret|SECRET)(?:_KEY)?\s*[:=]\s*['"](?!JWT |Database |secret key |your )[a-zA-Z0-9_-]{20,}['"]/i, name: 'secret' },
    { regex: /(?:access_token|refresh_token|bearer)\s*[:=]\s*['"][a-zA-Z0-9._-]{50,}['"]/i, name: 'token' },
  ];

  const backendDir = path.join(root, 'backend');
  let filesScanned = 0;
  let secretsFound = false;

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', 'uploads', 'logs'].includes(entry.name)) {
          scanDirectory(full);
        }
      } else if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) {
        filesScanned++;
        const content = fs.readFileSync(full, 'utf8');
        
        patterns.forEach(pattern => {
          const matches = content.match(pattern.regex);
          if (matches) {
            // Exclude test files, example configs, validators, and documentation
            if (!full.includes('test') && 
                !full.includes('example') &&
                !full.includes('validator') &&
                !full.includes('envValidator') &&
                !full.includes('__tests__')) {
              audit.error(`Potential hardcoded ${pattern.name} found`, {
                path: path.relative(root, full),
                details: 'Use environment variables instead'
              });
              secretsFound = true;
            }
          }
        });
      }
    }
  }

  scanDirectory(backendDir);
  
  if (!secretsFound) {
    audit.pass(`No hardcoded secrets found (scanned ${filesScanned} files)`);
  }
}

//──────────────────────────────────────────────────────────────
// 💉 SQL Injection Prevention
//──────────────────────────────────────────────────────────────
function checkSQLInjectionPrevention(audit) {
  audit.section('SQL Injection Prevention');

  const backendDir = path.join(root, 'backend');
  let filesScanned = 0;
  const vulnerableFiles = new Set(); // Track unique files only

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', 'uploads', 'logs', 'migrations'].includes(entry.name)) {
          scanDirectory(full);
        }
      } else if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) {
        filesScanned++;
        const content = fs.readFileSync(full, 'utf8');
        
        // Look for dangerous SQL patterns
        // Template literals with ${} interpolation (not $1 parameters)
        const hasTemplateLiteral = /query\s*\(\s*`[\s\S]*?`/gi.test(content);
        
        if (hasTemplateLiteral) {
          // Check if it has ${} interpolation (bad) vs $1, $2 parameters (good)
          const templateQueries = content.match(/query\s*\(\s*`([\s\S]*?)`/gi) || [];
          
          for (const queryBlock of templateQueries) {
            // Has ${} interpolation
            const hasInterpolation = /\$\{[^}]+\}/.test(queryBlock);
            
            // Has WHERE or SET clause
            const hasDangerousClause = /WHERE|SET/i.test(queryBlock);
            
            if (hasInterpolation && hasDangerousClause) {
              // Check if it's a safe pattern
              const isSafePattern = 
                // Safe column/field selection
                /SELECT\s+\$\{[^}]*(field|column|safeField|safeColumn)[^}]*\}\s+FROM/i.test(queryBlock) ||
                /ORDER\s+BY\s+\$\{[^}]*(field|column|sortField)[^}]*\}/i.test(queryBlock) ||
                // Safe INTERVAL with parseInt/Number sanitization
                /INTERVAL\s+['"]\$\{parseInt\([^)]+\)[^'"]*['"]/i.test(queryBlock) ||
                /INTERVAL\s+['"]\$\{Number\([^)]+\)[^'"]*['"]/i.test(queryBlock) ||
                // Safe dynamic parameter placeholders ($1, $2 generation)
                /\$\$\{[^}]*\.length/i.test(queryBlock); // Generates $1, $2, etc.
              
              if (!isSafePattern) {
                vulnerableFiles.add(path.relative(root, full));
                break; // Only add once per file
              }
            }
          }
        }
        
        // Also check for string concatenation (definitely dangerous)
        const hasStringConcat = /query\s*\(\s*["'][^"']*\+[^)]+WHERE/gi.test(content);
        if (hasStringConcat) {
          vulnerableFiles.add(path.relative(root, full));
        }
      }
    }
  }

  scanDirectory(backendDir);
  
  if (vulnerableFiles.size === 0) {
    audit.pass(`No SQL injection vulnerabilities found (scanned ${filesScanned} files)`);
  } else {
    vulnerableFiles.forEach(file => {
      audit.warn('Potential SQL injection risk detected', {
        path: file,
        details: 'Review SQL queries - use parameterized queries ($1, $2) for user input'
      });
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🌐 CORS Configuration Check
//──────────────────────────────────────────────────────────────
function checkCORSConfiguration(audit) {
  audit.section('CORS Configuration');

  // Check both main server and bootstrap security file
  const serverPath = path.join(root, 'backend/server.js');
  const securityPath = path.join(root, 'backend/bootstrap/setupSecurity.js');
  
  // Try to find CORS configuration in either location
  let content = '';
  let configLocation = '';
  
  if (fileExists(securityPath)) {
    content = fs.readFileSync(securityPath, 'utf8');
    configLocation = securityPath;
  } else if (fileExists(serverPath)) {
    content = fs.readFileSync(serverPath, 'utf8');
    configLocation = serverPath;
  } else {
    audit.error('Neither server.js nor setupSecurity.js found', {
      paths: [serverPath, securityPath]
    });
    return;
  }

  // Check if CORS is configured (flexible whitespace matching)
  const hasCors = /app\.use\s*\(\s*cors/s.test(content) || content.includes('import cors from');
  
  if (hasCors) {
    audit.pass('CORS middleware is configured');
    
    // Check for origin validation
    if ((content.includes('origin:') && content.includes('callback')) || content.includes('corsOriginChecker')) {
      audit.pass('CORS has origin validation callback');
    } else {
      audit.warn('CORS may allow all origins', {
        path: path.relative(root, configLocation),
        details: 'Use origin validation callback for security'
      });
    }

    // Check for credentials
    if (content.includes('credentials: true')) {
      audit.pass('CORS allows credentials (required for cookies)');
    } else {
      audit.warn('CORS credentials not enabled', {
        path: path.relative(root, configLocation),
        details: 'Required for cookie-based auth'
      });
    }
  } else {
    audit.error('CORS middleware not found', {
      path: path.relative(root, configLocation),
      details: 'Add CORS configuration to setupSecurity.js or server.js'
    });
  }
}

//──────────────────────────────────────────────────────────────
// 📝 Log Redaction Check
//──────────────────────────────────────────────────────────────
function checkLogRedaction(audit) {
  audit.section('Log Redaction');

  const loggingConfigPath = path.join(root, 'backend/config/logging-environments.js');
  
  if (!fileExists(loggingConfigPath)) {
    audit.error('logging-environments.js not found', {
      path: loggingConfigPath
    });
    return;
  }

  const content = fs.readFileSync(loggingConfigPath, 'utf8');

  // Check for redact configuration
  if (content.includes('redact:') || content.includes('redact {')) {
    audit.pass('Log redaction is configured');
    
    // Check for sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'email', 'authorization'];
    const missingRedactions = sensitiveFields.filter(field => !content.includes(field));
    
    if (missingRedactions.length === 0) {
      audit.pass('All sensitive fields are redacted in logs');
    } else {
      audit.warn(`Some sensitive fields may not be redacted: ${missingRedactions.join(', ')}`, {
        path: loggingConfigPath,
        details: 'Add these to redact.paths array'
      });
    }
  } else {
    audit.error('Log redaction not configured', {
      path: loggingConfigPath,
      details: 'Add redact configuration to prevent sensitive data leaks'
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🔐 Production Environment Check
//──────────────────────────────────────────────────────────────
function checkProductionSafety(audit) {
  audit.section('Production Environment Safety');

  const envAsyncPath = path.join(root, 'backend/config/env.async.js');
  
  if (!fileExists(envAsyncPath)) {
    audit.warn('env.async.js not found', {
      path: envAsyncPath
    });
    return;
  }

  const content = fs.readFileSync(envAsyncPath, 'utf8');

  // Check for production fail-fast
  if (content.includes("NODE_ENV === 'production'") && 
      (content.includes('throw') || content.includes('process.exit'))) {
    audit.pass('Production fail-fast validation exists');
    
    // Check which secrets are validated
    const criticalSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
    const validated = criticalSecrets.filter(secret => 
      content.includes(secret) && content.includes('missing')
    );
    
    if (validated.length === criticalSecrets.length) {
      audit.pass('All critical secrets validated in production');
    } else {
      const missing = criticalSecrets.filter(s => !validated.includes(s));
      audit.warn(`Some secrets not validated: ${missing.join(', ')}`, {
        path: envAsyncPath,
        details: 'Add production validation for these secrets'
      });
    }
  } else {
    audit.error('Production fail-fast validation missing', {
      path: envAsyncPath,
      details: 'Server should fail to start if critical secrets are missing in production'
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🔑 Password Security Check
//──────────────────────────────────────────────────────────────
function checkPasswordSecurity(audit) {
  audit.section('Password Security');

  const authServicePath = path.join(root, 'backend/services/authService.js');
  
  if (!fileExists(authServicePath)) {
    audit.error('authService.js not found', {
      path: authServicePath
    });
    return;
  }

  const content = fs.readFileSync(authServicePath, 'utf8');

  // Check for bcrypt
  if (content.includes('bcrypt')) {
    audit.pass('Using bcrypt for password hashing');
    
    // Check salt rounds
    const saltRoundsMatch = content.match(/saltRounds\s*=\s*(\d+)/);
    if (saltRoundsMatch) {
      const rounds = parseInt(saltRoundsMatch[1]);
      if (rounds >= 10) {
        audit.pass(`bcrypt salt rounds: ${rounds} (secure)`);
      } else {
        audit.warn(`bcrypt salt rounds: ${rounds} (recommended: 10+)`, {
          path: authServicePath
        });
      }
    }
  } else {
    audit.error('Password hashing not found', {
      path: authServicePath,
      details: 'Use bcrypt for secure password hashing'
    });
  }
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
async function main() {
  const audit = createAuditResult('Security', isSilent);

  // Run all security checks
  await checkJWTConfiguration(audit);
  checkTokenRotation(audit);
  checkCSRFProtection(audit);
  checkRateLimiting(audit);
  checkCookieSecurity(audit);
  checkHardcodedSecrets(audit);
  checkSQLInjectionPrevention(audit);
  checkCORSConfiguration(audit);
  checkLogRedaction(audit);
  checkProductionSafety(audit);
  checkPasswordSecurity(audit);

  // Generate report
  saveReport(audit, 'SECURITY_AUDIT.md', {
    description: 'Comprehensive security audit covering JWT configuration, token rotation, CSRF protection, rate limiting, cookie security, and common vulnerabilities.',
    recommendations: [
      'Ensure all JWT secrets are 32+ characters',
      'Keep access token TTL at 15m for security',
      'Implement refresh token rotation to prevent replay attacks',
      'Apply CSRF protection to all state-changing endpoints',
      'Use rate limiters on auth, refresh, and password reset routes',
      'Set httpOnly, secure, and sameSite on all auth cookies',
      'Never commit secrets to version control',
      'Use parameterized queries to prevent SQL injection',
      'Configure CORS with origin validation',
      'Redact sensitive data in production logs',
      'Use bcrypt with 10+ salt rounds for passwords',
      'Fail fast in production if critical secrets are missing'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Security audit failed: ${err.message}`);
  process.exit(1);
});

