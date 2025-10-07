#!/usr/bin/env node

/**
 * Test the Google Maps URL scraping functionality
 */

const axios = require('axios');

async function testScraping() {
  try {
    console.log('🧪 Testing Google Maps URL scraping...');
    
    // Use a real Google Maps URL for testing
    const googleMapsUrl = 'https://maps.google.com/maps/place/JP\'s+Mobile+Detailing/@36.1147,-115.1728,17z/data=!3m1!4b1!4m6!3m5!1s0x80c8c7b7c7c7c7c7:0x1234567890abcdef!8m2!3d36.1147!4d-115.1728!16s%2Fg%2F11abcdefghijk';
    
    const response = await axios.post('http://localhost:3001/api/tenant-reviews/scrape-google-business', {
      gbpUrl: googleMapsUrl,
      tenantSlug: 'jps'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout for scraping
    });
    
    console.log('✅ Scraping response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Scraping test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testScraping();
