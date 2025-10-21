#!/usr/bin/env node
/**
 * Dead Code Analyzer - Smart False Positive Detection
 * 
 * Analyzes unreachable files from flow audit to categorize them:
 * - Likely FALSE POSITIVE (modal imports, lazy loads, etc.)
 * - Likely DEAD (unused utilities, old components)
 * - INVESTIGATE (unclear status)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

// Get app name from command line
const appName = process.argv[2] || 'tenant-app';
const reportPath = path.join(root, `docs/audits/FLOW_FRONTEND_${appName.toUpperCase().replace('-', '_')}.md`);

if (!fs.existsSync(reportPath)) {
  console.error(`❌ Report not found: ${reportPath}`);
  process.exit(1);
}

const report = fs.readFileSync(reportPath, 'utf-8');

// Extract unreachable app files
const appFilesMatch = report.match(/## 🔴 Unreachable App Files[\s\S]*?(?=##|$)/);
if (!appFilesMatch) {
  console.log('✅ No unreachable app files found!');
  process.exit(0);
}

const fileLines = appFilesMatch[0].split('\n').filter(line => line.startsWith('- apps/'));
const files = fileLines.map(line => line.replace(/^- /, ''));

console.log(`\n📊 Dead Code Analysis - ${appName}`);
console.log(`Total Unreachable: ${files.length}\n`);

// Categorize files
const categories = {
  modalImports: [],
  lazyComponents: [],
  indexBarrels: [],
  refactoredFiles: [],
  apiClients: [],
  typeDefinitions: [],
  testHelpers: [],
  utilHelpers: [],
  components: [],
  hooks: [],
  other: []
};

files.forEach(file => {
  if (file.includes('Modal') && !file.endsWith('Modal.tsx')) {
    categories.modalImports.push(file);
  } else if (file.includes('.refactored.') || file.includes('.old.') || file.includes('.backup.')) {
    categories.refactoredFiles.push(file);
  } else if (file.includes('/index.ts')) {
    categories.indexBarrels.push(file);
  } else if (file.endsWith('.api.ts') || file.endsWith('Api.ts')) {
    categories.apiClients.push(file);
  } else if (file.endsWith('.types.ts') || file.endsWith('.schemas.ts')) {
    categories.typeDefinitions.push(file);
  } else if (file.includes('/hooks/')) {
    categories.hooks.push(file);
  } else if (file.includes('/utils/') || file.includes('/helpers/')) {
    categories.utilHelpers.push(file);
  } else if (file.endsWith('.tsx') && !file.endsWith('Page.tsx')) {
    categories.components.push(file);
  } else {
    categories.other.push(file);
  }
});

// Print analysis
console.log('🔍 Categorization:\n');

if (categories.refactoredFiles.length > 0) {
  console.log(`🔴 OLD/REFACTORED FILES (${categories.refactoredFiles.length}) - SAFE TO DELETE`);
  categories.refactoredFiles.forEach(f => console.log(`   ${f}`));
  console.log();
}

if (categories.indexBarrels.length > 0) {
  console.log(`🟡 INDEX BARRELS (${categories.indexBarrels.length}) - LIKELY FALSE POSITIVE`);
  console.log(`   These are re-export files - their children might be used`);
  categories.indexBarrels.slice(0, 5).forEach(f => console.log(`   ${f}`));
  if (categories.indexBarrels.length > 5) console.log(`   ... and ${categories.indexBarrels.length - 5} more`);
  console.log();
}

if (categories.typeDefinitions.length > 0) {
  console.log(`🟢 TYPE FILES (${categories.typeDefinitions.length}) - FALSE POSITIVE`);
  console.log(`   Types aren't "imported" in runtime, but are used`);
  categories.typeDefinitions.slice(0, 5).forEach(f => console.log(`   ${f}`));
  if (categories.typeDefinitions.length > 5) console.log(`   ... and ${categories.typeDefinitions.length - 5} more`);
  console.log();
}

if (categories.apiClients.length > 0) {
  console.log(`🟡 API CLIENTS (${categories.apiClients.length}) - INVESTIGATE`);
  console.log(`   Check if these are called dynamically or truly unused`);
  categories.apiClients.forEach(f => console.log(`   ${f}`));
  console.log();
}

if (categories.hooks.length > 0) {
  console.log(`🟡 HOOKS (${categories.hooks.length}) - INVESTIGATE`);
  console.log(`   May be exported but not used yet`);
  categories.hooks.slice(0, 10).forEach(f => console.log(`   ${f}`));
  if (categories.hooks.length > 10) console.log(`   ... and ${categories.hooks.length - 10} more`);
  console.log();
}

if (categories.components.length > 0) {
  console.log(`🟡 COMPONENTS (${categories.components.length}) - INVESTIGATE`);
  categories.components.slice(0, 10).forEach(f => console.log(`   ${f}`));
  if (categories.components.length > 10) console.log(`   ... and ${categories.components.length - 10} more`);
  console.log();
}

if (categories.utilHelpers.length > 0) {
  console.log(`🔴 UTILS/HELPERS (${categories.utilHelpers.length}) - LIKELY DEAD`);
  categories.utilHelpers.forEach(f => console.log(`   ${f}`));
  console.log();
}

// Summary
console.log('📝 Summary:\n');
const definitelyDead = categories.refactoredFiles.length + categories.utilHelpers.length;
const likelyFalsePositive = categories.indexBarrels.length + categories.typeDefinitions.length;
const needsInvestigation = categories.apiClients.length + categories.hooks.length + categories.components.length + categories.other.length;

console.log(`🔴 Definitely Dead: ${definitelyDead} files`);
console.log(`🟢 Likely False Positive: ${likelyFalsePositive} files`);
console.log(`🟡 Needs Investigation: ${needsInvestigation} files`);
console.log(`\nTrue Dead Code Estimate: ${definitelyDead} - ${definitelyDead + Math.floor(needsInvestigation * 0.3)} files`);

