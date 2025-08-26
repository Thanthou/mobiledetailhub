const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./database/connection');

async function checkJPSAffiliate() {
  try {
    console.log('🔍 Checking JPS affiliate data...');
    
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Check if JPS affiliate exists
    const affiliateResult = await pool.query('SELECT * FROM affiliates WHERE slug = $1', ['jps']);
    
    if (affiliateResult.rows.length === 0) {
      console.log('❌ JPS affiliate not found');
      return;
    }
    
    const affiliate = affiliateResult.rows[0];
    console.log('✅ JPS affiliate found:');
    console.log(`📋 Business: ${affiliate.business_name}`);
    console.log(`📍 Base address ID: ${affiliate.base_address_id}`);
    console.log(`📧 Email: ${affiliate.email}`);
    console.log(`📱 Phone: ${affiliate.phone}`);
    console.log(`📊 Status: ${affiliate.application_status}`);
    
    // Check if base_address_id is set
    if (affiliate.base_address_id) {
      console.log('\n🔍 Checking base address...');
      const addressResult = await pool.query('SELECT * FROM addresses WHERE id = $1', [affiliate.base_address_id]);
      
      if (addressResult.rows.length > 0) {
        const address = addressResult.rows[0];
        console.log('✅ Base address found:');
        console.log(`🏙️ City: ${address.city}`);
        console.log(`🏛️ State: ${address.state_code}`);
        console.log(`📮 ZIP: ${address.postal_code}`);
        console.log(`🌍 Coordinates: ${address.lat}, ${address.lng}`);
        
        // Check if state exists
        const stateResult = await pool.query('SELECT name FROM states WHERE state_code = $1', [address.state_code]);
        if (stateResult.rows.length > 0) {
          console.log(`🏛️ State name: ${stateResult.rows[0].name}`);
        } else {
          console.log('❌ State not found in states table');
        }
      } else {
        console.log('❌ Base address not found');
      }
    } else {
      console.log('⚠️ No base_address_id set for JPS affiliate');
    }
    
    // Check if cities table exists and has data
    console.log('\n🔍 Checking cities table...');
    try {
      const citiesResult = await pool.query('SELECT COUNT(*) FROM cities');
      console.log(`🏙️ Cities table exists with ${citiesResult.rows[0].count} records`);
    } catch (err) {
      console.log('❌ Cities table does not exist');
    }
    
    // Check if affiliate_service_areas table exists and has data
    console.log('\n🔍 Checking affiliate_service_areas table...');
    try {
      const serviceAreasResult = await pool.query('SELECT COUNT(*) FROM affiliate_service_areas');
      console.log(`📍 Service areas table exists with ${serviceAreasResult.rows[0].count} records`);
    } catch (err) {
      console.log('❌ affiliate_service_areas table does not exist');
    }
    
  } catch (err) {
    console.error('💥 Error checking JPS affiliate:', err);
  } finally {
    await pool.end();
  }
}

checkJPSAffiliate();
