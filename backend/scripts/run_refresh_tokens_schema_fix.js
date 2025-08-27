#!/usr/bin/env node

/**
 * Fix refresh_tokens table schema mismatch
 * Adds missing columns and renames 'ip' to 'ip_address' to match service code
 * Run with: node scripts/run_refresh_tokens_schema_fix.js
 */

const fs = require('fs');
const path = require('path');
const pool = require('../database/pool');

async function main() {
  console.log('🔧 Fixing refresh_tokens table schema...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix_refresh_tokens_schema.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found: ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Remove \d and \echo commands (PostgreSQL client specific)
    const cleanSql = sql
      .replace(/\\echo.*$/gm, '')
      .replace(/\\d.*$/gm, '')
      .trim();

    console.log('📋 Executing schema fixes...');
    
    // Execute the migration
    const result = await pool.query(cleanSql);
    console.log('✅ Schema fixes completed');

    // Verify the table structure
    console.log('\n📊 Verifying table structure...');
    const structureResult = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Current refresh_tokens table structure:');
    structureResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}${row.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
    });

    // Check for required columns
    const requiredColumns = ['id', 'user_id', 'token_hash', 'ip_address', 'is_revoked', 'expires_at'];
    const existingColumns = structureResult.rows.map(row => row.column_name);
    
    let allGood = true;
    for (const column of requiredColumns) {
      if (existingColumns.includes(column)) {
        console.log(`✅ ${column} column exists`);
      } else {
        console.log(`❌ ${column} column missing`);
        allGood = false;
      }
    }

    if (allGood) {
      console.log('\n🎉 All required columns are present!');
      console.log('The refresh token service should now work correctly.');
    } else {
      console.log('\n❌ Some required columns are still missing.');
      throw new Error('Schema fix incomplete');
    }

    // Test a simple query
    console.log('\n🧪 Testing query...');
    await pool.query('SELECT COUNT(*) FROM refresh_tokens');
    console.log('✅ Query test successful');

  } catch (error) {
    console.error('\n❌ Error fixing schema:', error.message);
    
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('\n💡 Suggestions:');
      console.log('1. Check if the refresh_tokens table was created properly');
      console.log('2. Run: node scripts/verify_refresh_tokens_schema.js');
      console.log('3. If needed, recreate the table: node scripts/run_refresh_tokens_migration.js');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}
