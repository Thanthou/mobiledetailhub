#!/usr/bin/env node

/**
 * List Audit Commands
 * 
 * Displays all available audit commands from package.json
 * Makes it easy to discover and run audits
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../..');

// Read package.json
const packageJsonPath = join(rootDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Extract all audit commands
const auditCommands = Object.entries(packageJson.scripts)
  .filter(([key]) => key.startsWith('audit:'))
  .sort(([a], [b]) => a.localeCompare(b));

// Display header
console.log('\n' + chalk.cyan('═'.repeat(70)));
console.log(chalk.cyan.bold('  📋 Available Audit Commands'));
console.log(chalk.cyan('═'.repeat(70)) + '\n');

// Display commands in a clean two-column format
auditCommands.forEach(([command, script]) => {
  const shortCommand = command.replace('audit:', '');
  const description = getCommandDescription(shortCommand);
  
  console.log(`${chalk.yellow(shortCommand.padEnd(22))}${chalk.white(description)}`);
});

// Display footer
console.log('\n' + chalk.cyan('═'.repeat(70)) + '\n');

/**
 * Get human-readable description for each audit command
 */
function getCommandDescription(command) {
  const descriptions = {
    'list': 'Show all available audit commands (this list)',
    'all': 'Run all available audits',
    'env': 'Check environment variables and configuration',
    'schema': 'Validate database schema and migrations',
    'routes': 'Analyze backend API routes and endpoints',
    'routing': 'Check frontend routing configuration',
    'performance': 'Measure app performance metrics',
    'seo': 'Validate SEO configuration and meta tags',
    'schema-validation': 'Validate JSON-LD schemas',
    'overview': 'Generate project overview report',
    'db': 'Check database connections and health',
    'depends': 'Analyze dependency health and vulnerabilities',
  };
  
  return descriptions[command] || 'Run audit script';
}

