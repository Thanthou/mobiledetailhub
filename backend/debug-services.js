const { pool } = require('./database/pool');

async function debugServices() {
  try {
    console.log('🔍 Debugging services data...\n');
    
    // Check what business IDs exist
    const businessResult = await pool.query('SELECT id, business_name FROM affiliates.business LIMIT 5');
    console.log('🏢 Available businesses:');
    console.table(businessResult.rows);
    
    // Check what services exist
    const servicesResult = await pool.query(`
      SELECT 
        id, 
        business_id, 
        service_name, 
        service_category, 
        vehicle_types,
        metadata,
        created_at
      FROM affiliates.services 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Recent services:');
    console.table(servicesResult.rows);
    
    // Check service_tiers
    const tiersResult = await pool.query('SELECT COUNT(*) as count FROM affiliates.service_tiers');
    console.log(`\n📊 Service tiers count: ${tiersResult.rows[0].count}`);
    
    // Test the exact query that's failing
    console.log('\n🧪 Testing the exact query...');
    const testQuery = `
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
    
    const testResult = await pool.query(testQuery, ['1', 'auto', JSON.stringify(['cars'])]);
    console.log(`\n🔍 Query test result: ${testResult.rows.length} services found`);
    if (testResult.rows.length > 0) {
      console.table(testResult.rows);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

debugServices();
