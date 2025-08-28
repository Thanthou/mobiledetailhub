const { pool } = require('../database/pool');

async function testAffiliateEndpoint() {
  try {
    console.log('🧪 Testing affiliate endpoint...');
    
    // First, let's see what affiliates exist
    const affiliatesResult = await pool.query('SELECT slug, business_name, phone FROM affiliates LIMIT 5');
    console.log('✅ Found affiliates:', affiliatesResult.rows);
    
    if (affiliatesResult.rows.length === 0) {
      console.log('❌ No affiliates found in database');
      return;
    }
    
    // Test with the first affiliate
    const testSlug = affiliatesResult.rows[0].slug;
    console.log(`\n🔍 Testing with slug: ${testSlug}`);
    
    // Test the query that the endpoint now uses
    const result = await pool.query(`
      SELECT 
        slug, 
        business_name, 
        application_status,
        phone,
        city,
        state,
        zip
      FROM affiliates 
      WHERE slug = $1
    `, [testSlug]);
    
    console.log('✅ Query result:', result.rows[0]);
    
    // Test the formatted response
    const affiliate = result.rows[0];
    const formattedAffiliate = {
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      application_status: affiliate.application_status,
      phone: affiliate.phone,
      base_location: affiliate.city && affiliate.state ? {
        city: affiliate.city,
        state_name: affiliate.state,
        zip: affiliate.zip
      } : null
    };
    
    console.log('✅ Formatted affiliate data:', formattedAffiliate);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testAffiliateEndpoint();
