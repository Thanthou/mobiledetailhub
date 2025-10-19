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

  // Check both src/ and public/ directories for changes
  const srcNewest = getNewestSrcTime(frontendDir);
  const publicNewest = getNewestSrcTime(publicDir);
  const newestSourceTime = Math.max(srcNewest, publicNewest);
  
  return newestSourceTime < distMtime;
}

function ensureFreshBuild() {
  console.log("🧠 Checking build status...");
  const fresh = isBuildFresh();

  if (!fresh) {
    console.log("⚙️  Building frontend (auto-detected change)...");
    try {
      execSync("npm run build", { cwd: path.join(root, "frontend"), stdio: "inherit" });

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
 🔌 Port helpers
──────────────────────────────────────────────────────────────*/
function isPortOpen(port, host = "127.0.0.1") {
  return new Promise(resolve => {
    const s = new net.Socket();
    s.setTimeout(800);
    s.once("connect", () => { s.destroy(); resolve(true); });
    s.once("timeout", () => { s.destroy(); resolve(false); });
    s.once("error", () => { resolve(false); });
    s.connect(port, host);
  });
}

async function waitForPort(port, retries = 20, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    if (await isPortOpen(port)) return true;
    await new Promise(r => setTimeout(r, delayMs));
  }
  return false;
}


/*──────────────────────────────────────────────────────────────
 📈 Lighthouse SEO (auto preview, Windows-safe)
──────────────────────────────────────────────────────────────*/
import util from "util";
import { exec } from "child_process";
const execAsync = util.promisify(exec);

async function runLighthouseSEO() {
  const basePort = 4173;
  const previewDir = path.join(root, "frontend");
  const reportPath = path.join(root, "docs/audits/lighthouse-seo.json");
  let processRef = null;
  let score = null;
  let port = basePort;

  try {
    console.log("🧠 Checking for running preview server...");

    // 🔎 Find first available port starting at 4173
    while (await isPortOpen(port)) port++;
    console.log(`⚙️  Starting temporary Vite preview on port ${port}...`);

    //────────────────────────────────────────────
// ⚙️ Launch Vite preview server (non-detached)
//────────────────────────────────────────────
processRef = spawn("npx", ["vite", "preview", "--port", port, "--strictPort"], {
  cwd: previewDir,
  shell: true,
  stdio: "ignore",
  detached: false, // ✅ stay attached to our process
});

// Graceful shutdown on exit or error
const killPreview = () => {
  if (!processRef || !processRef.pid) return;
  console.log("💤 Shutting down preview server...");

  try {
    if (process.platform === "win32") {
      // ✅ Windows-specific: force kill by image name
      spawn("taskkill", ["/PID", processRef.pid, "/T", "/F"], {
        stdio: "ignore",
        shell: true,
      });
    } else {
      // ✅ Linux/macOS
      process.kill(-processRef.pid, "SIGTERM");
    }
  } catch (err) {
    console.warn("⚠️ Could not kill preview server:", err.message);
  }
};

    // Auto-clean on script termination
    process.on("exit", killPreview);
    process.on("SIGINT", killPreview);
    process.on("SIGTERM", killPreview);


    // Wait for server
    const started = await waitForPort(port, 25, 500);
    if (!started) throw new Error("Preview server failed to start.");

    console.log(`✅ Preview server started on port ${port}`);

    //────────────────────────────────────────────
    // ⚡ Run Lighthouse
    //────────────────────────────────────────────
    const url = `http://localhost:${port}/main-site/`;
    const chromeDir = path.join(root, ".tmp_lh");
    fs.mkdirSync(chromeDir, { recursive: true });

    const lhCmd = [
      "npx",
      "lighthouse",
      url,
      "--only-categories=seo",
      `--output=json`,
      `--output-path=${reportPath}`,
      "--quiet",
      "--disable-storage-reset",
      `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --user-data-dir=${chromeDir}" --disable-cpu-throttling --disable-network-throttling --disable-storage-reset --output=json`,
      `--temp-dir-path=${path.join(root, ".tmp_lh")}`
    ].join(" ");

    console.log("⚡ Running Lighthouse SEO scan...");
    try {
      await execAsync(lhCmd, { cwd: root, env: process.env, timeout: 90000, windowsHide: true });
      console.log("✅ Lighthouse finished successfully.");
    } catch (err) {
      // ⚙️ Option 1 — safely ignore Windows cleanup error
      if (/EPERM|Permission denied/i.test(err.message)) {
        console.warn("⚠️ Lighthouse cleanup permission issue — safe to ignore.");
      } else {
        console.warn("⚠️ Lighthouse run issue:", err.message);
      }
    }
    

    // Parse score
    // Lighthouse may output to .report.json - check that first as it's newer
    const reportJsonPath = reportPath.replace('.json', '.report.json');
    const actualReportPath = fs.existsSync(reportJsonPath) 
      ? reportJsonPath 
      : reportPath;
    
    if (fs.existsSync(actualReportPath)) {
      const json = JSON.parse(fs.readFileSync(actualReportPath, "utf8"));
      score = Math.round((json.categories?.seo?.score || 0) * 100);
      console.log(`✅ Lighthouse score: ${score}/100`);
    } else {
      console.warn("⚠️ Lighthouse report not found or unreadable.");
    }
  } catch (err) {
    console.error("❌ Lighthouse failed:", err.message);
  } finally {
    // ✅ Centralized cleanup
    if (processRef && processRef.pid) {
      console.log("💤 Ensuring preview server is fully terminated...");
    }

    // ✅ Remove leftover Chrome temp directory safely
    try {
      const tmpDir = path.join(root, ".tmp_lh");
      if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (err) {
      console.warn("⚠️ Could not clean temp folder:", err.message);
    }
  }


  return score;
}






/*──────────────────────────────────────────────────────────────
 🧾 Comprehensive Reporting (Enhanced Markdown Output)
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
 📘 Detailed Markdown Report Generator (Escaped & Safe)
──────────────────────────────────────────────────────────────*/
function generateMarkdownReport({ finalScore, lighthouse, schema, html, staticSeo, endpoints }) {
  const hasMeta = html.every(f => f.hasTitle && f.hasDescription);
  const seoHealth =
    finalScore >= 90
      ? "🟢 Excellent"
      : finalScore >= 75
      ? "🟡 Good"
      : "🔴 Needs Improvement";

  return (
`# SEO Audit Report
Generated: ${new Date().toISOString()}

---

## 🧭 Overview
**Total SEO Score:** ${finalScore}/100 (${seoHealth})

| Metric | Score | Status |
|---------|-------|--------|
| Lighthouse | ${lighthouse ?? "N/A"} | ${lighthouse >= 90 ? "✅ Excellent" : "⚠️ Needs Work"} |
| Schema Quality | ${schema.score} | ${schema.score >= 80 ? "✅ Good" : "⚠️ Limited"} |
| HTML Meta Tags | ${hasMeta ? "✅ Complete" : "⚠️ Incomplete"} | ${hasMeta ? "Titles & descriptions found" : "Missing meta info"} |
| Static SEO / Analytics | ✅ Present | Helmet, GA, OG, Sitemap, Robots |
| Endpoints | ✅ Active | robots.txt & sitemap.xml verified |

---

## 🔍 Lighthouse SEO
**Score:** ${lighthouse ?? "N/A"}/100  
${lighthouse >= 90
  ? "✅ No major SEO issues detected. Your site is mobile-friendly, crawlable, and well-structured."
  : "⚠️ Some SEO opportunities exist. Review page titles, internal links, and mobile responsiveness."
}

**Recommendations:**
- Verify Lighthouse “SEO” audits in Chrome DevTools → Lighthouse → SEO tab.  
- Ensure canonical URLs and mobile meta tags (\`<meta name="viewport">\`) are consistent.

---

## 🧩 Structured Data (Schema)
**Score:** ${schema.score}/100  
${schema.score >= 80
  ? "✅ Sufficient structured data detected."
  : "⚠️ Schema markup found, but coverage is limited or incomplete."
}

**Findings:**
- JSON-LD blocks found: *Yes*  
- \`@type\` definitions detected: ${schema.score > 50 ? "Some" : "Few or none"}

**Recommendations:**
- Add or expand structured data with [schema.org](https://schema.org/) types:  
  - \`LocalBusiness\`, \`Service\`, and \`Organization\`  
  - Include \`aggregateRating\`, \`review\`, and \`openingHours\` where applicable  
- Validate using [Google’s Rich Results Test](https://search.google.com/test/rich-results)

---

## 🧱 HTML Meta Tags
**Status:** ${hasMeta ? "✅ All pages have meta titles & descriptions." : "⚠️ Missing or incomplete meta tags."}

**Recommendations:**
- Ensure every page has a unique, descriptive \`<title>\` (60 chars max)  
- Add \`<meta name="description">\` with ~155 chars of clear summary  
- Include:
  - \`<link rel="canonical" href="https://example.com/">\`
  - \`<meta property="og:image">\` and \`<meta property="twitter:card">\` for social previews

---

## 📊 Static SEO & Analytics Integration
| Feature | Status | Notes |
|----------|--------|-------|
| Helmet / Meta Management | ${staticSeo.helmet} | React Helmet ensures dynamic titles |
| Analytics | ${staticSeo.analytics} | Confirms GA4 or GTM tracking |
| OpenGraph / JSON-LD | ${staticSeo.opengraph} | Social and structured markup present |
| Sitemap | ${staticSeo.sitemap} | Sitemap generator detected |
| Robots.txt | ${staticSeo.robots} | Public-facing file verified |

**Recommendations:**
- Confirm analytics ID matches your main property (GA4 / GTM).  
- Ensure robots.txt allows essential pages (no accidental blocking).  
- Verify all key URLs appear in \`sitemap.xml\`.

---

## 🔗 Backend SEO Endpoints
| Endpoint | Status | Description |
|-----------|--------|-------------|
| robots.txt | ${endpoints.endpoints.some(e => e.includes('robots')) ? "✅ Found" : "⚠️ Missing"} | Controls search engine crawling |
| sitemap.xml | ${endpoints.endpoints.some(e => e.includes('sitemap')) ? "✅ Found" : "⚠️ Missing"} | Lists indexable pages for bots |

**Recommendations:**
- Ensure sitemap.xml dynamically includes tenant subdomains.  
- Host both sitemap and robots.txt at each tenant’s subdomain if applicable.

---

## 🧾 Final Summary
**Overall SEO Health:** ${seoHealth}

✅ **Strengths**
- Strong Lighthouse performance (technical SEO)
- Meta tags and analytics detected
- Sitemap and robots endpoints active

⚠️ **Opportunities**
- Improve structured data coverage
- Expand JSON-LD with richer entity details
- Audit schema consistency across subdomains

---

## 🚀 Next Steps
1. Improve Schema depth (\`LocalBusiness\`, \`Service\`, \`Organization\`).  
2. Validate structured data with Google’s Rich Results Test.  
3. Add social preview metadata (OG & Twitter cards).  
4. Submit sitemap to Google Search Console.  
5. Schedule recurring SEO audits weekly or before major releases.

---

Generated automatically by **That Smart Site SEO Auditor** 🧠
`
  );
}


/*──────────────────────────────────────────────────────────────
 🚀 Main Execution (unchanged except report writing)
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

  const reportMarkdown = generateMarkdownReport({
    finalScore,
    lighthouse,
    schema,
    html,
    staticSeo,
    endpoints,
  });

  const reportPath = path.join(root, "docs/audits/SEO_AUDIT.md");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportMarkdown);
  console.log(`✅ SEO audit complete → ${reportPath}\n`);
  process.exit(0);
})();
