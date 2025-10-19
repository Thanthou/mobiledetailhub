#!/usr/bin/env node
/**
 * Standardize Validation Script
 * 
 * This script helps migrate from legacy validation to Zod validation
 * by identifying routes that still use the old validation system
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
 * Analyze validation usage in a file
 */
function analyzeValidationUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const analysis = {
    file: path.relative(root, filePath),
    legacyImports: [],
    zodImports: [],
    legacyUsage: [],
    zodUsage: [],
    needsMigration: false
  };
  
  // Check for legacy validation imports
  const legacyImportRegex = /import\s*{[^}]*}\s*from\s+['"]\.\.?\/.*middleware\/validation\.js['"];?/g;
  const legacyMatches = content.match(legacyImportRegex);
  if (legacyMatches) {
    analysis.legacyImports = legacyMatches;
  }
  
  // Check for Zod validation imports
  const zodImportRegex = /import\s*{[^}]*}\s*from\s+['"]\.\.?\/.*middleware\/zodValidation\.js['"];?/g;
  const zodMatches = content.match(zodImportRegex);
  if (zodMatches) {
    analysis.zodImports = zodMatches;
  }
  
  // Check for legacy validation usage
  const legacyUsageRegex = /validateBody|validateParams|validateQuery|sanitize/g;
  const legacyUsageMatches = content.match(legacyUsageRegex);
  if (legacyUsageMatches) {
    analysis.legacyUsage = legacyUsageMatches;
  }
  
  // Check for Zod validation usage
  const zodUsageRegex = /validateBody|validateParams|validateQuery/g;
  const zodUsageMatches = content.match(zodUsageRegex);
  if (zodUsageMatches) {
    analysis.zodUsage = zodUsageMatches;
  }
  
  // Determine if migration is needed
  analysis.needsMigration = (analysis.legacyImports.length > 0 || analysis.legacyUsage.length > 0) && 
                           analysis.zodImports.length === 0;
  
  return analysis;
}

/**
 * Generate migration recommendations
 */
function generateMigrationRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.needsMigration) {
    recommendations.push({
      type: 'import',
      description: 'Update imports to use Zod validation',
      current: analysis.legacyImports[0] || 'Legacy validation import',
      suggested: "import { validateBody, validateParams, validateQuery } from '../middleware/zodValidation.js';"
    });
    
    if (analysis.legacyUsage.length > 0) {
      recommendations.push({
        type: 'usage',
        description: 'Update route handlers to use Zod schemas',
        details: 'Replace legacy validation functions with Zod schema validation'
      });
    }
  }
  
  return recommendations;
}

/**
 * Main function
 */
function main() {
  log('🔍 Analyzing Validation Usage', 'bold');
  
  const backendDir = path.join(root, 'backend');
  const jsFiles = findJSFiles(backendDir);
  
  const analyses = [];
  let needsMigrationCount = 0;
  
  for (const file of jsFiles) {
    try {
      const analysis = analyzeValidationUsage(file);
      analyses.push(analysis);
      
      if (analysis.needsMigration) {
        needsMigrationCount++;
      }
    } catch (error) {
      log(`❌ Error analyzing ${file}: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Analysis Summary:`, 'bold');
  log(`📁 Total files analyzed: ${analyses.length}`, 'blue');
  log(`🔧 Files needing migration: ${needsMigrationCount}`, needsMigrationCount > 0 ? 'yellow' : 'green');
  
  // Show files that need migration
  const needsMigration = analyses.filter(a => a.needsMigration);
  
  if (needsMigration.length > 0) {
    log('\n📝 Files needing validation migration:', 'yellow');
    needsMigration.forEach(analysis => {
      log(`  - ${analysis.file}`, 'yellow');
      
      if (analysis.legacyImports.length > 0) {
        log(`    Legacy imports: ${analysis.legacyImports.length}`, 'red');
      }
      
      if (analysis.legacyUsage.length > 0) {
        log(`    Legacy usage: ${analysis.legacyUsage.length}`, 'red');
      }
      
      // Generate recommendations
      const recommendations = generateMigrationRecommendations(analysis);
      recommendations.forEach(rec => {
        log(`    💡 ${rec.description}`, 'blue');
      });
    });
  }
  
  // Show files already using Zod
  const usingZod = analyses.filter(a => a.zodImports.length > 0);
  if (usingZod.length > 0) {
    log('\n✅ Files already using Zod validation:', 'green');
    usingZod.forEach(analysis => {
      log(`  - ${analysis.file}`, 'green');
    });
  }
  
  log('\n🎯 Migration Recommendations:', 'bold');
  log('1. Update imports to use zodValidation.js instead of validation.js', 'blue');
  log('2. Replace legacy validation functions with Zod schemas', 'blue');
  log('3. Add appropriate schemas to backend/schemas/apiSchemas.js', 'blue');
  log('4. Test validation with invalid inputs to ensure proper error handling', 'blue');
  
  log('\n🎉 Validation analysis complete!', 'green');
}

// Run the script
main();
