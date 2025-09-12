#!/usr/bin/env node

/**
 * Script to find button patterns that can be refactored to use shared Button component
 */

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all TypeScript/TSX files
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Patterns to look for
const buttonPatterns = [
  {
    name: 'Inline button with className',
    pattern: /<button[^>]*className[^>]*>/g,
    description: 'Buttons with custom className that could use shared Button'
  },
  {
    name: 'Button with bg- and hover- classes',
    pattern: /<button[^>]*className[^>]*(?:bg-|hover:bg-)[^>]*>/g,
    description: 'Buttons with background styling that could use Button variants'
  },
  {
    name: 'Button with px- and py- classes',
    pattern: /<button[^>]*className[^>]*(?:px-|py-)[^>]*>/g,
    description: 'Buttons with padding that could use Button sizes'
  },
  {
    name: 'Button with rounded classes',
    pattern: /<button[^>]*className[^>]*rounded[^>]*>/g,
    description: 'Buttons with border radius that could use Button styling'
  }
];

// Analyze files
function analyzeFiles() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findTsxFiles(srcDir);
  
  console.log(`🔍 Analyzing ${files.length} TypeScript files for button patterns...\n`);
  
  const results = {
    totalFiles: files.length,
    filesWithButtons: 0,
    totalButtons: 0,
    patterns: {}
  };
  
  // Initialize pattern counts
  buttonPatterns.forEach(pattern => {
    results.patterns[pattern.name] = {
      count: 0,
      files: []
    };
  });
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let fileHasButtons = false;
      let fileButtonCount = 0;
      
      // Check for any button patterns
      buttonPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          fileHasButtons = true;
          fileButtonCount += matches.length;
          results.patterns[pattern.name].count += matches.length;
          results.patterns[pattern.name].files.push({
            file: path.relative(srcDir, file),
            count: matches.length
          });
        }
      });
      
      if (fileHasButtons) {
        results.filesWithButtons++;
        results.totalButtons += fileButtonCount;
      }
    } catch (error) {
      console.warn(`⚠️  Error reading ${file}: ${error.message}`);
    }
  }
  
  return results;
}

// Generate report
function generateReport(results) {
  console.log('📊 BUTTON REFACTORING ANALYSIS REPORT');
  console.log('=====================================\n');
  
  console.log(`📁 Total files analyzed: ${results.totalFiles}`);
  console.log(`🔘 Files with buttons: ${results.filesWithButtons}`);
  console.log(`🔘 Total button instances: ${results.totalButtons}\n`);
  
  console.log('🎯 REFACTORING OPPORTUNITIES:\n');
  
  Object.entries(results.patterns).forEach(([patternName, data]) => {
    if (data.count > 0) {
      console.log(`📌 ${patternName}: ${data.count} instances`);
      console.log(`   ${buttonPatterns.find(p => p.name === patternName)?.description || ''}`);
      
      if (data.files.length > 0) {
        console.log('   Files (sorted by button count):');
        // Sort by button count descending
        const sortedFiles = data.files.sort((a, b) => b.count - a.count);
        sortedFiles.slice(0, 15).forEach(file => {
          console.log(`   - ${file.file} (${file.count} buttons)`);
        });
        if (data.files.length > 15) {
          console.log(`   ... and ${data.files.length - 15} more files`);
        }
      }
      console.log('');
    }
  });
  
  console.log('🚀 NEXT STEPS:');
  console.log('1. Start with files that have the most button instances');
  console.log('2. Focus on commonly used components first');
  console.log('3. Test each refactoring to ensure visual consistency');
  console.log('4. Update imports to use @/shared/ui');
}

// Main execution
try {
  const results = analyzeFiles();
  generateReport(results);
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
  process.exit(1);
}
