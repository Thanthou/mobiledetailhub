#!/usr/bin/env node
/**
 * audit-env.js — Environment Configuration Audit
 * -------------------------------------------------------------
 * ✅ Verifies required env vars by category
 * ✅ Tests database connectivity
 * ✅ Checks for weak file permissions
 * ✅ Audits backend for direct process.env usage
 * ✅ Audits frontend for direct import.meta.env usage
 * ✅ Enforces centralized env utility pattern
 * ✅ Uses standardized audit utilities
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { glob } from "glob";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists 
} from "./shared/audit-utils.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

// Check if running in silent mode (called from audit:all)
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//────────────────────────────────────────────
// 🧩 Required Environment Variable Groups
//────────────────────────────────────────────
const requiredEnvVars = {
  database: ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"],
  auth: ["JWT_SECRET", "JWT_REFRESH_SECRET"],
  email: ["SENDGRID_API_KEY", "FROM_EMAIL"],
  optional: [
    "DATABASE_URL", // Deprecated - use DB_HOST, DB_NAME, etc.
    "DB_PORT", // Optional - defaults to 5432
    "STRIPE_SECRET_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NODE_ENV",
    "BASE_DOMAIN",
  ],
};

//────────────────────────────────────────────
// 🧩 Config File Checks
//────────────────────────────────────────────
function checkConfigFiles(audit) {
  audit.section('Configuration Files');
  
  const envPath = path.join(root, ".env");

  if (!fileExists(envPath)) {
    audit.error('.env file not found', { path: envPath });
    return;
  }

  audit.pass('.env file exists');

  // Check required environment variables by category
  Object.entries(requiredEnvVars).forEach(([category, vars]) => {
    if (category === 'optional') return; // Skip optional for now

    const missing = [];
    const empty = [];

    vars.forEach((key) => {
      if (!(key in process.env)) {
        missing.push(key);
      } else if (!process.env[key] || process.env[key].trim() === "") {
        empty.push(key);
      }
    });

    if (missing.length > 0) {
      audit.error(
        `Missing required ${category} variables: ${missing.join(', ')}`,
        { category, details: 'These environment variables are required but not defined' }
      );
    } else if (empty.length > 0) {
      audit.warn(
        `Empty ${category} variables: ${empty.join(', ')}`,
        { category, details: 'These variables are defined but have empty values' }
      );
    } else {
      audit.pass(`All ${category} variables present`);
    }
  });

  // Check optional variables (just info, not errors)
  const missingOptional = requiredEnvVars.optional.filter(
    (key) => !process.env[key] || process.env[key].trim() === ""
  );
  
  if (missingOptional.length > 0) {
    audit.debug(`Optional variables not set: ${missingOptional.join(', ')}`);
  }
}

//────────────────────────────────────────────
// 🧩 Database Connection Check
//────────────────────────────────────────────
async function checkDatabaseConnection(audit) {
  audit.section('Database Connectivity');

  // Check for required DB connection params
  if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER) {
    audit.error('DB connection params not set (DB_HOST, DB_NAME, DB_USER) - skipping connection test');
    return;
  }

  try {
    const { Pool } = await import("pg");
    
    // Use individual DB params (preferred method)
    const dbConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };

    const pool = new Pool(dbConfig);
    const res = await pool.query("SELECT NOW() as time, version() as version");
    
    audit.pass(`Database connected successfully`);
    audit.debug(`  Server time: ${res.rows[0].time}`);
    audit.debug(`  PostgreSQL: ${res.rows[0].version.split(',')[0]}`);
    
    await pool.end();
  } catch (err) {
    audit.error(
      `Database connection failed: ${err.message}`,
      { details: 'Check DATABASE_URL credentials and network connectivity' }
    );
  }
}

//────────────────────────────────────────────
// 🔐 File Permission Checks
//────────────────────────────────────────────
function checkFilePermissions(audit) {
  audit.section('File Permissions');
  
  if (process.platform === "win32") {
    audit.debug('Skipped (Windows platform - permissions handled differently)');
    return;
  }

  const files = [".env"];
  let checkedAny = false;

  files.forEach((f) => {
    const full = path.join(root, f);
    if (!fs.existsSync(full)) return;
    
    checkedAny = true;
    const stats = fs.statSync(full);
    const mode = stats.mode & parseInt("777", 8);
    const octal = mode.toString(8);

    // Check if permissions are too open (should be 600 or 644)
    if (mode > parseInt("644", 8)) {
      audit.warn(
        `${f} has overly permissive file permissions (${octal})`,
        { 
          path: full, 
          details: 'Consider setting to 600 (owner read/write only)' 
        }
      );
    } else {
      audit.pass(`${f} file permissions OK (${octal})`);
    }
  });

  if (!checkedAny) {
    audit.debug('No sensitive files found to check');
  }
}

//────────────────────────────────────────────
// 🔒 Production Environment Checks
//────────────────────────────────────────────
function checkProductionSafety(audit) {
  audit.section('Production Safety');

  const nodeEnv = process.env.NODE_ENV;
  
  if (!nodeEnv) {
    audit.warn('NODE_ENV not set', { details: 'Should be "development", "test", or "production"' });
  } else {
    audit.pass(`NODE_ENV: ${nodeEnv}`);
    
    // Production-specific checks
    if (nodeEnv === 'production') {
      const criticalSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
      const missingInProd = criticalSecrets.filter(key => !process.env[key]);
      
      if (missingInProd.length > 0) {
        audit.error(
          `Critical secrets missing in production: ${missingInProd.join(', ')}`,
          { details: 'Production startup should fail without these secrets' }
        );
      } else {
        audit.pass('All critical production secrets present');
      }
    }
  }
}

//────────────────────────────────────────────
// 🔍 Code Usage Audit - Backend
//────────────────────────────────────────────
async function auditBackendEnvUsage(audit) {
  audit.section('Backend Environment Variable Usage');

  const allowedFiles = [
    'backend/config/env.js',
    'backend/config/env.async.js',
    'backend/server.js', // Allowed for initial dotenv.config()
  ];

  try {
    // Find all .js files in backend
    const files = await glob('backend/**/*.js', {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.js',
        '**/*.spec.js',
      ],
    });

    const violations = [];

    for (const file of files) {
      // Skip allowed files
      if (allowedFiles.some(allowed => file.includes(allowed.replace(/\//g, path.sep)))) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Check for direct process.env usage
        if (line.includes('process.env.') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
          // Extract the variable name
          const match = line.match(/process\.env\.([A-Z_]+)/);
          if (match) {
            violations.push({
              file: file.replace(/\\/g, '/'),
              line: idx + 1,
              variable: match[1],
              code: line.trim(),
            });
          }
        }
      });
    }

    if (violations.length === 0) {
      audit.pass('All backend code uses centralized env utility');
    } else {
      // Create a separate warning for each violation so they print one by one
      violations.forEach(v => {
        audit.warn(
          `Direct process.env.${v.variable} usage`,
          { 
            path: `${v.file}:${v.line}`,
            details: `Use "import { env } from '../config/env.async.js'" instead`
          }
        );
      });
    }
  } catch (error) {
    audit.error(`Failed to audit backend env usage: ${error.message}`);
  }
}

//────────────────────────────────────────────
// 🔍 Code Usage Audit - Frontend
//────────────────────────────────────────────
async function auditFrontendEnvUsage(audit) {
  audit.section('Frontend Environment Variable Usage');

  const allowedFiles = [
    'frontend/src/shared/config/env.ts',
    'frontend/src/shared/config/api.ts', // Currently uses import.meta.env
    'frontend/vite.config.ts', // Vite config defines env vars
    'frontend/vite.config.shared.ts', // Vite config defines env vars
  ];

  try {
    // Find all .ts and .tsx files in frontend
    const files = await glob('frontend/**/*.{ts,tsx}', {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    });

    const violations = [];

    for (const file of files) {
      // Skip allowed files
      if (allowedFiles.some(allowed => file.includes(allowed.replace(/\//g, path.sep)))) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Check for direct import.meta.env usage
        if (line.includes('import.meta.env.') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
          // Extract the variable name
          const match = line.match(/import\.meta\.env\.([A-Z_]+)/);
          if (match) {
            violations.push({
              file: file.replace(/\\/g, '/'),
              line: idx + 1,
              variable: match[1],
              code: line.trim(),
            });
          }
        }
      });
    }

    if (violations.length === 0) {
      audit.pass('All frontend code uses centralized env utility');
    } else {
      // Create a separate warning for each violation so they print one by one
      violations.forEach(v => {
        audit.warn(
          `Direct import.meta.env.${v.variable} usage`,
          { 
            path: `${v.file}:${v.line}`,
            details: `Create frontend/src/shared/config/env.ts and import from there instead`
          }
        );
      });
    }
  } catch (error) {
    audit.error(`Failed to audit frontend env usage: ${error.message}`);
  }
}

//────────────────────────────────────────────
// 🚀 Main
//────────────────────────────────────────────
async function runAuditEnv() {
  const audit = createAuditResult('Environment', isSilent);

  // Run all checks (silently - summary will show at end)
  checkConfigFiles(audit);
  await checkDatabaseConnection(audit);
  checkFilePermissions(audit);
  checkProductionSafety(audit);
  await auditBackendEnvUsage(audit);
  await auditFrontendEnvUsage(audit);

  // Generate report
  saveReport(audit, 'ENV_AUDIT.md', {
    description: 'Validates environment configuration, database connectivity, and file permissions.',
    recommendations: [
      'Verify all database credentials are correct',
      'Avoid committing .env files to version control',
      'Restrict .env file permissions to 600 on production servers',
      'Keep secrets rotated periodically',
      'Use environment-specific .env files for dev/staging/production',
      'Backend: Use "import { env } from \'./config/env.async.js\'" instead of process.env',
      'Frontend: Create centralized env.ts and use it instead of import.meta.env',
    ],
  });

  // Finish and exit
  finishAudit(audit);
}

runAuditEnv().catch((err) => {
  console.error(`❌ Audit failed: ${err.message}`);
  process.exit(1);
});
