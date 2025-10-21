#!/usr/bin/env node
/**
 * Audit Utilities — Shared Logging, Reporting & Result Collection
 * ----------------------------------------------------------------
 * Provides consistent interface for all audit scripts:
 * - Standardized console output (warnings, errors, success)
 * - Unified markdown report generation
 * - Result collection for audit:all aggregation
 * - Clean exit codes
 * ----------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//────────────────────────────────────────────────────────────────
// 🎨 Color utilities
//────────────────────────────────────────────────────────────────
export const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

//────────────────────────────────────────────────────────────────
// 📊 Audit Result Builder
//────────────────────────────────────────────────────────────────
/**
 * Creates a new audit result tracker
 * @param {string} auditName - Name of the audit (e.g., "Environment", "Database")
 * @param {boolean} silent - If true, suppress detailed console output (for audit:all)
 */
export function createAuditResult(auditName, silent = false) {
  const result = {
    name: auditName,
    passed: 0,
    warnings: 0,
    errors: 0,
    issues: [],
    reportLines: [],
    silent,
    startTime: Date.now(),
  };

  /**
   * Log a success check
   */
  result.pass = function (message) {
    this.passed++;
    // Don't print to console - summary only
    this.reportLines.push(`✅ ${message}`);
  };

  /**
   * Log a warning
   */
  result.warn = function (message, details = {}) {
    this.warnings++;
    this.issues.push({
      severity: 'warning',
      message,
      ...details,
    });
    
    // Don't print to console - summary only
    
    this.reportLines.push(`⚠️ **WARNING**: ${message}`);
    if (details.path) {
      this.reportLines.push(`   - Path: \`${details.path}\``);
    }
  };

  /**
   * Log a critical error
   */
  result.error = function (message, details = {}) {
    this.errors++;
    this.issues.push({
      severity: 'error',
      message,
      ...details,
    });
    
    // Don't print to console - summary only
    
    this.reportLines.push(`❌ **ERROR**: ${message}`);
    if (details.path) {
      this.reportLines.push(`   - Path: \`${details.path}\``);
    }
  };

  /**
   * Log an informational message (not counted)
   */
  result.info = function (message) {
    // Don't print to console - summary only
    this.reportLines.push(message);
  };

  /**
   * Log a debug/gray message (not counted)
   */
  result.debug = function (message) {
    // Don't print to console - summary only (keep for report)
  };

  /**
   * Add a section header to report
   */
  result.section = function (title) {
    // Don't print to console - summary only
    this.reportLines.push(`\n## ${title}`);
    this.reportLines.push('');
  };

  /**
   * Get status emoji for summary
   */
  result.getStatusEmoji = function () {
    if (this.errors > 0) return '🔴';
    if (this.warnings > 0) return '🟡';
    return '🟢';
  };

  /**
   * Get one-line summary for audit:all
   */
  result.getSummary = function () {
    const emoji = this.getStatusEmoji();
    const parts = [];
    
    if (this.errors > 0) {
      parts.push(`${this.errors} error${this.errors !== 1 ? 's' : ''}`);
    }
    if (this.warnings > 0) {
      parts.push(`${this.warnings} warning${this.warnings !== 1 ? 's' : ''}`);
    }
    
    const suffix = parts.length > 0 ? ` - ${parts.join(', ')}` : '';
    return `${emoji} ${this.name}${suffix}`;
  };

  /**
   * Get colored summary for console
   */
  result.getColoredSummary = function () {
    const emoji = this.getStatusEmoji();
    const parts = [];
    
    if (this.errors > 0) {
      parts.push(color.red(`${this.errors} error${this.errors !== 1 ? 's' : ''}`));
    }
    if (this.warnings > 0) {
      parts.push(color.yellow(`${this.warnings} warning${this.warnings !== 1 ? 's' : ''}`));
    }
    
    const name = color.bold(this.name);
    const suffix = parts.length > 0 ? ` - ${parts.join(', ')}` : '';
    return `${emoji} ${name}${suffix}`;
  };

  /**
   * Calculate health score (0-100)
   */
  result.getScore = function () {
    const totalChecks = this.passed + this.warnings + this.errors;
    if (totalChecks === 0) return 100;
    
    // Errors are weighted heavily, warnings less so
    const penalty = (this.errors * 10) + (this.warnings * 3);
    return Math.max(0, 100 - penalty);
  };

  /**
   * Check if audit passed (no errors)
   */
  result.isHealthy = function () {
    return this.errors === 0;
  };

  /**
   * Get duration in ms
   */
  result.getDuration = function () {
    return Date.now() - this.startTime;
  };

  return result;
}

//────────────────────────────────────────────────────────────────
// 📝 Report Generation
//────────────────────────────────────────────────────────────────
/**
 * Generate and save a markdown report
 * @param {object} result - Audit result from createAuditResult
 * @param {string} filename - Output filename (e.g., "ENV_AUDIT.md")
 * @param {object} options - Additional report options
 */
export function saveReport(result, filename, options = {}) {
  const root = process.cwd();
  const docsDir = path.join(root, 'docs', 'audits');
  
  // Ensure directory exists
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const duration = result.getDuration();
  const score = result.getScore();

  // Build markdown report
  const lines = [
    `# ${result.name} Audit Report`,
    '',
    `**Generated:** ${timestamp}`,
    `**Duration:** ${duration}ms`,
    `**Score:** ${score}/100`,
    '',
    '---',
    '',
    '## Summary',
    '',
    `- ✅ **Passed:** ${result.passed}`,
    `- ⚠️  **Warnings:** ${result.warnings}`,
    `- ❌ **Errors:** ${result.errors}`,
    '',
  ];

  // Add custom sections from options
  if (options.description) {
    lines.push('## Description');
    lines.push('');
    lines.push(options.description);
    lines.push('');
  }

  // Add issues breakdown
  if (result.issues.length > 0) {
    lines.push('## Issues Found');
    lines.push('');

    const errors = result.issues.filter(i => i.severity === 'error');
    const warnings = result.issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
      lines.push('### 🔴 Critical Errors');
      lines.push('');
      errors.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.message}**`);
        if (issue.path) lines.push(`   - Path: \`${issue.path}\``);
        if (issue.details) lines.push(`   - Details: ${issue.details}`);
        lines.push('');
      });
    }

    if (warnings.length > 0) {
      lines.push('### 🟡 Warnings');
      lines.push('');
      warnings.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.message}**`);
        if (issue.path) lines.push(`   - Path: \`${issue.path}\``);
        if (issue.details) lines.push(`   - Details: ${issue.details}`);
        lines.push('');
      });
    }
  } else {
    lines.push('## ✅ All Checks Passed!');
    lines.push('');
    lines.push('No issues found during this audit.');
    lines.push('');
  }

  // Add detailed log
  lines.push('---');
  lines.push('');
  lines.push('## Detailed Log');
  lines.push('');
  lines.push(...result.reportLines);

  // Add recommendations if provided
  if (options.recommendations && options.recommendations.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Recommendations');
    lines.push('');
    options.recommendations.forEach((rec, idx) => {
      lines.push(`${idx + 1}. ${rec}`);
    });
    lines.push('');
  }

  // Write file
  const reportPath = path.join(docsDir, filename);
  fs.writeFileSync(reportPath, lines.join('\n'));

  // Don't print to console - keep output clean
  // Report is saved silently

  return reportPath;
}

//────────────────────────────────────────────────────────────────
// 🏁 Audit Completion
//────────────────────────────────────────────────────────────────
/**
 * Print final summary and exit with appropriate code
 * @param {object} result - Audit result
 * @param {boolean} exitProcess - Whether to call process.exit (default: true)
 */
export function finishAudit(result, exitProcess = true) {
  if (!result.silent) {
    // Full detailed output for standalone runs
    console.log('');
    console.log(color.bold('─'.repeat(50)));
    console.log(color.bold(`📊 ${result.name} Audit Complete`));
    console.log(color.bold('─'.repeat(50)));
    console.log('');
    console.log(`✅ Passed:   ${color.green(result.passed)}`);
    console.log(`⚠️  Warnings: ${color.yellow(result.warnings)}`);
    console.log(`❌ Errors:   ${color.red(result.errors)}`);
    
    // Show actual errors and warnings
    if (result.errors > 0) {
      const errors = result.issues.filter(i => i.severity === 'error');
      errors.forEach(err => {
        const pathStr = err.path ? ` ${color.gray(err.path)}` : '';
        console.log(`     ${color.red('🔴')} ${err.message}${pathStr}`);
      });
    }
    
    if (result.warnings > 0) {
      const warnings = result.issues.filter(i => i.severity === 'warning');
      warnings.forEach(warn => {
        const pathStr = warn.path ? ` ${color.gray(warn.path)}` : '';
        console.log(`     ${color.yellow('🟡')} ${warn.message}${pathStr}`);
      });
    }
    
    console.log(`🎯 Score:    ${result.getScore()}/100`);
    console.log(`⏱️  Duration: ${result.getDuration()}ms`);
    
    // Status line inside the box
    if (result.isHealthy()) {
      console.log(`Status:     ${color.green('✅ Pass')}`);
    } else {
      console.log(`Status:     ${color.red('❌ Fail')}`);
    }
    
    console.log(color.bold('─'.repeat(50)));
    console.log('');
  } else {
    // In silent mode, output parseable JSON for audit:all
    // Use a special prefix so it's easy to parse
    console.log(`AUDIT_RESULT:${JSON.stringify({
      name: result.name,
      passed: result.passed,
      warnings: result.warnings,
      errors: result.errors,
      score: result.getScore(),
      healthy: result.isHealthy(),
      issues: result.issues // Include actual error/warning messages with paths
    })}`);
  }

  if (exitProcess) {
    process.exit(result.isHealthy() ? 0 : 1);
  }

  return result;
}

//────────────────────────────────────────────────────────────────
// 🔧 Utility Helpers
//────────────────────────────────────────────────────────────────
/**
 * Check if file exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read JSON file safely
 */
export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

/**
 * Format file size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str, maxLength = 80) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

//────────────────────────────────────────────────────────────────
// 📤 Export for audit:all
//────────────────────────────────────────────────────────────────
/**
 * Export result as JSON for aggregation
 */
export function exportResult(result) {
  return {
    name: result.name,
    passed: result.passed,
    warnings: result.warnings,
    errors: result.errors,
    score: result.getScore(),
    duration: result.getDuration(),
    healthy: result.isHealthy(),
    issues: result.issues,
    summary: result.getSummary(),
  };
}

