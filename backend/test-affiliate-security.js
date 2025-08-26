const fetch = require('node-fetch');

async function testAffiliateSecurity() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔒 Testing Affiliate Security...\n');
  
  try {
    // Test 1: Check if we can access the pending affiliate by slug
    console.log('1. Testing pending affiliate access by slug...');
    const pendingSlug = 'temp-1756224540430-v2wts2ell'; // Replace with actual pending slug
    
    try {
      const response = await fetch(`${baseUrl}/api/affiliates/${pendingSlug}`);
      if (response.status === 404) {
        console.log('✅ Pending affiliate properly hidden (404 Not Found)');
      } else {
        const data = await response.json();
        console.log('❌ Pending affiliate accessible:', data.business_name);
      }
    } catch (error) {
      console.log('✅ Pending affiliate access blocked');
    }
    
    // Test 2: Check affiliate lookup endpoint
    console.log('\n2. Testing affiliate lookup endpoint...');
    const lookupResponse = await fetch(`${baseUrl}/api/affiliates/lookup?city=Bullhead%20City&state=AZ`);
    const lookupData = await lookupResponse.json();
    
    if (lookupResponse.ok) {
      console.log('✅ Lookup endpoint working');
      console.log('   Found affiliates:', lookupData.count);
      if (lookupData.slugs) {
        console.log('   Slugs:', lookupData.slugs);
      }
    } else {
      console.log('❌ Lookup endpoint error:', lookupData.error);
    }
    
    // Test 3: Check slugs endpoint
    console.log('\n3. Testing slugs endpoint...');
    const slugsResponse = await fetch(`${baseUrl}/api/affiliates/slugs`);
    const slugsData = await slugsResponse.json();
    
    if (slugsResponse.ok) {
      console.log('✅ Slugs endpoint working');
      console.log('   Total approved affiliates:', slugsData.length);
      if (slugsData.length > 0) {
        console.log('   Sample affiliate:', slugsData[0]);
      }
    } else {
      console.log('❌ Slugs endpoint error:', slugsData.error);
    }
    
    // Test 4: Check database directly for pending affiliates
    console.log('\n4. Database status check...');
    console.log('   (This would require direct database access)');
    console.log('   Expected: Pending affiliates should have application_status = "pending"');
    console.log('   Expected: Only approved affiliates should be visible in public endpoints');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAffiliateSecurity();
