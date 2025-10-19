#!/usr/bin/env node
/**
 * Environment Configuration Audit
 * Verifies all required environment variables and configurations
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const root = process.cwd();

// Required environment variables by category
const requiredEnvVars = {
  database: [
    'DB_HOST',
    'DB_PORT', 
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ],
  auth: [
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_SECRET' // Updated to match your naming
  ],
  email: [
    'SENDGRID_API_KEY',
    'EMAIL_USER', // Updated to match your naming
    'EMAIL_SERVICE' // Updated to match your naming
  ],
  frontend: [
    'VITE_API_URL_LIVE', // Updated to match your naming
    'VITE_GOOGLE_MAPS_API_KEY' // Updated to match your naming
  ],
  optional: [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'STRIPE_SECRET_KEY',
    'GOOGLE_ANALYTICS_ID',
    'NODE_ENV'
  ]
};

// Configuration files to check
const configFiles = [
  '.env',
  '.env.local'
  // Only check root .env since that's where all variables are configured
];

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

function checkEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, vars: {} };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        vars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return { exists: true, vars };
}

function checkRequiredVars(category, vars, envFile) {
  const required = requiredEnvVars[category];
  const missing = [];
  const empty = [];

  required.forEach(varName => {
    if (!(varName in vars)) {
      missing.push(varName);
    } else if (!vars[varName] || vars[varName].trim() === '') {
      empty.push(varName);
    }
  });

  if (missing.length > 0) {
    results.failed++;
    results.issues.push({
      type: 'missing',
      category,
      file: envFile,
      vars: missing,
      message: `Missing required ${category} variables: ${missing.join(', ')}`
    });
  }

  if (empty.length > 0) {
    results.failed++;
    results.issues.push({
      type: 'empty',
      category,
      file: envFile,
      vars: empty,
      message: `Empty ${category} variables: ${empty.join(', ')}`
    });
  }

  if (missing.length === 0 && empty.length === 0) {
    results.passed++;
  }
}

function checkOptionalVars(vars, envFile) {
  const optional = requiredEnvVars.optional;
  const missing = [];

  optional.forEach(varName => {
    if (!(varName in vars) || !vars[varName] || vars[varName].trim() === '') {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    results.warnings++;
    results.issues.push({
      type: 'optional',
      category: 'optional',
      file: envFile,
      vars: missing,
      message: `Optional variables not set: ${missing.join(', ')}`
    });
  }
}

function checkConfigFiles() {
  console.log(chalk.blue('📁 Checking configuration files...\n'));

  // Check if .env file exists
  const envPath = path.join(root, '.env');
  if (fs.existsSync(envPath)) {
    console.log(chalk.green('✅ .env - Found'));
    
    // Check loaded environment variables directly
    Object.keys(requiredEnvVars).forEach(category => {
      if (category === 'optional') return;
      checkRequiredVars(category, process.env, '.env');
    });
    
    // Check optional variables
    checkOptionalVars(process.env, '.env');
  } else {
    console.log(chalk.red('❌ .env - Not found'));
    results.failed++;
    results.issues.push({
      type: 'missing_file',
      category: 'config',
      file: '.env',
      message: 'Root .env file not found'
    });
  }
}

async function checkDatabaseConnection() {
  console.log(chalk.blue('\n🔌 Testing database connection...\n'));

  try {
    // Simple database connection test using pg directly
    const { Pool } = await import('pg');
    
    // Get database config from environment
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'thatsmartsite',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || ''
    };

    // Check if required database variables are set
    if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      console.log(chalk.yellow('⚠️  Missing database variables, checking what we have:'));
      console.log(chalk.gray(`   DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`));
      console.log(chalk.gray(`   DB_NAME: ${process.env.DB_NAME || 'NOT SET'}`));
      console.log(chalk.gray(`   DB_USER: ${process.env.DB_USER || 'NOT SET'}`));
      console.log(chalk.gray(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? 'SET' : 'NOT SET'}`));
      throw new Error('Missing required database environment variables (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)');
    }

    const pool = new Pool(dbConfig);
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    console.log(chalk.green(`✅ Database connection successful`));
    console.log(chalk.gray(`   Server: ${result.rows[0].version}`));
    console.log(chalk.gray(`   Time: ${result.rows[0].current_time}`));
    
    await pool.end();
    results.passed++;
  } catch (error) {
    console.log(chalk.red(`❌ Database connection failed: ${error.message}`));
    results.failed++;
    results.issues.push({
      type: 'connection',
      category: 'database',
      file: 'database',
      message: `Database connection failed: ${error.message}`
    });
  }
}

function checkFilePermissions() {
  console.log(chalk.blue('\n🔐 Checking file permissions...\n'));

  const criticalFiles = [
    '.env',
    'backend/.env',
    'frontend/.env'
  ];

  criticalFiles.forEach(filePath => {
    const fullPath = path.join(root, filePath);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const mode = stats.mode & parseInt('777', 8);
      
      if (mode > parseInt('644', 8)) {
        console.log(chalk.yellow(`⚠️  ${filePath} - Permissions too open (${mode.toString(8)})`));
        results.warnings++;
        results.issues.push({
          type: 'permissions',
          category: 'security',
          file: filePath,
          message: `File permissions too open: ${mode.toString(8)}`
        });
      } else {
        console.log(chalk.green(`✅ ${filePath} - Permissions OK`));
        results.passed++;
      }
    }
  });
}

function generateReport() {
  console.log(chalk.blue.bold('\n📊 Environment Audit Report\n'));
  
  console.log(chalk.green(`✅ Passed: ${results.passed}`));
  if (results.failed > 0) {
    console.log(chalk.red(`❌ Failed: ${results.failed}`));
  }
  if (results.warnings > 0) {
    console.log(chalk.yellow(`⚠️  Warnings: ${results.warnings}`));
  }

  if (results.issues.length > 0) {
    console.log(chalk.red('\n🚨 Issues Found:\n'));
    
    results.issues.forEach((issue, index) => {
      const icon = issue.type === 'missing' || issue.type === 'empty' || issue.type === 'connection' ? '❌' : '⚠️';
      console.log(chalk.red(`${icon} ${issue.message}`));
      if (issue.file !== 'database') {
        console.log(chalk.gray(`   File: ${issue.file}`));
      }
      console.log();
    });
  } else {
    console.log(chalk.green('\n🎉 All environment checks passed!'));
  }

  return results.failed === 0;
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');

  console.log(chalk.blue.bold('🔍 Environment Configuration Audit\n'));

  // Check configuration files
  checkConfigFiles();

  // Check database connection
  await checkDatabaseConnection();

  // Check file permissions
  checkFilePermissions();

  // Generate report
  const success = generateReport();

  if (!success) {
    console.log(chalk.red('\n❌ Environment audit failed. Fix the issues above before proceeding.'));
    process.exit(1);
  } else if (strict && results.warnings > 0) {
    console.log(chalk.yellow('\n⚠️  Environment audit passed with warnings (--strict mode)'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ Environment audit completed successfully!'));
    process.exit(0);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Environment audit failed:'), error);
  process.exit(1);
});
