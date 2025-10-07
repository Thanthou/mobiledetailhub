#!/usr/bin/env node

/**
 * Add Google Maps URL to test business for scraping functionality
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addGoogleMapsUrl() {
  try {
    console.log('🔧 Adding Google Maps URL to test business...');
    
    // Add a sample Google Maps URL to the 'jps' business
    const googleMapsUrl = 'https://maps.google.com/maps/place/JP\'s+Mobile+Detailing/@36.1147,-115.1728,17z/data=!3m1!4b1!4m6!3m5!1s0x80c8c7b7c7c7c7c7:0x1234567890abcdef!8m2!3d36.1147!4d-115.1728!16s%2Fg%2F11abcdefghijk';
    
    const result = await pool.query(`
      UPDATE tenants.business 
      SET google_maps_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE slug = 'jps'
      RETURNING business_name, google_maps_url
    `, [googleMapsUrl]);
    
    if (result.rows.length > 0) {
      console.log('✅ Successfully added Google Maps URL to business:', result.rows[0].business_name);
      console.log('📍 Google Maps URL:', result.rows[0].google_maps_url);
    } else {
      console.log('❌ No business found with slug "jps"');
    }
    
  } catch (error) {
    console.error('❌ Error adding Google Maps URL:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the script
addGoogleMapsUrl();
