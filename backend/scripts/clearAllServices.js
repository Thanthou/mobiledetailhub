// Load environment variables first
require('dotenv').config();

const { pool } = require('../database/pool');

async function clearAllServices() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️ Starting cleanup of all existing services...');
    
    // Step 1: Delete all service tiers first (due to foreign key constraints)
    console.log('📊 Step 1: Deleting all service tiers...');
    const tiersResult = await client.query('DELETE FROM service_tiers RETURNING id');
    console.log(`✅ Deleted ${tiersResult.rowCount} service tiers`);
    
    // Step 2: Delete all services
    console.log('📊 Step 2: Deleting all services...');
    const servicesResult = await client.query('DELETE FROM services RETURNING id, name');
    console.log(`✅ Deleted ${servicesResult.rowCount} services:`);
    
    servicesResult.rows.forEach(service => {
      console.log(`   - "${service.name}" (ID: ${service.id})`);
    });
    
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Run the migration script to add new foreign key columns');
    console.log('   2. Test creating new services with the new structure');
    console.log('   3. Verify proper isolation by vehicle/category');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run cleanup if called directly
if (require.main === module) {
  clearAllServices()
    .then(() => {
      console.log('✅ Cleanup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup script failed:', error);
      process.exit(1);
    });
}

module.exports = { clearAllServices };
