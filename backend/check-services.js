const { pool } = require('./database/pool');

async function checkServices() {
  try {
    console.log('🔍 Checking services data...\n');
    
    // Check services table
    const servicesResult = await pool.query(`
      SELECT 
        id, 
        business_id, 
        service_name, 
        service_category, 
        metadata,
        created_at
      FROM affiliates.services 
      LIMIT 5
    `);
    
    console.log('📋 Sample Services:');
    console.table(servicesResult.rows);
    
    // Check service_tiers table
    const tiersResult = await pool.query(`
      SELECT COUNT(*) as tier_count 
      FROM affiliates.service_tiers
    `);
    
    console.log(`\n📊 Service Tiers Count: ${tiersResult.rows[0].tier_count}`);
    
    // Check business table
    const businessResult = await pool.query(`
      SELECT id, business_name, slug 
      FROM affiliates.business 
      LIMIT 3
    `);
    
    console.log('\n🏢 Sample Businesses:');
    console.table(businessResult.rows);
    
    // Check if services have business_id relationships
    const relationshipResult = await pool.query(`
      SELECT 
        s.id as service_id,
        s.service_name,
        b.business_name,
        b.slug
      FROM affiliates.services s
      LEFT JOIN affiliates.business b ON s.business_id = b.id
      LIMIT 5
    `);
    
    console.log('\n🔗 Service-Business Relationships:');
    console.table(relationshipResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkServices();
