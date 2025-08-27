const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { getPool } = require('../database/connection');

async function testServiceAreas() {
  try {
    console.log('🔍 Testing service areas endpoint...');
    
    // Get pool
    const pool = await getPool();
    if (!pool) {
      console.error('❌ Failed to get database pool');
      return;
    }
    console.log('✅ Database pool obtained');
    
    // Check if required tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('states', 'cities', 'affiliate_service_areas')
      ORDER BY table_name
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log('\n📋 Required tables found:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });
    
    if (tablesResult.rows.length < 3) {
      console.log('\n❌ Missing required tables. Found only:');
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      return;
    }
    
    // Test the actual query from the service areas route
    console.log('\n🔍 Testing service areas query...');
    const serviceAreasQuery = `
      SELECT DISTINCT s.state_code, s.name
      FROM states s
      JOIN affiliate_service_areas asa ON asa.city_id IN (
        SELECT id FROM cities WHERE state_code = s.state_code
      )
      ORDER BY s.name
    `;
    
    const result = await pool.query(serviceAreasQuery);
    console.log(`✅ Query successful! Found ${result.rows.length} service areas`);
    
    if (result.rows.length > 0) {
      console.log('\n📊 Sample service areas:');
      result.rows.slice(0, 5).forEach(row => {
        console.log(`  ${row.state_code}: ${row.name}`);
      });
    }
    
  } catch (err) {
    console.error('💥 Error testing service areas:', err.message);
    console.error('Stack trace:', err.stack);
  }
}

testServiceAreas();
