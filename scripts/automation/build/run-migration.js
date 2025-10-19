#!/usr/bin/env node

/**
 * Migration Runner Script
 * 
 * Runs individual migration files safely
 * 
 * Usage: node database/scripts/run-migration.js <migration-file>
 * Example: node database/scripts/run-migration.js 20241220_create_customers_schema.sql
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Create database connection
const pool = new Pool(dbConfig);

async function runMigration(migrationFile) {
  const client = await pool.connect();
  try {
    console.log(`🚀 Running migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, '../migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Migration timed out after 60 seconds')), 60000);
    });
    
    const queryPromise = client.query(sql);
    await Promise.race([queryPromise, timeoutPromise]);
    
    console.log(`✅ Migration ${migrationFile} completed successfully`);
    
  } catch (error) {
    console.error(`❌ Migration ${migrationFile} failed:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Handle script execution
if (require.main === module) {
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('❌ Please provide a migration file name');
    console.log('Usage: node database/scripts/run-migration.js <migration-file>');
    console.log('Example: node database/scripts/run-migration.js 20241220_create_customers_schema.sql');
    process.exit(1);
  }
  
  runMigration(migrationFile)
    .then(() => {
      console.log('✨ Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}

module.exports = { runMigration };
