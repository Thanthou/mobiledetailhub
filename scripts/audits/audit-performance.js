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
  gray: s => `\x1b[90m${s}\x1b[0m`,
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
  console.log(`Routes: ${routes.length} (${routes.filter(r => r.isLazy).length} lazy, ${routes.filter(r => !r.isLazy).length} eager)`);
  console.log(`Bundles: ${bundles.length} total, ${(bundles.reduce((s, b) => s + b.sizeKB, 0) / 1024).toFixed(2)}MB`);
  console.log(`Components: ${compData.comps.length} total, ${compData.large.length} large (200+ lines)`);
  console.log("─────────────────────────────");
  
  // Critical issues (high severity)
  const criticalIssues = issues.filter(i => i.severity === "high");
  if (criticalIssues.length > 0) {
    console.log(color.bold(color.red(`\n🔴 CRITICAL ISSUES (${criticalIssues.length}):`)));
    
    criticalIssues.forEach(issue => {
      console.log(color.red(`  ❌ ${issue.message}`));
      
      // Show specific details for each issue type
      if (issue.type === "large_bundles") {
        const largeBundles = bundles.filter(b => b.sizeKB > 500).sort((a, b) => b.sizeKB - a.sizeKB).slice(0, 5);
        largeBundles.forEach(bundle => {
          console.log(color.gray(`     • ${bundle.name}: ${bundle.sizeKB}KB`));
        });
        if (bundles.filter(b => b.sizeKB > 500).length > 5) {
          console.log(color.gray(`     ... and ${bundles.filter(b => b.sizeKB > 500).length - 5} more`));
        }
        console.log(color.cyan(`     Fix: Use dynamic imports and code splitting`));
      }
      
      if (issue.type === "missing_suspense") {
        const missingSuspense = routes.filter(r => r.isLazy && !r.hasSuspense).slice(0, 5);
        missingSuspense.forEach(route => {
          console.log(color.gray(`     • ${route.path} (${route.file})`));
        });
        if (routes.filter(r => r.isLazy && !r.hasSuspense).length > 5) {
          console.log(color.gray(`     ... and ${routes.filter(r => r.isLazy && !r.hasSuspense).length - 5} more`));
        }
        console.log(color.cyan(`     Fix: Wrap lazy routes with <Suspense> boundary`));
      }
      
      if (issue.type === "huge_components") {
        const hugeComps = compData.errors.sort((a, b) => b.lines - a.lines).slice(0, 5);
        hugeComps.forEach(comp => {
          console.log(color.gray(`     • ${comp.path}: ${comp.lines} lines`));
        });
        if (compData.errors.length > 5) {
          console.log(color.gray(`     ... and ${compData.errors.length - 5} more`));
        }
        console.log(color.cyan(`     Fix: Split into smaller, focused components`));
      }
      
      console.log();
    });
  }
  
  // Warnings (medium severity)
  const warnings = issues.filter(i => i.severity === "medium");
  if (warnings.length > 0) {
    console.log(color.bold(color.yellow(`🟡 WARNINGS (${warnings.length}):`)));
    
    warnings.forEach(issue => {
      console.log(color.yellow(`  ⚠️  ${issue.message}`));
      
      if (issue.type === "too_many_eager_routes") {
        const eagerRoutes = routes.filter(r => !r.isLazy).slice(0, 5);
        eagerRoutes.forEach(route => {
          console.log(color.gray(`     • ${route.path} (${route.file})`));
        });
        if (routes.filter(r => !r.isLazy).length > 5) {
          console.log(color.gray(`     ... and ${routes.filter(r => !r.isLazy).length - 5} more`));
        }
        console.log(color.cyan(`     Fix: Convert non-critical routes to lazy-loaded with React.lazy()`));
      }
      
      console.log();
    });
  }
  
  // Additional info - large components warning
  if (compData.warnings.length > 0 && !criticalIssues.some(i => i.type === "huge_components")) {
    console.log(color.bold(color.yellow(`🟡 LARGE COMPONENTS (${compData.warnings.length} files 500-749 lines):`)));
    const topWarnings = compData.warnings.sort((a, b) => b.lines - a.lines).slice(0, 5);
    topWarnings.forEach(comp => {
      console.log(color.yellow(`  ⚠️  ${comp.path}: ${comp.lines} lines`));
    });
    if (compData.warnings.length > 5) {
      console.log(color.gray(`     ... and ${compData.warnings.length - 5} more`));
    }
    console.log(color.cyan(`     Recommendation: Consider refactoring for better maintainability`));
    console.log();
  }
  
  // Success cases
  if (issues.length === 0) {
    console.log(color.bold(color.green(`\n✅ EXCELLENT PERFORMANCE:`)));
    console.log(color.green(`  ✅ No critical issues detected`));
    console.log(color.green(`  ✅ Bundle sizes are optimal`));
    console.log(color.green(`  ✅ Component sizes are manageable`));
    console.log(color.green(`  ✅ Route loading strategy is efficient`));
    console.log();
  } else {
    // Show what's working well
    const goodPoints = [];
    if (!issues.some(i => i.type === "large_bundles")) {
      goodPoints.push("Bundle sizes are optimal");
    }
    if (!issues.some(i => i.type === "too_many_eager_routes")) {
      goodPoints.push("Route loading strategy is good");
    }
    if (!issues.some(i => i.type === "huge_components")) {
      goodPoints.push("Component sizes are manageable");
    }
    
    if (goodPoints.length > 0) {
      console.log(color.bold(color.green(`✅ WORKING WELL:`)));
      goodPoints.forEach(point => {
        console.log(color.green(`  ✅ ${point}`));
      });
      console.log();
    }
  }
  
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
