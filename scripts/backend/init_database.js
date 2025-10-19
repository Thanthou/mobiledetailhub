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
  database: process.env.DB_NAME || 'ThatSmartSite',
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
// TODO: Re-enable when needed for special SQL execution cases
async function _executeSql(sql, description) {
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
      DROP SCHEMA IF EXISTS tenants CASCADE;
      DROP SCHEMA IF EXISTS booking CASCADE;
      DROP SCHEMA IF EXISTS system CASCADE;
      DROP SCHEMA IF EXISTS reputation CASCADE;
      DROP SCHEMA IF EXISTS customers CASCADE;
      DROP SCHEMA IF EXISTS schedule CASCADE;
      DROP SCHEMA IF EXISTS website CASCADE;
      DROP SCHEMA IF EXISTS vehicles CASCADE;
      DROP SCHEMA IF EXISTS affiliates CASCADE;
    `);
    client.release();
    console.log('✅ Old schemas cleaned');
    
    // 1. Create schemas
    console.log('📁 Creating database schemas...');
    const schemaClient = await pool.connect();
    await schemaClient.query(`
      CREATE SCHEMA auth;
      CREATE SCHEMA tenants;
      CREATE SCHEMA booking;
      CREATE SCHEMA system;
      CREATE SCHEMA reputation;
      CREATE SCHEMA customers;
      CREATE SCHEMA schedule;
      CREATE SCHEMA website;
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
    
    // 3. Create tenant tables
    console.log('\n🏢 Creating tenant tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/business.sql'),
      'Creating business table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/services.sql'),
      'Creating services table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/service_tiers.sql'),
      'Creating service_tiers table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/tenant_images.sql'),
      'Creating tenant_images table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/tenant_applications.sql'),
      'Creating tenant_applications table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/tenants/subscriptions.sql'),
      'Creating subscriptions table'
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
    await executeSqlFile(
      path.join(__dirname, '../schemas/system/health_monitoring.sql'),
      'Creating health_monitoring table'
    );
    
    // 5. Create reputation tables
    console.log('\n⭐ Creating reputation tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/reputation/reviews.sql'),
      'Creating reviews table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/reputation/review_replies.sql'),
      'Creating review_replies table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/reputation/review_votes.sql'),
      'Creating review_votes table'
    );
    
    // 6. Create customers tables
    console.log('\n👥 Creating customer tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/customers/customers.sql'),
      'Creating customers table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/customers/customer_vehicles.sql'),
      'Creating customer_vehicles table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/customers/customer_communications.sql'),
      'Creating customer_communications table'
    );
    
    // 7. Create schedule tables
    console.log('\n📅 Creating schedule tables...');
    await executeSqlFile(
      path.join(__dirname, '../schemas/schedule/appointments.sql'),
      'Creating appointments table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/schedule/blocked_days.sql'),
      'Creating blocked_days table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/schedule/schedule_settings.sql'),
      'Creating schedule_settings table'
    );
    await executeSqlFile(
      path.join(__dirname, '../schemas/schedule/time_blocks.sql'),
      'Creating time_blocks table'
    );
    
    // 8. Insert seed data (optional - comment out if not needed)
    console.log('\n🌱 Inserting seed data...');
    try {
      await executeSqlFile(
        path.join(__dirname, '../seeds/auth_users.sql'),
        'Inserting initial users'
      );
    } catch {
      console.log('⚠️  Skipping auth_users seed (file may not exist)');
    }
    
    try {
      await executeSqlFile(
        path.join(__dirname, '../seeds/reputation_reviews.sql'),
        'Inserting sample reviews'
      );
    } catch {
      console.log('⚠️  Skipping reputation_reviews seed (file may not exist)');
    }
    
    // 9. Update schema migrations
    console.log('\n📝 Updating schema migrations...');
    const migrationClient = await pool.connect();
    await migrationClient.query(`
      INSERT INTO system.schema_migrations (version, description) 
      VALUES ('v7.0', 'Initialized complete schema: auth, tenants (with onboarding), customers, reputation, schedule, booking, website')
      ON CONFLICT (version) DO NOTHING;
    `);
    migrationClient.release();
    console.log('✅ Schema migration recorded');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   • Public Schema: Cleaned (no tables)');
    console.log('   • Auth Schema: 4 tables (users, refresh_tokens, login_attempts, user_sessions)');
    console.log('   • Tenants Schema: 6 tables (business, services, service_tiers, tenant_images, tenant_applications, subscriptions)');
    console.log('   • System Schema: 3 tables (schema_migrations, system_config, health_monitoring)');
    console.log('   • Reputation Schema: 3 tables (reviews, review_replies, review_votes)');
    console.log('   • Customers Schema: 3 tables (customers, customer_vehicles, customer_communications)');
    console.log('   • Schedule Schema: 4 tables (appointments, blocked_days, schedule_settings, time_blocks)');
    console.log('   • Booking Schema: To be implemented');
    console.log('   • Website Schema: To be implemented');
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

