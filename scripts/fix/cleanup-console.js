#!/usr/bin/env node
/**
 * Console Cleanup Script
 * Replaces console.log/error/warn with proper logger usage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.resolve(__dirname, '../../backend');

// Files to process (excluding node_modules, tests, scripts)
const filesToProcess = [
  'backend/config/env.async.js',
  'backend/config/env.js', 
  'backend/controllers/tenantController.js',
  'backend/database/pool.async.js',
  'backend/database/pool.js',
  'backend/middleware/withTenant.js',
  'backend/services/stripeService.js',
  'backend/services/tenantProvisionService.js',
  'backend/utils/avatarUtils.js',
  'backend/utils/errorMonitor.js'
];

// Console patterns to replace
const consolePatterns = [
  {
    pattern: /console\.log\(/g,
    replacement: 'logger.info('
  },
  {
    pattern: /console\.error\(/g,
    replacement: 'logger.error('
  },
  {
    pattern: /console\.warn\(/g,
    replacement: 'logger.warn('
  },
  {
    pattern: /console\.info\(/g,
    replacement: 'logger.info('
  }
];

function addLoggerImport(content, filePath) {
  // Check if logger is already imported
  if (content.includes('createModuleLogger') || content.includes('logger')) {
    return content;
  }

  // Add logger import at the top
  const loggerImport = "import { createModuleLogger } from '../config/logger.js';\nconst logger = createModuleLogger('" + 
    path.basename(filePath, '.js') + "');\n\n";
  
  // Find the first import statement
  const importMatch = content.match(/^import\s+.*$/m);
  if (importMatch) {
    return content.replace(importMatch[0], importMatch[0] + '\n' + loggerImport);
  } else {
    // No imports found, add at the beginning
    return loggerImport + content;
  }
}

function processFile(filePath) {
  const fullPath = path.resolve(__dirname, '../../', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file has console statements
  const hasConsole = /console\.(log|error|warn|info)\(/.test(content);
  if (!hasConsole) {
    console.log(`✅ No console statements in ${filePath}`);
    return false;
  }

  // Add logger import if needed
  const originalContent = content;
  content = addLoggerImport(content, filePath);
  if (content !== originalContent) {
    modified = true;
  }

  // Replace console statements
  for (const { pattern, replacement } of consolePatterns) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated ${filePath}`);
    return true;
  } else {
    console.log(`⚠️  No changes made to ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🧹 Starting Console Cleanup...\n');

  let processed = 0;
  let updated = 0;

  for (const file of filesToProcess) {
    processed++;
    if (processFile(file)) {
      updated++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processed}`);
  console.log(`   Files updated: ${updated}`);
  console.log(`   Files unchanged: ${processed - updated}`);
  
  if (updated > 0) {
    console.log(`\n✅ Console cleanup completed! Run 'npm run overview' to see improvements.`);
  } else {
    console.log(`\n✅ No console statements found in target files.`);
  }
}

main();
