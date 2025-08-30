const { pool } = require('../database/pool');

async function rollbackServicesMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting services migration rollback...');
    
    // Step 1: Drop the foreign key constraints
    console.log('🔓 Step 1: Dropping foreign key constraints...');
    await client.query(`
      ALTER TABLE services 
      DROP CONSTRAINT IF EXISTS fk_services_vehicle
    `);
    
    await client.query(`
      ALTER TABLE services 
      DROP CONSTRAINT IF EXISTS fk_services_service_category
    `);
    
    console.log('✅ Foreign key constraints dropped');
    
    // Step 2: Drop the indexes
    console.log('📉 Step 2: Dropping indexes...');
    await client.query(`
      DROP INDEX IF EXISTS idx_services_affiliate_vehicle_category
    `);
    
    console.log('✅ Indexes dropped');
    
    // Step 3: Drop the columns
    console.log('🗑️ Step 3: Dropping new columns...');
    await client.query(`
      ALTER TABLE services 
      DROP COLUMN IF EXISTS vehicle_id,
      DROP COLUMN IF EXISTS service_category_id
    `);
    
    console.log('✅ New columns dropped');
    
    console.log('\n🎉 Rollback completed successfully!');
    console.log('📋 The services table is back to its original state');
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run rollback if called directly
if (require.main === module) {
  rollbackServicesMigration()
    .then(() => {
      console.log('✅ Rollback script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Rollback script failed:', error);
      process.exit(1);
    });
}

module.exports = { rollbackServicesMigration };
