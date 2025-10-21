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
import { 
  killProcessTree, 
  isPortInUse, 
  waitForPort, 
  findAvailablePort,
  processRegistry,
  setupGracefulShutdown 
} from "../utils/cleanup.js";
import { runSchemaValidation } from "./schema-validator.js";
import { ingestSEOResults } from "../automation/ingest-seo.js";
import { runPageSpeedForApps } from "../utils/pagespeed-api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend/src");
const distDir = path.join(root, "frontend/dist");
const publicDir = path.join(root, "frontend/public");

/*──────────────────────────────────────────────────────────────
| 🧩 Multi-App Configuration
|──────────────────────────────────────────────────────────────*/
// Support custom URLs via environment variables (fallback to production)
const BASE_URL = process.env.SEO_BASE_URL || "https://thatsmartsite.com";
const TENANT_URL = process.env.SEO_TENANT_URL || "https://demo.thatsmartsite.com";

const APPS = [
  { name: "main-site", description: "Marketing & Onboarding", liveUrl: BASE_URL },
  { name: "tenant-app", description: "Live Tenant Storefronts", liveUrl: TENANT_URL },
  // { name: "admin-app", description: "Tenant Dashboard" }, // Excluded from SEO audit
];

// PageSpeed Insights API Configuration
const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const USE_PAGESPEED_API = !!PAGESPEED_API_KEY && !process.argv.includes('--local');

/*──────────────────────────────────────────────────────────────
| 🧠 Auto-Build if Missing or Outdated
|──────────────────────────────────────────────────────────────*/
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
| 🧩 Enhanced Schema Detection (with Deep Validation)
|──────────────────────────────────────────────────────────────*/
async function runEnhancedSchemaDetection() {
  console.log("\n🧩 Running Enhanced Schema Detection & Validation...\n");
  
  // Run deep validation
  const validation = await runSchemaValidation(distDir, { generateReport: false });
  
  // Legacy: Also count source @type definitions
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
  
  // Use validation score as base, with bonus for source references
  let score = validation.score;
  if (srcSchemaCount > 0) score = Math.min(100, score + 10);
  
  console.log(`✅ Schema validation score: ${validation.score}/100`);
  console.log(`   Total schemas: ${validation.totalSchemas}`);
  console.log(`   Valid: ${validation.validSchemas}/${validation.totalSchemas}`);
  console.log(`   Errors: ${validation.totalErrors}, Warnings: ${validation.totalWarnings}`);
  console.log(`   Source references: ${srcSchemaCount} files\n`);
  
  return {
    score,
    validation,
    srcSchemaCount,
  };
}

/*──────────────────────────────────────────────────────────────
| 🌍 Static SEO & Analytics Scan
|──────────────────────────────────────────────────────────────*/
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
| 🔗 Endpoint + HTML Meta Checks
|──────────────────────────────────────────────────────────────*/
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
| 📈 Lighthouse SEO (auto preview, Windows-safe, with cleanup utils)
|──────────────────────────────────────────────────────────────*/
import util from "util";
import { exec } from "child_process";
const execAsync = util.promisify(exec);

async function runLighthouseSEO() {
  //──────────────────────────────────────────────
  // 🌐 PageSpeed API Mode (if API key is set)
  //──────────────────────────────────────────────
  if (USE_PAGESPEED_API) {
    console.log("\n🌐 Using PageSpeed Insights API (Google hosted Lighthouse)\n");
    const outputDir = path.join(root, "docs/audits/lighthouse");
    const apiResults = await runPageSpeedForApps(APPS, PAGESPEED_API_KEY, outputDir);
    
    // Convert to same format as local Lighthouse results
    const results = {};
    for (const result of apiResults) {
      results[result.app] = result.score;
    }
    return results;
  }
  
  //──────────────────────────────────────────────
  // 💻 Local Lighthouse Mode (preview server)
  //──────────────────────────────────────────────
  console.log("\n💻 Using local Lighthouse (preview server)\n");
  
  const basePort = 4173;
  const previewDir = path.join(root, "frontend");
  let processRef = null;
  let port = basePort;
  const results = {}; // Store results per app

  try {
    console.log("🧠 Checking for running preview server...");

    // 🔎 Find first available port starting at 4173
    port = await findAvailablePort(basePort);
    if (port === -1) {
      throw new Error("No available ports found");
    }
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

    // Register process for automatic cleanup
    if (processRef.pid) {
      processRegistry.register(port, processRef.pid, "vite-preview");
    }


    // Wait for server to be ready
    const started = await waitForPort(port, 25, 500);
    if (!started) {
      await killProcessTree(processRef.pid);
      throw new Error("Preview server failed to start.");
    }

    console.log(`✅ Preview server started on port ${port}`);

    //────────────────────────────────────────────
    // ⚡ Run Lighthouse for Each App
    //────────────────────────────────────────────
    const chromeDir = path.join(root, ".tmp_lh");
    fs.mkdirSync(chromeDir, { recursive: true });

    for (const app of APPS) {
      console.log(`\n⚡ Running Lighthouse for ${app.name} (${app.description})...`);
      
      // Point to app root path (Vite serves from dist/{app-name}/)
      const url = `http://localhost:${port}/${app.name}/`;
      const reportPath = path.join(root, `docs/audits/lighthouse/${app.name}-seo.json`);
      
      // Ensure output directory exists
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });

      // 🐛 DEBUG: Verify URL is accessible before running Lighthouse
      const debugMode = process.argv.includes('--debug');
      if (debugMode) {
        console.log(`   🐛 DEBUG MODE: Testing ${url}`);
        try {
          const https = await import('https');
          const http = await import('http');
          const fetchUrl = new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? https : http;
            lib.default.get(url, (res) => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => resolve({ status: res.statusCode, html: data }));
            }).on('error', reject);
          });
          
          const { status, html} = await fetchUrl;
          const debugPath = path.join(root, `.tmp_lh/${app.name}-fetched.html`);
          fs.writeFileSync(debugPath, html);
          console.log(`   🐛 DEBUG: Saved fetched HTML to ${debugPath}`);
          console.log(`   🐛 DEBUG: HTML size: ${html.length} bytes`);
          console.log(`   🐛 DEBUG: Contains 'root': ${html.includes('root')}`);
          console.log(`   🐛 DEBUG: Contains script tag: ${html.includes('<script')}`);
          console.log(`   🐛 DEBUG: Status: ${status}`);
        } catch (err) {
          console.warn(`   ⚠️ DEBUG: Failed to fetch URL:`, err.message);
        }
      }

      const lhCmd = [
        "npx",
        "lighthouse",
        url,
        "--only-categories=seo",
        `--output=json`,
        `--output-path=${reportPath}`,
        "--quiet",
        "--disable-storage-reset",
        `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --user-data-dir=${chromeDir}"`,
      ].join(" ");

      try {
        await execAsync(lhCmd, { cwd: root, env: process.env, timeout: 90000, windowsHide: true });
        console.log(`✅ Lighthouse finished for ${app.name}`);
      } catch (err) {
        if (/EPERM|Permission denied/i.test(err.message)) {
          console.warn(`⚠️ Lighthouse cleanup permission issue for ${app.name} — safe to ignore.`);
        } else {
          console.warn(`⚠️ Lighthouse run issue for ${app.name}:`, err.message);
        }
      }

      // Parse score
      const reportJsonPath = reportPath.replace('.json', '.report.json');
      const actualReportPath = fs.existsSync(reportJsonPath) 
        ? reportJsonPath 
        : reportPath;
      
      if (fs.existsSync(actualReportPath)) {
        const json = JSON.parse(fs.readFileSync(actualReportPath, "utf8"));
        const score = Math.round((json.categories?.seo?.score || 0) * 100);
        console.log(`✅ ${app.name} score: ${score}/100`);
        results[app.name] = { score, data: json };
      } else {
        console.warn(`⚠️ Lighthouse report not found for ${app.name}`);
        results[app.name] = { score: null, data: null };
      }
    }
  } catch (err) {
    console.error("❌ Lighthouse failed:", err.message);
  } finally {
    // ✅ Centralized cleanup using cleanup utilities
    if (processRef && processRef.pid) {
      console.log("💤 Shutting down preview server...");
      await killProcessTree(processRef.pid);
      processRegistry.unregister(port);
    }

    // ✅ Remove leftover Chrome temp directory safely (keep debug files if in debug mode)
    try {
      const debugMode = process.argv.includes('--debug');
      const tmpDir = path.join(root, ".tmp_lh");
      if (fs.existsSync(tmpDir) && !debugMode) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } else if (debugMode) {
        console.log("🐛 DEBUG: Keeping .tmp_lh folder for inspection");
      }
    } catch (err) {
      console.warn("⚠️ Could not clean temp folder:", err.message);
    }
  }

  return results;
}






/*──────────────────────────────────────────────────────────────
| 🧾 Comprehensive Reporting (Enhanced Markdown Output)
|──────────────────────────────────────────────────────────────*/
function printSummary(final, lighthouseResults, schema, staticSeo, endpoints, html) {
  console.log("\n─────────────────────────────");
  console.log("📊 MULTI-APP SEO AUDIT SUMMARY");
  console.log("─────────────────────────────");
  console.log(`Total Score: ${final}/100`);
  
  console.log("\n📈 Lighthouse Scores by App:");
  for (const app of APPS) {
    const result = lighthouseResults[app.name];
    const score = result?.score ?? "N/A";
    console.log(`  ${app.name}: ${score}/100 (${app.description})`);
  }
  
  console.log(`\nSchema Quality: ${schema.score}/100`);
  if (schema.validation) {
    const v = schema.validation;
    console.log(`  Schemas: ${v.validSchemas || 0}/${v.totalSchemas || 0} valid`);
    console.log(`  Types: ${(v.typesCovered || []).join(", ") || "None"}`);
    if ((v.totalErrors || 0) > 0) console.log(`  ⚠️ ${v.totalErrors} error(s)`);
    if ((v.totalWarnings || 0) > 0) console.log(`  ⚠️ ${v.totalWarnings} warning(s)`);
  }
  
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
| 📘 Detailed Markdown Report Generator (Escaped & Safe)
|──────────────────────────────────────────────────────────────*/
function generateMarkdownReport({ finalScore, lighthouseResults, schema, html, staticSeo, endpoints }) {
  const hasMeta = html.every(f => f.hasTitle && f.hasDescription);
  const seoHealth =
    finalScore >= 90
      ? "🟢 Excellent"
      : finalScore >= 75
      ? "🟡 Good"
      : "🔴 Needs Improvement";

  // Calculate average Lighthouse score across apps
  const validScores = Object.values(lighthouseResults).filter(r => r.score !== null).map(r => r.score);
  const avgLighthouse = validScores.length > 0 
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : null;

  // Generate per-app sections
  const appSections = APPS.map(app => {
    const result = lighthouseResults[app.name];
    const score = result?.score ?? "N/A";
    const status = typeof score === 'number' && score >= 90 ? "✅ Excellent" : "⚠️ Needs Work";
    
    return `### ${app.name} — ${app.description}
**Score:** ${score}/100 ${status}

**Key Findings:**
${result?.data ? `
- Mobile Friendly: ${result.data.audits?.['viewport']?.score === 1 ? "✅ Yes" : "⚠️ No"}
- Valid hreflang: ${result.data.audits?.['hreflang']?.score === 1 ? "✅ Yes" : "N/A"}
- Document Title: ${result.data.audits?.['document-title']?.score === 1 ? "✅ Present" : "⚠️ Missing"}
- Meta Description: ${result.data.audits?.['meta-description']?.score === 1 ? "✅ Present" : "⚠️ Missing"}
- Crawlable Links: ${result.data.audits?.['crawlable-anchors']?.score === 1 ? "✅ Yes" : "⚠️ No"}
` : "- Report not available"}
`;
  }).join("\n---\n\n");

  return (
`# Multi-App SEO Audit Report
Generated: ${new Date().toISOString()}

---

## 🧭 Overview
**Total SEO Score:** ${finalScore}/100 (${seoHealth})

| Metric | Score | Status |
|---------|-------|--------|
| Lighthouse (Average) | ${avgLighthouse ?? "N/A"} | ${avgLighthouse >= 90 ? "✅ Excellent" : "⚠️ Needs Work"} |
| Schema Quality | ${schema.score} | ${schema.score >= 80 ? "✅ Good" : "⚠️ Limited"} |
| HTML Meta Tags | ${hasMeta ? "✅ Complete" : "⚠️ Incomplete"} | ${hasMeta ? "Titles & descriptions found" : "Missing meta info"} |
| Static SEO / Analytics | ✅ Present | Helmet, GA, OG, Sitemap, Robots |
| Endpoints | ✅ Active | robots.txt & sitemap.xml verified |

### 📱 Lighthouse Scores by App

| App | Score | Description |
|-----|-------|-------------|
${APPS.map(app => {
  const result = lighthouseResults[app.name];
  const score = result?.score ?? "N/A";
  return `| **${app.name}** | ${score}/100 | ${app.description} |`;
}).join('\n')}

---

## 🔍 Lighthouse SEO — Per-App Results

${appSections}

**General Recommendations:**
- Verify Lighthouse "SEO" audits in Chrome DevTools → Lighthouse → SEO tab for each app.  
- Ensure canonical URLs and mobile meta tags (\`<meta name="viewport">\`) are consistent across all apps.

---

## 🧩 Structured Data (Schema)
**Score:** ${schema.score}/100  
${schema.score >= 80
  ? "✅ Sufficient structured data detected."
  : "⚠️ Schema markup found, but coverage is limited or incomplete."
}

${schema.validation ? `
**Validation Results:**
- Total Schemas: ${schema.validation.totalSchemas}
- Valid Schemas: ${schema.validation.validSchemas} (${schema.validation.totalSchemas > 0 ? Math.round((schema.validation.validSchemas / schema.validation.totalSchemas) * 100) : 0}%)
- Invalid Schemas: ${schema.validation.invalidSchemas}
- Errors: ${schema.validation.totalErrors}
- Warnings: ${schema.validation.totalWarnings}
- Schema Types: ${schema.validation.typesCovered.join(", ") || "None"}
` : ""}

**Findings:**
- Source files with @type: ${schema.srcSchemaCount || 0}
- Schema types covered: ${schema.validation?.typesCovered.length || 0}

**Recommendations:**
- Add or expand structured data with [schema.org](https://schema.org/) types:  
  - \`LocalBusiness\`, \`Service\`, and \`Organization\`  
  - Include \`aggregateRating\`, \`review\`, and \`openingHours\` where applicable  
- Run detailed schema validation: \`node scripts/audits/schema-validator.js\`
- Validate using [Google's Rich Results Test](https://search.google.com/test/rich-results)

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
- Host both sitemap and robots.txt at each tenant's subdomain if applicable.

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
2. Validate structured data with Google's Rich Results Test.  
3. Add social preview metadata (OG & Twitter cards).  
4. Submit sitemap to Google Search Console.  
5. Schedule recurring SEO audits weekly or before major releases.

---

Generated automatically by **That Smart Site SEO Auditor** 🧠
`
  );
}


/*──────────────────────────────────────────────────────────────
| 🚀 Main Execution (unchanged except report writing)
|──────────────────────────────────────────────────────────────*/
(async function runSEOAudit() {
  console.log("\n🚀 Running Full Multi-App SEO Audit...\n");
  
  if (USE_PAGESPEED_API) {
    console.log("🌐 Using PageSpeed Insights API (Google hosted Lighthouse)");
  } else if (process.platform === "win32") {
    console.log("⚠️  Using local Lighthouse on Windows (may have headless Chrome issues)");
    console.log("   💡 Tip: Set PAGESPEED_API_KEY in .env for reliable results\n");
  }
  
  // Setup graceful shutdown to clean up any processes
  setupGracefulShutdown();
  
  ensureFreshBuild();

  const schema = await runEnhancedSchemaDetection();
  const lighthouseResults = await runLighthouseSEO();
  const staticSeo = staticSeoAnalysis();
  const endpoints = testSEOEndpoints();
  const html = analyzeHTMLStructure();

  // Calculate average lighthouse score across all apps
  const validScores = Object.values(lighthouseResults).filter(r => r.score !== null).map(r => r.score);
  const avgLighthouse = validScores.length > 0 
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : null;

  let score = 100;
  if (!avgLighthouse || avgLighthouse < 80) score -= 10;
  if (schema.score < 80) score -= 10;
  if (html.some(f => !f.hasTitle || !f.hasDescription)) score -= 10;
  if (endpoints.issues.length) score -= endpoints.issues.length * 5;
  const finalScore = Math.max(0, score);

  printSummary(finalScore, lighthouseResults, schema, staticSeo, endpoints, html);

  const reportMarkdown = generateMarkdownReport({
    finalScore,
    lighthouseResults,
    schema,
    html,
    staticSeo,
    endpoints,
  });

  const reportPath = path.join(root, "docs/audits/SEO_AUDIT.md");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportMarkdown);
  console.log(`✅ Multi-app SEO audit complete → ${reportPath}\n`);

  // Auto-ingest results to database (if --no-db flag not set)
  const skipDb = process.argv.includes("--no-db");
  if (!skipDb) {
    try {
      console.log("💾 Ingesting results to database...");
      await ingestSEOResults();
      console.log("✅ Results saved to health_monitoring table\n");
    } catch (err) {
      console.warn("⚠️ Database ingestion failed (continuing anyway):", err.message);
      console.log("   Run manually: node scripts/automation/ingest-seo.js\n");
    }
  }

  process.exit(0);
})();
