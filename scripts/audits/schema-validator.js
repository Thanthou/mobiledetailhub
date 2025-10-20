#!/usr/bin/env node
/**
 * schema-validator.js — Deep JSON-LD Schema Validator
 * --------------------------------------------------------------
 * Goes beyond simple schema detection to validate:
 *  - Required properties for each @type
 *  - Nested object structure
 *  - Common SEO-critical fields
 *  - Best practices for local businesses
 * --------------------------------------------------------------
 * Outputs:
 *  - Detailed validation report
 *  - Missing field analysis
 *  - Schema quality score
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*──────────────────────────────────────────────────────────────
| 📋 Schema Type Validation Rules
|──────────────────────────────────────────────────────────────*/

const SCHEMA_RULES = {
  LocalBusiness: {
    required: ["@type", "name", "address"],
    recommended: ["telephone", "url", "image", "priceRange", "openingHoursSpecification"],
    optional: ["aggregateRating", "review", "geo", "sameAs"],
    nested: {
      address: ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"],
    },
  },
  Organization: {
    required: ["@type", "name", "url"],
    recommended: ["logo", "contactPoint", "sameAs"],
    optional: ["description", "foundingDate", "founders"],
  },
  Service: {
    required: ["@type", "name", "provider"],
    recommended: ["description", "serviceType", "areaServed"],
    optional: ["offers", "aggregateRating", "review"],
  },
  Product: {
    required: ["@type", "name"],
    recommended: ["description", "image", "offers"],
    optional: ["brand", "aggregateRating", "review"],
  },
  WebSite: {
    required: ["@type", "name", "url"],
    recommended: ["potentialAction"],
    optional: ["description", "publisher"],
  },
  BreadcrumbList: {
    required: ["@type", "itemListElement"],
    recommended: [],
    optional: [],
  },
};

/*──────────────────────────────────────────────────────────────
| 🔍 JSON-LD Extraction
|──────────────────────────────────────────────────────────────*/

/**
 * Extract all JSON-LD blocks from HTML content
 * @param {string} html - HTML content
 * @returns {Array} - Array of parsed JSON-LD objects
 */
function extractJSONLD(html) {
  const jsonldBlocks = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const jsonString = match[1].trim();
      const parsed = JSON.parse(jsonString);
      jsonldBlocks.push(parsed);
    } catch (err) {
      jsonldBlocks.push({
        error: "Parse error",
        message: err.message,
        raw: match[1].substring(0, 100),
      });
    }
  }

  return jsonldBlocks;
}

/**
 * Extract all JSON-LD from HTML files in dist directory
 * @param {string} distDir - Path to dist directory
 * @returns {Object} - Map of file -> JSON-LD blocks
 */
function extractAllJSONLD(distDir) {
  const results = {};

  if (!fs.existsSync(distDir)) {
    return results;
  }

  const htmlFiles = fs
    .readdirSync(distDir)
    .filter((f) => f.endsWith(".html"));

  for (const file of htmlFiles) {
    const filePath = path.join(distDir, file);
    const html = fs.readFileSync(filePath, "utf8");
    const blocks = extractJSONLD(html);

    if (blocks.length > 0) {
      results[file] = blocks;
    }
  }

  return results;
}

/*──────────────────────────────────────────────────────────────
| ✅ Schema Validation
|──────────────────────────────────────────────────────────────*/

/**
 * Validate a single JSON-LD object against schema rules
 * @param {Object} schema - JSON-LD object
 * @returns {Object} - Validation result
 */
function validateSchema(schema) {
  if (schema.error) {
    return {
      valid: false,
      type: null,
      errors: [schema.error],
      warnings: [],
      missing: [],
    };
  }

  const type = schema["@type"];
  const result = {
    valid: true,
    type,
    errors: [],
    warnings: [],
    missing: [],
  };

  if (!type) {
    result.valid = false;
    result.errors.push("Missing @type property");
    return result;
  }

  // Get validation rules for this type
  const rules = SCHEMA_RULES[type];
  if (!rules) {
    result.warnings.push(`No validation rules for type: ${type}`);
    return result;
  }

  // Check required fields
  for (const field of rules.required) {
    if (!schema[field]) {
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
      result.missing.push(field);
    }
  }

  // Check recommended fields
  for (const field of rules.recommended) {
    if (!schema[field]) {
      result.warnings.push(`Missing recommended field: ${field}`);
      result.missing.push(field);
    }
  }

  // Check nested object requirements
  if (rules.nested) {
    for (const [parentField, childFields] of Object.entries(rules.nested)) {
      if (schema[parentField]) {
        const parent = schema[parentField];
        for (const childField of childFields) {
          if (!parent[childField]) {
            result.warnings.push(
              `Missing ${parentField}.${childField}`
            );
            result.missing.push(`${parentField}.${childField}`);
          }
        }
      }
    }
  }

  return result;
}

/**
 * Validate all schemas in a file
 * @param {Array} schemas - Array of JSON-LD objects
 * @returns {Object} - Validation summary
 */
function validateFile(schemas) {
  const results = schemas.map(validateSchema);
  const summary = {
    total: schemas.length,
    valid: results.filter((r) => r.valid).length,
    invalid: results.filter((r) => !r.valid).length,
    types: [...new Set(results.map((r) => r.type).filter(Boolean))],
    allErrors: results.flatMap((r) => r.errors),
    allWarnings: results.flatMap((r) => r.warnings),
    details: results,
  };

  return summary;
}

/*──────────────────────────────────────────────────────────────
| 📊 Scoring & Reporting
|──────────────────────────────────────────────────────────────*/

/**
 * Calculate schema quality score
 * @param {Object} allResults - Map of file -> validation summary
 * @returns {Object} - Score and breakdown
 */
function calculateScore(allResults) {
  let totalSchemas = 0;
  let validSchemas = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const typesCovered = new Set();

  for (const result of Object.values(allResults)) {
    totalSchemas += result.total;
    validSchemas += result.valid;
    totalErrors += result.allErrors.length;
    totalWarnings += result.allWarnings.length;
    result.types.forEach((t) => typesCovered.add(t));
  }

  // Scoring algorithm
  let score = 100;

  // Penalty for errors (critical)
  score -= totalErrors * 10;

  // Penalty for warnings (minor)
  score -= totalWarnings * 2;

  // Bonus for type coverage
  const importantTypes = ["LocalBusiness", "Organization", "Service"];
  const coveredImportant = importantTypes.filter((t) =>
    typesCovered.has(t)
  ).length;
  score += coveredImportant * 5;

  // Ensure 0-100 range
  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    totalSchemas,
    validSchemas,
    invalidSchemas: totalSchemas - validSchemas,
    totalErrors,
    totalWarnings,
    typesCovered: Array.from(typesCovered),
    breakdown: {
      errorPenalty: totalErrors * 10,
      warningPenalty: totalWarnings * 2,
      coverageBonus: coveredImportant * 5,
    },
  };
}

/**
 * Generate detailed validation report
 * @param {Object} allResults - Map of file -> validation summary
 * @param {Object} scoreData - Score calculation results
 * @returns {string} - Markdown report
 */
function generateReport(allResults, scoreData) {
  const { score, totalSchemas, validSchemas, invalidSchemas, totalErrors, totalWarnings, typesCovered } = scoreData;

  const health =
    score >= 90
      ? "🟢 Excellent"
      : score >= 75
      ? "🟡 Good"
      : score >= 60
      ? "🟠 Needs Improvement"
      : "🔴 Critical";

  let report = `# Schema Validation Report
Generated: ${new Date().toISOString()}

---

## 🎯 Overall Score: ${score}/100 (${health})

| Metric | Value |
|--------|-------|
| Total Schemas | ${totalSchemas} |
| Valid Schemas | ${validSchemas} (${totalSchemas > 0 ? Math.round((validSchemas / totalSchemas) * 100) : 0}%) |
| Invalid Schemas | ${invalidSchemas} |
| Errors | ${totalErrors} |
| Warnings | ${totalWarnings} |
| Schema Types Found | ${typesCovered.join(", ") || "None"} |

---

## 📋 Schema Types Coverage

`;

  const importantTypes = ["LocalBusiness", "Organization", "Service", "Product"];
  for (const type of importantTypes) {
    const covered = typesCovered.includes(type);
    report += `- ${covered ? "✅" : "❌"} **${type}** ${covered ? "— Found" : "— Missing"}\n`;
  }

  report += `\n---\n\n## 📄 Per-File Analysis\n\n`;

  for (const [file, result] of Object.entries(allResults)) {
    report += `### ${file}\n\n`;
    report += `- **Total Schemas:** ${result.total}\n`;
    report += `- **Valid:** ${result.valid} | **Invalid:** ${result.invalid}\n`;
    report += `- **Types:** ${result.types.join(", ") || "None"}\n\n`;

    if (result.allErrors.length > 0) {
      report += `**Errors:**\n`;
      result.allErrors.forEach((err) => {
        report += `- ❌ ${err}\n`;
      });
      report += `\n`;
    }

    if (result.allWarnings.length > 0) {
      report += `**Warnings:**\n`;
      result.allWarnings.slice(0, 5).forEach((warn) => {
        report += `- ⚠️ ${warn}\n`;
      });
      if (result.allWarnings.length > 5) {
        report += `- ... and ${result.allWarnings.length - 5} more warnings\n`;
      }
      report += `\n`;
    }

    report += `---\n\n`;
  }

  report += `## 🔍 Detailed Schema Breakdown\n\n`;

  for (const [file, result] of Object.entries(allResults)) {
    for (let i = 0; i < result.details.length; i++) {
      const detail = result.details[i];
      report += `### ${file} — Schema #${i + 1}\n`;
      report += `- **Type:** ${detail.type || "Unknown"}\n`;
      report += `- **Valid:** ${detail.valid ? "✅ Yes" : "❌ No"}\n`;

      if (detail.missing.length > 0) {
        report += `- **Missing Fields:** ${detail.missing.join(", ")}\n`;
      }

      report += `\n`;
    }
  }

  report += `---\n\n## 💡 Recommendations\n\n`;

  if (totalErrors > 0) {
    report += `### Critical Issues\n`;
    report += `- Fix ${totalErrors} error(s) to improve schema validity\n`;
    report += `- Ensure all required fields are present (@type, name, url, address, etc.)\n`;
    report += `- Validate JSON syntax in all JSON-LD blocks\n\n`;
  }

  if (totalWarnings > 0) {
    report += `### Improvements\n`;
    report += `- Add ${totalWarnings} recommended field(s) for better SEO\n`;
    report += `- Include rich data like aggregateRating, review, openingHours\n`;
    report += `- Add complete address information for LocalBusiness schemas\n\n`;
  }

  if (!typesCovered.includes("LocalBusiness")) {
    report += `### Missing LocalBusiness Schema\n`;
    report += `- Add LocalBusiness schema for better local SEO\n`;
    report += `- Include name, address, telephone, url, and openingHours\n\n`;
  }

  report += `### Best Practices\n`;
  report += `- Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate\n`;
  report += `- Keep schemas up to date with [schema.org](https://schema.org/) specifications\n`;
  report += `- Add structured data for all key business information\n`;
  report += `- Include review and rating schemas when applicable\n\n`;

  report += `---\n\nGenerated by **That Smart Site Schema Validator** 🧠\n`;

  return report;
}

/*──────────────────────────────────────────────────────────────
| 🚀 Main Execution
|──────────────────────────────────────────────────────────────*/

export async function runSchemaValidation(distDir, options = {}) {
  console.log("\n🔍 Running Deep Schema Validation...\n");

  // Extract all JSON-LD
  const allSchemas = extractAllJSONLD(distDir);
  const fileCount = Object.keys(allSchemas).length;

  if (fileCount === 0) {
    console.warn("⚠️ No JSON-LD schemas found in HTML files");
    return {
      score: 0,
      totalSchemas: 0,
      validSchemas: 0,
      invalidSchemas: 0,
      totalErrors: 0,
      totalWarnings: 0,
      typesCovered: [],
      allResults: {},
      report: "No schemas found to validate",
    };
  }

  console.log(`📄 Found schemas in ${fileCount} file(s)`);

  // Validate each file
  const allResults = {};
  for (const [file, schemas] of Object.entries(allSchemas)) {
    console.log(`  Validating ${file}... (${schemas.length} schema(s))`);
    allResults[file] = validateFile(schemas);
  }

  // Calculate score
  const scoreData = calculateScore(allResults);
  console.log(`\n✅ Schema Quality Score: ${scoreData.score}/100`);
  console.log(`   Schemas: ${scoreData.validSchemas}/${scoreData.totalSchemas} valid`);
  console.log(`   Errors: ${scoreData.totalErrors}`);
  console.log(`   Warnings: ${scoreData.totalWarnings}`);

  // Generate report if requested
  let report = null;
  if (options.generateReport !== false) {
    report = generateReport(allResults, scoreData);
  }

  return {
    ...scoreData,
    allResults,
    report,
  };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const distDir = path.join(root, "frontend/dist");
  const outputPath = path.join(root, "docs/audits/SCHEMA_VALIDATION.md");

  const result = await runSchemaValidation(distDir);

  if (result.report) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.report);
    console.log(`\n📝 Report saved: ${outputPath}`);
  }

  process.exit(result.score >= 60 ? 0 : 1);
}

