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
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/ROUTES_AUDIT.md
 *  - Color-coded CLI summary
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const routesDir = path.resolve(root, "backend/routes");

//──────────────────────────────────────────────────────────────
// 🧠 Utility helpers
//──────────────────────────────────────────────────────────────
const color = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};

const issues = {
  mixedImports: [],
  inconsistentLogging: [],
  missingErrorHandling: [],
  disabledValidation: [],
  legacyPoolImport: [],
  inconsistentResponses: [],
  missingDocumentation: [],
};

const reportLines = [];
const logLine = (msg, type = "info") => {
  const colorized =
    type === "success"
      ? color.green(msg)
      : type === "warn"
      ? color.yellow(msg)
      : type === "error"
      ? color.red(msg)
      : msg;
  console.log(colorized);
  reportLines.push(msg);
};

//──────────────────────────────────────────────────────────────
// 🔍 Scan individual route file
//──────────────────────────────────────────────────────────────
async function scanRouteFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  const fileIssues = { path: relativePath, fileName, issues: [] };

  const push = (type, msg) => {
    fileIssues.issues.push(msg);
    issues[type].push(relativePath);
  };

  // Mixed imports
  const hasImport = content.includes("import ");
  const hasRequire = content.includes("require(");
  if (hasImport && hasRequire) push("mixedImports", "Mixed import/require patterns");

  // Logging
  const hasConsoleLog = /console\.(log|error|warn)/.test(content);
  const hasLogger = content.includes("logger.") || content.includes("createModuleLogger");
  if (hasConsoleLog && !hasLogger) push("inconsistentLogging", "Uses console.log instead of structured logger");

  // Error handling
  const hasAsyncRoutes = /async\s*\(\s*req,\s*res/.test(content);
  const hasAsyncHandler = content.includes("asyncHandler");
  if (hasAsyncRoutes && !hasAsyncHandler)
    push("missingErrorHandling", "Async route without asyncHandler wrapper");

  // Disabled validation
  if (content.match(/\/\/\s*TODO: Re-enable validation/i) || content.match(/\/\/\s*import { validate/))
    push("disabledValidation", "Validation middleware commented out or disabled");

  // Legacy pool
  if (
    content.includes("import { pool } from '../database/pool.js'") ||
    content.includes("const { pool } = require('../database/pool')")
  )
    push("legacyPoolImport", "Uses legacy pool import (should use getPool)");

  // Inconsistent responses
  const responsePatterns = [
    content.match(/res\.json\(\{[^}]*success[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*data[^}]*\}/g) || [],
    content.match(/res\.json\(\{[^}]*error[^}]*\}/g) || [],
  ];
  const uniqueResponseTypes = responsePatterns.filter(p => p.length > 0).length;
  if (uniqueResponseTypes > 1)
    push("inconsistentResponses", "Inconsistent response format patterns");

  // Documentation
  const hasJSDoc = content.includes("/**") && content.includes("*/");
  const hasRouteComments = content.match(/\/\/\s*(GET|POST|PUT|DELETE)/);
  if (!hasJSDoc && !hasRouteComments) push("missingDocumentation", "Missing API documentation");

  return fileIssues;
}

//──────────────────────────────────────────────────────────────
// 🧮 Summary + Markdown Report
//──────────────────────────────────────────────────────────────
function generateReport(totalFiles, fileResults, healthScore) {
  const ts = new Date().toISOString();
  const filesWithIssues = fileResults.filter(r => r.issues.length > 0);
  return `# Express Routes Audit
Generated: ${ts}

## 📊 Summary
- Total Files: ${totalFiles}
- Files with Issues: ${filesWithIssues.length}
- Health Score: ${healthScore}/100

---

## 🧩 Issues by Type

### 🔴 Mixed Import/Require Patterns (${issues.mixedImports.length})
${issues.mixedImports.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Inconsistent Logging (${issues.inconsistentLogging.length})
${issues.inconsistentLogging.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Missing Error Handling (${issues.missingErrorHandling.length})
${issues.missingErrorHandling.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Disabled Validation (${issues.disabledValidation.length})
${issues.disabledValidation.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Legacy Pool Import (${issues.legacyPoolImport.length})
${issues.legacyPoolImport.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Inconsistent Responses (${issues.inconsistentResponses.length})
${issues.inconsistentResponses.map(f => `- ${f}`).join("\n") || "✅ None"}

### 🟡 Missing Documentation (${issues.missingDocumentation.length})
${issues.missingDocumentation.map(f => `- ${f}`).join("\n") || "✅ None"}

---

## 📝 Recommendations
${issues.mixedImports.length ? "- Convert all routes to ES6 imports\n" : ""}
${issues.inconsistentLogging.length ? "- Replace console.log with structured logger\n" : ""}
${issues.missingErrorHandling.length ? "- Wrap async routes with asyncHandler middleware\n" : ""}
${issues.disabledValidation.length ? "- Re-enable and enforce request validation middleware\n" : ""}
${issues.legacyPoolImport.length ? "- Use getPool() instead of legacy pool imports\n" : ""}
${issues.inconsistentResponses.length ? "- Standardize response JSON structure across routes\n" : ""}
${issues.missingDocumentation.length ? "- Add JSDoc or route-level comments for each endpoint\n" : ""}
${!Object.values(issues).some(a => a.length) ? "✅ All route files meet consistency standards!" : ""}
`;
}

function printSummary(totalFiles, fileResults, healthScore) {
  const filesWithIssues = fileResults.filter(r => r.issues.length > 0).length;
  console.log("\n─────────────────────────────");
  console.log(color.bold("📊 ROUTES AUDIT SUMMARY"));
  console.log("─────────────────────────────");
  console.log(`Total Files: ${totalFiles}`);
  console.log(`Files with Issues: ${filesWithIssues}`);
  console.log(`Health Score: ${healthScore >= 90 ? color.green(healthScore) : healthScore >= 70 ? color.yellow(healthScore) : color.red(healthScore)}/100`);

  if (healthScore >= 90) console.log(color.green("✅ Excellent - Minimal cleanup needed"));
  else if (healthScore >= 70) console.log(color.yellow("⚠️ Needs Improvement"));
  else console.log(color.red("❌ Requires Major Cleanup"));

  console.log("─────────────────────────────\n");
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Audit Runner
//──────────────────────────────────────────────────────────────
async function auditExpressRoutes() {
  console.log(color.cyan("\n🚀 Running Express Routes Consistency Audit...\n"));

  try {
    const files = await fs.readdir(routesDir);
    const routeFiles = files.filter(f => f.endsWith(".js"));
    console.log(`📂 Found ${routeFiles.length} route files\n`);

    const results = [];
    for (const f of routeFiles) {
      const res = await scanRouteFile(path.join(routesDir, f));
      results.push(res);
    }

    // Per-file summary
    results.forEach(r => {
      if (!r.issues.length) logLine(`✅ ${r.fileName}: Clean`, "success");
      else {
        logLine(`⚠️ ${r.fileName}: ${r.issues.length} issue(s)`, "warn");
        r.issues.forEach(i => logLine(`   - ${i}`, "warn"));
      }
    });

    // Health score
    const totalFiles = routeFiles.length;
    const filesWithIssues = results.filter(r => r.issues.length > 0).length;
    const healthScore = Math.round(((totalFiles - filesWithIssues) / totalFiles) * 100);

    printSummary(totalFiles, results, healthScore);

    // Markdown report
    const report = generateReport(totalFiles, results, healthScore);
    const reportDir = path.join(root, "docs", "audits");
    await fs.mkdir(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, "ROUTES_AUDIT.md");
    await fs.writeFile(reportPath, report, "utf8");

    console.log(color.green(`✅ Express Routes audit complete → ${reportPath}\n`));
  } catch (err) {
    console.error(color.red(`❌ Error during audit: ${err.message}`));
    process.exit(1);
  }
}

auditExpressRoutes();
