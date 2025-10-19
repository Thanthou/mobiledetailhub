#!/usr/bin/env node
/**
 * Standardize Logger Imports
 * 
 * This script updates all logger imports to use the standardized config/logger.js
 * instead of the wrapper utils/logger.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all JavaScript files in the backend directory
 */
function findJSFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        files.push(...findJSFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Update logger imports in a file
 */
function updateLoggerImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file imports from utils/logger.js
  const utilsLoggerRegex = /import\s+logger\s+from\s+['"]\.\.?\/.*utils\/logger\.js['"];?\s*\n?/g;
  const matches = content.match(utilsLoggerRegex);
  
  if (!matches) {
    return false; // No changes needed
  }
  
  // Replace utils/logger.js imports with config/logger.js
  let updatedContent = content.replace(
    /import\s+logger\s+from\s+['"]\.\.?\/.*utils\/logger\.js['"];?\s*\n?/g,
    "import { logger } from '../config/logger.js';\n"
  );
  
  // Fix relative paths - count ../ to determine correct path
  const relativePathCount = (filePath.match(/\.\.\//g) || []).length;
  const configPath = '../'.repeat(relativePathCount) + 'config/logger.js';
  
  updatedContent = updatedContent.replace(
    /import\s*{\s*logger\s*}\s*from\s+['"]\.\.?\/.*config\/logger\.js['"];?\s*\n?/g,
    `import { logger } from '${configPath}';\n`
  );
  
  // Write updated content
  fs.writeFileSync(filePath, updatedContent);
  return true;
}

/**
 * Main function
 */
function main() {
  log('🔧 Standardizing Logger Imports', 'bold');
  
  const backendDir = path.join(root, 'backend');
  const jsFiles = findJSFiles(backendDir);
  
  let updatedCount = 0;
  const updatedFiles = [];
  
  for (const file of jsFiles) {
    try {
      if (updateLoggerImports(file)) {
        updatedCount++;
        updatedFiles.push(path.relative(root, file));
      }
    } catch (error) {
      log(`❌ Error updating ${file}: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Summary:`, 'bold');
  log(`✅ Updated ${updatedCount} files`, 'green');
  
  if (updatedFiles.length > 0) {
    log('\n📝 Updated files:', 'blue');
    updatedFiles.forEach(file => {
      log(`  - ${file}`, 'blue');
    });
  }
  
  log('\n🎉 Logger standardization complete!', 'green');
}

// Run the script
main();
