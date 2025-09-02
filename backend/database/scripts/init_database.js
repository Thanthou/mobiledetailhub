#!/usr/bin/env node

/**
 * Mobile Detail Hub Database Initialization Script (CLEAN SLATE)
 * 
 * ⚠️  WARNING: This script will DELETE ALL EXISTING DATA!
 * 
 * This script performs a complete database reset including:
 * - Drops all existing schemas and data
 * - Creates fresh schemas (public, auth, affiliates, system)
 * - Creates all tables with proper relationships
 * - Sets up indexes and constraints
 * - Inserts initial seed data
 * 
 * Usage: node scripts/init_database.js
 * 
 * ⚠️  BACKUP YOUR DATA BEFORE RUNNING THIS SCRIPT!
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

// Utility function to execute SQL files with individual connections
async function executeSqlFile(filePath, description) {
  const client = await pool.connect();
  try {
    console.log(`📄 ${description}...`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out after 30 seconds')), 30000);
    });
    
    const queryPromise = client.query(sql);
    await Promise.race([queryPromise, timeoutPromise]);
    
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Utility function to execute SQL string
async function executeSql(sql, description) {
  try {
    console.log(`🔧 ${description}...`);
    await pool.query(sql);
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message);
    throw error;
  }
}

// Main initialization function
async function initializeDatabase() {
  try {
    console.log('🚀 Starting Mobile Detail Hub Database Initialization...\n');
    
    // 0. Clean slate - Remove old schemas and data
    console.log('🧹 Cleaning existing schemas and data...');
    const client = await pool.connect();
    await client.query(`
      -- Drop existing schemas (CASCADE will remove all objects)
      DROP SCHEMA IF EXISTS public CASCADE;
      DROP SCHEMA IF EXISTS auth CASCADE;
      DROP SCHEMA IF EXISTS affiliates CASCADE;
      DROP SCHEMA IF EXISTS system CASCADE;
      DROP SCHEMA IF EXISTS customers CASCADE;
      DROP SCHEMA IF EXISTS vehicles CASCADE;
    `);
    client.release();
    console.log('✅ Old schemas cleaned');
    
    // 1. Create schemas
    console.log('📁 Creating database schemas...');
    const schemaClient = await pool.connect();
    await schemaClient.query(`
      CREATE SCHEMA auth;
      CREATE SCHEMA affiliates;
      CREATE SCHEMA system;
    `);
    schemaClient.release();
    console.log('✅ Schemas created');
    
    // 2. Create auth tables
    console.log('\n🔐 Creating authentication tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/auth/users.sql'),
      'Creating users table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/auth/refresh_tokens.sql'),
      'Creating refresh_tokens table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/auth/login_attempts.sql'),
      'Creating login_attempts table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/auth/user_sessions.sql'),
      'Creating user_sessions table'
    );
    
    // 3. Create affiliates tables
    console.log('\n🏢 Creating affiliate tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/affiliates/business.sql'),
      'Creating business table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/affiliates/services.sql'),
      'Creating services table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/affiliates/service_tiers.sql'),
      'Creating service_tiers table'
    );
    
    // 4. Create system tables
    console.log('\n⚙️ Creating system tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/system/schema_migrations.sql'),
      'Creating schema_migrations table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/system/system_config.sql'),
      'Creating system_config table'
    );
    
    // 5. Insert seed data
    console.log('\n🌱 Inserting seed data...');
    await executeSqlFile(
      path.join(__dirname, '../seeds/auth_users.sql'),
      'Inserting initial users'
    );
    
    // 6. Update schema migrations
    console.log('\n📝 Updating schema migrations...');
    const migrationClient = await pool.connect();
    await migrationClient.query(`
      INSERT INTO system.schema_migrations (version, description) 
      VALUES ('v6.0', 'Initialized new schema structure: auth, affiliates, system with enterprise features')
      ON CONFLICT (version) DO NOTHING;
    `);
    migrationClient.release();
    console.log('✅ Schema migration recorded');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   • Public Schema: Cleaned (no tables)');
    console.log('   • Auth Schema: 4 tables (users, refresh_tokens, login_attempts, user_sessions)');
    console.log('   • Affiliates Schema: 3 tables (business, services, service_tiers)');
    console.log('   • System Schema: 2 tables (schema_migrations, system_config)');
    console.log('   • Seed Data: Initial users and system configuration');
    console.log('\n⚠️  WARNING: All previous data has been removed!');
    
  } catch (error) {
    console.error('\n💥 Database initialization failed!');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Handle script execution
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n✨ Ready to start building!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
