require('dotenv').config();
const { pool } = require('./database/pool');

async function checkServiceCategory() {
  try {
    console.log('🔍 Checking service category mapping...\n');
    
    // Check what the service was created with
    const serviceResult = await pool.query(`
      SELECT 
        id, 
        service_name, 
        service_category,
        metadata,
        created_at
      FROM affiliates.services 
      WHERE id = 111
    `);
    
    console.log('📋 Service details:');
    console.table(serviceResult.rows);
    
    // Check what categories exist
    const categoriesResult = await pool.query(`
      SELECT DISTINCT service_category, COUNT(*) as count
      FROM affiliates.services 
      GROUP BY service_category
    `);
    
    console.log('\n📊 Categories in database:');
    console.table(categoriesResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkServiceCategory();
