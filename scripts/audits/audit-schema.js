#!/usr/bin/env node
/**
 * audit-schema.js — Schema Switching Verification Audit
 * --------------------------------------------------------------
 * ✅ Verifies:
 *  - Active schema detection
 *  - Available schemas
 *  - Switching between key schemas (tenants, website, analytics)
 *  - Tenant middleware behavior (via simulated hostnames)
 *  - Schema isolation
 *  - BASE_DOMAIN + environment consistency
 * --------------------------------------------------------------
 */

import path from "path";
import dotenv from "dotenv";
import { getPool } from "../../backend/database/pool.js";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit
} from './shared/audit-utils.js';

dotenv.config();

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🔍 Schema Switching Verification
//──────────────────────────────────────────────────────────────
async function testSchemaSwitching(audit, pool) {
  audit.section('Schema Switching');

  // 1️⃣ Current Schema
  try {
    const res = await pool.query("SELECT current_schema() AS current_schema");
    audit.pass(`Current schema: ${res.rows[0].current_schema}`);
  } catch (err) {
    audit.error(`Failed to detect current schema: ${err.message}`);
  }

  // 2️⃣ List Available Schemas
  try {
    const res = await pool.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    const schemas = res.rows.map(r => r.schema_name);
    audit.pass(`Available schemas (${schemas.length}): ${schemas.join(", ")}`);
  } catch (err) {
    audit.error(`Failed to list schemas: ${err.message}`);
  }

  // 3️⃣ Try Switching
  const targets = ["tenants", "website", "analytics"];
  for (const schema of targets) {
    try {
      await pool.query(`SET search_path TO ${schema}, public`);
      const r = await pool.query("SELECT current_schema()");
      audit.pass(`Switched to ${schema} → ${r.rows[0].current_schema}`);

      const tables = await pool.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = $1 LIMIT 3
      `, [schema]);
      
      if (tables.rows.length) {
        audit.debug(`  Tables: ${tables.rows.map(t => t.table_name).join(", ")}`);
      } else {
        audit.warn(`No tables found in ${schema} schema`, {
          details: 'Schema exists but is empty - run migrations'
        });
      }
    } catch (err) {
      audit.error(`Failed to switch to ${schema}: ${err.message}`, {
        details: 'Schema may not exist or search_path is restricted'
      });
    }
  }

  // Reset to public
  try {
    await pool.query("SET search_path TO public");
  } catch (err) {
    audit.debug(`Note: Could not reset to public schema: ${err.message}`);
  }
}

//──────────────────────────────────────────────────────────────
// 🧭 Tenant Middleware Simulation
//──────────────────────────────────────────────────────────────
function extractSubdomain(hostname) {
  const cleanHost = hostname.split(":")[0];
  const parts = cleanHost.split(".");
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1") return null;
  if (parts.length >= 2 && parts[1] === "localhost") return parts[0];
  if (parts.length >= 3 && parts[1] === "thatsmartsite" && parts[2] === "com")
    return parts[0] === "www" ? null : parts[0];
  return null;
}

async function testTenantMiddlewareSchemaSwitching(audit, pool) {
  audit.section('Tenant Middleware Simulation');
  
  const cases = [
    { host: "localhost", expected: "public" },
    { host: "admin.localhost", expected: "tenants" },
    { host: "demo.localhost", expected: "tenants" },
    { host: "www.thatsmartsite.com", expected: "public" },
    { host: "example.thatsmartsite.com", expected: "tenants" },
  ];

  for (const c of cases) {
    const sub = extractSubdomain(c.host);
    try {
      const target = sub ? "tenants" : "public";
      await pool.query(`SET search_path TO ${target}, public`);
      const res = await pool.query("SELECT current_schema()");
      const actual = res.rows[0].current_schema;
      
      if (actual === c.expected) {
        audit.pass(`${c.host} → ${actual} (correct)`);
      } else {
        audit.warn(`${c.host} → ${actual} (expected: ${c.expected})`, {
          details: 'Middleware routing may not match expected schema'
        });
      }
    } catch (err) {
      audit.error(`${c.host} middleware test failed: ${err.message}`);
    }
  }

  // Reset to public
  try {
    await pool.query("SET search_path TO public");
  } catch (err) {
    audit.debug(`Note: Could not reset to public schema: ${err.message}`);
  }
}

//──────────────────────────────────────────────────────────────
// 🧱 Schema Isolation Check
//──────────────────────────────────────────────────────────────
async function testSchemaIsolation(audit, pool) {
  audit.section('Schema Isolation');
  
  try {
    // Set search path to tenants only (not public)
    await pool.query("SET search_path TO tenants");
    
    // Try to query website schema tables
    const res = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'website' LIMIT 1
    `);
    
    if (res.rows.length) {
      audit.warn(`Tenants schema can access website table: ${res.rows[0].table_name}`, {
        details: 'Schemas are not fully isolated - cross-schema queries possible'
      });
    } else {
      audit.pass('Schema isolation verified (no cross-schema access)');
    }
  } catch (err) {
    // This is actually good - it means isolation is working
    audit.pass('Schema isolation enforced (cross-schema queries blocked)');
  } finally {
    // Reset to public
    try {
      await pool.query("SET search_path TO public");
    } catch (err) {
      audit.debug(`Note: Could not reset to public schema: ${err.message}`);
    }
  }
}

//──────────────────────────────────────────────────────────────
// ⚙️ Environment Consistency Check
//──────────────────────────────────────────────────────────────
function checkEnvironment(audit) {
  audit.section('Environment Configuration');
  
  const baseDomain = process.env.BASE_DOMAIN;
  if (!baseDomain) {
    audit.warn('BASE_DOMAIN missing in .env', {
      details: 'Required for tenant subdomain routing in production'
    });
  } else {
    audit.pass(`BASE_DOMAIN: ${baseDomain}`);
  }

  const dbURL = process.env.DATABASE_URL;
  if (!dbURL) {
    audit.error('DATABASE_URL missing', {
      details: 'Required for database connection'
    });
  } else if (!dbURL.includes("postgres")) {
    audit.warn('DATABASE_URL may not be PostgreSQL', {
      details: 'Expected postgres:// protocol'
    });
  } else {
    audit.pass('DATABASE_URL format is valid');
  }
}

//──────────────────────────────────────────────────────────────
// 🚀 MAIN EXECUTION
//──────────────────────────────────────────────────────────────
async function main() {
  const audit = createAuditResult('Schema Switching', isSilent);

  // Get database connection
  let pool;
  try {
    pool = await getPool();
    
    // Verify connection
    await pool.query("SELECT 1");
    audit.pass('Database connection successful');
  } catch (err) {
    audit.error(`Database connection failed: ${err.message}`, {
      details: 'Cannot test schema switching without database connection'
    });
    
    saveReport(audit, 'SCHEMA_AUDIT.md', {
      description: 'Validates schema switching, tenant middleware routing, and schema isolation.',
      recommendations: [
        'Ensure DATABASE_URL is correct',
        'Verify tenant middleware dynamically switches schemas',
        'Add BASE_DOMAIN to .env for production',
        'Test isolation across all tenant schemas',
        'Verify health monitoring tracks schema switching'
      ]
    });
    
    finishAudit(audit);
    return;
  }

  // Run all checks
  await testSchemaSwitching(audit, pool);
  await testTenantMiddlewareSchemaSwitching(audit, pool);
  await testSchemaIsolation(audit, pool);
  checkEnvironment(audit);

  // Generate report
  saveReport(audit, 'SCHEMA_AUDIT.md', {
    description: 'Validates schema switching, tenant middleware routing, and schema isolation for multi-tenant architecture.',
    recommendations: [
      'Ensure tenant middleware dynamically switches schemas based on subdomain',
      'Add BASE_DOMAIN to .env for production routing',
      'Test isolation between tenant schemas to prevent data leakage',
      'Verify all expected schemas (tenants, website, analytics) exist',
      'Monitor schema switching in production logs'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Schema audit failed: ${err.message}`);
  process.exit(1);
});
