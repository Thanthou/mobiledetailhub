const { pool } = require('../database/pool');

async function testAffiliateSlug() {
  if (!pool) {
    console.error('❌ Database connection not available');
    process.exit(1);
  }

  try {
    console.log('🔍 Testing affiliate slug query...');
    
    const result = await pool.query(`
      SELECT slug, business_name, application_status, base_address_id
      FROM affiliates 
      WHERE slug = $1
    `, ['abc']);
    
    console.log(`✅ Query successful, found ${result.rowCount} affiliates`);
    console.log('Affiliate data:', result.rows);
    
    if (result.rowCount > 0) {
      const affiliate = result.rows[0];
      console.log(`\n📋 Affiliate Details:`);
      console.log(`  Slug: ${affiliate.slug}`);
      console.log(`  Business: ${affiliate.business_name}`);
      console.log(`  Status: ${affiliate.application_status}`);
      console.log(`  Address ID: ${affiliate.base_address_id}`);
      
      // Check if address exists
      if (affiliate.base_address_id) {
        const addrResult = await pool.query(`
          SELECT city, state_code, postal_code, lat, lng
          FROM addresses 
          WHERE id = $1
        `, [affiliate.base_address_id]);
        
        if (addrResult.rowCount > 0) {
          console.log(`  Address: ${addrResult.rows[0].city}, ${addrResult.rows[0].state_code}`);
        } else {
          console.log(`  ❌ No address found for ID ${affiliate.base_address_id}`);
        }
      } else {
        console.log(`  ❌ No base_address_id set`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing affiliate slug:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testAffiliateSlug();
