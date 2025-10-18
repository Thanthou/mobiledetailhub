/**
 * Shared CLI Utilities for Scripts
 * Standardized argument parsing, flags, and output formatting
 */

/* eslint-disable no-console -- CLI utilities require console output */

import path from 'node:path';

/**
 * Parse command line arguments
 */
export interface ParsedArgs {
  flags: Set<string>;
  options: Map<string, string>;
  positional: string[];
}

export function parseArgs(argv: string[] = process.argv.slice(2)): ParsedArgs {
  const flags = new Set<string>();
  const options = new Map<string, string>();
  const positional: string[] = [];
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      
      // Check if next arg is a value
      if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        options.set(flagName, argv[i + 1]);
        i++; // Skip next arg
      } else {
        flags.add(flagName);
      }
    } else if (arg.startsWith('-')) {
      flags.add(arg.slice(1));
    } else {
      positional.push(arg);
    }
  }
  
  return { flags, options, positional };
}

/**
 * Check if flag is present
 */
export function hasFlag(args: ParsedArgs, ...names: string[]): boolean {
  return names.some(name => args.flags.has(name));
}

/**
 * Get option value
 */
export function getOption(args: ParsedArgs, name: string, defaultValue?: string): string | undefined {
  return args.options.get(name) || defaultValue;
}

/**
 * Standard script modes
 */
export interface ScriptMode {
  check: boolean;  // --check: Validate only, no changes
  fix: boolean;    // --fix: Auto-fix issues
  verbose: boolean; // --verbose: Detailed output
  quiet: boolean;  // --quiet: Minimal output
  dryRun: boolean; // --dry-run: Show what would happen
}

/**
 * Parse standard script flags
 */
export function parseScriptMode(args: ParsedArgs): ScriptMode {
  return {
    check: hasFlag(args, 'check', 'c'),
    fix: hasFlag(args, 'fix', 'f'),
    verbose: hasFlag(args, 'verbose', 'v'),
    quiet: hasFlag(args, 'quiet', 'q'),
    dryRun: hasFlag(args, 'dry-run', 'n'),
  };
}

/**
 * Validation result tracker
 */
export class ValidationReporter {
  private errors: Array<{ file: string; message: string }> = [];
  private warnings: Array<{ file: string; message: string }> = [];
  private fixed: Array<{ file: string; message: string }> = [];
  private filesChecked = 0;
  
  addError(file: string, message: string): void {
    this.errors.push({ file, message });
  }
  
  addWarning(file: string, message: string): void {
    this.warnings.push({ file, message });
  }
  
  addFix(file: string, message: string): void {
    this.fixed.push({ file, message });
  }
  
  incrementChecked(): void {
    this.filesChecked++;
  }
  
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  
  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
  
  getErrorCount(): number {
    return this.errors.length;
  }
  
  getWarningCount(): number {
    return this.warnings.length;
  }
  
  /**
   * Print summary report
   */
  printReport(mode: ScriptMode): void {
    if (!mode.quiet) {
      console.log('\n' + '='.repeat(60));
      console.log(`📊 Validation Report`);
      console.log('='.repeat(60));
      console.log(`Files checked: ${this.filesChecked}`);
      console.log(`Errors: ${this.errors.length}`);
      console.log(`Warnings: ${this.warnings.length}`);
      if (mode.fix) {
        console.log(`Fixed: ${this.fixed.length}`);
      }
      console.log('='.repeat(60));
    }
    
    // Print errors
    if (this.errors.length > 0) {
      console.error('\n❌ ERRORS:');
      this.errors.forEach(({ file, message }) => {
        console.error(`  ${file}`);
        console.error(`    ${message}`);
      });
    }
    
    // Print warnings (if verbose or if there are errors)
    if (this.warnings.length > 0 && (mode.verbose || this.errors.length > 0)) {
      console.warn('\n⚠️  WARNINGS:');
      this.warnings.forEach(({ file, message }) => {
        console.warn(`  ${file}`);
        console.warn(`    ${message}`);
      });
    }
    
    // Print fixes
    if (this.fixed.length > 0 && mode.verbose) {
      console.log('\n✅ FIXED:');
      this.fixed.forEach(({ file, message }) => {
        console.log(`  ${file}`);
        console.log(`    ${message}`);
      });
    }
    
    // Final status
    if (!mode.quiet) {
      console.log('');
      if (this.errors.length === 0) {
        console.log('✅ All checks passed!');
      } else {
        console.error(`❌ Found ${this.errors.length} error(s)`);
      }
    }
  }
  
  /**
   * Exit with appropriate code
   */
  exit(): never {
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

/**
 * Print help message
 */
export function printHelp(scriptName: string, description: string, usage: string[]): void {
  console.log(`
${scriptName}
${description}

Usage:
${usage.map(u => `  ${u}`).join('\n')}

Options:
  --check, -c     Validate only (no changes)
  --fix, -f       Auto-fix issues
  --verbose, -v   Detailed output
  --quiet, -q     Minimal output
  --dry-run, -n   Show what would happen
  --help, -h      Show this help
`);
}

/**
 * Format file path for output (relative to cwd)
 */
export function formatPath(absolutePath: string): string {
  const cwd = process.cwd();
  const relative = path.relative(cwd, absolutePath);
  return relative.startsWith('..') ? absolutePath : relative;
}

/* eslint-enable no-console -- Re-enable no-console rule after CLI utilities section */
