const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Starting affiliate pricing columns migration...');
    
    if (!pool) {
      throw new Error('Database connection not available');
    }

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/add_affiliate_pricing_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Executing migration SQL...');
    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Added columns: minimum, multiplier to affiliates table');

    // Verify the columns were added
    const verifyQuery = `
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
      AND column_name IN ('minimum', 'multiplier')
      ORDER BY column_name;
    `;
    
    const result = await pool.query(verifyQuery);
    console.log('🔍 Verification - Added columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  }
}

runMigration();
