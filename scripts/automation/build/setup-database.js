#!/usr/bin/env node
/**
 * Complete Database Setup
 * - Initializes schemas and tables if they don't exist
 * - Runs migrations for incremental updates
 * - Handles both fresh and existing databases
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Build connection string with better error handling
let connectionString;
if (process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL;
} else if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
  connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;
} else {
  console.error('❌ No database connection configuration found');
  console.error('   Please set either DATABASE_URL or all DB_* environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkDatabaseExists() {
  try {
    const { rows } = await pool.query('SELECT 1');
    return true;
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkSchemasExist() {
  try {
    const { rows } = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('auth', 'tenants', 'customers', 'vehicles', 'affiliates', 'reputation', 'schedule', 'system')
    `);
    return rows.length >= 8; // All 8 schemas should exist
  } catch (error) {
    log(`❌ Failed to check schemas: ${error.message}`, 'red');
    return false;
  }
}

async function initializeSchemas() {
  log('🏗️  Initializing database schemas...', 'blue');
  
  const schemas = [
    'auth', 'tenants', 'customers', 'vehicles', 
    'affiliates', 'reputation', 'schedule', 'system'
  ];
  
  for (const schema of schemas) {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    log(`   ✅ Created schema: ${schema}`, 'green');
  }
}

async function runDatabaseInit() {
  try {
    log('🚀 Running database initialization...', 'blue');
    
    // Check if init-database.js exists and run it
    const initScriptPath = path.join(__dirname, 'init_database.js');
    if (fs.existsSync(initScriptPath)) {
      log('📋 Found init-database.js, running...', 'cyan');
      
      // Import and run the init script
      const { initializeDatabase } = await import('./init_database.js');
      await initializeDatabase();
      
      log('✅ Database initialization completed', 'green');
    } else {
      log('⚠️  init-database.js not found, skipping initialization', 'yellow');
    }
  } catch (error) {
    log(`❌ Database initialization failed: ${error.message}`, 'red');
    throw error;
  }
}

async function runMigrations() {
  try {
    log('🔄 Running migrations...', 'blue');
    
    // Import and run the migration script
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    await execAsync('node scripts/migrate.js', { cwd: path.join(__dirname, '..') });
    
    log('✅ Migrations completed', 'green');
  } catch (error) {
    log(`❌ Migrations failed: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  try {
    log('🚀 Complete Database Setup', 'bold');
    log('========================', 'bold');
    
    // Step 1: Check database connection
    log('\n1️⃣ Checking database connection...', 'blue');
    if (!(await checkDatabaseExists())) {
      process.exit(1);
    }
    log('✅ Database connected', 'green');
    
    // Step 2: Check if schemas exist
    log('\n2️⃣ Checking database schemas...', 'blue');
    const schemasExist = await checkSchemasExist();
    
    if (!schemasExist) {
      log('⚠️  Schemas missing, initializing...', 'yellow');
      await initializeSchemas();
      
      // Try to run full database initialization
      await runDatabaseInit();
    } else {
      log('✅ All schemas exist', 'green');
    }
    
    // Step 3: Run migrations
    log('\n3️⃣ Running migrations...', 'blue');
    await runMigrations();
    
    log('\n🎉 Database setup completed successfully!', 'green');
    
  } catch (error) {
    log(`\n❌ Database setup failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
