/**
 * ------------------------------------------------------------
 * PHASE 3.2 – ROUTING VALIDATION AUDIT
 * ------------------------------------------------------------
 * Verifies proper routing structure for Admin, Tenant, and Main apps.
 * Confirms that:
 *  - Only one top-level Router exists per app.
 *  - react-router-dom is used consistently.
 *  - Route definitions, lazy boundaries, and navigation hooks exist.
 *  - Detects wildcard subdomain / tenant readiness.
 * ------------------------------------------------------------
 */

import fs from "fs";
import path from "path";

const root = path.resolve();
const frontendSrc = path.join(root, "frontend", "src");
const outDir = path.join(root, "chatgpt");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function walkDir(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results = results.concat(walkDir(filePath));
    else results.push(filePath);
  }
  return results;
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function phase32Audit() {
  const findings = [];
  if (!fs.existsSync(frontendSrc))
    return "\n# PHASE 3.2 – ROUTING VALIDATION AUDIT\n❌ frontend/src not found";

  const files = walkDir(frontendSrc).filter(f =>
    /\.(ts|tsx|js|jsx)$/.test(f)
  );

  const routerFiles = files.filter(f =>
    /router|route|AppRouter|ConditionalRouter|BrowserRouter/i.test(f)
  );
  findings.push(`Router-related files detected: ${routerFiles.length}`);

  // 1️⃣ react-router-dom imports
  const routerImports = routerFiles.filter(f =>
    /react-router-dom/i.test(safeRead(f))
  );
  findings.push(
    `react-router-dom imports: ${
      routerImports.length ? "✅ present" : "⚠️ none"
    }`
  );

  // 2️⃣ Top-level Router elements
  const routerRoots = routerFiles.filter(f =>
    /<Router|BrowserRouter|createBrowserRouter|RouterProvider/i.test(
      safeRead(f)
    )
  );
  findings.push(
    `Top-level Router components: ${
      routerRoots.length ? "✅ found" : "⚠️ missing"
    } (${routerRoots.length})`
  );
  if (routerRoots.length > 1)
    findings.push(`❌ Multiple Router roots detected (${routerRoots.length})`);

  // 3️⃣ App segmentation
  const tenantRouters = routerFiles.filter(f =>
    /tenant|withTenant|TenantApp/i.test(f)
  );
  const adminRouters = routerFiles.filter(f =>
    /admin|AdminApp|Dashboard/i.test(f)
  );
  const mainRouters = routerFiles.filter(f =>
    /main|AppRouter|index/i.test(f)
  );
  findings.push(
    `App router segmentation: ${[
      tenantRouters.length ? "Tenant✅" : "Tenant⚠️",
      adminRouters.length ? "Admin✅" : "Admin⚠️",
      mainRouters.length ? "Main✅" : "Main⚠️",
    ].join(" | ")}`
  );

  // 4️⃣ Route definitions
  const routeDefs = routerFiles.filter(f =>
    /Route\s|\spath=|createRoutesFromElements/i.test(safeRead(f))
  );
  findings.push(
    `Route definitions: ${routeDefs.length ? "✅ found" : "⚠️ none detected"}`
  );

  // 5️⃣ Navigation hooks/components
  const navHooks = routerFiles.filter(f =>
    /Link|NavLink|useNavigate|useParams|useLocation/i.test(safeRead(f))
  );
  findings.push(
    `Navigation hooks/components: ${
      navHooks.length ? "✅ present" : "⚠️ missing"
    }`
  );

  // 6️⃣ Suspense / Lazy loading
  const suspenseUsage = files.some(f =>
    /Suspense|React\.lazy/i.test(safeRead(f))
  );
  findings.push(`Lazy/Suspense boundaries: ${suspenseUsage ? "✅ present" : "⚠️ none"}`);

  // 7️⃣ Wildcard domain or BASE_DOMAIN readiness
  const env = safeRead(path.join(root, ".env"));
  const hasWildcard =
    /\*\.thatsmartsite\.com/i.test(env) || /BASE_DOMAIN|PRIMARY_DOMAIN/i.test(env);
  findings.push(
    `Wildcard/BASE_DOMAIN variable: ${hasWildcard ? "✅ found" : "⚠️ not found"}`
  );

  // 8️⃣ Overall Router Health Score
  const pass = findings.filter(f => f.includes("✅")).length;
  const total = findings.length;
  const score = Math.round((pass / total) * 100);
  findings.push(`\nRouter Health Score: ${score}/100`);

  return "\n# PHASE 3.2 – ROUTING VALIDATION AUDIT\n" + findings.map(f => "- " + f).join("\n");
}

// 🔹 Execute + write
const output = phase32Audit();
const outFile = path.join(outDir, "ROUTING_VALIDATION_AUDIT.md");
fs.writeFileSync(outFile, output, "utf8");

// 🔹 Print warnings/errors only
const issues = output
  .split("\n")
  .filter(line => line.includes("⚠️") || line.includes("❌"));
if (issues.length) {
  console.log("\n🔍 Routing issues detected:\n");
  for (const issue of issues) console.log("  " + issue);
  console.log(`\nTotal: ${issues.length} routing warnings/errors.\n`);
} else {
  console.log("\n🎉 No routing issues detected. All good!\n");
}

console.log(`✅ Routing Validation Audit complete. Report saved to ${outFile}\n`);
