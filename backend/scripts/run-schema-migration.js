#!/usr/bin/env node

/**
 * Schema Migration Runner
 * Runs the 3-schema migration to organize tables into auth, affiliates, and system schemas
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

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting 5-schema migration...');
    console.log('📋 This will move tables from public schema to:');
    console.log('   • auth: users, refresh_tokens');
    console.log('   • customers: customers');
    console.log('   • vehicles: vehicles');
    console.log('   • affiliates: affiliates, service_tiers, tiers');
    console.log('   • system: mdh_config');
    console.log('');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'migrate_to_3_schemas.sql');
    
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

    // Verify the migration
    console.log('🔍 Verifying migration results...');
    
    // Check schemas exist
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('auth', 'customers', 'vehicles', 'affiliates', 'system')
      ORDER BY schema_name
    `);
    
    console.log('📁 Created schemas:');
    schemasResult.rows.forEach(row => {
      console.log(`   ✅ ${row.schema_name}`);
    });
    console.log('');

    // Check tables are in correct schemas
    const tablesResult = await client.query(`
      SELECT schemaname, tablename
      FROM pg_tables 
      WHERE schemaname IN ('auth', 'customers', 'vehicles', 'affiliates', 'system')
      ORDER BY schemaname, tablename
    `);
    
    console.log('📋 Tables moved to new schemas:');
    let currentSchema = '';
    tablesResult.rows.forEach(row => {
      if (row.schemaname !== currentSchema) {
        currentSchema = row.schemaname;
        console.log(`   📁 ${currentSchema}:`);
      }
      console.log(`      • ${row.tablename}`);
    });
    console.log('');

    // Test views work
    console.log('👁️  Testing backward compatibility views...');
    const viewTests = [
      { name: 'users', query: 'SELECT COUNT(*) as count FROM public.users' },
      { name: 'affiliates', query: 'SELECT COUNT(*) as count FROM public.affiliates' },
      { name: 'service_tiers', query: 'SELECT COUNT(*) as count FROM public.service_tiers' },
      { name: 'tiers', query: 'SELECT COUNT(*) as count FROM public.tiers' },
      { name: 'customers', query: 'SELECT COUNT(*) as count FROM public.customers' },
      { name: 'vehicles', query: 'SELECT COUNT(*) as count FROM public.vehicles' },
      { name: 'mdh_config', query: 'SELECT COUNT(*) as count FROM public.mdh_config' }
    ];

    for (const test of viewTests) {
      try {
        const result = await client.query(test.query);
        console.log(`   ✅ ${test.name}: ${result.rows[0].count} records accessible via view`);
      } catch (error) {
        console.log(`   ❌ ${test.name}: Error - ${error.message}`);
      }
    }
    console.log('');

    // Check foreign keys
    const fkResult = await client.query(`
      SELECT 
        tc.table_schema,
        tc.table_name,
        tc.constraint_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema IN ('auth', 'customers', 'vehicles', 'affiliates', 'system')
      ORDER BY tc.table_schema, tc.table_name
    `);

    console.log('🔗 Foreign key constraints updated:');
    fkResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_schema}.${row.table_name} → ${row.foreign_table_schema}.${row.foreign_table_name}`);
    });
    console.log('');

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Your existing code will continue to work via the views');
    console.log('   2. You can gradually update queries to use schema-qualified names');
    console.log('   3. Example: "SELECT * FROM auth.users" instead of "SELECT * FROM users"');
    console.log('   4. The search_path is updated, so unqualified names still work');
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
    console.log('   • Check the database logs for detailed error information');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Schema Migration Runner');
  console.log('');
  console.log('Usage: node run-schema-migration.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --dry-run      Show what would be done without executing');
  console.log('');
  console.log('This script migrates tables from the public schema to organized schemas:');
console.log('  • auth: users, refresh_tokens');
console.log('  • customers: customers');
console.log('  • vehicles: vehicles');
console.log('  • affiliates: affiliates, service_tiers, tiers');
console.log('  • system: mdh_config, schema_migrations');
  console.log('');
  console.log('The migration creates views for backward compatibility.');
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('');
  console.log('This migration would:');
  console.log('  1. Create 5 new schemas: auth, customers, vehicles, affiliates, system');
  console.log('  2. Move tables to appropriate schemas');
  console.log('  3. Update foreign key constraints');
  console.log('  4. Create views for backward compatibility');
  console.log('  5. Update database search_path');
  console.log('');
  console.log('To run the actual migration, remove the --dry-run flag');
  process.exit(0);
}

// Run the migration
runMigration().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
