const { pool } = require('../database/pool');

async function debugAffiliateData() {
  try {
    console.log('🔍 Debugging affiliate data...');
    
    // Check the table structure
    console.log('\n📋 Checking table structure...');
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Table structure:');
    structureResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check what affiliates exist and their data
    console.log('\n👥 Checking affiliate data...');
    const affiliatesResult = await pool.query(`
      SELECT id, slug, business_name, phone, city, state, zip, application_status
      FROM affiliates 
      LIMIT 5
    `);
    
    if (affiliatesResult.rows.length === 0) {
      console.log('❌ No affiliates found in database');
      return;
    }
    
    console.log('✅ Found affiliates:');
    affiliatesResult.rows.forEach((affiliate, index) => {
      console.log(`\n  Affiliate ${index + 1}:`);
      console.log(`    ID: ${affiliate.id}`);
      console.log(`    Slug: ${affiliate.slug}`);
      console.log(`    Business Name: ${affiliate.business_name}`);
      console.log(`    Phone: ${affiliate.phone || 'NULL'}`);
      console.log(`    City: ${affiliate.city || 'NULL'}`);
      console.log(`    State: ${affiliate.state || 'NULL'}`);
      console.log(`    Zip: ${affiliate.zip || 'NULL'}`);
      console.log(`    Status: ${affiliate.application_status}`);
    });
    
    // Test the exact query the endpoint uses
    if (affiliatesResult.rows.length > 0) {
      const testSlug = affiliatesResult.rows[0].slug;
      console.log(`\n🧪 Testing endpoint query with slug: ${testSlug}`);
      
      const endpointQuery = `
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
      `;
      
      const endpointResult = await pool.query(endpointQuery, [testSlug]);
      console.log('✅ Endpoint query result:', endpointResult.rows[0]);
      
      // Test the response formatting
      const affiliate = endpointResult.rows[0];
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
      
      console.log('✅ Formatted response:', formattedAffiliate);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await pool.end();
  }
}

debugAffiliateData();
