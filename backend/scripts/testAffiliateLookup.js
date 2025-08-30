// Load environment variables
require('dotenv').config();

const { pool } = require('../database/pool');

async function testAffiliateLookup() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing affiliate lookup...');
    
    // Test 1: Check if affiliates table exists and has data
    console.log('\n📋 Test 1: Check affiliates table structure');
    const tableCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'affiliates' 
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Affiliates table columns:');
    tableCheck.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Test 2: Check if there are any affiliates
    console.log('\n📋 Test 2: Check affiliate count');
    const countResult = await client.query('SELECT COUNT(*) FROM affiliates');
    console.log(`✅ Total affiliates: ${countResult.rows[0].count}`);
    
    // Test 3: Check specific affiliate with slug 'abc'
    console.log('\n📋 Test 3: Look for affiliate with slug "abc"');
    const affiliateResult = await client.query(`
      SELECT id, slug, business_name, city, state, zip
      FROM affiliates 
      WHERE slug = 'abc'
    `);
    
    if (affiliateResult.rows.length > 0) {
      console.log('✅ Found affiliate:', affiliateResult.rows[0]);
    } else {
      console.log('❌ No affiliate found with slug "abc"');
      
      // Let's see what slugs actually exist
      const allSlugs = await client.query('SELECT slug, business_name FROM affiliates LIMIT 5');
      console.log('📋 Available affiliate slugs:');
      allSlugs.rows.forEach(row => {
        console.log(`  - ${row.slug}: ${row.business_name}`);
      });
    }
    
    // Test 4: Check if the query from the route would work
    console.log('\n📋 Test 4: Test the exact query from the route');
    const routeQuery = await client.query(`
      SELECT 
        id,
        slug, 
        business_name, 
        application_status,
        phone,
        sms_phone,
        city,
        state,
        zip
      FROM affiliates 
      WHERE slug = 'abc'
    `);
    
    if (routeQuery.rows.length > 0) {
      console.log('✅ Route query successful:', routeQuery.rows[0]);
    } else {
      console.log('❌ Route query failed - no results');
    }
    
    // Test 5: Test with the actual slug "jps"
    console.log('\n📋 Test 5: Test with slug "jps"');
    const jpsQuery = await client.query(`
      SELECT 
        id,
        slug, 
        business_name, 
        application_status,
        phone,
        sms_phone,
        city,
        state,
        zip
      FROM affiliates 
      WHERE slug = 'jps'
    `);
    
    if (jpsQuery.rows.length > 0) {
      console.log('✅ JPS query successful:', jpsQuery.rows[0]);
    } else {
      console.log('❌ JPS query failed - no results');
      
      // Let's see what the actual data looks like for jps
      const jpsData = await client.query(`
        SELECT * FROM affiliates WHERE slug = 'jps'
      `);
      
      if (jpsData.rows.length > 0) {
        console.log('🔍 Raw JPS data:', jpsData.rows[0]);
      } else {
        console.log('❌ No JPS data found at all');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the test
testAffiliateLookup()
  .then(() => {
    console.log('\n🎉 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
