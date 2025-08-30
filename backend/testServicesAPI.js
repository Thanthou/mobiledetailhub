const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testServicesAPI() {
  try {
    console.log('🧪 Testing Services API...\n');

    // Test 1: Get all vehicles
    console.log('1️⃣ Testing GET /api/services/master/vehicles');
    const vehiclesResponse = await axios.get(`${BASE_URL}/services/master/vehicles`);
    console.log('✅ Vehicles:', vehiclesResponse.data.data.length, 'found');
    console.log('   Sample:', vehiclesResponse.data.data[0]?.name);
    console.log('');

    // Test 2: Get all categories
    console.log('2️⃣ Testing GET /api/services/master/categories');
    const categoriesResponse = await axios.get(`${BASE_URL}/services/master/categories`);
    console.log('✅ Categories:', categoriesResponse.data.data.length, 'found');
    console.log('   Sample:', categoriesResponse.data.data[0]?.name);
    console.log('');

    // Test 3: Check what affiliates exist
    console.log('3️⃣ Checking existing affiliates...');
    try {
      const affiliatesResponse = await axios.get(`${BASE_URL}/affiliates`);
      console.log('✅ Affiliates found:', affiliatesResponse.data.data?.length || 0);
      if (affiliatesResponse.data.data && affiliatesResponse.data.data.length > 0) {
        const firstAffiliate = affiliatesResponse.data.data[0];
        console.log('   Using affiliate ID:', firstAffiliate.id);
        
        // Test 4: Create a test service with real affiliate ID
        console.log('4️⃣ Testing POST /api/services');
        const newService = {
          affiliate_id: firstAffiliate.id,
          vehicle_id: 1,
          service_category_id: 1,
          base_price_cents: 7500
        };
        
        const createResponse = await axios.post(`${BASE_URL}/services`, newService);
        console.log('✅ Service created:', createResponse.data.message);
        console.log('   Service ID:', createResponse.data.data.id);
        console.log('');

        // Test 5: Get affiliate services
        console.log('5️⃣ Testing GET /api/services/' + firstAffiliate.id);
        const affiliateServicesResponse = await axios.get(`${BASE_URL}/services/${firstAffiliate.id}`);
        console.log('✅ Affiliate services:', affiliateServicesResponse.data.count, 'found');
        console.log('');

        console.log('🎉 All tests passed! Your Services API is working perfectly!');
      } else {
        console.log('⚠️  No affiliates found. Create an affiliate first before testing services.');
      }
    } catch (affiliateError) {
      console.log('⚠️  Could not check affiliates:', affiliateError.message);
      console.log('   You may need to create an affiliate first.');
    }

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your backend server is running:');
      console.log('   cd backend && npm start');
    }
  }
}

// Run the tests
testServicesAPI();
