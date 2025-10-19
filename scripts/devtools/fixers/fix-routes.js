#!/usr/bin/env node
/**
 * Unified Route Fixer
 * Consolidates all route fixing functionality with CLI modes
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.resolve(__dirname, '../../../backend/routes');

const results = {
  processed: 0,
  fixed: 0,
  errors: 0,
  details: []
};

// Fix patterns
const fixes = {
  // Convert require() to import statements
  requireToImport: {
    pattern: /const\s+\{[^}]+\}\s*=\s*require\(['"]([^'"]+)['"]\)/g,
    replacement: (match, modulePath) => {
      const importPath = modulePath.startsWith('.') ? modulePath : `../${modulePath}`;
      return `import { ${match.match(/\{([^}]+)\}/)[1]} } from '${importPath}';`;
    },
    description: 'Convert require() to import statements'
  },

  // Fix inconsistent logging
  inconsistentLogging: {
    pattern: /console\.(log|error|warn)\(/g,
    replacement: 'logger.$1(',
    description: 'Replace console.* with logger.*'
  },

  // Fix missing error handling
  missingErrorHandling: {
    pattern: /(\w+)\.query\([^)]+\)(?!\s*\.catch)/g,
    replacement: '$1.query($2).catch(error => {\n      logger.error(\'Database query failed:\', error);\n      throw error;\n    })',
    description: 'Add error handling to database queries'
  },

  // Fix disabled validation
  disabledValidation: {
    pattern: /\/\/\s*validation\.validate/g,
    replacement: 'validation.validate',
    description: 'Re-enable disabled validation'
  },

  // Fix legacy pool import
  legacyPoolImport: {
    pattern: /const\s+pool\s*=\s*require\(['"]\.\.\/database\/pool['"]\)/g,
    replacement: "import { getPool } from '../database/pool.js';",
    description: 'Update pool import to ES modules'
  },

  // Fix inconsistent responses
  inconsistentResponses: {
    pattern: /res\.json\(\{[\s\S]*?\}\)/g,
    replacement: (match) => {
      // Standardize response format
      return match.replace(/\{([\s\S]*?)\}/, (innerMatch, content) => {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const standardized = lines.map(line => {
          if (line.includes('success:')) return '  success: true,';
          if (line.includes('message:')) return '  message: "Operation completed successfully",';
          if (line.includes('data:')) return '  data: result.rows,';
          return line;
        });
        return `{\n${standardized.join('\n')}\n}`;
      });
    },
    description: 'Standardize response format'
  }
};

async function fixRouteFile(filePath, mode = 'express') {
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    const appliedFixes = [];

    // Apply fixes based on mode
    const fixesToApply = getFixesForMode(mode);
    
    for (const [fixName, fix] of Object.entries(fixesToApply)) {
      const beforeLength = content.length;
      content = content.replace(fix.pattern, fix.replacement);
      
      if (content.length !== beforeLength) {
        modified = true;
        appliedFixes.push(fix.description);
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(chalk.green(`✅ Fixed ${fileName}`));
      console.log(chalk.gray(`   Applied: ${appliedFixes.join(', ')}`));
      results.fixed++;
    } else {
      console.log(chalk.gray(`⚪ No fixes needed for ${fileName}`));
    }

    results.processed++;
    results.details.push({
      file: relativePath,
      fixed: modified,
      fixes: appliedFixes
    });

  } catch (error) {
    console.log(chalk.red(`❌ Error fixing ${fileName}: ${error.message}`));
    results.errors++;
    results.details.push({
      file: relativePath,
      fixed: false,
      error: error.message
    });
  }
}

function getFixesForMode(mode) {
  const modeFixes = {
    express: {
      requireToImport: fixes.requireToImport,
      inconsistentLogging: fixes.inconsistentLogging,
      missingErrorHandling: fixes.missingErrorHandling
    },
    final: {
      requireToImport: fixes.requireToImport,
      inconsistentLogging: fixes.inconsistentLogging,
      missingErrorHandling: fixes.missingErrorHandling,
      disabledValidation: fixes.disabledValidation,
      legacyPoolImport: fixes.legacyPoolImport
    },
    remaining: {
      requireToImport: fixes.requireToImport,
      inconsistentLogging: fixes.inconsistentLogging,
      missingErrorHandling: fixes.missingErrorHandling,
      disabledValidation: fixes.disabledValidation,
      legacyPoolImport: fixes.legacyPoolImport,
      inconsistentResponses: fixes.inconsistentResponses
    }
  };

  return modeFixes[mode] || modeFixes.express;
}

async function scanRouteFiles() {
  const files = [];
  
  try {
    const entries = await fs.readdir(routesDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(routesDir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await scanDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.js') && !entry.name.includes('.test.')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ Error scanning routes directory: ${error.message}`));
    return [];
  }
  
  return files;
}

async function scanDirectory(dirPath) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await scanDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.js') && !entry.name.includes('.test.')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directory read errors
  }
  
  return files;
}

function showHelp() {
  console.log(chalk.blue.bold('🔧 Route Fixer\n'));
  console.log(chalk.gray('Usage: node scripts/devtools/fixers/fix-routes.js [options]\n'));
  
  console.log(chalk.yellow('Options:'));
  console.log(chalk.white('  --mode=<mode>     Fix mode: express, final, remaining (default: express)'));
  console.log(chalk.white('  --dry-run         Show what would be fixed without making changes'));
  console.log(chalk.white('  --help            Show this help message\n'));
  
  console.log(chalk.yellow('Modes:'));
  console.log(chalk.white('  express           Basic fixes: require→import, logging, error handling'));
  console.log(chalk.white('  final             Express + validation, pool imports'));
  console.log(chalk.white('  remaining         All fixes including response standardization\n'));
  
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  node scripts/devtools/fixers/fix-routes.js --mode=express'));
  console.log(chalk.gray('  node scripts/devtools/fixers/fix-routes.js --mode=final --dry-run'));
  console.log(chalk.gray('  node scripts/devtools/fixers/fix-routes.js --mode=remaining'));
}

function generateReport() {
  console.log(chalk.blue.bold('\n📊 Route Fix Report\n'));
  
  console.log(chalk.green(`✅ Files processed: ${results.processed}`));
  console.log(chalk.green(`🔧 Files fixed: ${results.fixed}`));
  if (results.errors > 0) {
    console.log(chalk.red(`❌ Errors: ${results.errors}`));
  }

  if (results.details.length > 0) {
    console.log(chalk.blue('\n📋 Details:\n'));
    
    results.details.forEach(detail => {
      if (detail.fixed) {
        console.log(chalk.green(`✅ ${detail.file}`));
        if (detail.fixes.length > 0) {
          console.log(chalk.gray(`   Applied: ${detail.fixes.join(', ')}`));
        }
      } else if (detail.error) {
        console.log(chalk.red(`❌ ${detail.file} - ${detail.error}`));
      } else {
        console.log(chalk.gray(`⚪ ${detail.file} - No fixes needed`));
      }
    });
  }

  return results.errors === 0;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'express';
  const dryRun = args.includes('--dry-run');

  console.log(chalk.blue.bold('🔧 Route Fixer Starting...\n'));
  console.log(chalk.yellow(`Mode: ${mode}`));
  if (dryRun) {
    console.log(chalk.yellow('Dry run mode - no changes will be made\n'));
  }

  // Validate mode
  if (!['express', 'final', 'remaining'].includes(mode)) {
    console.log(chalk.red(`❌ Invalid mode: ${mode}. Use --help to see available modes.`));
    process.exit(1);
  }

  // Scan for route files
  console.log(chalk.blue('📁 Scanning route files...\n'));
  const files = await scanRouteFiles();
  
  if (files.length === 0) {
    console.log(chalk.yellow('⚠️  No route files found'));
    process.exit(0);
  }

  console.log(chalk.green(`Found ${files.length} route files\n`));

  // Process files
  for (const filePath of files) {
    if (dryRun) {
      // In dry run mode, just analyze without fixing
      console.log(chalk.cyan(`🔍 Analyzing ${path.basename(filePath)}...`));
      // Analysis logic would go here
    } else {
      await fixRouteFile(filePath, mode);
    }
  }

  // Generate report
  const success = generateReport();

  if (dryRun) {
    console.log(chalk.yellow('\n🔍 Dry run completed - no changes were made'));
  } else if (success) {
    console.log(chalk.green('\n✅ Route fixing completed successfully!'));
  } else {
    console.log(chalk.red('\n❌ Route fixing completed with errors'));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Route fixer failed:'), error);
  process.exit(1);
});
