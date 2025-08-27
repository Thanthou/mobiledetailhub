#!/usr/bin/env node

/**
 * Service Areas Normalization Migration Runner
 * 
 * This script runs the migration to normalize affiliate_service_areas table
 * by replacing free-text city/state with city_id foreign keys.
 * 
 * Usage: node run_service_areas_normalization.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs').promises;
const { Pool } = require('pg');
const logger = require('../utils/logger');

// Alternative configuration if connection string fails
const getPoolConfig = () => {
  // Try connection string first
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  
  // Fall back to individual parameters
  const password = process.env.DB_PASSWORD || '';
  if (typeof password !== 'string') {
    throw new Error('DB_PASSWORD environment variable must be a string');
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'MobileDetailHub',
    user: process.env.DB_USER || 'postgres',
    password: password,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

async function runMigration() {
  let pool = null;
  
  try {
    logger.info('🚀 Starting Service Areas Normalization Migration...');
    
    // Get database configuration
    const config = getPoolConfig();
    logger.info('🔧 Database config:', { 
      host: config.host || 'from_connection_string',
      database: config.database || 'from_connection_string',
      user: config.user || 'from_connection_string'
    });
    
    // Connect to database
    pool = new Pool(config);
    logger.info('✅ Database connection established');
    
    // Check current table structure
    logger.info('🔍 Checking current affiliate_service_areas table structure...');
    const tableCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'affiliate_service_areas' 
      ORDER BY ordinal_position
    `);
    
    logger.info('Current table structure:');
    tableCheck.rows.forEach(col => {
      logger.info(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if migration has already been run
    const cityIdExists = tableCheck.rows.some(col => col.column_name === 'city_id');
    if (cityIdExists) {
      logger.warn('⚠️  city_id column already exists. Migration may have been run already.');
      logger.info('Checking if migration is complete...');
      
      const cityExists = tableCheck.rows.some(col => col.column_name === 'city');
      if (!cityExists) {
        logger.info('✅ Migration appears to be complete (city column removed)');
        return;
      }
    }
    
    // Check if cities table exists
    logger.info('🔍 Checking cities table...');
    const citiesCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cities'
      ) as exists
    `);
    
    if (!citiesCheck.rows[0].exists) {
      throw new Error('Cities table does not exist. Please run schema_init.sql first.');
    }
    
    // Check if slugify function exists
    logger.info('🔍 Checking slugify function...');
    const slugifyCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.routines 
        WHERE routine_name = 'slugify'
      ) as exists
    `);
    
    if (!slugifyCheck.rows[0].exists) {
      throw new Error('slugify function does not exist. Please run schema_init.sql first.');
    }
    
    // Read and execute migration SQL
    logger.info('📖 Reading migration SQL...');
    const migrationPath = path.join(__dirname, 'normalize_service_areas.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    logger.info('⚡ Executing migration...');
    await pool.query(migrationSQL);
    
    logger.info('✅ Migration completed successfully!');
    
    // Verify migration results
    logger.info('🔍 Verifying migration results...');
    
    const serviceAreasCount = await pool.query('SELECT COUNT(*) as count FROM affiliate_service_areas');
    const citiesCount = await pool.query('SELECT COUNT(*) as count FROM cities');
    
    logger.info(`📊 Migration Results:`);
    logger.info(`  - Total service areas: ${serviceAreasCount.rows[0].count}`);
    logger.info(`  - Total cities: ${citiesCount.rows[0].count}`);
    
    // Check new table structure
    const newTableCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'affiliate_service_areas' 
      ORDER BY ordinal_position
    `);
    
    logger.info('New table structure:');
    newTableCheck.rows.forEach(col => {
      logger.info(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Test the new functions
    logger.info('🧪 Testing new functions...');
    
    // Test view
    const viewTest = await pool.query('SELECT * FROM affiliate_service_areas_view LIMIT 1');
    logger.info('✅ affiliate_service_areas_view working');
    
    // Test function (if there are any service areas)
    if (serviceAreasCount.rows[0].count > 0) {
      const firstServiceArea = await pool.query('SELECT affiliate_id, city_id FROM affiliate_service_areas LIMIT 1');
      if (firstServiceArea.rows.length > 0) {
        const { affiliate_id, city_id } = firstServiceArea.rows[0];
        const cityInfo = await pool.query('SELECT name, state_code FROM cities WHERE id = $1', [city_id]);
        logger.info(`✅ Sample data: Affiliate ${affiliate_id} serves ${cityInfo.rows[0].name}, ${cityInfo.rows[0].state_code}`);
      }
    }
    
    logger.info('🎉 Migration verification completed successfully!');
    
  } catch (error) {
    logger.error('❌ Migration failed:', { error: error.message, stack: error.stack });
    
    if (pool) {
      logger.info('🔄 Rolling back any partial changes...');
      try {
        await pool.query('ROLLBACK');
        logger.info('✅ Rollback completed');
      } catch (rollbackError) {
        logger.error('❌ Rollback failed:', { error: rollbackError.message });
      }
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      logger.info('🔌 Database connection closed');
    }
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      logger.info('✅ Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Migration script failed:', { error: error.message });
      process.exit(1);
    });
}

module.exports = { runMigration };
