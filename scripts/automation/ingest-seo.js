#!/usr/bin/env node
/**
 * ingest-seo.js — SEO Audit Results Database Ingestion
 * --------------------------------------------------------------
 * Parses SEO_AUDIT.md and lighthouse JSON reports
 * Pushes results to system.health_monitoring table
 * Enables trend tracking and dashboard visualization
 * --------------------------------------------------------------
 * Usage:
 *   node scripts/automation/ingest-seo.js
 *   node scripts/automation/ingest-seo.js --tenant=demo
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPool } from "../../backend/database/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

/*──────────────────────────────────────────────────────────────
| 📊 Parse Lighthouse JSON Reports
|──────────────────────────────────────────────────────────────*/

function parseLighthouseReports() {
  const lighthouseDir = path.join(root, "docs/audits/lighthouse");
  const apps = ["main-site", "tenant-app", "admin-app"];
  const scores = {};

  for (const app of apps) {
    const reportPath = path.join(lighthouseDir, `${app}-seo.report.json`);
    
    if (!fs.existsSync(reportPath)) {
      console.warn(`⚠️ Missing Lighthouse report for ${app}`);
      scores[app] = null;
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(reportPath, "utf8"));
      const score = Math.round((data.categories?.seo?.score || 0) * 100);
      scores[app] = score;
      console.log(`✅ Parsed ${app}: ${score}/100`);
    } catch (err) {
      console.error(`❌ Failed to parse ${app} report:`, err.message);
      scores[app] = null;
    }
  }

  // Calculate average
  const validScores = Object.values(scores).filter(s => s !== null);
  const avgScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : null;

  return {
    mainSite: scores["main-site"],
    tenantApp: scores["tenant-app"],
    adminApp: scores["admin-app"],
    average: avgScore,
  };
}

/*──────────────────────────────────────────────────────────────
| 📄 Parse SEO Audit Markdown Report
|──────────────────────────────────────────────────────────────*/

function parseSEOAuditReport() {
  const reportPath = path.join(root, "docs/audits/SEO_AUDIT.md");
  
  if (!fs.existsSync(reportPath)) {
    console.error("❌ SEO_AUDIT.md not found. Run `npm run audit:seo` first.");
    return null;
  }

  const content = fs.readFileSync(reportPath, "utf8");
  const data = {
    schemaScore: null,
    schemaTotalCount: 0,
    schemaValidCount: 0,
    schemaErrorCount: 0,
    schemaWarningCount: 0,
    schemaTypesCovered: [],
    metaTagsComplete: false,
    analyticsDetected: false,
    sitemapFound: false,
    robotsTxtFound: false,
  };

  // Extract schema validation score
  const schemaScoreMatch = content.match(/Schema Quality \| (\d+)/);
  if (schemaScoreMatch) {
    data.schemaScore = parseInt(schemaScoreMatch[1], 10);
  }

  // Extract schema validation details
  const totalSchemasMatch = content.match(/Total Schemas: (\d+)/);
  if (totalSchemasMatch) {
    data.schemaTotalCount = parseInt(totalSchemasMatch[1], 10);
  }

  const validSchemasMatch = content.match(/Valid Schemas: (\d+)/);
  if (validSchemasMatch) {
    data.schemaValidCount = parseInt(validSchemasMatch[1], 10);
  }

  const errorsMatch = content.match(/Errors: (\d+)/);
  if (errorsMatch) {
    data.schemaErrorCount = parseInt(errorsMatch[1], 10);
  }

  const warningsMatch = content.match(/Warnings: (\d+)/);
  if (warningsMatch) {
    data.schemaWarningCount = parseInt(warningsMatch[1], 10);
  }

  const typesMatch = content.match(/Schema Types: ([^\n]+)/);
  if (typesMatch && typesMatch[1] !== "None") {
    data.schemaTypesCovered = typesMatch[1].split(",").map(t => t.trim());
  }

  // Check for meta tags
  data.metaTagsComplete = content.includes("HTML Meta Tags | ✅ Complete");

  // Check for analytics
  data.analyticsDetected = content.includes("✅ Google Analytics / GTM found");

  // Check for sitemap
  data.sitemapFound = content.includes("✅ Sitemap generation found");

  // Check for robots.txt
  data.robotsTxtFound = content.includes("✅ robots.txt found");

  return data;
}

/*──────────────────────────────────────────────────────────────
| 💾 Save to Database
|──────────────────────────────────────────────────────────────*/

async function ingestSEOResults(tenantSlug = "system", url = "https://thatsmartsite.com") {
  console.log("\n📊 Ingesting SEO Audit Results...\n");

  const lighthouse = parseLighthouseReports();
  const seoData = parseSEOAuditReport();

  if (!seoData) {
    console.error("❌ Failed to parse SEO audit data");
    process.exit(1);
  }

  console.log("\n✅ Parsed audit data:");
  console.log(`   Lighthouse Average: ${lighthouse.average}/100`);
  console.log(`   Schema Quality: ${seoData.schemaScore}/100`);
  console.log(`   Schemas: ${seoData.schemaValidCount}/${seoData.schemaTotalCount} valid`);

  const pool = await getPool();

  try {
    const query = `
      INSERT INTO system.health_monitoring (
        tenant_slug,
        check_type,
        url,
        strategy,
        seo_score,
        lighthouse_main_score,
        lighthouse_tenant_score,
        lighthouse_admin_score,
        lighthouse_avg_score,
        schema_validation_score,
        schema_total_count,
        schema_valid_count,
        schema_error_count,
        schema_warning_count,
        schema_types_covered,
        meta_tags_complete,
        analytics_detected,
        sitemap_found,
        robots_txt_found,
        audit_source,
        audit_metadata,
        status,
        checked_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )
      RETURNING id, checked_at
    `;

    const status = lighthouse.average >= 90 && seoData.schemaScore >= 80 
      ? 'healthy' 
      : lighthouse.average >= 75 && seoData.schemaScore >= 60
      ? 'warning'
      : 'critical';

    const values = [
      tenantSlug,
      'seo',
      url,
      'desktop',
      lighthouse.average || 0,
      lighthouse.mainSite,
      lighthouse.tenantApp,
      lighthouse.adminApp,
      lighthouse.average,
      seoData.schemaScore,
      seoData.schemaTotalCount,
      seoData.schemaValidCount,
      seoData.schemaErrorCount,
      seoData.schemaWarningCount,
      seoData.schemaTypesCovered,
      seoData.metaTagsComplete,
      seoData.analyticsDetected,
      seoData.sitemapFound,
      seoData.robotsTxtFound,
      'automated',
      JSON.stringify({
        lighthouse: lighthouse,
        schema: seoData,
        generatedAt: new Date().toISOString(),
      }),
      status,
      new Date(),
    ];

    const result = await pool.query(query, values);
    
    console.log(`\n✅ SEO audit results saved to database`);
    console.log(`   Record ID: ${result.rows[0].id}`);
    console.log(`   Timestamp: ${result.rows[0].checked_at}`);
    console.log(`   Status: ${status}`);
    console.log(`   Tenant: ${tenantSlug}`);

    return result.rows[0];
  } catch (err) {
    console.error("\n❌ Database ingestion failed:", err.message);
    console.error(err.stack);
    throw err;
  } finally {
    await pool.end();
  }
}

/*──────────────────────────────────────────────────────────────
| 🚀 Main Execution
|──────────────────────────────────────────────────────────────*/

async function main() {
  const args = process.argv.slice(2);
  const tenantArg = args.find(a => a.startsWith("--tenant="));
  const tenantSlug = tenantArg ? tenantArg.split("=")[1] : "system";
  
  const urlArg = args.find(a => a.startsWith("--url="));
  const url = urlArg ? urlArg.split("=")[1] : "https://thatsmartsite.com";

  console.log("\n🚀 SEO Audit Ingestion Tool\n");
  console.log(`   Tenant: ${tenantSlug}`);
  console.log(`   URL: ${url}`);

  await ingestSEOResults(tenantSlug, url);
  
  console.log("\n✅ Ingestion complete!\n");
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  });
}

// Export for use by other scripts
export { ingestSEOResults, parseLighthouseReports, parseSEOAuditReport };

