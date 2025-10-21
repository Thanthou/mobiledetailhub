#!/usr/bin/env node

/**
 * Fix Import Aliases
 * 
 * Replaces incorrect import aliases:
 * - @/tenant-app/ → @tenant-app/
 * - @/admin-app/ → @admin-app/
 * - @/main-site/ → @main-site/
 */

const fs = require('fs');
const path = require('path');

const patterns = [
  { from: /@\/tenant-app\//g, to: '@tenant-app/' },
  { from: /@\/admin-app\//g, to: '@admin-app/' },
  { from: /@\/main-site\//g, to: '@main-site/' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { from, to } of patterns) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    return 1;
  }

  return 0;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

console.log('🔧 Fixing import aliases...\n');

const frontendDir = path.join(__dirname, '../../frontend');
const files = walkDir(frontendDir);

let fixedCount = 0;
for (const file of files) {
  fixedCount += fixFile(file);
}

console.log(`\n✅ Fixed ${fixedCount} files`);

