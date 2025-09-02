#!/usr/bin/env node

/**
 * Fix Affiliates View and Drop Location Columns
 * Updates the public.affiliates view to exclude location columns, then drops them
 */

const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixViewAndDropColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing affiliates view and dropping location columns...');
    console.log('');

    // Start transaction
    await client.query('BEGIN');
    console.log('✅ Transaction started');

    // First, get the current structure of the affiliates table
    const columnsResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'affiliates'
        AND column_name NOT IN ('city', 'state', 'zip')
      ORDER BY ordinal_position
    `);

    const columnNames = columnsResult.rows.map(row => row.column_name);
    console.log('📋 Columns to keep in view:', columnNames.join(', '));

    // Update the public.affiliates view to exclude location columns
    console.log('🔄 Updating public.affiliates view...');
    const viewSQL = `CREATE OR REPLACE VIEW public.affiliates AS SELECT ${columnNames.join(', ')} FROM affiliates.affiliates`;
    await client.query(viewSQL);
    console.log('✅ View updated successfully');

    // Now drop the location columns
    console.log('🗑️  Dropping location columns...');
    
    // Drop city column
    await client.query('ALTER TABLE affiliates.affiliates DROP COLUMN IF EXISTS city');
    console.log('✅ Dropped city column');
    
    // Drop state column  
    await client.query('ALTER TABLE affiliates.affiliates DROP COLUMN IF EXISTS state');
    console.log('✅ Dropped state column');
    
    // Drop zip column
    await client.query('ALTER TABLE affiliates.affiliates DROP COLUMN IF EXISTS zip');
    console.log('✅ Dropped zip column');

    // Update migration tracking
    console.log('📝 Updating migration tracking...');
    await client.query(`
      INSERT INTO system.schema_migrations(version, description) VALUES
      ('v5.1', 'Dropped redundant location columns (city, state, zip) from affiliates table and updated view')
    `);
    console.log('✅ Migration tracking updated');

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

    // Test the view
    console.log('🧪 Testing updated view...');
    const viewTest = await client.query('SELECT COUNT(*) as count FROM public.affiliates');
    console.log(`✅ View works: ${viewTest.rows[0].count} records accessible`);

    // Show final table structure
    const finalColumns = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'affiliates' 
        AND table_name = 'affiliates'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Final affiliates table structure:');
    finalColumns.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`   • ${row.column_name}: ${row.data_type} (${nullable})`);
    });

    console.log('\n🎉 Location columns cleanup completed successfully!');
    console.log('');
    console.log('📝 What was accomplished:');
    console.log('   • Updated public.affiliates view to exclude location columns');
    console.log('   • Dropped city, state, zip columns from affiliates table');
    console.log('   • All location data now comes from service_areas JSONB field');
    console.log('   • Backward compatibility maintained via updated view');
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
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
fixViewAndDropColumns().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
