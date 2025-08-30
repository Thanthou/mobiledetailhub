const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testEndpoints() {
  console.log('🔍 Testing Available API Endpoints...\n');

  const endpoints = [
    '/health',
    '/services/master/vehicles',
    '/services/master/categories',
    '/affiliates',
    '/mdh-config',
    '/service_areas'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status} - ${response.data.success ? 'Success' : 'Data'}`);
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`   Found ${response.data.data.length} items`);
        if (response.data.data.length > 0) {
          console.log(`   First item:`, JSON.stringify(response.data.data[0], null, 2));
        }
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint}: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.data) {
          console.log(`   Error details:`, JSON.stringify(error.response.data, null, 2));
        }
      } else {
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }
    console.log('');
  }
}

testEndpoints();
