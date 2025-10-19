#!/usr/bin/env node
/**
 * Enhanced Project Orchestrator
 * Central runner for all audits, tests, and reports with dynamic detection
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();
const scriptsDir = path.join(root, 'scripts');
const reportsDir = path.join(scriptsDir, 'audits', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Available audit phases
const auditPhases = {
  backend: [
    { name: 'Schema Switching', script: 'audits/backend/audit-schema-switching.js' },
    { name: 'Express Routes', script: 'audits/backend/audit-express-routes.js' },
    { name: 'Database Audit', script: 'backend/db-audit.js' },
    { name: 'Environment Check', script: 'audits/system/env-check.js' }
  ],
  frontend: [
    { name: 'Routing Validation', script: 'audits/frontend/audit-routing.js' },
    { name: 'Component Sizes', script: 'audits/frontend/check-component-sizes.js' },
    { name: 'Import Boundaries', script: 'frontend/check-import-boundaries.ts' },
    { name: 'Build Validation', script: 'testing/frontend/validate-build.js' }
  ],
  seo: [
    { name: 'SEO Anchors', script: 'audits/seo/test-anchors.js' },
    { name: 'SEO Endpoints', script: 'audits/seo/test-endpoints.js' },
    { name: 'SEO Integration', script: 'audits/seo/integrate.js' }
  ],
  system: [
    { name: 'Subdomain Debug', script: 'audits/system/debug-subdomain.js' },
    { name: 'Environment Check', script: 'audits/system/env-check.js' },
    { name: 'Project Overview', script: 'project/project-overview.js' }
  ],
  tests: [
    { name: 'Backend Tests', script: 'testing/backend/test-subdomain.js' },
    { name: 'Frontend Tests', script: 'testing/frontend/validate-build.js' },
    { name: 'Integration Tests', script: 'testing/integration/verify-onboarding.js' }
  ]
};

// Results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  details: []
};

async function runPhase(phaseName, phase) {
  console.log(chalk.blue.bold(`\n🔍 Running ${phaseName} Audits...\n`));
  
  let phasePassed = 0;
  let phaseFailed = 0;
  let phaseSkipped = 0;

  for (const audit of phase) {
    const scriptPath = path.join(scriptsDir, audit.script);
    
    if (!fs.existsSync(scriptPath)) {
      console.log(chalk.yellow(`⚠️  Skipping ${audit.name} - Script not found: ${audit.script}`));
      phaseSkipped++;
      results.skipped++;
      results.details.push({
        phase: phaseName,
        name: audit.name,
        status: 'skipped',
        reason: 'Script not found'
      });
      continue;
    }

    console.log(chalk.cyan(`📊 ${audit.name}...`));
    
    try {
      const startTime = Date.now();
      execSync(`node ${scriptPath}`, { 
        stdio: 'inherit', 
        cwd: root,
        timeout: 300000 // 5 minute timeout
      });
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log(chalk.green(`✅ ${audit.name} completed (${duration}s)\n`));
      phasePassed++;
      results.passed++;
      results.details.push({
        phase: phaseName,
        name: audit.name,
        status: 'passed',
        duration: `${duration}s`
      });
    } catch (error) {
      console.log(chalk.red(`❌ ${audit.name} failed: ${error.message}\n`));
      phaseFailed++;
      results.failed++;
      results.details.push({
        phase: phaseName,
        name: audit.name,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Phase summary
  const total = phasePassed + phaseFailed + phaseSkipped;
  console.log(chalk.blue(`📈 ${phaseName} Summary: ${phasePassed} passed, ${phaseFailed} failed, ${phaseSkipped} skipped\n`));
  
  return { phasePassed, phaseFailed, phaseSkipped, total };
}

function generateSummaryReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `PROJECT_SUMMARY_${timestamp}.md`);
  
  const report = `# Project Audit Summary

**Generated:** ${new Date().toLocaleString()}
**Total Scripts:** ${results.total}
**Passed:** ${results.passed}
**Failed:** ${results.failed}
**Skipped:** ${results.skipped}

## Results by Phase

${Object.keys(auditPhases).map(phase => {
  const phaseResults = results.details.filter(d => d.phase === phase);
  const passed = phaseResults.filter(d => d.status === 'passed').length;
  const failed = phaseResults.filter(d => d.status === 'failed').length;
  const skipped = phaseResults.filter(d => d.status === 'skipped').length;
  
  return `### ${phase.charAt(0).toUpperCase() + phase.slice(1)}
- **Passed:** ${passed}
- **Failed:** ${failed}
- **Skipped:** ${skipped}

${phaseResults.map(detail => 
  `- **${detail.name}:** ${detail.status}${detail.duration ? ` (${detail.duration})` : ''}${detail.error ? ` - ${detail.error}` : ''}`
).join('\n')}`;
}).join('\n\n')}

## Recommendations

${results.failed > 0 ? 
  `⚠️ **${results.failed} scripts failed** - Review error messages above and fix issues before deployment.` : 
  '✅ **All scripts passed** - Project is ready for deployment.'
}

${results.skipped > 0 ? 
  `ℹ️ **${results.skipped} scripts skipped** - Consider implementing missing scripts for complete coverage.` : 
  ''
}

---
*Generated by MDH Project Orchestrator*
`;

  fs.writeFileSync(reportPath, report);
  console.log(chalk.green(`📄 Summary report saved: ${reportPath}`));
}

function showHelp() {
  console.log(chalk.blue.bold('🚀 MDH Project Orchestrator\n'));
  console.log(chalk.gray('Usage: node scripts/project/run-all.js [options]\n'));
  
  console.log(chalk.yellow('Options:'));
  console.log(chalk.white('  --backend     Run backend audits only'));
  console.log(chalk.white('  --frontend    Run frontend audits only'));
  console.log(chalk.white('  --seo         Run SEO audits only'));
  console.log(chalk.white('  --system      Run system audits only'));
  console.log(chalk.white('  --tests       Run tests only'));
  console.log(chalk.white('  --all         Run all audits and tests (default)'));
  console.log(chalk.white('  --help        Show this help message\n'));
  
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  node scripts/project/run-all.js --backend'));
  console.log(chalk.gray('  node scripts/project/run-all.js --frontend --seo'));
  console.log(chalk.gray('  node scripts/project/run-all.js --all'));
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  console.log(chalk.blue.bold('🚀 MDH Project Orchestrator Starting...\n'));
  
  const startTime = Date.now();
  
  // Determine which phases to run
  const runAll = args.length === 0 || args.includes('--all');
  const phasesToRun = runAll ? Object.keys(auditPhases) : 
    Object.keys(auditPhases).filter(phase => args.includes(`--${phase}`));
  
  if (phasesToRun.length === 0) {
    console.log(chalk.red('❌ No phases specified. Use --help to see available options.'));
    process.exit(1);
  }

  console.log(chalk.cyan(`Running phases: ${phasesToRun.join(', ')}\n`));

  // Run selected phases
  for (const phaseName of phasesToRun) {
    if (auditPhases[phaseName]) {
      const phaseResults = await runPhase(phaseName, auditPhases[phaseName]);
      results.total += phaseResults.total;
    }
  }

  // Generate summary
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(chalk.blue.bold(`\n🎉 Audit Suite Completed in ${totalTime}s\n`));
  
  console.log(chalk.green(`✅ Passed: ${results.passed}`));
  if (results.failed > 0) {
    console.log(chalk.red(`❌ Failed: ${results.failed}`));
  }
  if (results.skipped > 0) {
    console.log(chalk.yellow(`⚠️  Skipped: ${results.skipped}`));
  }

  // Generate report
  generateSummaryReport();

  // Exit with appropriate code
  if (results.failed > 0) {
    console.log(chalk.red('\n❌ Some audits failed. Check the report for details.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ All audits passed successfully!'));
    process.exit(0);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Orchestrator failed:'), error);
  process.exit(1);
});