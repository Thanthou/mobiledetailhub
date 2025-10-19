#!/usr/bin/env node
/**
 * audit-overview.js — Meta Audit: Project Overview
 * --------------------------------------------------------------
 * ✅ Evaluates:
 *  - Project structure & key directories
 *  - package.json integrity & audit commands
 *  - Reads scores from prior audit reports (Env, Schema, Routes, SEO, Performance)
 *  - Produces unified health score + summary
 * --------------------------------------------------------------
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/PROJECT_OVERVIEW.md
 *  - Color-coded CLI Summary
 */

import fs from "fs";
import path from "path";
import chalk from "chalk";

const root = process.cwd();
const docsDir = path.join(root, "docs", "audits");

//────────────────────────────────────────────
// 🧠 Color utils
//────────────────────────────────────────────
const color = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`
};

//────────────────────────────────────────────
// 🧩 Check project structure
//────────────────────────────────────────────
function checkStructure() {
  const requiredDirs = [
    "backend",
    "frontend",
    "scripts/audits",
    "database",
    "docs/audits"
  ];
  const missing = requiredDirs.filter(d => !fs.existsSync(path.join(root, d)));
  const result = {
    missing,
    score: missing.length === 0 ? 100 : 100 - missing.length * 10
  };
  return result;
}

//────────────────────────────────────────────
// 🧩 Check package.json integrity
//────────────────────────────────────────────
function checkPackageJson() {
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return { missing: true, score: 0 };
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const expectedScripts = [
    "audit:env",
    "audit:schema",
    "audit:routes",
    "audit:routing",
    "audit:performance",
    "audit:seo",
    "audit:all"
  ];

  const missingScripts = expectedScripts.filter(s => !pkg.scripts?.[s]);
  const hasLint = !!pkg.scripts?.lint;
  const hasTest = !!pkg.scripts?.test;
  const score = 100 - missingScripts.length * 5 - (!hasLint ? 5 : 0) - (!hasTest ? 5 : 0);

  return {
    name: pkg.name || "Unknown Project",
    version: pkg.version || "0.0.0",
    missingScripts,
    hasLint,
    hasTest,
    score: Math.max(0, score)
  };
}

//────────────────────────────────────────────
// 📊 Parse scores from existing audit reports
//────────────────────────────────────────────
function extractScoreFromReport(filename) {
  try {
    const filePath = path.join(docsDir, filename);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/Score:\s*(\d+)\/100/i);
    if (match) return parseInt(match[1]);
  } catch {
    return null;
  }
  return null;
}

function gatherAuditScores() {
  return {
    env: extractScoreFromReport("ENV_AUDIT.md"),
    schema: extractScoreFromReport("SCHEMA_AUDIT.md"),
    routes: extractScoreFromReport("ROUTES_AUDIT.md"),
    performance: extractScoreFromReport("PERFORMANCE_AUDIT.md"),
    seo: extractScoreFromReport("SEO_AUDIT.md")
  };
}

//────────────────────────────────────────────
// 🧮 Calculate overall project score
//────────────────────────────────────────────
function calculateOverallScore(parts) {
  const weights = { structure: 0.2, package: 0.2, audits: 0.6 };
  const structureScore = parts.structure.score;
  const packageScore = parts.pkg.score;

  const auditScores = Object.values(parts.audits).filter(s => s !== null);
  const avgAuditScore = auditScores.length
    ? auditScores.reduce((a, b) => a + b, 0) / auditScores.length
    : 50;

  const total =
    structureScore * weights.structure +
    packageScore * weights.package +
    avgAuditScore * weights.audits;

  return Math.round(total);
}

//────────────────────────────────────────────
// 🧾 Generate Markdown Report
//────────────────────────────────────────────
function generateReport(structure, pkg, audits, score) {
  const ts = new Date().toISOString();
  const report = `# Project Overview Audit
Generated: ${ts}

## 📊 Overall Health Score: ${score}/100
${score >= 90 ? "🟢 Excellent" : score >= 70 ? "🟡 Good" : "🔴 Needs Attention"}

---

## 🧱 Project Structure
${structure.missing.length ? `⚠️ Missing: ${structure.missing.join(", ")}` : "✅ All key directories found"}

## 📦 package.json Integrity
- Project: ${pkg.name}
- Version: ${pkg.version}
- Missing scripts: ${pkg.missingScripts.length ? pkg.missingScripts.join(", ") : "None"}
- Lint script: ${pkg.hasLint ? "✅" : "❌"}
- Test script: ${pkg.hasTest ? "✅" : "❌"}
- Score: ${pkg.score}/100

## 🧩 Audit Scores
${Object.entries(audits)
  .map(([name, val]) => `- ${name.toUpperCase()}: ${val !== null ? val + "/100" : "⚠️ Not Found"}`)
  .join("\n")}

---

## 🎯 Recommendations
${structure.missing.length ? "- Create missing core directories\n" : ""}
${pkg.missingScripts.length ? "- Add missing audit scripts in package.json\n" : ""}
${!pkg.hasLint ? "- Add a linting step to enforce code quality\n" : ""}
${!pkg.hasTest ? "- Add a test script to enable CI checks\n" : ""}
${Object.values(audits).some(s => s !== null && s < 70)
  ? "- Address low-scoring audits (SEO, Performance, Routes, etc.)\n"
  : ""}
${score >= 90 ? "✅ Project is in excellent health. No immediate issues." : ""}
`;

  const reportPath = path.join(docsDir, "PROJECT_OVERVIEW.md");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(reportPath, report);
  return reportPath;
}

//────────────────────────────────────────────
// 🚀 Run Overview Audit
//────────────────────────────────────────────
function runProjectOverview() {
  console.log(color.cyan("\n🚀 Running Project Overview Audit...\n"));

  const structure = checkStructure();
  const pkg = checkPackageJson();
  const audits = gatherAuditScores();
  const score = calculateOverallScore({ structure, pkg, audits });
  const reportPath = generateReport(structure, pkg, audits, score);

  console.log(color.bold("📊 PROJECT OVERVIEW SUMMARY"));
  console.log("----------------------------");
  console.log(`Structure: ${structure.score}/100`);
  console.log(`Package: ${pkg.score}/100`);
  console.log(
    `Audit Avg: ${
      Object.values(audits).filter(Boolean).length
        ? Math.round(
            Object.values(audits)
              .filter(Boolean)
              .reduce((a, b) => a + b, 0) / Object.values(audits).filter(Boolean).length
          )
        : "N/A"
    }/100`
  );
  console.log(`\nOverall Score: ${
    score >= 90 ? color.green(score) : score >= 70 ? color.yellow(score) : color.red(score)
  }/100\n`);
  console.log(color.green(`📄 Report generated → ${reportPath}\n`));

  process.exit(score < 70 ? 1 : 0);
}

runProjectOverview();
