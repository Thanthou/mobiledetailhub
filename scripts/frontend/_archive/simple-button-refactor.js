#!/usr/bin/env node

/**
 * Simple Button Refactoring Script
 */

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

// Simple button pattern replacement
function refactorFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Skip if already has Button import
    if (content.includes("import { Button } from '@/shared/ui'")) {
      return { success: true, changes: 0, file: path.relative(process.cwd(), filePath) };
    }
    
    // Simple pattern: button with bg-blue-600
    const blueButtonPattern = /<button\s+([^>]*?)className="([^"]*?)bg-blue-600[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs;
    const blueMatches = content.match(blueButtonPattern);
    if (blueMatches) {
      content = content.replace(blueButtonPattern, (match, beforeClass, className, afterClass, content) => {
        changes++;
        return `<Button\n        ${beforeClass.trim()}\n        variant="primary"\n        size="md"\n        className="${className}"\n        ${afterClass.trim()}\n      >\n        ${content.trim()}\n      </Button>`;
      });
    }
    
    // Add Button import if changes were made
    if (changes > 0) {
      // Find the last import statement
      const importRegex = /^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertIndex) + 
                 "\nimport { Button } from '@/shared/ui';\n" + 
                 content.slice(insertIndex);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return { success: true, changes, file: path.relative(process.cwd(), filePath) };
  } catch (error) {
    return { success: false, error: error.message, file: path.relative(process.cwd(), filePath) };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting simple button refactoring...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findTsxFiles(srcDir);
  
  console.log(`📁 Found ${files.length} TypeScript files`);
  
  let processed = 0;
  let changed = 0;
  let totalChanges = 0;
  
  for (const file of files) {
    const result = refactorFile(file);
    processed++;
    
    if (result.success) {
      if (result.changes > 0) {
        changed++;
        totalChanges += result.changes;
        console.log(`✅ ${result.file} - ${result.changes} buttons refactored`);
      }
    } else {
      console.log(`❌ ${result.file} - error: ${result.error}`);
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`📁 Total files: ${files.length}`);
  console.log(`⚙️  Processed: ${processed}`);
  console.log(`✅ Changed: ${changed}`);
  console.log(`🔘 Total buttons refactored: ${totalChanges}`);
}

main();
