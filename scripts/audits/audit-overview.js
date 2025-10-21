#!/usr/bin/env node
/**
 * audit-overview.js — Meta Audit: Project Overview
 * --------------------------------------------------------------
 * ✅ Evaluates:
 *  - Project structure & key directories
 *  - package.json integrity & audit commands
 *  - Reads scores from prior audit reports
 *  - Produces unified health score + summary
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists,
  readJson
} from './shared/audit-utils.js';

const root = process.cwd();
const docsDir = path.join(root, "docs", "audits");

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//────────────────────────────────────────────
// 🧩 Check project structure
//────────────────────────────────────────────
function checkStructure(audit) {
  audit.section('Project Structure');
  
  const requiredDirs = [
    "backend",
    "frontend",
    "scripts/audits",
    "docs/audits"
  ];
  
  for (const dir of requiredDirs) {
    if (fileExists(path.join(root, dir))) {
      audit.pass(`${dir}/ exists`);
    } else {
      audit.error(`${dir}/ missing`, {
        path: dir,
        details: 'Required directory for project structure'
      });
    }
  }
}

//────────────────────────────────────────────
// 🧩 Check package.json integrity
//────────────────────────────────────────────
function checkPackageJson(audit) {
  audit.section('Package Configuration');
  
  const pkgPath = path.join(root, "package.json");
  const pkg = readJson(pkgPath);
  
  if (!pkg) {
    audit.error('package.json not found', {
      path: 'package.json',
      details: 'Required for project configuration'
    });
    return;
  }

  audit.pass(`Project: ${pkg.name || "Unknown"} v${pkg.version || "0.0.0"}`);

  const expectedScripts = [
    "audit:env",
    "audit:schema",
    "audit:db",
    "audit:routes",
    "audit:routing",
    "audit:dependencies",
    "audit:all"
  ];

  const missingScripts = expectedScripts.filter(s => !pkg.scripts?.[s]);
  
  if (missingScripts.length > 0) {
    audit.warn(`Missing audit scripts: ${missingScripts.join(', ')}`, {
      details: 'Add these npm scripts to package.json'
    });
  } else {
    audit.pass('All audit scripts present');
  }

  if (!pkg.scripts?.lint) {
    audit.warn('No lint script defined', {
      details: 'Add linting step to enforce code quality'
    });
  } else {
    audit.pass('Lint script present');
  }

  if (!pkg.scripts?.test) {
    audit.warn('No test script defined', {
      details: 'Add test script to enable CI checks'
    });
  } else {
    audit.pass('Test script present');
  }
}

//────────────────────────────────────────────
// 📊 Parse scores from existing audit reports
//────────────────────────────────────────────
function extractScoreFromReport(filename) {
  try {
    const filePath = path.join(docsDir, filename);
    if (!fileExists(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/Score:\s*(\d+)\/100/i);
    if (match) return parseInt(match[1]);
  } catch {
    return null;
  }
  return null;
}

function checkAuditReports(audit) {
  audit.section('Audit Reports');
  
  const reports = {
    'ENV_AUDIT.md': 'Environment',
    'DATABASE_AUDIT.md': 'Database',
    'SCHEMA_AUDIT.md': 'Schema Switching',
    'ROUTES_AUDIT.md': 'Backend Routes',
    'DEPENDENCY_AUDIT.md': 'Dependencies',
  };

  let foundAny = false;
  
  for (const [filename, name] of Object.entries(reports)) {
    const score = extractScoreFromReport(filename);
    
    if (score !== null) {
      foundAny = true;
      if (score >= 90) {
        audit.pass(`${name}: ${score}/100`);
      } else if (score >= 70) {
        audit.pass(`${name}: ${score}/100 (could improve)`);
      } else {
        audit.warn(`${name}: ${score}/100 (needs attention)`, {
          details: `Run: npm run audit:${filename.toLowerCase().replace('_audit.md', '')}`
        });
      }
    }
  }
  
  if (!foundAny) {
    audit.warn('No audit reports found', {
      details: 'Run: npm run audit:all to generate reports'
    });
  }
}

//────────────────────────────────────────────
// 🚀 Run Overview Audit
//────────────────────────────────────────────
function runProjectOverview() {
  const audit = createAuditResult('Project Overview', isSilent);

  // Run all checks
  checkStructure(audit);
  checkPackageJson(audit);
  checkAuditReports(audit);

  // Generate report
  saveReport(audit, 'PROJECT_OVERVIEW.md', {
    description: 'Meta-audit that evaluates overall project health by checking structure, configuration, and individual audit scores.',
    recommendations: [
      'Ensure all core directories exist (backend, frontend, scripts, docs)',
      'Add any missing audit scripts to package.json',
      'Add lint and test scripts if missing',
      'Run individual audits to generate reports: npm run audit:all',
      'Address low-scoring audits (< 70)',
      'Keep audit reports up to date by running audits regularly'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

runProjectOverview();
