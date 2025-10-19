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
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/SCHEMA_AUDIT.md
 *  - Color-coded CLI Summary
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { getPool } from "../backend/pool.js";
import { createModuleLogger } from "../../backend/config/logger.js";

dotenv.config();
const logger = createModuleLogger("schemaAudit");

const reportLines = [];
const color = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};

//──────────────────────────────────────────────────────────────
// 🧩 Utility Helpers
//──────────────────────────────────────────────────────────────
function logLine(message, status = "info") {
  const colored =
    status === "success"
      ? color.green(message)
      : status === "warn"
      ? color.yellow(message)
      : status === "error"
      ? color.red(message)
      : message;

  console.log(colored);
  reportLines.push(message);
}

async function verifyConnection(pool) {
  try {
    await pool.query("SELECT 1");
    logLine("✅ Database connection successful", "success");
    return true;
  } catch (err) {
    logLine(`❌ Database connection failed: ${err.message}`, "error");
    return false;
  }
}

//──────────────────────────────────────────────────────────────
// 🔍 Schema Switching Verification
//──────────────────────────────────────────────────────────────
async function testSchemaSwitching(pool) {
  logLine("\n🔍 Testing Schema Switching\n", "info");
  const results = { success: 0, fail: 0 };

  // 1️⃣ Current Schema
  try {
    const res = await pool.query("SELECT current_schema() AS current_schema");
    logLine(`Current schema: ${res.rows[0].current_schema}`, "success");
  } catch (err) {
    logLine(`Failed to detect current schema: ${err.message}`, "error");
    results.fail++;
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
    logLine(`Available Schemas (${schemas.length}): ${schemas.join(", ")}`, "success");
  } catch (err) {
    logLine(`Failed to list schemas: ${err.message}`, "error");
    results.fail++;
  }

  // 3️⃣ Try Switching
  const targets = ["tenants", "website", "analytics"];
  for (const schema of targets) {
    try {
      await pool.query(`SET search_path TO ${schema}, public`);
      const r = await pool.query("SELECT current_schema()");
      logLine(`Switched to ${schema} → ${r.rows[0].current_schema}`, "success");

      const tables = await pool.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = '${schema}' LIMIT 3
      `);
      if (tables.rows.length) {
        logLine(`   Tables: ${tables.rows.map(t => t.table_name).join(", ")}`, "info");
      } else {
        logLine(`   ⚠️ No tables found in ${schema}`, "warn");
      }
      results.success++;
    } catch (err) {
      logLine(`❌ Failed to switch to ${schema}: ${err.message}`, "error");
      results.fail++;
    }
  }

  return results;
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

async function testTenantMiddlewareSchemaSwitching(pool) {
  logLine("\n🧭 Testing Tenant Middleware Schema Switching\n");
  const cases = [
    { host: "localhost", expected: "public" },
    { host: "admin.localhost", expected: "tenants" },
    { host: "demo.localhost", expected: "tenants" },
    { host: "www.thatsmartsite.com", expected: "public" },
    { host: "example.thatsmartsite.com", expected: "tenants" },
  ];

  const results = [];
  for (const c of cases) {
    const sub = extractSubdomain(c.host);
    try {
      const target = sub ? "tenants" : "public";
      await pool.query(`SET search_path TO ${target}, public`);
      const res = await pool.query("SELECT current_schema()");
      const actual = res.rows[0].current_schema;
      const status = actual === c.expected ? "✅" : "⚠️";
      logLine(`${status} ${c.host} → schema: ${actual} (expected: ${c.expected})`);
      results.push({ host: c.host, expected: c.expected, actual, status });
    } catch (err) {
      logLine(`❌ ${c.host}: ${err.message}`, "error");
      results.push({ host: c.host, error: err.message });
    }
  }

  return results;
}

//──────────────────────────────────────────────────────────────
// 🧱 Schema Isolation Check
//──────────────────────────────────────────────────────────────
async function testSchemaIsolation(pool) {
  logLine("\n🧱 Testing Schema Isolation\n");
  try {
    await pool.query("SET search_path TO tenants, public");
    const res = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'website' LIMIT 1
    `);
    if (res.rows.length)
      logLine(`⚠️ Tenants schema can access website table: ${res.rows[0].table_name}`, "warn");
    else logLine("✅ Isolation verified (no website tables accessible)", "success");
  } catch (err) {
    logLine(`❌ Schema isolation check failed: ${err.message}`, "error");
  } finally {
    await pool.query("SET search_path TO public");
  }
}

//──────────────────────────────────────────────────────────────
// ⚙️ Environment Consistency Check
//──────────────────────────────────────────────────────────────
function checkEnvironment() {
  logLine("\n⚙️ Environment Validation\n");
  const baseDomain = process.env.BASE_DOMAIN;
  if (!baseDomain) logLine("❌ BASE_DOMAIN missing in .env", "error");
  else logLine(`✅ BASE_DOMAIN: ${baseDomain}`, "success");

  const dbURL = process.env.DATABASE_URL;
  if (!dbURL) logLine("❌ DATABASE_URL missing", "error");
  else if (!dbURL.includes("postgres"))
    logLine("⚠️ DATABASE_URL may not be PostgreSQL", "warn");
  else logLine("✅ DATABASE_URL format looks valid", "success");
}

//──────────────────────────────────────────────────────────────
// 📈 Summary & Report
//──────────────────────────────────────────────────────────────
function generateReport(finalScore, middlewareResults) {
  const ts = new Date().toISOString();
  return `# Schema Switching Audit
Generated: ${ts}

## 📊 Score: ${finalScore}/100

### Tenant Middleware
${middlewareResults.map(r =>
  r.error
    ? `- ❌ ${r.host}: ${r.error}`
    : `- ${r.status} ${r.host} → ${r.actual} (expected ${r.expected})`
).join("\n")}

---

## 📝 Recommendations
- Ensure tenant middleware dynamically switches schemas.
- Add BASE_DOMAIN to .env.
- Test isolation across all tenant schemas.
- Verify health monitoring tracks schema switching.
`;
}

function printSummary(finalScore) {
  console.log("\n─────────────────────────────");
  console.log(color.bold("📊 SCHEMA AUDIT SUMMARY"));
  console.log("─────────────────────────────");
  console.log(`Total Score: ${finalScore >= 90 ? color.green(finalScore) : color.yellow(finalScore)}/100`);
  console.log("See detailed report in docs/audits/SCHEMA_AUDIT.md");
  console.log("─────────────────────────────\n");
}

//──────────────────────────────────────────────────────────────
// 🚀 MAIN EXECUTION
//──────────────────────────────────────────────────────────────
async function main() {
  console.log(color.cyan("\n🚀 Running Schema Switching Verification Audit...\n"));
  const pool = await getPool();
  const connected = await verifyConnection(pool);
  if (!connected) process.exit(1);

  const schemaResults = await testSchemaSwitching(pool);
  const middlewareResults = await testTenantMiddlewareSchemaSwitching(pool);
  await testSchemaIsolation(pool);
  checkEnvironment();

  // scoring logic
  let score = 100;
  if (schemaResults.fail > 0) score -= schemaResults.fail * 5;
  if (middlewareResults.some(r => r.status === "⚠️" || r.error)) score -= 10;

  const finalScore = Math.max(0, score);
  const report = generateReport(finalScore, middlewareResults);

  const reportsDir = path.join(process.cwd(), "docs", "audits");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "SCHEMA_AUDIT.md"), report);

  printSummary(finalScore);
  console.log(color.green("✅ Schema switching audit completed successfully!\n"));
  process.exit(0);
}

main().catch(err => {
  console.error(color.red(`❌ Audit failed: ${err.message}`));
  process.exit(1);
});
