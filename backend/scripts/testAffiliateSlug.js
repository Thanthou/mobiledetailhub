const { pool } = require('../database/pool');

async function testAffiliateSlug() {
  try {
    console.log('🔍 Testing affiliate slug filtering...');
    
    // Test 1: Get all affiliates
    console.log('\n📋 All affiliates:');
    const allAffiliates = await pool.query(`
      SELECT id, slug, business_name, owner, email, application_status
      FROM affiliates 
      ORDER BY id
    `);
    
    allAffiliates.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Slug: ${row.slug}, Business: ${row.business_name}, Owner: ${row.owner}`);
    });
    
    // Test 2: Test slug filtering for 'qwe'
    console.log('\n🔍 Testing slug filter for "qwe":');
    const qweAffiliate = await pool.query(`
      SELECT id, slug, business_name, owner, email, application_status
      FROM affiliates 
      WHERE slug = $1
    `, ['qwe']);
    
    if (qweAffiliate.rowCount > 0) {
      console.log('✅ Found affiliate with slug "qwe":');
      qweAffiliate.rows.forEach(row => {
        console.log(`  ID: ${row.id}, Slug: ${row.slug}, Business: ${row.business_name}, Owner: ${row.owner}`);
      });
    } else {
      console.log('❌ No affiliate found with slug "qwe"');
    }
    
    // Test 3: Test the exact query from the admin endpoint
    console.log('\n🔍 Testing exact admin endpoint query:');
    const adminQuery = `
      SELECT 
        a.id, a.owner as name, a.email, 'affiliate' as role, a.created_at,
        a.business_name, a.application_status, a.slug, a.phone, a.service_areas
      FROM affiliates a
      WHERE a.application_status = 'approved' AND a.slug = $1
      ORDER BY a.created_at DESC
    `;
    
    const adminResult = await pool.query(adminQuery, ['qwe']);
    console.log(`Query returned ${adminResult.rowCount} rows`);
    if (adminResult.rowCount > 0) {
      console.log('✅ Admin query result:');
      adminResult.rows.forEach(row => {
        console.log(`  Business: ${row.business_name}, Slug: ${row.slug}, Owner: ${row.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing affiliate slug:', error);
  } finally {
    await pool.end();
  }
}

testAffiliateSlug();
