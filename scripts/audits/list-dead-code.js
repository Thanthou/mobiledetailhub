#!/usr/bin/env node
/**
 * List Dead Code - Extract unreachable files from flow audit reports
 * 
 * Reads the frontend flow audit reports and extracts all unreachable app files.
 * Groups them by category to help prioritize deletion.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

// Apps to check
const APPS = ['MAIN_SITE', 'TENANT_APP', 'ADMIN_APP'];

function parseUnreachableFiles(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf-8');
  const unreachableFiles = [];
  
  // Find the "Unreachable App Files" section
  const appFilesMatch = content.match(/## 🔴 Unreachable App Files \(\d+\)([\s\S]*?)(?=##|$)/);
  
  if (appFilesMatch) {
    const section = appFilesMatch[1];
    // Extract all file paths (lines starting with "- ")
    const fileMatches = section.match(/^- (.+)$/gm);
    
    if (fileMatches) {
      fileMatches.forEach(match => {
        const filePath = match.replace(/^- /, '').trim();
        unreachableFiles.push(filePath);
      });
    }
  }
  
  return unreachableFiles;
}

function categorizeFile(filePath) {
  if (filePath.includes('.refactored.')) return 'refactored';
  if (filePath.includes('.test.') || filePath.includes('.spec.')) return 'test';
  if (filePath.includes('/api/')) return 'api';
  if (filePath.includes('/hooks/')) return 'hooks';
  if (filePath.includes('/components/')) return 'components';
  if (filePath.includes('/utils/')) return 'utils';
  if (filePath.includes('/types/')) return 'types';
  if (filePath.endsWith('.types.ts')) return 'types';
  if (filePath.includes('/pages/')) return 'pages';
  if (filePath.includes('/contexts/')) return 'contexts';
  return 'other';
}

function main() {
  console.log('\n📊 Dead Code Analysis\n');
  console.log('Extracting unreachable files from flow audit reports...\n');
  
  const allUnreachable = [];
  const byApp = {};
  
  // Collect unreachable files from each app
  APPS.forEach(app => {
    const reportPath = path.join(root, 'docs/audits', `FLOW_FRONTEND_${app}.md`);
    
    if (!fs.existsSync(reportPath)) {
      console.log(`⚠️  Report not found: ${app}`);
      return;
    }
    
    const files = parseUnreachableFiles(reportPath);
    byApp[app] = files;
    allUnreachable.push(...files.map(f => ({ app, path: f })));
  });
  
  // Print summary
  console.log('═══════════════════════════════════════════════════');
  console.log('📋 Summary by App');
  console.log('═══════════════════════════════════════════════════\n');
  
  let totalCount = 0;
  APPS.forEach(app => {
    const count = byApp[app]?.length || 0;
    totalCount += count;
    const emoji = count === 0 ? '✅' : '🔴';
    console.log(`${emoji} ${app.padEnd(15)} ${count} files`);
  });
  
  console.log(`\n📊 TOTAL: ${totalCount} unreachable files\n`);
  
  // Categorize all files
  const categories = {};
  allUnreachable.forEach(({ path: filePath }) => {
    const category = categorizeFile(filePath);
    if (!categories[category]) categories[category] = [];
    categories[category].push(filePath);
  });
  
  // Print by category
  console.log('═══════════════════════════════════════════════════');
  console.log('📂 By Category');
  console.log('═══════════════════════════════════════════════════\n');
  
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1].length - a[1].length);
  
  sortedCategories.forEach(([category, files]) => {
    console.log(`🔸 ${category.toUpperCase()}: ${files.length} files`);
  });
  
  // Show refactored files (safe to delete)
  if (categories.refactored) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🗑️  Safe to Delete: Refactored Files');
    console.log('═══════════════════════════════════════════════════\n');
    
    categories.refactored.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    console.log(`\n💡 These ${categories.refactored.length} files have ".refactored." in name - safe to delete!\n`);
  }
  
  // Print detailed lists by app
  console.log('═══════════════════════════════════════════════════');
  console.log('📄 Detailed Lists');
  console.log('═══════════════════════════════════════════════════\n');
  
  APPS.forEach(app => {
    const files = byApp[app] || [];
    if (files.length === 0) {
      console.log(`✅ ${app}: No unreachable files\n`);
      return;
    }
    
    console.log(`\n🔴 ${app} (${files.length} files)\n`);
    console.log('See full list in:', `docs/audits/FLOW_FRONTEND_${app}.md\n`);
  });
  
  // Export to JSON for programmatic use
  const outputPath = path.join(root, 'docs/audits/unreachable-files.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: totalCount,
    byApp,
    byCategory: Object.fromEntries(
      Object.entries(categories).map(([cat, files]) => [cat, files.length])
    ),
    files: allUnreachable
  }, null, 2));
  
  console.log(`\n💾 Full list exported to: ${path.relative(root, outputPath)}\n`);
}

main();

