# Audit Utilities Documentation

## Overview

Standardized utilities for all audit scripts in `scripts/audits/`. Provides consistent logging, reporting, and result aggregation for `npm run audit:all`.

---

## Quick Start

### Basic Pattern

```js
#!/usr/bin/env node
import { createAuditResult, saveReport, finishAudit } from './shared/audit-utils.js';

const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

async function main() {
  const audit = createAuditResult('My Audit Name', isSilent);
  
  // Run checks
  audit.section('Section Name');
  
  if (somethingWrong) {
    audit.error('Critical issue found', { path: '/path/to/file' });
  } else if (somethingWarning) {
    audit.warn('Non-critical warning', { details: 'More info here' });
  } else {
    audit.pass('Check passed successfully');
  }
  
  // Save report
  saveReport(audit, 'MY_AUDIT.md', {
    description: 'What this audit does',
    recommendations: ['Suggestion 1', 'Suggestion 2']
  });
  
  // Exit with appropriate code
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Audit failed: ${err.message}`);
  process.exit(1);
});
```

---

## API Reference

### `createAuditResult(auditName, silent)`

Creates a new audit result tracker.

**Parameters:**
- `auditName` (string) - Display name of the audit (e.g., "Environment", "Database")
- `silent` (boolean) - If true, suppresses detailed console output (used by `audit:all`)

**Returns:** Audit result object with methods below

---

### Audit Result Methods

#### `audit.pass(message)`
Logs a successful check. Increments pass count.

```js
audit.pass('Database connection successful');
```

#### `audit.warn(message, details)`
Logs a warning. Increments warning count.

```js
audit.warn('Missing optional config', { 
  path: '.env', 
  details: 'BASE_DOMAIN not set' 
});
```

**Output:**
- Console: `🟡 Missing optional config`
- Report: `⚠️ **WARNING**: Missing optional config`

#### `audit.error(message, details)`
Logs a critical error. Increments error count.

```js
audit.error('Database connection failed', { 
  path: 'backend/database/pool.js',
  details: 'Connection timeout after 5000ms'
});
```

**Output:**
- Console: `🔴 Database connection failed`
- Report: `❌ **ERROR**: Database connection failed`

#### `audit.info(message)`
Logs informational message (not counted in results).

```js
audit.info('🔍 Running Database Audit...');
```

#### `audit.debug(message)`
Logs debug/gray message (only in non-silent mode).

```js
audit.debug('Checking table: users');
```

#### `audit.section(title)`
Adds a section header to the report.

```js
audit.section('Database Connectivity');
```

---

### `saveReport(result, filename, options)`

Generates and saves a markdown report.

**Parameters:**
- `result` - Audit result object from `createAuditResult()`
- `filename` (string) - Output filename (e.g., `'ENV_AUDIT.md'`)
- `options` (object) - Optional configuration:
  - `description` (string) - Audit description
  - `recommendations` (array) - List of recommendations

**Example:**

```js
saveReport(audit, 'DATABASE_AUDIT.md', {
  description: 'Validates database structure and connectivity',
  recommendations: [
    'Run migrations before deployment',
    'Add indexes on frequently queried columns',
    'Enable query logging in production'
  ]
});
```

**Output Location:** `docs/audits/{filename}`

---

### `finishAudit(result, exitProcess)`

Prints final summary and exits with appropriate code.

**Parameters:**
- `result` - Audit result object
- `exitProcess` (boolean) - Whether to call `process.exit()` (default: true)

**Exit Codes:**
- `0` - Success (no errors)
- `1` - Failure (one or more errors)

---

## Summary Output (for audit:all)

When running `npm run audit:all`, audits show:

```
🟢 Environment
🟡 Routing - 1 warning
🔴 Database - 3 errors
```

### Status Emoji Guide

- 🟢 **Green** - All checks passed
- 🟡 **Yellow** - Warnings found (non-critical)
- 🔴 **Red** - Errors found (critical issues)

---

## Helper Utilities

### `fileExists(path)`
Check if file exists.

```js
if (fileExists('.env')) {
  audit.pass('.env file found');
}
```

### `readJson(path)`
Read JSON file safely (returns null on error).

```js
const pkg = readJson('package.json');
if (pkg) {
  audit.pass(`Found package: ${pkg.name}`);
}
```

### `formatBytes(bytes)`
Format byte count as human-readable string.

```js
const size = fs.statSync('bundle.js').size;
audit.info(`Bundle size: ${formatBytes(size)}`); // "2.5 MB"
```

### `truncate(string, maxLength)`
Truncate string with ellipsis.

```js
const msg = truncate(longErrorMessage, 100);
audit.error(msg);
```

---

## Migration Guide

### Converting Existing Audits

**Before:**
```js
const results = { passed: 0, failed: 0, warnings: 0 };

if (checkPassed) {
  console.log(chalk.green('✅ Check passed'));
  results.passed++;
} else {
  console.log(chalk.red('❌ Check failed'));
  results.failed++;
}

// Custom report generation...
fs.writeFileSync('report.md', customMarkdown);
```

**After:**
```js
import { createAuditResult, saveReport, finishAudit } from './shared/audit-utils.js';

const audit = createAuditResult('Audit Name', isSilent);

if (checkPassed) {
  audit.pass('Check passed');
} else {
  audit.error('Check failed', { path: 'file.js' });
}

saveReport(audit, 'AUDIT.md');
finishAudit(audit);
```

### Benefits of Migration

1. ✅ **Consistent logging** - Same format across all audits
2. ✅ **Clean audit:all** - Shows only summaries, not full logs
3. ✅ **Standardized reports** - Same structure and naming
4. ✅ **Better aggregation** - Easier to track overall health
5. ✅ **Less code** - No need to reimplement logging/reporting

---

## Example: audit-env.js

See `scripts/audits/audit-env.js` for a complete working example of the new pattern.

Key changes:
- Uses `createAuditResult()` instead of custom results object
- Calls `audit.pass()`, `audit.warn()`, `audit.error()` instead of console.log
- Uses `saveReport()` instead of custom markdown generation
- Uses `finishAudit()` for clean exit

---

## Running Audits

### Individual Audit
```bash
npm run audit:env
```

**Output:**
```
🔍 Running Environment Audit...

## Configuration Files

✅ .env file exists
✅ All database variables present
✅ All auth variables present
🟡 Missing optional variables: STRIPE_SECRET_KEY

──────────────────────────────────────────────────
📊 Environment Audit Complete
──────────────────────────────────────────────────

✅ Passed:   5
⚠️  Warnings: 1
❌ Errors:   0
🎯 Score:    97/100
⏱️  Duration: 234ms

✅ Audit passed - no critical issues found!
```

### All Audits
```bash
npm run audit:all
```

**Output:**
```
🔍 Running All Audits...

🟢 Environment (234ms)
🟡 Routing (156ms) - 1 warning
🟢 Database (445ms)
🔴 Backend Routes (89ms) - 2 errors

═══════════════════════════════════════════════════
📊 All Audits Summary
═══════════════════════════════════════════════════

Overall Results:
  Audits Run:     4
  ✅ Passed:     2/4
  ⚠️  Warnings:  1
  ❌ Errors:    2
  ⏱️  Duration:  924ms

⚠️  Some audits found errors. Review reports for details.

📄 Detailed reports available in docs/audits/
```

---

## Best Practices

### 1. Use Descriptive Messages

```js
// ❌ Bad
audit.error('Failed');

// ✅ Good
audit.error('Database migration 2025-10-21 failed to apply', {
  path: 'backend/migrations/2025-10-21_add_users.sql',
  details: 'Column "email" already exists'
});
```

### 2. Group Related Checks with Sections

```js
audit.section('Database Structure');
// ... checks ...

audit.section('Database Connectivity');
// ... checks ...
```

### 3. Use Appropriate Severity Levels

- **Error (`audit.error`)** - Critical issues that block functionality
- **Warning (`audit.warn`)** - Non-critical issues that should be addressed
- **Pass (`audit.pass`)** - Successful checks
- **Info (`audit.info`)** - General information
- **Debug (`audit.debug`)** - Detailed debug info

### 4. Always Include Path/Details for Issues

```js
audit.warn('Missing index on frequently queried column', {
  path: 'database/tenants.business',
  details: 'Column: business_email (>10k rows)'
});
```

### 5. Support Silent Mode

```js
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';
const audit = createAuditResult('My Audit', isSilent);
```

---

## Troubleshooting

### Audit not showing in audit:all

**Problem:** New audit doesn't appear in summary

**Solution:** Add it to `AUDITS` array in `scripts/audits/audit-all.js`:

```js
const AUDITS = [
  // ... existing audits ...
  { name: 'My New Audit', script: 'audit-mynew.js', critical: false },
];
```

### Colors not showing correctly

**Problem:** Emoji/colors look wrong in terminal

**Solution:** 
- Windows: Use Windows Terminal (not cmd.exe)
- VSCode: Enable color support in integrated terminal
- CI/CD: Colors automatically disabled in non-TTY environments

### Report not being generated

**Problem:** No markdown file in `docs/audits/`

**Solution:** Check that `saveReport()` is called before `finishAudit()`:

```js
saveReport(audit, 'MY_AUDIT.md'); // Must come before finish
finishAudit(audit);
```

---

## Future Enhancements

Planned features:
- JSON export for CI/CD integration
- Historical trend tracking
- Automated fix suggestions
- Parallel audit execution
- Web dashboard for results

---

## Questions?

See `scripts/audits/audit-env.js` for a complete working example.

