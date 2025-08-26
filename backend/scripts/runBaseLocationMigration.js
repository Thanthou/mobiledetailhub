const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runBaseLocationMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'MobileDetailHub',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔄 Starting base_location to base_address_id migration...');
    
    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, 'migrate_base_location_to_addresses.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing migration SQL...');
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Verifying migration results...');
    
    // Verify the migration results
    const migrationCheck = await pool.query(`
      SELECT 
        'affiliates_with_base_address_id' as metric,
        COUNT(*) as count
      FROM affiliates 
      WHERE base_address_id IS NOT NULL
      
      UNION ALL
      
      SELECT 
        'total_addresses_created' as metric,
        COUNT(*) as count
      FROM addresses
      
      UNION ALL
      
      SELECT 
        'affiliates_with_old_base_location' as metric,
        COUNT(*) as count
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
        AND column_name = 'base_location'
        AND data_type = 'jsonb'
    `);
    
    console.log('\n📈 Migration Results:');
    migrationCheck.rows.forEach(row => {
      console.log(`  ${row.metric}: ${row.count}`);
    });
    
    // Check for any affiliates that might need manual attention
    const orphanedAffiliates = await pool.query(`
      SELECT COUNT(*) as count
      FROM affiliates 
      WHERE base_location IS NOT NULL 
        AND base_location != '{"city": "", "state": "", "zip": ""}'::jsonb
        AND base_address_id IS NULL
    `);
    
    if (parseInt(orphanedAffiliates.rows[0].count) > 0) {
      console.log(`\n⚠️  Warning: ${orphanedAffiliates.rows[0].count} affiliates have base_location data but no base_address_id.`);
      console.log('   These may need manual review.');
    }
    
    console.log('\n🎉 Migration verification complete!');
    console.log('💡 Next steps:');
    console.log('   1. Verify data integrity in your application');
    console.log('   2. Update application code to use base_address_id instead of base_location');
    console.log('   3. Run test queries to ensure everything works correctly');
    console.log('   4. Once confirmed, uncomment the DROP COLUMN line in the migration script');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('🔍 Rollback may be needed if partial changes were applied');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  runBaseLocationMigration();
}

module.exports = { runBaseLocationMigration };
