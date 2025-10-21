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
  { name: 'Database', script: 'audit-db.js', critical: true },
  { name: 'Schema Switching', script: 'audit-schema.js', critical: true },
  { name: 'Backend Routes', script: 'audit-routes.js', critical: false },
  { name: 'Frontend Routing', script: 'audit-routing.js', critical: false },
  { name: 'Dependencies', script: 'audit-dependencies.js', critical: false },
  { name: 'Performance', script: 'audit-performance.js', critical: false },
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
      
      const jsonMatch = stdout.match(/AUDIT_RESULT:(\{.*?\})/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[1]);
          warnings = result.warnings || 0;
          errors = result.errors || 0;
        } catch (e) {
          // Fallback to old parsing if JSON parse fails
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

    // Clear the line and show quick status
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

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

  console.log(color.gray('📄 Detailed reports available in docs/audits/\n'));

  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error(color.red('❌ Audit runner failed:'), error);
  process.exit(1);
});

