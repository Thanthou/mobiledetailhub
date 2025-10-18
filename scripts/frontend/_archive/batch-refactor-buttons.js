#!/usr/bin/env node

/**
 * Batch Button Refactoring Script
 * Automatically converts common button patterns to use shared Button component
 */

/* eslint-env node */
/* eslint no-console: "off" */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to skip (already refactored manually)
const SKIP_FILES = [
  'MultiTierPricingModal.tsx',
  'BookingPage.tsx', 
  'QuickActions.tsx',
  'GoogleBusinessProfileModal.tsx',
  'LoginModal.tsx',
  'CTAButton.tsx',
  'ServiceHero.tsx',
  'ScheduleSidebar.tsx',
  'UsersTab.tsx'
];

// Common button patterns to refactor
const BUTTON_PATTERNS = [
  {
    name: 'Primary Button with bg-blue',
    pattern: /<button\s+([^>]*?)className="([^"]*?)bg-blue-600[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      const iconMatch = cleanContent.match(/<([^>]+)\s+className="[^"]*?"\s*\/>([^<]*)/);
      
      if (iconMatch) {
        const iconElement = iconMatch[1];
        const textContent = iconMatch[2].trim();
        return `<Button\n        ${beforeClass.trim()}\n        variant="primary"\n        size="md"\n        className="${className.replace(/bg-blue-600[^"]*/, 'bg-blue-600 hover:bg-blue-700')}"\n        leftIcon={<${iconElement} />}\n        ${afterClass.trim()}\n      >\n        ${textContent}\n      </Button>`;
      }
      
      return `<Button\n        ${beforeClass.trim()}\n        variant="primary"\n        size="md"\n        className="${className.replace(/bg-blue-600[^"]*/, 'bg-blue-600 hover:bg-blue-700')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  },
  {
    name: 'Secondary Button with bg-gray',
    pattern: /<button\s+([^>]*?)className="([^"]*?)bg-gray-600[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      return `<Button\n        ${beforeClass.trim()}\n        variant="secondary"\n        size="md"\n        className="${className.replace(/bg-gray-600[^"]*/, 'bg-gray-600 hover:bg-gray-700')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  },
  {
    name: 'Ghost Button with text-gray',
    pattern: /<button\s+([^>]*?)className="([^"]*?)text-gray-400[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      const iconMatch = cleanContent.match(/<([^>]+)\s+className="[^"]*?"\s*\/>([^<]*)/);
      
      if (iconMatch) {
        const iconElement = iconMatch[1];
        const textContent = iconMatch[2].trim();
        return `<Button\n        ${beforeClass.trim()}\n        variant="ghost"\n        size="sm"\n        className="${className.replace(/text-gray-400[^"]*/, 'text-gray-400 hover:text-white')}"\n        leftIcon={<${iconElement} />}\n        ${afterClass.trim()}\n      >\n        ${textContent}\n      </Button>`;
      }
      
      return `<Button\n        ${beforeClass.trim()}\n        variant="ghost"\n        size="sm"\n        className="${className.replace(/text-gray-400[^"]*/, 'text-gray-400 hover:text-white')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  },
  {
    name: 'Orange Button with bg-orange',
    pattern: /<button\s+([^>]*?)className="([^"]*?)bg-orange-500[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      return `<Button\n        ${beforeClass.trim()}\n        variant="primary"\n        size="md"\n        className="${className.replace(/bg-orange-500[^"]*/, 'bg-orange-500 hover:bg-orange-600')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  },
  {
    name: 'Green Button with bg-green',
    pattern: /<button\s+([^>]*?)className="([^"]*?)bg-green-500[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      return `<Button\n        ${beforeClass.trim()}\n        variant="primary"\n        size="md"\n        className="${className.replace(/bg-green-500[^"]*/, 'bg-green-500 hover:bg-green-600')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  },
  {
    name: 'Red Button with bg-red',
    pattern: /<button\s+([^>]*?)className="([^"]*?)bg-red-500[^"]*?"([^>]*?)>([^<]*?)<\/button>/gs,
    replacement: (match, beforeClass, className, afterClass, content) => {
      const cleanContent = content.trim();
      return `<Button\n        ${beforeClass.trim()}\n        variant="destructive"\n        size="md"\n        className="${className.replace(/bg-red-500[^"]*/, 'bg-red-500 hover:bg-red-600')}"\n        ${afterClass.trim()}\n      >\n        ${cleanContent}\n      </Button>`;
    }
  }
];

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

// Check if file should be skipped
function shouldSkipFile(filePath) {
  const fileName = path.basename(filePath);
  return SKIP_FILES.some(skipFile => fileName.includes(skipFile));
}

// Add Button import if not present
function addButtonImport(content) {
  if (content.includes("import { Button } from '@/shared/ui'") || 
      content.includes("import { Button } from '@/shared'")) {
    return content;
  }
  
  // Find the last import statement
  const importRegex = /^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertIndex = lastImportIndex + lastImport.length;
    
    return content.slice(0, insertIndex) + 
           "\nimport { Button } from '@/shared/ui';\n" + 
           content.slice(insertIndex);
  }
  
  // If no imports found, add at the top after React imports
  const reactImportRegex = /^import\s+React[^;]*;?\s*$/m;
  const reactImportMatch = content.match(reactImportRegex);
  
  if (reactImportMatch) {
    const insertIndex = reactImportMatch.index + reactImportMatch[0].length;
    return content.slice(0, insertIndex) + 
           "\nimport { Button } from '@/shared/ui';\n" + 
           content.slice(insertIndex);
  }
  
  // Fallback: add at the beginning
  return "import { Button } from '@/shared/ui';\n" + content;
}

// Refactor a single file
function refactorFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let changes = 0;
    
    // Apply each pattern
    BUTTON_PATTERNS.forEach(pattern => {
      const matches = newContent.match(pattern.pattern);
      if (matches) {
        newContent = newContent.replace(pattern.pattern, pattern.replacement);
        changes += matches.length;
      }
    });
    
    // Add Button import if changes were made
    if (changes > 0) {
      newContent = addButtonImport(newContent);
    }
    
    // Write back if changes were made
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return { success: true, changes, file: path.relative(process.cwd(), filePath) };
    }
    
    return { success: true, changes: 0, file: path.relative(process.cwd(), filePath) };
  } catch (error) {
    return { success: false, error: error.message, file: path.relative(process.cwd(), filePath) };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting batch button refactoring...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findTsxFiles(srcDir);
  
  console.log(`📁 Found ${files.length} TypeScript files`);
  
  const results = {
    total: 0,
    processed: 0,
    changed: 0,
    errors: 0,
    totalChanges: 0
  };
  
  for (const file of files) {
    results.total++;
    
    if (shouldSkipFile(file)) {
      console.log(`⏭️  Skipping ${path.relative(process.cwd(), file)} (already refactored)`);
      continue;
    }
    
    results.processed++;
    const result = refactorFile(file);
    
    if (result.success) {
      if (result.changes > 0) {
        results.changed++;
        results.totalChanges += result.changes;
        console.log(`✅ ${result.file} - ${result.changes} buttons refactored`);
      } else {
        console.log(`⚪ ${result.file} - no buttons found`);
      }
    } else {
      results.errors++;
      console.log(`❌ ${result.file} - error: ${result.error}`);
    }
  }
  
  console.log('\n📊 REFACTORING SUMMARY:');
  console.log('========================');
  console.log(`📁 Total files: ${results.total}`);
  console.log(`⚙️  Processed: ${results.processed}`);
  console.log(`✅ Changed: ${results.changed}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`🔘 Total buttons refactored: ${results.totalChanges}`);
  
  if (results.errors > 0) {
    console.log('\n⚠️  Some files had errors. Check the output above for details.');
  } else {
    console.log('\n🎉 All files processed successfully!');
  }
  
  console.log('\n🔍 Next steps:');
  console.log('1. Review the changes to ensure they look correct');
  console.log('2. Test the application to verify buttons work properly');
  console.log('3. Run linting to check for any issues');
  console.log('4. Commit the changes when satisfied');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
