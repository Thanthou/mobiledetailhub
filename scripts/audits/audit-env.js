#!/usr/bin/env node
/**
 * audit-env.js — Environment Configuration Audit
 * -------------------------------------------------------------
 * ✅ Verifies required env vars by category
 * ✅ Tests database connectivity
 * ✅ Checks for weak file permissions
 * ✅ Outputs score, color-coded summary, and markdown report
 */

import fs from "fs";
import path from "path";
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

//────────────────────────────────────────────
// 🧩 Required Environment Variable Groups
//────────────────────────────────────────────
const requiredEnvVars = {
  database: ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"],
  auth: ["JWT_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_SECRET"],
  email: ["SENDGRID_API_KEY", "EMAIL_USER", "EMAIL_SERVICE"],
  frontend: ["VITE_API_URL_LIVE", "VITE_GOOGLE_MAPS_API_KEY"],
  optional: [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "STRIPE_SECRET_KEY",
    "GOOGLE_ANALYTICS_ID",
    "NODE_ENV",
  ],
};

//────────────────────────────────────────────
// 📊 Results Object
//────────────────────────────────────────────
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
  score: 100,
};

//────────────────────────────────────────────
// 🧠 Helper Utilities
//────────────────────────────────────────────
function checkRequiredVars(category, env) {
  const required = requiredEnvVars[category];
  const missing = [];
  const empty = [];
  required.forEach((key) => {
    if (!(key in env)) missing.push(key);
    else if (!env[key] || env[key].trim() === "") empty.push(key);
  });

  if (missing.length > 0)
    results.issues.push({
      severity: "high",
      type: "missing",
      category,
      message: `Missing required ${category} variables: ${missing.join(", ")}`,
    });
  if (empty.length > 0)
    results.issues.push({
      severity: "medium",
      type: "empty",
      category,
      message: `Empty ${category} variables: ${empty.join(", ")}`,
    });
}

function checkOptionalVars(env) {
  const missing = requiredEnvVars.optional.filter(
    (key) => !env[key] || env[key].trim() === ""
  );
  if (missing.length > 0)
    results.issues.push({
      severity: "low",
      type: "optional",
      category: "optional",
      message: `Optional variables not set: ${missing.join(", ")}`,
    });
}

//────────────────────────────────────────────
// 🧩 Config File Checks
//────────────────────────────────────────────
function checkConfigFiles() {
  console.log(chalk.cyan("\n📁 Checking .env configuration..."));
  const envPath = path.join(root, ".env");

  if (!fs.existsSync(envPath)) {
    results.issues.push({
      severity: "high",
      type: "missing_file",
      category: "config",
      message: ".env file not found",
    });
    console.log(chalk.red("❌ .env not found"));
    return;
  }

  console.log(chalk.green("✅ .env found"));
  Object.keys(requiredEnvVars).forEach((category) => {
    if (category !== "optional") checkRequiredVars(category, process.env);
  });
  checkOptionalVars(process.env);
}

//────────────────────────────────────────────
// 🧩 Database Connection Check
//────────────────────────────────────────────
async function checkDatabaseConnection() {
  console.log(chalk.cyan("\n🔌 Testing database connection..."));

  try {
    const { Pool } = await import("pg");
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const res = await pool.query("SELECT NOW() as time");
    console.log(chalk.green(`✅ Database connected (${res.rows[0].time})`));
    await pool.end();
  } catch (err) {
    results.issues.push({
      severity: "high",
      type: "connection",
      category: "database",
      message: `Database connection failed: ${err.message}`,
    });
    console.log(chalk.red(`❌ Database connection failed: ${err.message}`));
  }
}

//────────────────────────────────────────────
// 🔐 File Permission Checks
//────────────────────────────────────────────
function checkFilePermissions() {
  console.log(chalk.cyan("\n🔐 Checking file permissions..."));
  if (process.platform === "win32") {
    console.log(chalk.gray("ℹ️  Skipped (Windows platform)"));
    return;
  }

  const files = [".env", "backend/.env", "frontend/.env"];
  files.forEach((f) => {
    const full = path.join(root, f);
    if (!fs.existsSync(full)) return;
    const mode = fs.statSync(full).mode & parseInt("777", 8);
    if (mode > parseInt("644", 8)) {
      console.log(chalk.yellow(`⚠️  ${f} permissions too open (${mode.toString(8)})`));
      results.issues.push({
        severity: "medium",
        type: "permissions",
        category: "security",
        message: `${f} permissions too open (${mode.toString(8)})`,
      });
    } else {
      console.log(chalk.green(`✅ ${f} permissions OK`));
    }
  });
}

//────────────────────────────────────────────
// 📈 Calculate Score
//────────────────────────────────────────────
function calculateScore() {
  let score = 100;
  results.issues.forEach((issue) => {
    if (issue.severity === "high") score -= 10;
    else if (issue.severity === "medium") score -= 5;
    else if (issue.severity === "low") score -= 2;
  });
  results.score = Math.max(0, score);
  return results.score;
}

//────────────────────────────────────────────
// 🧾 Generate Markdown Report
//────────────────────────────────────────────
function generateReport() {
  const reportDir = path.join(root, "docs", "audits");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "ENV_AUDIT.md");

  const ts = new Date().toISOString();
  const content = `# Environment Configuration Audit
Generated: ${ts}

## 📊 Score: ${results.score}/100
${results.score >= 90 ? "🟢 Excellent" : results.score >= 70 ? "🟡 Moderate" : "🔴 Critical Issues Detected"}

---

## ✅ Passed: ${results.passed}
## ❌ Failed: ${results.failed}
## ⚠️  Warnings: ${results.warnings}

### Issues
${
  results.issues.length
    ? results.issues
        .map(
          (i) =>
            `- ${i.severity === "high" ? "🔴" : i.severity === "medium" ? "🟡" : "🟢"} ${i.message}`
        )
        .join("\n")
    : "✅ No issues detected"
}

---

**Recommendations**
- Verify all database credentials are correct
- Avoid committing .env files to version control
- Restrict .env file permissions to 600 on production servers
- Keep secrets rotated periodically
`;

  fs.writeFileSync(reportPath, content);
  console.log(chalk.green(`\n📄 Report saved → ${reportPath}\n`));
}


//────────────────────────────────────────────
// 🚀 Main
//────────────────────────────────────────────
async function runAuditEnv() {
  console.log(chalk.blue.bold("\n🔍 Running Environment Audit...\n"));

  checkConfigFiles();
  await checkDatabaseConnection();
  checkFilePermissions();
  const score = calculateScore();

  console.log(chalk.blue("\n📊 Environment Health Summary"));
  console.log(chalk.gray("-------------------------------"));
  if (score >= 90) console.log(chalk.green(`✅ Score: ${score}/100 — Excellent`));
  else if (score >= 70) console.log(chalk.yellow(`⚠️ Score: ${score}/100 — Moderate`));
  else console.log(chalk.red(`❌ Score: ${score}/100 — Needs Attention`));

  if (results.issues.length) {
    console.log(chalk.red("\n🚨 Issues Detected:"));
    results.issues.forEach((i) => console.log(` - ${i.message}`));
  } else console.log(chalk.green("\n🎉 No issues found. All good!"));

  generateReport();
  process.exit(score < 70 ? 1 : 0);
}

runAuditEnv().catch((err) => {
  console.error(chalk.red("❌ Audit failed:"), err);
  process.exit(1);
});
