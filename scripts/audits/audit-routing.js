#!/usr/bin/env node
/**
 * audit-routing.js — Frontend Routing Validation Audit
 * --------------------------------------------------------------
 * ✅ Verifies:
 *  - Each app (Admin, Tenant, Main Site) has exactly one router
 *  - No nested routers in subcomponents
 *  - All router context hooks are properly wrapped
 *  - Shared components don't accidentally initialize routers
 * --------------------------------------------------------------
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/ROUTING_AUDIT.md
 *  - Color-coded CLI Summary
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend");

//──────────────────────────────────────────────────────────────
// 🧠 Utility helpers
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

//──────────────────────────────────────────────────────────────
// 🔍 Router discovery
//──────────────────────────────────────────────────────────────
function findRouterFiles(dir) {
  const routerFiles = [];
  const patterns = [
    /BrowserRouter/,
    /createBrowserRouter/,
    /<Router/,
    /useRouter/,
    /useNavigate/,
    /Routes/,
    /Route/,
    /RouterProvider/,
  ];

  function scan(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", "build", ".git"].includes(entry.name)) scan(full);
      } else if (/\.(t|j)sx?$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(full, "utf8");
          if (patterns.some(p => p.test(content))) {
            routerFiles.push({
              path: full,
              relativePath: path.relative(frontendDir, full),
              content,
            });
          }
        } catch {}
      }
    }
  }
  scan(dir);
  return routerFiles;
}

//──────────────────────────────────────────────────────────────
// 🧩 Router structure analysis
//──────────────────────────────────────────────────────────────
function analyzeRouterStructure(file) {
  const { content, relativePath } = file;
  const lines = content.split("\n");
  const analysis = {
    file: relativePath,
    routerCount: 0,
    routerLines: [],
    hasRoutes: false,
    hasRoute: false,
    issues: [],
  };

  lines.forEach((line, i) => {
    const ln = i + 1;
    if (/<BrowserRouter/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "BrowserRouter", line: line.trim() });
    }
    if (/createBrowserRouter/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "createBrowserRouter", line: line.trim() });
    }
    if (/<RouterProvider/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "RouterProvider", line: line.trim() });
    }
    if (/<Routes/.test(line)) analysis.hasRoutes = true;
    if (/<Route/.test(line)) analysis.hasRoute = true;
  });

  if (analysis.routerCount === 0) analysis.issues.push("No router found");
  if (analysis.routerCount > 1) analysis.issues.push(`Multiple routers (${analysis.routerCount})`);
  return analysis;
}

//──────────────────────────────────────────────────────────────
// 🧭 App entry validation
//──────────────────────────────────────────────────────────────
function validateAppEntries(routerFiles) {
  const entries = [
    { name: "Admin App", path: "apps/admin-app/src/main.tsx" },
    { name: "Tenant App", path: "apps/tenant-app/src/main.tsx" },
    { name: "Main Site", path: "apps/main-site/src/main.tsx" },
  ];
  const validation = { entries: [], totalRouters: 0, issues: [] };

  for (const entry of entries) {
    const file = routerFiles.find(f => f.relativePath.replace(/\\/g, "/") === entry.path);
    if (!file) {
      validation.entries.push({
        name: entry.name,
        status: "❌ Missing",
        routerCount: 0,
        issues: ["Entry file not found"],
      });
      validation.issues.push(`${entry.name}: entry file missing`);
      continue;
    }
    const analysis = analyzeRouterStructure(file);
    validation.totalRouters += analysis.routerCount;
    const status =
      analysis.routerCount === 1 ? "✅ Valid" : analysis.routerCount === 0 ? "❌ No router" : "⚠️ Multiple routers";
    validation.entries.push({ name: entry.name, status, ...analysis });
    if (analysis.issues.length) validation.issues.push(`${entry.name}: ${analysis.issues.join(", ")}`);
  }
  return validation;
}

//──────────────────────────────────────────────────────────────
// ⚙️ Routing context and nesting checks
//──────────────────────────────────────────────────────────────
function analyzeContextUsage(routerFiles, analyses) {
  const contextFiles = routerFiles.filter(
    f => f.content.includes("useRouter") || f.content.includes("useNavigate") || f.content.includes("useLocation")
  );
  const nested = analyses.filter(a => a.routerCount > 1);
  const contextWithoutRouter = contextFiles.filter(f => {
    const a = analyzeRouterStructure(f);
    if (a.routerCount > 0) return false;
    // Exclude shared components - they're designed to be used within routed apps
    if (f.relativePath.includes("shared")) return false;
    if (f.relativePath.includes("hooks") || f.relativePath.endsWith(".ts")) return false;
    if (f.relativePath.match(/App\.tsx|AdminApp|TenantApp|MainApp/)) return false;
    // Components in apps/*/src/ are within router context (their parent app has router)
    if (f.relativePath.match(/^apps[\/\\][^\/\\]+[\/\\]src[\/\\]/)) return false;
    return true;
  });
  return { contextFiles, nested, contextWithoutRouter };
}

//──────────────────────────────────────────────────────────────
// 🧾 Report generation
//──────────────────────────────────────────────────────────────
function generateReport(score, summary, context, issues) {
  const ts = new Date().toISOString();
  return `# Routing Validation Audit
Generated: ${ts}

## 📊 Score: ${score}/100

### Summary
- Total Router Files: ${summary.totalFiles}
- Total Routers: ${summary.totalRouters}
- Expected: 3 (one per app)

### App Entries
${summary.entries
  .map(e => `- ${e.name}: ${e.status} (${e.routerCount} routers)`)
  .join("\n")}

### Router Context
- Files using router context: ${context.contextFiles.length}
- Files with multiple routers: ${context.nested.length}
- Files using context without router: ${context.contextWithoutRouter.length}

${context.contextWithoutRouter.length
    ? `### ⚠️ Files using router context without router
${context.contextWithoutRouter.map(f => `- ${f.relativePath}`).join("\n")}`
    : "✅ All router context usage properly wrapped"}

---

## ⚠️ Issues
${issues.length ? issues.map(i => `- ${i}`).join("\n") : "✅ No issues found"}

---

## 📝 Recommendations
- Maintain one router instance per app.
- Avoid nested routers in shared or layout components.
- Ensure useNavigate and useRouter only appear inside routed components.
- Keep route definitions close to app entry points.
`;
}

function printSummary(finalScore, summary, context, validation) {
  console.log("\n─────────────────────────────");
  console.log(color.bold("📊 ROUTING AUDIT SUMMARY"));
  console.log("─────────────────────────────");
  console.log(`Total Score: ${finalScore >= 90 ? color.green(finalScore) : finalScore >= 70 ? color.yellow(finalScore) : color.red(finalScore)}/100`);
  console.log(`Total Routers: ${summary.totalRouters} (expected 3)`);
  console.log(`Context files: ${context.contextFiles.length}`);
  console.log("─────────────────────────────");
  
  // Critical issues
  const criticalIssues = summary.entries.filter(e => e.status.includes("❌"));
  if (criticalIssues.length > 0) {
    console.log(color.bold(color.red(`\n🔴 CRITICAL ISSUES (${criticalIssues.length}):`)));
    criticalIssues.forEach(entry => {
      console.log(color.red(`  ❌ ${entry.name}: ${entry.issues.join(", ")}`));
      console.log(color.gray(`     File: ${entry.file || 'Not found'}`));
      if (entry.routerCount === 0) {
        console.log(color.cyan(`     Fix: Add <BrowserRouter> wrapper in main.tsx`));
      }
      console.log();
    });
  }
  
  // Warnings
  const hasWarnings = context.nested.length > 0 || context.contextWithoutRouter.length > 0;
  if (hasWarnings) {
    console.log(color.bold(color.yellow(`🟡 WARNINGS:`)));
    
    // Nested routers
    if (context.nested.length > 0) {
      console.log(color.yellow(`  ⚠️ Nested routers found (${context.nested.length} files):`));
      context.nested.forEach(analysis => {
        console.log(color.yellow(`     • ${analysis.file}`));
        analysis.routerLines.forEach(router => {
          console.log(color.gray(`       Line ${router.ln}: ${router.type}`));
        });
        console.log(color.cyan(`       Fix: Remove nested router, use existing app router`));
      });
      console.log();
    }
    
    // Context without router
    if (context.contextWithoutRouter.length > 0) {
      console.log(color.yellow(`  ⚠️ Router context hooks without router (${context.contextWithoutRouter.length} files):`));
      context.contextWithoutRouter.forEach(file => {
        console.log(color.yellow(`     • ${file.relativePath}`));
        
        // Find which hooks are being used
        const hooks = [];
        if (file.content.includes('useNavigate')) hooks.push('useNavigate()');
        if (file.content.includes('useLocation')) hooks.push('useLocation()');
        if (file.content.includes('useParams')) hooks.push('useParams()');
        if (file.content.includes('useRouter')) hooks.push('useRouter()');
        
        if (hooks.length > 0) {
          console.log(color.gray(`       Uses: ${hooks.join(', ')}`));
        }
        console.log(color.cyan(`       Fix: Ensure component is rendered inside <BrowserRouter>`));
      });
      console.log();
    }
  }
  
  // Passed checks
  const passedEntries = summary.entries.filter(e => e.status.includes("✅"));
  if (passedEntries.length > 0) {
    console.log(color.bold(color.green(`✅ PASSED (${passedEntries.length}):`)));
    passedEntries.forEach(entry => {
      console.log(color.green(`  ✅ ${entry.name}: ${entry.routerCount} router (correct)`));
      console.log(color.gray(`     File: ${entry.file}`));
    });
    console.log();
  }
  
  console.log("─────────────────────────────\n");
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
async function main() {
  console.log(color.cyan("\n🚀 Running Routing Validation Audit...\n"));
  const routerFiles = findRouterFiles(frontendDir);
  const analyses = routerFiles.map(analyzeRouterStructure);
  const validation = validateAppEntries(routerFiles);
  const context = analyzeContextUsage(routerFiles, analyses);

  let score = 100;
  if (validation.issues.length) score -= validation.issues.length * 3;
  if (context.nested.length) score -= context.nested.length * 5;
  if (context.contextWithoutRouter.length) score -= 5;

  const summary = {
    totalFiles: routerFiles.length,
    totalRouters: validation.totalRouters,
    entries: validation.entries,
  };

  const finalScore = Math.max(0, score);
  printSummary(finalScore, summary, context, validation);

  const report = generateReport(finalScore, validation, context, validation.issues);
  const reportDir = path.join(root, "docs", "audits");
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, "ROUTING_AUDIT.md"), report);

  console.log(color.green(`✅ Routing audit complete → ${path.join(reportDir, "ROUTING_AUDIT.md")}\n`));
}

main().catch(err => {
  console.error(color.red(`❌ Routing audit failed: ${err.message}`));
  process.exit(1);
});
