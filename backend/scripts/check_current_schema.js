const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkCurrentSchema() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'MobileDetailHub',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔍 Checking current database schema...\n');

    // Check if addresses table exists
    const addressesExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'addresses'
      );
    `);
    
    console.log(`📍 Addresses table exists: ${addressesExists.rows[0].exists}`);

    // Check affiliates table structure
    const affiliatesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
      AND column_name IN ('base_location', 'base_address_id')
      ORDER BY column_name;
    `);
    
    console.log('\n📋 Affiliates table relevant columns:');
    if (affiliatesColumns.rows.length === 0) {
      console.log('  No base_location or base_address_id columns found');
    } else {
      affiliatesColumns.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    }

    // Check what tables exist
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📊 All tables in database:');
    allTables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check for required tables from schema
    const requiredTables = [
      'addresses', 'affiliate_service_areas', 'affiliates', 'availability', 
      'bookings', 'cities', 'customers', 'location', 'mdh_config', 'quotes', 
      'review_reply', 'review_sync_state', 'reviews', 'service_area_slugs', 
      'service_tiers', 'services', 'states', 'users', 'v_affiliate_base_location', 
      'v_served_cities', 'v_served_states'
    ];

    console.log('\n✅ Checking required tables:');
    const missingTables = [];
    for (const table of requiredTables) {
      const exists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      if (exists.rows[0].exists) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} (missing)`);
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('💡 Run setupDatabase() from databaseInit.js to create missing tables');
    }

    // Check if migration is needed
    const hasBaseLocation = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'affiliates' 
        AND column_name = 'base_location'
      );
    `);

    const hasBaseAddressId = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'affiliates' 
        AND column_name = 'base_address_id'
      );
    `);

    console.log('\n🔧 Migration Status:');
    console.log(`  base_location column: ${hasBaseLocation.rows[0].exists ? 'EXISTS' : 'NOT FOUND'}`);
    console.log(`  base_address_id column: ${hasBaseAddressId.rows[0].exists ? 'EXISTS' : 'NOT FOUND'}`);

    if (hasBaseLocation.rows[0].exists && hasBaseAddressId.rows[0].exists) {
      console.log('\n🎉 Schema appears to be already migrated!');
      console.log('   Your database has both old and new structures.');
      console.log('   You can safely drop the base_location column if desired.');
    } else if (!hasBaseLocation.rows[0].exists && hasBaseAddressId.rows[0].exists) {
      console.log('\n🎉 Schema is already using the new structure!');
      console.log('   No migration needed.');
    } else if (hasBaseLocation.rows[0].exists && !hasBaseAddressId.rows[0].exists) {
      console.log('\n⚠️  Migration needed:');
      console.log('   Run the migration script to convert base_location to base_address_id');
    } else {
      console.log('\n💡 No location columns found:');
      console.log('   Your affiliates table may need the base_address_id column added');
    }

  } catch (err) {
    console.error('❌ Error checking schema:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  checkCurrentSchema();
}

module.exports = { checkCurrentSchema };
