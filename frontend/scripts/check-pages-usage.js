#!/usr/bin/env node
/* eslint-env node */

/**
 * Script to check for any remaining imports from the pages directory
 * Run this to ensure all code is using features instead of pages
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = 'src';

// File extensions to check
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Patterns that indicate pages directory usage
const PAGES_PATTERNS = [
  /from ['"]@\/pages\//g,
  /from ['"]\.\.\/pages\//g,
  /from ['"]\.\/pages\//g,
  /import.*['"]@\/pages\//g,
  /import.*['"]\.\.\/pages\//g,
  /import.*['"]\.\/pages\//g,
];

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (FILE_EXTENSIONS.includes(extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFileForPagesUsage(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const issues = [];
    
    PAGES_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            line: content.substring(0, content.indexOf(match)).split('\n').length,
            match,
            pattern: index
          });
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  console.log('🔍 Checking for pages directory usage...\n');
  
  const allFiles = getAllFiles(SRC_DIR);
  const issues = [];
  
  allFiles.forEach(file => {
    const fileIssues = checkFileForPagesUsage(file);
    if (fileIssues.length > 0) {
      issues.push({
        file,
        issues: fileIssues
      });
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ No pages directory usage found! All code is using features.');
    process.exit(0);
  }
  
  console.log(`❌ Found ${issues.length} files still using pages directory:\n`);
  
  issues.forEach(({ file, issues: fileIssues }) => {
    console.log(`📁 ${file}`);
    fileIssues.forEach(({ line, match }) => {
      console.log(`   Line ${line}: ${match}`);
    });
    console.log('');
  });
  
  console.log('💡 To fix these issues:');
  console.log('   1. Replace @/pages/ imports with @/features/');
  console.log('   2. Update relative imports to use @ alias');
  console.log('   3. Run this script again to verify fixes');
  
  process.exit(1);
}

main();
