#!/usr/bin/env node

/**
 * Import Boundary Checker
 * Enforces feature-first architecture: features can only import from @/shared or themselves
 * 
 * Usage:
 *   npm run check:boundaries
 *   npm run check:boundaries -- --fix
 */

import path from 'path';

import { findFilesSync, parseArgs, parseScriptMode, printHelp,readFile, ValidationReporter } from './_lib/index.js';

interface ImportViolation {
  file: string;
  line: number;
  import: string;
  fromFeature: string;
  toFeature: string;
}

/**
 * Extract feature name from file path
 */
function getFeatureName(filePath: string): string | null {
  const match = filePath.match(/features[/\\]([^/\\]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a file should be excluded from boundary checks
 * Page-level compositions are allowed to import from multiple features
 */
function shouldExcludeFile(filePath: string, content: string): boolean {
  // Check for eslint-disable comment for no-restricted-imports
  // This indicates intentional cross-feature imports (page compositions)
  if (content.includes('eslint-disable-next-line no-restricted-imports')) {
    return true;
  }
  
  // Exclude page composition files
  const fileName = path.basename(filePath);
  if (fileName.endsWith('Page.tsx') || filePath.includes('/pages/')) {
    return true;
  }
  
  return false;
}

/**
 * Extract imports from TypeScript/JavaScript file
 */
function extractImports(content: string): Array<{ line: number; import: string }> {
  const imports: Array<{ line: number; import: string }> = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Match: import ... from '@/features/...'
    const importMatch = line.match(/from\s+['"]@\/features\/([^'"]+)['"]/);
    if (importMatch) {
      imports.push({
        line: index + 1,
        import: importMatch[1],
      });
    }
  });
  
  return imports;
}

/**
 * Check if import is a cross-feature violation
 */
function isViolation(fromFeature: string, importPath: string): boolean {
  // Extract target feature from import path
  // e.g., "@/features/gallery/types" → "gallery"
  const match = importPath.match(/^([^/]+)/);
  if (!match) return false;
  
  const toFeature = match[1];
  
  // Importing from same feature is OK
  if (fromFeature === toFeature) return false;
  
  // Importing from _templates is OK
  if (toFeature === '_templates') return false;
  
  // Otherwise it's a violation
  return true;
}

/**
 * Find all cross-feature import violations
 */
function findViolations(): ImportViolation[] {
  const violations: ImportViolation[] = [];
  
  // Find all TS/TSX files in features
  const files = findFilesSync('**/*.{ts,tsx}', { 
    cwd: path.resolve(process.cwd(), 'src/features') 
  });
  
  files.forEach(filePath => {
    const fromFeature = getFeatureName(filePath);
    if (!fromFeature) return;
    
    const content = readFile(filePath);
    if (!content) return;
    
    // Skip page-level compositions and other excluded files
    if (shouldExcludeFile(filePath, content)) return;
    
    const imports = extractImports(content);
    
    imports.forEach(({ line, import: importPath }) => {
      if (isViolation(fromFeature, importPath)) {
        const toFeature = importPath.match(/^([^/]+)/)?.[1] || 'unknown';
        violations.push({
          file: filePath,
          line,
          import: importPath,
          fromFeature,
          toFeature,
        });
      }
    });
  });
  
  return violations;
}

/**
 * Main execution
 */
function main() {
  const args = parseArgs();
  const mode = parseScriptMode(args);
  
  if (args.flags.has('help') || args.flags.has('h')) {
    printHelp(
      'check-import-boundaries',
      'Check for cross-feature import violations',
      [
        'npm run check:boundaries',
        'npm run check:boundaries -- --verbose',
      ]
    );
    process.exit(0);
  }
  
  const reporter = new ValidationReporter();
  
  if (!mode.quiet) {
    console.log('🔍 Checking import boundaries...\n');
  }
  
  const violations = findViolations();
  
  violations.forEach(v => {
    reporter.addError(
      `${v.file}:${v.line}`,
      `Cross-feature import: feature '${v.fromFeature}' imports from '${v.toFeature}'. Extract to @/shared/** or use props/context.`
    );
  });
  
  if (!mode.quiet) {
    if (violations.length === 0) {
      console.log('✅ No cross-feature imports found!');
      console.log('   All features properly isolated.');
    } else {
      console.log(`\n📋 Found ${violations.length} cross-feature import(s):\n`);
      
      // Group by source feature
      const byFeature = violations.reduce<Record<string, ImportViolation[]>>((acc, v) => {
        if (!acc[v.fromFeature]) acc[v.fromFeature] = [];
        acc[v.fromFeature].push(v);
        return acc;
      }, {});
      
      Object.entries(byFeature).forEach(([feature, viols]) => {
        console.log(`  ${feature}/ (${viols.length} violations)`);
        viols.forEach(v => {
          console.log(`    → imports from ${v.toFeature}/ (${path.basename(v.file)}:${v.line})`);
        });
      });
      
      console.log('\n💡 Fix: Move shared code to @/shared/** or pass data via props');
    }
  }
  
  reporter.printReport(mode);
  reporter.exit();
}

main();

