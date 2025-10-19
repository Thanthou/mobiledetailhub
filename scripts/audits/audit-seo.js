#!/usr/bin/env node
/**
 * audit-seo.js — Full Unified SEO Audit
 * --------------------------------------------------------------
 * ✅ Combines:
 *  - Auto-build if missing or outdated
 *  - Enhanced Schema Detection (static, JS, and source)
 *  - Lighthouse Runtime SEO
 *  - HTML Meta Checks
 *  - robots.txt / sitemap.xml verification
 *  - Static SEO & Analytics Code Scan (Helmet, GA, OG, etc.)
 * --------------------------------------------------------------
 * 🧾 Outputs:
 *  - Markdown Report → docs/audits/SEO_AUDIT.md
 *  - CLI Summary → color-coded instant feedback
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";
import net from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend/src");
const distDir = path.join(root, "frontend/dist");
const publicDir = path.join(root, "frontend/public");

/*──────────────────────────────────────────────────────────────
 🧠 Auto-Build if Missing or Outdated
──────────────────────────────────────────────────────────────*/
function isBuildFresh() {
  if (!fs.existsSync(distDir)) return false;
  const distMtime = fs.statSync(distDir).mtimeMs;

  function getNewestSrcTime(dir) {
    let newest = 0;
    if (!fs.existsSync(dir)) return newest;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        newest = Math.max(newest, getNewestSrcTime(full));
      } else if (/\.(t|j)sx?$|\.html$/i.test(entry.name)) {
        const mtime = fs.statSync(full).mtimeMs;
        newest = Math.max(newest, mtime);
      }
    }
    return newest;
  }

  const srcNewest = getNewestSrcTime(frontendDir);
  return srcNewest < distMtime;
}

function ensureFreshBuild() {
  console.log("🧠 Checking build status...");
  const fresh = isBuildFresh();

  if (!fresh) {
    console.log("⚙️  Building frontend (auto-detected change)...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Build completed successfully.");
    } catch (err) {
      console.error("❌ Build failed:", err.message);
      process.exit(1);
    }
  } else {
    console.log("✅ Existing build is up to date.");
  }
}

/*──────────────────────────────────────────────────────────────
 🧩 Enhanced Schema Detection
──────────────────────────────────────────────────────────────*/
async function runEnhancedSchemaDetection() {
  console.log("\n🧩 Running Enhanced Schema Detection...\n");
  const res = { score: 0 };

  // Static JSON-LD
  const htmlFiles = fs.existsSync(distDir)
    ? fs.readdirSync(distDir).filter(f => f.endsWith(".html"))
    : [];
  let schemaCount = 0;
  for (const f of htmlFiles) {
    const content = fs.readFileSync(path.join(distDir, f), "utf8");
    const scripts = content.match(/application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [];
    schemaCount += scripts.length;
  }
  if (schemaCount > 0) res.score += 30;

  // Source @type definitions
  let srcSchemaCount = 0;
  function scanSrc(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scanSrc(full);
      else if (/\.(t|j)sx?$/.test(entry.name)) {
        const c = fs.readFileSync(full, "utf8");
        if (c.includes("@type") || c.includes("schema.org")) srcSchemaCount++;
      }
    }
  }
  scanSrc(frontendDir);
  if (srcSchemaCount > 0) res.score += 30;

  res.score = Math.min(100, res.score + Math.min(40, schemaCount + srcSchemaCount * 2));
  console.log(`✅ Schema quality score: ${res.score}/100\n`);
  return res;
}

/*──────────────────────────────────────────────────────────────
 🌍 Static SEO & Analytics Scan
──────────────────────────────────────────────────────────────*/
function staticSeoAnalysis() {
  console.log("🧠 Scanning static SEO & analytics code...\n");
  const walk = dir =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
          e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
        )
      : [];

  const files = walk(frontendDir);
  const backendFiles = walk(path.join(root, "backend"));
  const has = pattern => files.some(f => fs.readFileSync(f, "utf8").match(pattern));

  return {
    helmet: has(/Helmet|Meta|Head/i)
      ? "✅ Helmet components detected"
      : "⚠️ Missing Helmet/meta components",
    analytics: has(/UA-|G-|gtag|googletagmanager/i)
      ? "✅ Google Analytics / GTM found"
      : "⚠️ No analytics code found",
    opengraph: has(/og:|twitter:card|application\/ld/i)
      ? "✅ OpenGraph / JSON-LD present"
      : "⚠️ Missing structured data",
    sitemap: backendFiles.some(f => /sitemap|generate-sitemap/i.test(fs.readFileSync(f, "utf8")))
      ? "✅ Sitemap generation found"
      : "⚠️ No sitemap scripts detected",
    robots: fs.existsSync(path.join(publicDir, "robots.txt"))
      ? "✅ robots.txt found"
      : "⚠️ Missing robots.txt",
  };
}

/*──────────────────────────────────────────────────────────────
 🔗 Endpoint + HTML Meta Checks
──────────────────────────────────────────────────────────────*/
function analyzeHTMLStructure() {
  if (!fs.existsSync(distDir)) return [];
  const htmls = fs
    .readdirSync(distDir)
    .filter(f => f.endsWith(".html"))
    .map(f => {
      const c = fs.readFileSync(path.join(distDir, f), "utf8");
      return {
        file: f,
        hasTitle: /<title/i.test(c),
        hasDescription: /<meta[^>]+description/i.test(c),
      };
    });
  return htmls;
}

function testSEOEndpoints() {
  const endpoints = [];
  const issues = [];
  const add = (label, file) => {
    const exists = fs.existsSync(path.join(root, file));
    (exists ? endpoints : issues).push(
      (exists ? "✅ " : "❌ Missing ") + label
    );
  };
  add("robots.txt route", "backend/routes/seo/robotsRoute.ts");
  add("sitemap.xml route", "backend/routes/seo/sitemapRoute.ts");
  return { endpoints, issues };
}

/*──────────────────────────────────────────────────────────────
 📈 Lighthouse SEO (auto preview)
──────────────────────────────────────────────────────────────*/
function isPortOpen(port) {
  return new Promise(resolve => {
    const s = new net.Socket();
    s.setTimeout(800);
    s.on("error", () => resolve(false));
    s.on("timeout", () => resolve(false));
    s.connect(port, "localhost", () => {
      s.end();
      resolve(true);
    });
  });
}

async function waitForPort(port, tries = 15) {
  for (let i = 0; i < tries; i++) {
    if (await isPortOpen(port)) return true;
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function runLighthouseSEO() {
  const port = 4173;
  const url = `http://localhost:${port}`;
  let processRef = null;
  let score = null;

  try {
    console.log("🧠 Checking for running preview server...");
    let running = await isPortOpen(port);

    if (!running) {
      console.log("⚙️  Starting temporary Vite preview server...");
      processRef = spawn("npx", ["vite", "preview", "--port", port], {
        cwd: root,
        shell: true,
        stdio: "inherit",
      });
      const started = await waitForPort(port);
      if (!started) throw new Error("Preview server failed to start.");
      console.log("✅ Preview server started on port", port);
    }

    console.log("⚡ Running Lighthouse SEO scan...");
    const output = execSync(
      `lighthouse ${url} --only-categories=seo --output=json --quiet --chrome-flags="--headless"`,
      { stdio: "pipe", timeout: 90000 }
    );
    const json = JSON.parse(output.toString());
    score = Math.round((json.categories?.seo?.score || 0) * 100);
    console.log(`✅ Lighthouse score: ${score}/100`);
  } catch (err) {
    console.log("⚠️  Lighthouse skipped:", err.message);
  } finally {
    if (processRef) {
      console.log("💤 Shutting down preview server...");
      try {
        processRef.kill();
      } catch {
        console.log("⚠️  Could not kill preview server.");
      }
    }
  }

  return score;
}

/*──────────────────────────────────────────────────────────────
 🧾 Reporting
──────────────────────────────────────────────────────────────*/
function printSummary(final, lh, schema, staticSeo, endpoints, html) {
  console.log("\n─────────────────────────────");
  console.log("📊 SEO AUDIT SUMMARY");
  console.log("─────────────────────────────");
  console.log(`Total Score: ${final}/100`);
  console.log(`Lighthouse: ${lh ?? "N/A"}/100`);
  console.log(`Schema Quality: ${schema.score}/100`);
  console.log(
    `HTML Meta: ${
      html.every(h => h.hasTitle && h.hasDescription)
        ? "✅ OK"
        : "⚠️ Missing meta tags"
    }`
  );
  console.log("\n🔎 Static SEO/Analytics:");
  Object.values(staticSeo).forEach(v => console.log("  " + v));
  console.log("\n🔗 Endpoints:");
  endpoints.endpoints.forEach(e => console.log("  " + e));
  endpoints.issues.forEach(e => console.log("  " + e));
  console.log("─────────────────────────────\n");
}

/*──────────────────────────────────────────────────────────────
 🚀 Main Execution
──────────────────────────────────────────────────────────────*/
(async function runSEOAudit() {
  console.log("\n🚀 Running Full SEO Audit...\n");
  ensureFreshBuild();

  const schema = await runEnhancedSchemaDetection();
  const lighthouse = await runLighthouseSEO();
  const staticSeo = staticSeoAnalysis();
  const endpoints = testSEOEndpoints();
  const html = analyzeHTMLStructure();

  let score = 100;
  if (!lighthouse || lighthouse < 80) score -= 10;
  if (schema.score < 80) score -= 10;
  if (html.some(f => !f.hasTitle || !f.hasDescription)) score -= 10;
  if (endpoints.issues.length) score -= endpoints.issues.length * 5;
  const finalScore = Math.max(0, score);

  printSummary(finalScore, lighthouse, schema, staticSeo, endpoints, html);

  const reportPath = path.join(root, "docs/audits/SEO_AUDIT.md");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const report = `# SEO Audit Report
Generated: ${new Date().toISOString()}

## Score: ${finalScore}/100
- Lighthouse: ${lighthouse ?? "N/A"}/100
- Schema: ${schema.score}/100
- Meta: ${
    html.every(f => f.hasTitle && f.hasDescription) ? "Complete" : "Incomplete"
  }

### Static SEO/Analytics
${Object.values(staticSeo)
  .map(v => "- " + v)
  .join("\n")}

### Endpoints
${endpoints.endpoints.concat(endpoints.issues).map(v => "- " + v).join("\n")}
`;
  fs.writeFileSync(reportPath, report);
  console.log(`✅ SEO audit complete → ${reportPath}\n`);
})();
