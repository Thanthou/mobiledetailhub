#!/usr/bin/env node
/**
 * Unified CLI Tool
 * Central command-line interface for all development utilities
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();
const scriptsDir = path.join(root, 'scripts');

// Available commands
const commands = {
  // Admin management
  'create-admin': {
    script: 'devtools/cli/create-admin.js',
    description: 'Create a new admin user',
    args: ['--email', '--password']
  },
  'create-tenant': {
    script: 'devtools/cli/create-main-tenant.js',
    description: 'Create a new tenant',
    args: ['--name', '--industry', '--email']
  },
  'reset-admin': {
    script: 'devtools/cli/reset-admin.js',
    description: 'Reset admin password',
    args: ['--email']
  },
  'reset-password': {
    script: 'devtools/cli/reset-admin-password.js',
    description: 'Reset admin password with new password',
    args: ['--email', '--password']
  },

  // Development utilities
  'find-port': {
    script: 'devtools/cli/find-free-port.js',
    description: 'Find available port for frontend',
    args: []
  },
  'start-frontend': {
    script: 'devtools/cli/start-frontend.js',
    description: 'Start frontend development server',
    args: ['--port']
  },
  'dev-monitor': {
    script: 'devtools/cli/dev-monitor.js',
    description: 'Start development monitoring',
    args: []
  },

  // Database utilities
  'db-audit': {
    script: 'backend/db-audit.js',
    description: 'Comprehensive database audit',
    args: ['--quick', '--deep', '--fix']
  },
  'repair-db': {
    script: 'backend/repair-database.js',
    description: 'Repair database issues',
    args: ['--fix-migrations', '--fix-constraints', '--fix-version']
  },

  // Code fixing
  'fix-routes': {
    script: 'devtools/fixers/fix-routes.js',
    description: 'Fix route issues',
    args: ['--mode=express|final|remaining', '--dry-run']
  },

  // Metrics and analysis
  'scorecard': {
    script: 'devtools/metrics/scorecard.js',
    description: 'Generate developer scorecard',
    args: []
  },

  // Testing
  'test-subdomain': {
    script: 'testing/backend/test-subdomain.js',
    description: 'Test subdomain functionality',
    args: ['--live', '--simple']
  },
  'test-build': {
    script: 'testing/frontend/validate-build.js',
    description: 'Validate frontend build',
    args: []
  },

  // Audits
  'audit-backend': {
    script: 'audits/backend/audit-schema-switching.js',
    description: 'Audit backend schema switching',
    args: []
  },
  'audit-frontend': {
    script: 'audits/frontend/audit-routing.js',
    description: 'Audit frontend routing',
    args: []
  },
  'audit-seo': {
    script: 'audits/seo/test-anchors.js',
    description: 'Audit SEO implementation',
    args: []
  },
  'audit-env': {
    script: 'audits/system/env-check.js',
    description: 'Check environment configuration',
    args: ['--strict']
  },

  // Project management
  'overview': {
    script: 'project/project-overview.js',
    description: 'Generate project overview',
    args: []
  },
  'run-all': {
    script: 'project/run-all.js',
    description: 'Run all audits and tests',
    args: ['--backend', '--frontend', '--seo', '--system', '--tests']
  }
};

function showHelp() {
  console.log(chalk.blue.bold('🛠️  MDH Development CLI\n'));
  console.log(chalk.gray('Usage: node scripts/devtools/cli/index.js <command> [options]\n'));
  
  console.log(chalk.yellow('Available Commands:\n'));
  
  // Group commands by category
  const categories = {
    'Admin Management': ['create-admin', 'create-tenant', 'reset-admin', 'reset-password'],
    'Development': ['find-port', 'start-frontend', 'dev-monitor'],
    'Database': ['db-audit', 'repair-db'],
    'Code Fixing': ['fix-routes'],
    'Metrics': ['scorecard'],
    'Testing': ['test-subdomain', 'test-build'],
    'Audits': ['audit-backend', 'audit-frontend', 'audit-seo', 'audit-env'],
    'Project': ['overview', 'run-all']
  };

  Object.entries(categories).forEach(([category, cmdList]) => {
    console.log(chalk.cyan(`  ${category}:`));
    cmdList.forEach(cmd => {
      const command = commands[cmd];
      console.log(chalk.white(`    ${cmd.padEnd(20)} ${command.description}`));
      if (command.args.length > 0) {
        console.log(chalk.gray(`      Args: ${command.args.join(', ')}`));
      }
    });
    console.log();
  });

  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  node scripts/devtools/cli/index.js create-admin --email admin@example.com'));
  console.log(chalk.gray('  node scripts/devtools/cli/index.js fix-routes --mode=express --dry-run'));
  console.log(chalk.gray('  node scripts/devtools/cli/index.js run-all --backend --frontend'));
  console.log(chalk.gray('  node scripts/devtools/cli/index.js audit-env --strict'));
}

function executeCommand(commandName, args = []) {
  const command = commands[commandName];
  
  if (!command) {
    console.error(chalk.red(`❌ Unknown command: ${commandName}`));
    console.log(chalk.yellow('Run with --help to see available commands'));
    process.exit(1);
  }

  const scriptPath = path.join(scriptsDir, command.script);
  
  if (!fs.existsSync(scriptPath)) {
    console.error(chalk.red(`❌ Script not found: ${scriptPath}`));
    process.exit(1);
  }

  console.log(chalk.blue(`🚀 Running: ${command.description}`));
  console.log(chalk.gray(`   Script: ${command.script}`));
  if (args.length > 0) {
    console.log(chalk.gray(`   Args: ${args.join(' ')}`));
  }
  console.log();

  try {
    const fullCommand = `node ${scriptPath} ${args.join(' ')}`.trim();
    execSync(fullCommand, { stdio: 'inherit', cwd: root });
    console.log(chalk.green(`✅ ${command.description} completed successfully`));
  } catch (error) {
    console.error(chalk.red(`❌ ${command.description} failed:`));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const commandName = args[0];
const commandArgs = args.slice(1);

executeCommand(commandName, commandArgs);
