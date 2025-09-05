// Load environment variables first
require('dotenv').config();
const { pool } = require('./database/pool');

async function testQuery() {
  try {
    console.log('🧪 Testing the exact query...\n');
    
    const query = `
      SELECT 
        s.id as service_id,
        s.service_name as name,
        s.service_category as category,
        s.service_description as description,
        s.metadata->>'base_price_cents' as base_price_cents,
        s.metadata->>'pricing_unit' as pricing_unit,
        s.metadata->>'min_duration_min' as min_duration_min,
        s.is_active as active
      FROM affiliates.services s
      WHERE s.business_id = $1 
        AND s.service_category = $2
        AND s.vehicle_types @> $3::jsonb
      ORDER BY s.created_at DESC, s.service_name ASC
    `;
    
    const params = ['1', 'auto', JSON.stringify([1])];
    console.log('🔍 Query parameters:', params);
    
    const result = await pool.query(query, params);
    console.log(`📊 Query result: ${result.rows.length} services found`);
    
    if (result.rows.length > 0) {
      console.log('✅ Services found:');
      console.table(result.rows);
    } else {
      console.log('❌ No services found. Let me check what exists...');
      
      // Check what services exist
      const allServices = await pool.query('SELECT id, business_id, service_name, service_category, vehicle_types FROM affiliates.services');
      console.log('\n📋 All services in database:');
      console.table(allServices.rows);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testQuery();
