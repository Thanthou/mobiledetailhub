require('dotenv').config();
const { pool } = require('../database/pool');
const logger = require('../utils/logger');

async function dropLegacyIpColumn() {
  const client = await pool.connect();
  
  try {
    logger.info('Starting legacy IP column removal from refresh_tokens table...');
    
    // Check if the legacy 'ip' column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens' 
      AND column_name = 'ip'
    `);
    
    if (checkColumn.rows.length === 0) {
      logger.info('✅ Legacy "ip" column does not exist - no action needed');
      return;
    }
    
    // Drop the legacy 'ip' column
    await client.query('ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS ip');
    logger.info('✅ Legacy "ip" column dropped successfully');
    
    // Verify the current table structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens'
      ORDER BY ordinal_position
    `);
    
    logger.info('Current refresh_tokens table structure:');
    tableInfo.rows.forEach(row => {
      logger.info(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Verify indexes
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'refresh_tokens'
    `);
    
    logger.info('Current indexes on refresh_tokens:');
    indexes.rows.forEach(row => {
      logger.info(`  - ${row.indexname}: ${row.indexdef}`);
    });
    
    logger.info('✅ Legacy IP column removal completed successfully');
    
  } catch (error) {
    logger.error('❌ Error dropping legacy IP column:', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

// Run the script
if (require.main === module) {
  dropLegacyIpColumn()
    .then(() => {
      logger.info('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Script failed:', { error: error.message });
      process.exit(1);
    });
}

module.exports = { dropLegacyIpColumn };
