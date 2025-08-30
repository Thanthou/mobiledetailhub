// Load environment variables first
require('dotenv').config();

const { pool } = require('../database/pool');

async function checkServices() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking services in database...');
    
    // Check all services
    const servicesResult = await client.query(`
      SELECT 
        id, 
        name, 
        affiliate_id, 
        vehicle_id, 
        service_category_id, 
        category,
        description
      FROM services 
      ORDER BY id
    `);
    
    console.log(`📊 Found ${servicesResult.rows.length} services:`);
    
    if (servicesResult.rows.length === 0) {
      console.log('❌ No services found in database');
      return;
    }
    
    servicesResult.rows.forEach((service, index) => {
      console.log(`\n${index + 1}. Service: "${service.name}" (ID: ${service.id})`);
      console.log(`   Affiliate ID: ${service.affiliate_id}`);
      console.log(`   Vehicle ID: ${service.vehicle_id}`);
      console.log(`   Service Category ID: ${service.service_category_id}`);
      console.log(`   Category: ${service.category}`);
      console.log(`   Description: "${service.description}"`);
    });
    
    // Check if there are any services with NULL foreign keys
    const nullKeysResult = await client.query(`
      SELECT COUNT(*) as count 
      FROM services 
      WHERE vehicle_id IS NULL OR service_category_id IS NULL
    `);
    
    console.log(`\n⚠️ Services with NULL foreign keys: ${nullKeysResult.rows[0].count}`);
    
    if (nullKeysResult.rows[0].count > 0) {
      console.log('\n🔧 These services need to be updated with proper foreign keys');
    }
    
  } catch (error) {
    console.error('❌ Error checking services:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run check if called directly
if (require.main === module) {
  checkServices()
    .then(() => {
      console.log('✅ Check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkServices };
