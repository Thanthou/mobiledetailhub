#!/usr/bin/env node

/**
 * Drop Unused Tiers Table
 * Safely removes the empty and unused affiliates.tiers table
 */

const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function dropUnusedTiersTable() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Dropping unused tiers table...');
    console.log('');

    // Start transaction
    await client.query('BEGIN');
    console.log('✅ Transaction started');

    // First, verify the table is empty and unused
    const tiersData = await client.query(`
      SELECT COUNT(*) as count
      FROM affiliates.tiers
    `);
    
    console.log(`📊 Tiers table record count: ${tiersData.rows[0].count}`);
    
    if (tiersData.rows[0].count > 0) {
      throw new Error('Tiers table contains data - cannot drop');
    }

    // Check for any actual dependencies
    const dependencies = await client.query(`
      SELECT 
        n.nspname as schema_name,
        c.relname as object_name,
        c.relkind as object_type
      FROM pg_depend d
      JOIN pg_class c ON d.refobjid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE d.refobjid = (
        SELECT oid 
        FROM pg_class 
        WHERE relname = 'tiers' 
          AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'affiliates')
      )
      AND c.relkind IN ('v', 'm', 'S') -- views, materialized views, sequences
    `);
    
    console.log(`📊 Dependencies found: ${dependencies.rows.length}`);
    
    if (dependencies.rows.length > 0) {
      console.log('⚠️  Dependencies found:');
      dependencies.rows.forEach(row => {
        const typeMap = {
          'v': 'VIEW',
          'm': 'MATERIALIZED VIEW', 
          'S': 'SEQUENCE'
        };
        console.log(`   • ${row.schema_name}.${row.object_name} (${typeMap[row.object_type] || row.object_type})`);
      });
      throw new Error('Cannot drop table - dependencies exist');
    }

    // Drop the tiers table
    console.log('🗑️  Dropping affiliates.tiers table...');
    await client.query('DROP TABLE IF EXISTS affiliates.tiers');
    console.log('✅ Tiers table dropped successfully');

    // Update migration tracking
    console.log('📝 Updating migration tracking...');
    await client.query(`
      INSERT INTO system.schema_migrations(version, description) VALUES
      ('v5.2', 'Dropped unused affiliates.tiers table - was empty and had no dependencies')
    `);
    console.log('✅ Migration tracking updated');

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Transaction committed successfully');
    console.log('');

    // Verify the table is gone
    console.log('🔍 Verifying table was dropped...');
    const tableExists = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'tiers'
    `);
    
    if (tableExists.rows[0].count === 0) {
      console.log('✅ Tiers table successfully removed');
    } else {
      console.log('❌ Tiers table still exists');
    }

    // Show remaining tables in affiliates schema
    const remainingTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables 
      WHERE table_schema = 'affiliates'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Remaining tables in affiliates schema:');
    remainingTables.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });

    console.log('\n🎉 Unused tiers table cleanup completed!');
    console.log('');
    console.log('📝 What was accomplished:');
    console.log('   • Verified tiers table was empty and unused');
    console.log('   • Dropped affiliates.tiers table');
    console.log('   • Updated migration tracking');
    console.log('   • Cleaned up schema structure');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('');
    console.log('🔄 Rolling back transaction...');
    await client.query('ROLLBACK');
    console.log('✅ Transaction rolled back');
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   • Check that your database is accessible');
    console.log('   • Ensure you have sufficient permissions');
    console.log('   • Verify the table is actually empty and unused');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Drop Unused Tiers Table');
  console.log('');
  console.log('Usage: node drop-unused-tiers-table.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --dry-run      Show what would be done without executing');
  console.log('');
  console.log('This script removes the unused affiliates.tiers table:');
  console.log('  • Verifies table is empty and has no dependencies');
  console.log('  • Drops the table if safe to do so');
  console.log('  • Updates migration tracking');
  console.log('');
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('');
  console.log('This migration would:');
  console.log('  1. Verify tiers table is empty and unused');
  console.log('  2. Check for any dependencies');
  console.log('  3. Drop the affiliates.tiers table');
  console.log('  4. Update migration tracking');
  console.log('');
  console.log('To run the actual migration, remove the --dry-run flag');
  process.exit(0);
}

// Run the migration
dropUnusedTiersTable().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
