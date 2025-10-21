#!/usr/bin/env node
/**
 * audit-all.js — Meta-Audit Runner
 * ----------------------------------------------------------------
 * Runs all individual audits and displays a clean summary.
 * Each audit runs in "silent" mode to suppress detailed logs.
 * Final output shows only status summary with warnings/errors count.
 * ----------------------------------------------------------------
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { color } from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//────────────────────────────────────────────────────────────────
// 🎯 Audit Configuration
//────────────────────────────────────────────────────────────────
const AUDITS = [
  { name: 'Environment', script: 'audit-env.js', critical: true },
  { name: 'Security', script: 'audit-security.js', critical: true },
  { name: 'Database', script: 'audit-db.js', critical: true },
  { name: 'Schema Switching', script: 'audit-schema.js', critical: true },
  { name: 'Import Boundaries', script: 'audit-boundaries.js', critical: true },
  { name: 'Middleware', script: 'audit-middleware.js', critical: false },
  { name: 'API Contracts', script: 'audit-api-contracts.js', critical: false },
  { name: 'Assets', script: 'audit-assets.js', critical: false },
  { name: 'Backend Routes', script: 'audit-routes.js', critical: false },
  { name: 'Frontend Routing', script: 'audit-routing.js', critical: false },
  { name: 'Dependencies', script: 'audit-dependencies.js', critical: false },
  { name: 'Performance', script: 'audit-performance.js', critical: false },
  { name: 'Project Overview', script: 'audit-overview.js', critical: false },
  // { name: 'SEO', script: 'audit-seo.js', critical: false },
];

//────────────────────────────────────────────────────────────────
// 🏃 Run Single Audit
//────────────────────────────────────────────────────────────────
function runAudit(audit) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, audit.script);
    const startTime = Date.now();

    // Run audit with --silent flag (if supported)
    const child = spawn('node', [scriptPath, '--silent'], {
      cwd: process.cwd(),
      env: { ...process.env, AUDIT_SILENT: 'true' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      
      // Exit code determines health: 0 = pass, 1 = fail
      const healthy = code === 0;
      
      // Try to parse JSON result from stdout (format: AUDIT_RESULT:{json})
      let warnings = 0;
      let errors = 0;
      let issues = [];
      
      // Find the AUDIT_RESULT marker and extract everything after it
      const markerIndex = stdout.indexOf('AUDIT_RESULT:');
      if (markerIndex !== -1) {
        try {
          // Extract JSON string from marker to end (or to next line)
          const jsonStr = stdout.substring(markerIndex + 'AUDIT_RESULT:'.length).trim().split('\n')[0];
          const result = JSON.parse(jsonStr);
          warnings = result.warnings || 0;
          errors = result.errors || 0;
          issues = result.issues || [];
        } catch (e) {
          // Fallback to old parsing if JSON parse fails
          console.error(`Failed to parse audit result JSON: ${e.message}`);
          warnings = parseCount(stdout, 'warning');
          errors = parseCount(stdout, 'error');
        }
      } else {
        // Fallback to regex parsing for non-migrated audits
        warnings = parseCount(stdout, 'warning');
        errors = parseCount(stdout, 'error');
      }
      
      // If exit code is 1 but we couldn't parse errors, assume at least 1 error
      const actualErrors = (code === 1 && errors === 0) ? 1 : errors;
      
      resolve({
        name: audit.name,
        script: audit.script,
        critical: audit.critical,
        exitCode: code,
        duration,
        warnings,
        errors: actualErrors,
        healthy,
        issues,
        stdout,
        stderr,
      });
    });

    child.on('error', (err) => {
      resolve({
        name: audit.name,
        script: audit.script,
        critical: audit.critical,
        exitCode: 1,
        duration: Date.now() - startTime,
        warnings: 0,
        errors: 1,
        healthy: false,
        issues: [{ severity: 'error', message: err.message, path: audit.script }],
        stdout: '',
        stderr: err.message,
      });
    });
  });
}

//────────────────────────────────────────────────────────────────
// 🔍 Parse Output
//────────────────────────────────────────────────────────────────
function parseCount(output, type) {
  // Try to find "X warnings" or "X errors" pattern
  const patterns = [
    new RegExp(`(\\d+)\\s+${type}s?`, 'i'),
    new RegExp(`${type}s?:\\s+(\\d+)`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return 0;
}

//────────────────────────────────────────────────────────────────
// 📊 Display Results
//────────────────────────────────────────────────────────────────
function displayResults(results) {
  console.log('');
  console.log(color.bold('═'.repeat(60)));
  console.log(color.bold('📊 All Audits Summary'));
  console.log(color.bold('═'.repeat(60)));
  console.log('');

  const maxNameLength = Math.max(...results.map(r => r.name.length));

  results.forEach((result) => {
    const emoji = getStatusEmoji(result);
    const name = result.name.padEnd(maxNameLength);
    const parts = [];

    if (result.errors > 0) {
      parts.push(color.red(`${result.errors} error${result.errors !== 1 ? 's' : ''}`));
    }
    if (result.warnings > 0) {
      parts.push(color.yellow(`${result.warnings} warning${result.warnings !== 1 ? 's' : ''}`));
    }

    const suffix = parts.length > 0 ? ` - ${parts.join(', ')}` : '';
    const duration = color.gray(`(${result.duration}ms)`);

    console.log(`${emoji} ${name} ${duration} ${suffix}`);
  });

  console.log('');
  console.log(color.bold('─'.repeat(60)));

  // Overall summary
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const healthyCount = results.filter(r => r.healthy).length;
  const criticalFailed = results.filter(r => r.critical && !r.healthy).length;

  console.log('');
  console.log(color.bold('Overall Results:'));
  console.log(`  Audits Run:     ${results.length}`);
  console.log(`  ${color.green('✅ Passed:')}     ${healthyCount}/${results.length}`);
  console.log(`  ${color.yellow('⚠️  Warnings:')}  ${totalWarnings}`);
  console.log(`  ${color.red('❌ Errors:')}    ${totalErrors}`);
  console.log(`  ${color.gray('⏱️  Duration:')}  ${totalDuration}ms`);
  console.log('');

  if (criticalFailed > 0) {
    console.log(color.red('❌ CRITICAL: Some critical audits failed!'));
    console.log('');
    return false;
  } else if (totalErrors > 0) {
    console.log(color.yellow('⚠️  Some audits found errors. Review reports for details.'));
    console.log('');
    return false;
  } else if (totalWarnings > 0) {
    console.log(color.yellow('⚠️  Some audits found warnings. Review reports for details.'));
    console.log('');
    return true; // Warnings don't fail the build
  } else {
    console.log(color.green('✅ All audits passed successfully!'));
    console.log('');
    return true;
  }
}

function getStatusEmoji(result) {
  // Exit code is source of truth: 0 = pass, 1 = fail
  if (!result.healthy) return '🔴';
  if (result.warnings > 0) return '🟡';
  return '🟢';
}

//────────────────────────────────────────────────────────────
// 📝 Write Summary File
//────────────────────────────────────────────────────────────
function writeSummaryFile(results) {
  const summaryDir = path.join(process.cwd(), 'docs', 'audits', 'summaries');
  
  // Ensure directory exists
  if (!fs.existsSync(summaryDir)) {
    fs.mkdirSync(summaryDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const lines = [
    '# All Audits - Issues Summary',
    '',
    `**Generated:** ${timestamp}`,
    `**Total Audits:** ${results.length}`,
    '',
    '---',
    ''
  ];

  // Collect all errors
  const allErrors = [];
  const allWarnings = [];

  results.forEach(result => {
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        if (issue.severity === 'error') {
          allErrors.push({
            audit: result.name,
            message: issue.message,
            path: issue.path || 'N/A'
          });
        } else if (issue.severity === 'warning') {
          allWarnings.push({
            audit: result.name,
            message: issue.message,
            path: issue.path || 'N/A'
          });
        }
      });
    }
  });

  // Write errors section
  if (allErrors.length > 0) {
    lines.push('## ❌ Errors');
    lines.push('');
    lines.push(`**Total Errors:** ${allErrors.length}`);
    lines.push('');

    allErrors.forEach((error, idx) => {
      lines.push(`### ${idx + 1}. ${error.audit}`);
      lines.push('');
      lines.push(`**Error:** ${error.message}`);
      lines.push('');
      lines.push(`**Path:** \`${error.path}\``);
      lines.push('');
    });
  } else {
    lines.push('## ✅ No Errors Found');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Write warnings section
  if (allWarnings.length > 0) {
    lines.push('## ⚠️  Warnings');
    lines.push('');
    lines.push(`**Total Warnings:** ${allWarnings.length}`);
    lines.push('');

    allWarnings.forEach((warning, idx) => {
      lines.push(`### ${idx + 1}. ${warning.audit}`);
      lines.push('');
      lines.push(`**Warning:** ${warning.message}`);
      lines.push('');
      lines.push(`**Path:** \`${warning.path}\``);
      lines.push('');
    });
  } else {
    lines.push('## ✅ No Warnings Found');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## 📊 Audit Results Summary');
  lines.push('');

  results.forEach(result => {
    const emoji = getStatusEmoji(result);
    const status = result.healthy ? 'Pass' : 'Fail';
    lines.push(`- ${emoji} **${result.name}**: ${status} (${result.errors} errors, ${result.warnings} warnings)`);
  });

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`_Generated by \`npm run audit:all\` at ${timestamp}_`);

  // Write file
  const summaryPath = path.join(summaryDir, 'all-errors.md');
  fs.writeFileSync(summaryPath, lines.join('\n'));

  return summaryPath;
}

//────────────────────────────────────────────────────────────────
// 🚀 Main Execution
//────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const failFast = args.includes('--fail-fast');

  console.log(color.cyan('\n🔍 Running All Audits...\n'));

  const results = [];

  for (const audit of AUDITS) {
    process.stdout.write(color.gray(`Running ${audit.name}...`));

    const result = await runAudit(audit);
    results.push(result);

    // Clear the line and show quick status (if supported)
    if (typeof process.stdout.clearLine === 'function') {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    } else {
      // Fallback for terminals that don't support clearLine
      console.log('');
    }

    const emoji = getStatusEmoji(result);
    console.log(`${emoji} ${audit.name} ${color.gray(`(${result.duration}ms)`)}`);

    // If verbose, show output
    if (verbose && result.stdout) {
      console.log(color.gray('─'.repeat(40)));
      console.log(result.stdout);
      console.log(color.gray('─'.repeat(40)));
    }

    // Fail fast on critical audit failure
    if (failFast && result.critical && !result.healthy) {
      console.log('');
      console.log(color.red(`❌ Critical audit "${audit.name}" failed. Stopping.`));
      console.log('');
      if (result.stderr) {
        console.log(color.red('Error output:'));
        console.log(result.stderr);
      }
      process.exit(1);
    }
  }

  const success = displayResults(results);

  // Write comprehensive summary file
  try {
    const summaryPath = writeSummaryFile(results);
    console.log(color.gray(`📄 Detailed reports available in docs/audits/`));
    console.log(color.gray(`📋 Issues summary written to ${path.relative(process.cwd(), summaryPath)}\n`));
  } catch (error) {
    console.error(color.yellow(`⚠️  Failed to write summary file: ${error.message}`));
    console.log(color.gray('📄 Detailed reports available in docs/audits/\n'));
  }

  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error(color.red('❌ Audit runner failed:'), error);
  process.exit(1);
});

