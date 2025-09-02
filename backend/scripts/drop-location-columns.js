#!/usr/bin/env node

/**
 * Drop Redundant Location Columns
 * Removes city, state, zip columns from affiliates table since data is in service_areas JSONB
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function dropLocationColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Starting location columns cleanup...');
    console.log('📋 This will drop redundant columns from affiliates table:');
    console.log('   • city (data now in service_areas JSONB)');
    console.log('   • state (data now in service_areas JSONB)');
    console.log('   • zip (data now in service_areas JSONB)');
    console.log('');

    // First, check current columns
    const currentColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'affiliates'
        AND column_name IN ('city', 'state', 'zip')
      ORDER BY column_name
    `);

    console.log('📋 Current location columns in affiliates table:');
    if (currentColumns.rows.length === 0) {
      console.log('   ✅ No redundant location columns found - already cleaned up!');
      return;
    } else {
      currentColumns.rows.forEach(row => {
        console.log(`   • ${row.column_name} (${row.data_type})`);
      });
    }
    console.log('');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'drop_redundant_location_columns.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📖 Reading migration file...');
    console.log('🔍 File size:', Math.round(migrationSQL.length / 1024), 'KB');
    console.log('');

    // Start transaction
    await client.query('BEGIN');
    console.log('✅ Transaction started');

    // Execute the migration
    console.log('⚡ Executing migration...');
    await client.query(migrationSQL);
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Transaction committed successfully');
    console.log('');

    // Verify the changes
    console.log('🔍 Verifying changes...');
    
    // Check if columns were dropped
    const remainingColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'affiliates'
        AND column_name IN ('city', 'state', 'zip')
      ORDER BY column_name
    `);

    if (remainingColumns.rows.length === 0) {
      console.log('✅ Successfully dropped all redundant location columns');
    } else {
      console.log('⚠️  Some columns still remain:');
      remainingColumns.rows.forEach(row => {
        console.log(`   • ${row.column_name} (${row.data_type})`);
      });
    }

    // Show remaining columns structure
    const allColumns = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'affiliates'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Current affiliates table structure:');
    allColumns.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`   • ${row.column_name}: ${row.data_type} (${nullable})`);
    });

    console.log('\n🎉 Location columns cleanup completed!');
    console.log('');
    console.log('📝 Benefits:');
    console.log('   • Reduced data redundancy');
    console.log('   • Single source of truth for location data (service_areas JSONB)');
    console.log('   • Cleaner table structure');
    console.log('   • Better data consistency');
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
    console.log('   • Verify the migration file exists and is readable');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Drop Redundant Location Columns');
  console.log('');
  console.log('Usage: node drop-location-columns.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --dry-run      Show what would be done without executing');
  console.log('');
  console.log('This script removes redundant location columns from the affiliates table:');
  console.log('  • city, state, zip columns');
  console.log('  • Data is now stored in service_areas JSONB field');
  console.log('');
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('');
  console.log('This migration would:');
  console.log('  1. Check for existing city, state, zip columns');
  console.log('  2. Drop the redundant location columns');
  console.log('  3. Update migration tracking');
  console.log('  4. Verify the changes');
  console.log('');
  console.log('To run the actual migration, remove the --dry-run flag');
  process.exit(0);
}

// Run the migration
dropLocationColumns().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
