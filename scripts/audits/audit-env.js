#!/usr/bin/env node
/**
 * audit-env.js — Environment Configuration Audit
 * -------------------------------------------------------------
 * ✅ Verifies required env vars by category
 * ✅ Tests database connectivity
 * ✅ Checks for weak file permissions
 * ✅ Uses standardized audit utilities
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
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
  database: ["DATABASE_URL"],
  auth: ["JWT_SECRET", "JWT_REFRESH_SECRET"],
  email: ["SENDGRID_API_KEY", "FROM_EMAIL"],
  optional: [
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

  if (!process.env.DATABASE_URL) {
    audit.error('DATABASE_URL not set - skipping connection test');
    return;
  }

  try {
    const { Pool } = await import("pg");
    
    // Parse DATABASE_URL
    let dbConfig;
    try {
      const url = new URL(process.env.DATABASE_URL);
      dbConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading /
      };
    } catch (parseError) {
      audit.error('Invalid DATABASE_URL format', { details: parseError.message });
      return;
    }

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
// 🚀 Main
//────────────────────────────────────────────
async function runAuditEnv() {
  const audit = createAuditResult('Environment', isSilent);

  // Run all checks (silently - summary will show at end)
  checkConfigFiles(audit);
  await checkDatabaseConnection(audit);
  checkFilePermissions(audit);
  checkProductionSafety(audit);

  // Generate report
  saveReport(audit, 'ENV_AUDIT.md', {
    description: 'Validates environment configuration, database connectivity, and file permissions.',
    recommendations: [
      'Verify all database credentials are correct',
      'Avoid committing .env files to version control',
      'Restrict .env file permissions to 600 on production servers',
      'Keep secrets rotated periodically',
      'Use environment-specific .env files for dev/staging/production',
    ],
  });

  // Finish and exit
  finishAudit(audit);
}

runAuditEnv().catch((err) => {
  console.error(`❌ Audit failed: ${err.message}`);
  process.exit(1);
});
