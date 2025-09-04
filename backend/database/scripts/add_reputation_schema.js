#!/usr/bin/env node

/**
 * Add Reputation Schema Migration Script
 * 
 * This script adds the reputation schema and tables to an existing database
 * without affecting existing data.
 * 
 * Usage: node scripts/add_reputation_schema.js
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

// Check if reputation schema already exists
async function checkReputationSchema() {
  try {
    const result = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'reputation'
    `);
    
    if (result.rows.length > 0) {
      console.log('⚠️  Reputation schema already exists!');
      console.log('   This script will not run to prevent data loss.');
      console.log('   If you want to recreate the reputation schema,');
      console.log('   you must first drop it manually or use init_database.js');
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error checking reputation schema:', error.message);
    throw error;
  }
}

// Main migration function
async function addReputationSchema() {
  try {
    console.log('🚀 Adding Reputation Schema to Existing Database...\n');
    
    // Check if reputation schema already exists
    const canProceed = await checkReputationSchema();
    if (!canProceed) {
      process.exit(1);
    }
    
    // 1. Create reputation schema
    console.log('📁 Creating reputation schema...');
    await executeSql(`
      CREATE SCHEMA reputation;
      COMMENT ON SCHEMA reputation IS 'Reviews, ratings, and reputation management for affiliates and MDH site';
    `, 'Creating reputation schema');
    
    // 2. Create reputation tables
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
    
    // 3. Update schema migrations
    console.log('\n📝 Updating schema migrations...');
    await executeSql(`
      INSERT INTO system.schema_migrations (version, description) 
      VALUES ('v6.1', 'Added reputation schema with reviews, replies, and voting system')
      ON CONFLICT (version) DO NOTHING;
    `, 'Recording schema migration');
    
    console.log('\n🎉 Reputation schema added successfully!');
    console.log('\n📊 What was added:');
    console.log('   • reputation.reviews - Main reviews table (affiliate & MDH site reviews)');
    console.log('   • reputation.review_replies - Business responses to reviews');
    console.log('   • reputation.review_votes - Helpful/not helpful voting');
    console.log('   • All necessary indexes and foreign key constraints');
    console.log('   • Migration tracking updated');
    
    console.log('\n✨ Your existing data is safe and the reviews system is ready to use!');
    
  } catch (error) {
    console.error('\n💥 Adding reputation schema failed!');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Handle script execution
if (require.main === module) {
  addReputationSchema()
    .then(() => {
      console.log('\n🎯 Ready to start collecting reviews!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { addReputationSchema };
