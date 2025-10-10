#!/usr/bin/env node

/**
 * Check Component Sizes
 * 
 * Reports the largest component files in the codebase.
 * Helps identify components that may need refactoring.
 * 
 * Usage:
 *   node scripts/check-component-sizes.js [options]
 * 
 * Options:
 *   --limit N        Number of files to show (default: 10)
 *   --threshold N    Only show files with N+ lines (default: 200)
 *   --warn N         Warn threshold in lines (default: 500)
 *   --fail N         Fail threshold in lines (default: none)
 *   --ci             CI mode: exit 1 if any files exceed --fail
 *   --json           Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  limit: 10,
  threshold: 200,
  warn: 500,
  fail: null,
  ci: false,
  json: false,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--limit' && args[i + 1]) {
    options.limit = parseInt(args[++i], 10);
  } else if (arg === '--threshold' && args[i + 1]) {
    options.threshold = parseInt(args[++i], 10);
  } else if (arg === '--warn' && args[i + 1]) {
    options.warn = parseInt(args[++i], 10);
  } else if (arg === '--fail' && args[i + 1]) {
    options.fail = parseInt(args[++i], 10);
  } else if (arg === '--ci') {
    options.ci = true;
  } else if (arg === '--json') {
    options.json = true;
  }
}

/**
 * Recursively find all component files
 */
function findComponentFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, dist, build, etc.
      if (!['node_modules', 'dist', 'build', '__tests__', '.next'].includes(entry.name)) {
        findComponentFiles(fullPath, files);
      }
    } else if (entry.isFile()) {
      // Only check .tsx and .ts files
      if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Count lines in a file
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round((stats.size / 1024) * 10) / 10;
  } catch (error) {
    return 0;
  }
}

/**
 * Format path relative to project root
 */
function formatPath(filePath, baseDir) {
  const relative = path.relative(baseDir, filePath);
  return relative.replace(/\\/g, '/');
}

/**
 * Determine severity level
 */
function getSeverity(lineCount, options) {
  if (options.fail && lineCount >= options.fail) return 'error';
  if (options.warn && lineCount >= options.warn) return 'warn';
  return 'info';
}

/**
 * Main function
 */
function main() {
  const baseDir = path.resolve(__dirname, '..');
  const srcDir = path.join(baseDir, 'src');

  // Find all component files
  const componentFiles = findComponentFiles(srcDir);

  // Analyze each file
  const results = componentFiles
    .map(filePath => ({
      path: formatPath(filePath, baseDir),
      lines: countLines(filePath),
      sizeKB: getFileSizeKB(filePath),
    }))
    .filter(file => file.lines >= options.threshold)
    .sort((a, b) => b.lines - a.lines);

  // Add severity to results
  const resultsWithSeverity = results.map(file => ({
    ...file,
    severity: getSeverity(file.lines, options),
  }));

  // Output results
  if (options.json) {
    console.log(JSON.stringify({
      summary: {
        total: componentFiles.length,
        aboveThreshold: results.length,
        warnings: resultsWithSeverity.filter(f => f.severity === 'warn').length,
        errors: resultsWithSeverity.filter(f => f.severity === 'error').length,
      },
      files: resultsWithSeverity.slice(0, options.limit),
      options,
    }, null, 2));
  } else {
    // Human-readable output
    console.log('\n📊 Component Size Report\n');
    console.log(`Found ${componentFiles.length} component files`);
    console.log(`Showing top ${Math.min(options.limit, results.length)} largest files (${options.threshold}+ lines)\n`);

    if (results.length === 0) {
      console.log('✅ No files exceed the threshold!\n');
      return 0;
    }

    // Table header
    console.log('Lines  Size   Status  File');
    console.log('─────  ─────  ──────  ────────────────────────────────────────────');

    // Table rows
    const topFiles = resultsWithSeverity.slice(0, options.limit);
    for (const file of topFiles) {
      const linesStr = String(file.lines).padStart(5);
      const sizeStr = `${file.sizeKB}KB`.padStart(5);
      
      let statusIcon = '  ℹ️  ';
      if (file.severity === 'warn') statusIcon = '  ⚠️  ';
      if (file.severity === 'error') statusIcon = '  ❌  ';

      console.log(`${linesStr}  ${sizeStr}  ${statusIcon}  ${file.path}`);
    }

    console.log();

    // Summary
    const warnings = resultsWithSeverity.filter(f => f.severity === 'warn');
    const errors = resultsWithSeverity.filter(f => f.severity === 'error');

    if (errors.length > 0) {
      console.log(`❌ ${errors.length} file(s) exceed ${options.fail} lines`);
    }
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} file(s) exceed ${options.warn} lines`);
    }
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All files are within acceptable size limits');
    }

    console.log();

    // Recommendations
    if (warnings.length > 0 || errors.length > 0) {
      console.log('💡 Consider refactoring large components by:');
      console.log('   • Extracting subcomponents');
      console.log('   • Moving business logic to hooks');
      console.log('   • Splitting into smaller, focused components');
      console.log('   • Using composition patterns\n');
    }
  }

  // Exit with appropriate code in CI mode
  if (options.ci) {
    const hasErrors = resultsWithSeverity.some(f => f.severity === 'error');
    return hasErrors ? 1 : 0;
  }

  return 0;
}

// Run and exit with status code
const exitCode = main();
process.exit(exitCode);

