#!/usr/bin/env node
/**
 * audit-performance.js — Frontend Performance Audit
 * --------------------------------------------------------------
 * ✅ Analyzes:
 *  - Route loading strategy (lazy vs eager)
 *  - Bundle sizes and chunking
 *  - Component size distribution
 *  - Performance issues & recommendations
 * --------------------------------------------------------------
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/PERFORMANCE_AUDIT.md
 *  - Color-coded CLI Summary
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend/src");
const distDir = path.join(root, "frontend/dist");

//──────────────────────────────────────────────────────────────
// 🧠 CLI Color + Logging Utils
//──────────────────────────────────────────────────────────────
const color = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};
const reportLines = [];
function logLine(msg, type = "info") {
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
}

//──────────────────────────────────────────────────────────────
// 🔍 Route and Component Discovery
//──────────────────────────────────────────────────────────────
function findRouteDefinitions() {
  const routeFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", "build"].includes(entry.name)) walk(full);
      } else if (/\.(t|j)sx?$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf8");
        if (/Route|createRoutesFromElements|path=/.test(content))
          routeFiles.push({
            path: full,
            relativePath: path.relative(frontendDir, full),
            content,
          });
      }
    }
  }
  walk(frontendDir);
  return routeFiles;
}

function analyzeRoutePatterns(routeFiles) {
  const routes = [];
  for (const file of routeFiles) {
    const routeTags = file.content.match(/<Route\s+[^>]*path=["']([^"']+)["']/g) || [];
    const lazy = /React\.lazy|import\(/.test(file.content);
    const suspense = /<Suspense/.test(file.content);
    for (const tag of routeTags) {
      const match = tag.match(/path=["']([^"']+)["']/);
      if (match)
        routes.push({
          file: file.relativePath,
          path: match[1],
          isLazy: lazy,
          hasSuspense: suspense,
        });
    }
  }
  return routes;
}

function analyzeBundleSizes() {
  if (!fs.existsSync(distDir))
    return { error: "⚠️ Build directory not found. Run npm run build first.", bundles: [] };

  const bundles = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith(".js")) {
        const size = fs.statSync(full).size;
        bundles.push({
          name: e.name,
          path: path.relative(distDir, full),
          sizeKB: Math.round(size / 1024),
          isVendor: /vendor|node_modules/.test(e.name),
          isChunk: /chunk/.test(e.name),
        });
      }
    }
  }
  walk(distDir);
  const total = bundles.reduce((s, b) => s + b.sizeKB, 0);
  return { bundles, totalSizeMB: (total / 1024).toFixed(2) };
}

function findComponentFiles(dir, arr = []) {
  if (!fs.existsSync(dir)) return arr;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!["node_modules", "dist", "build", ".next", "__tests__"].includes(e.name))
        findComponentFiles(full, arr);
    } else if (/\.(tsx|ts)$/.test(e.name) && !/\.test\./.test(e.name)) arr.push(full);
  }
  return arr;
}

//──────────────────────────────────────────────────────────────
// 📊 Component Analysis
//──────────────────────────────────────────────────────────────
function countLines(fp) {
  try {
    return fs.readFileSync(fp, "utf8").split("\n").length;
  } catch {
    return 0;
  }
}

function analyzeComponents() {
  const files = findComponentFiles(frontendDir);
  const comps = files.map(f => ({
    path: path.relative(frontendDir, f),
    lines: countLines(f),
  }));
  const large = comps.filter(c => c.lines >= 200);
  const warnings = large.filter(c => c.lines >= 500 && c.lines < 750);
  const errors = large.filter(c => c.lines >= 750);
  return { comps, large, warnings, errors };
}

//──────────────────────────────────────────────────────────────
// ⚙️ Performance Checks
//──────────────────────────────────────────────────────────────
function detectPerformanceIssues(routes, bundles, compData) {
  const issues = [];
  const largeBundles = bundles.filter(b => b.sizeKB > 500);
  if (largeBundles.length)
    issues.push({
      type: "large_bundles",
      severity: "high",
      message: `${largeBundles.length} bundles exceed 500KB`,
    });
  const eager = routes.filter(r => !r.isLazy);
  if (eager.length > 10)
    issues.push({
      type: "too_many_eager_routes",
      severity: "medium",
      message: `${eager.length} eager routes found`,
    });
  const missingSuspense = routes.filter(r => r.isLazy && !r.hasSuspense);
  if (missingSuspense.length)
    issues.push({
      type: "missing_suspense",
      severity: "high",
      message: `${missingSuspense.length} lazy routes missing Suspense`,
    });
  if (compData.errors.length)
    issues.push({
      type: "huge_components",
      severity: "high",
      message: `${compData.errors.length} components exceed 750 lines`,
    });
  return issues;
}

//──────────────────────────────────────────────────────────────
// 🧮 Scoring + Reporting
//──────────────────────────────────────────────────────────────
function calculateScore(issues) {
  let score = 100;
  score -= issues.filter(i => i.severity === "high").length * 10;
  score -= issues.filter(i => i.severity === "medium").length * 5;
  return Math.max(0, score);
}

function generateReport(routes, bundles, compData, issues, score) {
  const ts = new Date().toISOString();
  return `# Performance Audit
Generated: ${ts}

## 📊 Performance Score: ${score}/100
${score >= 90 ? "🟢 Excellent" : score >= 70 ? "🟡 Moderate" : "🔴 Needs Improvement"}

## 🛣️ Routes
- Total: ${routes.length}
- Lazy: ${routes.filter(r => r.isLazy).length}
- Eager: ${routes.filter(r => !r.isLazy).length}

## 📦 Bundles
- Count: ${bundles.length}
- Total Size: ${(bundles.reduce((s, b) => s + b.sizeKB, 0) / 1024).toFixed(2)}MB
- Large Bundles (>500KB): ${bundles.filter(b => b.sizeKB > 500).length}

## 🧩 Components
- Total: ${compData.comps.length}
- Large (200+ lines): ${compData.large.length}
- Warnings (500+): ${compData.warnings.length}
- Errors (750+): ${compData.errors.length}

## ⚠️ Issues
${issues.length ? issues.map(i => `- ${i.severity === "high" ? "🔴" : "🟡"} ${i.message}`).join("\n") : "✅ No issues found"}

## 📝 Recommendations
${issues.some(i => i.type === "large_bundles") ? "- Use dynamic imports and lazy loading for large chunks\n" : ""}
${issues.some(i => i.type === "too_many_eager_routes") ? "- Convert non-critical routes to lazy-loaded\n" : ""}
${issues.some(i => i.type === "missing_suspense") ? "- Wrap lazy routes with Suspense for smoother UX\n" : ""}
${issues.some(i => i.type === "huge_components") ? "- Refactor extremely large components (>750 lines)\n" : ""}
`;
}

function printSummary(score, routes, bundles, compData, issues) {
  console.log("\n─────────────────────────────");
  console.log(color.bold("📊 PERFORMANCE AUDIT SUMMARY"));
  console.log("─────────────────────────────");
  console.log(`Score: ${score >= 90 ? color.green(score) : score >= 70 ? color.yellow(score) : color.red(score)}/100`);
  console.log(`Routes: ${routes.length} (${routes.filter(r => r.isLazy).length} lazy)`);
  console.log(`Bundles: ${bundles.length} total, ${(bundles.reduce((s, b) => s + b.sizeKB, 0) / 1024).toFixed(2)}MB`);
  console.log(`Large components: ${compData.large.length}`);
  if (issues.length)
    console.log(color.yellow(`⚠️  ${issues.length} performance issue(s) detected`));
  else console.log(color.green("✅ No performance issues found"));
  console.log("─────────────────────────────\n");
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
function runPerformanceAudit() {
  console.log(color.cyan("\n🚀 Running Performance Audit...\n"));

  const routeFiles = findRouteDefinitions();
  const routes = analyzeRoutePatterns(routeFiles);
  const bundleData = analyzeBundleSizes();
  const compData = analyzeComponents();
  const issues = detectPerformanceIssues(routes, bundleData.bundles, compData);
  const score = calculateScore(issues);

  printSummary(score, routes, bundleData.bundles, compData, issues);

  const reportDir = path.join(root, "docs", "audits");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "PERFORMANCE_AUDIT.md");
  fs.writeFileSync(reportPath, generateReport(routes, bundleData.bundles, compData, issues, score));

  console.log(color.green(`✅ Performance audit complete → ${reportPath}\n`));
  process.exit(0);
}

runPerformanceAudit();
