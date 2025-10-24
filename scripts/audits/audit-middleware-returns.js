// scripts/audit-middleware-returns.js
// 🧩 Tenant Middleware Safety Audit
// Scans backend/middleware for res.status(...).json() calls missing 'return'
// Prevents premature 404 responses (async chain continuation)

import fs from 'fs';
import path from 'path';

const middlewareDir = path.resolve('backend', 'middleware');

function scanFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const lines = code.split('\n');
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect response sends
    if (/res\.status\(\d+\)\.json\(/.test(line)) {
      const nextLine = lines[i + 1] || '';

      // Look for missing 'return' on same or next line
      const hasReturn = line.includes('return') || nextLine.trim().startsWith('return');

      if (!hasReturn) {
        issues.push({ line: i + 1, snippet: line.trim() });
      }
    }
  }

  return issues;
}

function auditDirectory(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const filePath = path.join(dir, file);

    const code = fs.readFileSync(filePath, 'utf-8');
    if (!/res\.status/.test(code)) continue; // Skip if file doesn't send responses

    const issues = scanFile(filePath);
    if (issues.length > 0) {
      results.push({ file: filePath, issues });
    }
  }
  return results;
}

const results = auditDirectory(middlewareDir);

if (results.length === 0) {
  console.log('✅ All middleware return properly after sending responses.');
} else {
  console.log('⚠️ Potential missing returns found in middleware:');
  for (const result of results) {
    console.log(`\n📄 ${result.file}`);
    for (const issue of result.issues) {
      console.log(`  Line ${issue.line}: ${issue.snippet}`);
    }
  }
  console.log('\n💡 Fix by adding `return;` immediately after res.status(...).json(...) lines.');
}
