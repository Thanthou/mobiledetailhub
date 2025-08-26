const fetch = require('node-fetch');

async function testAffiliateEndpoint() {
  try {
    console.log('Testing affiliate endpoint...');
    
    const testData = {
      legal_name: 'Test Business',
      primary_contact: 'John Doe',
      phone: '555-123-4567',
      email: 'test@example.com',
      base_location: {
        city: 'Test City',
        state: 'CA',
        zip: '12345'
      },
      categories: ['auto', 'ceramic'],
      has_insurance: true,
      source: 'test'
    };

    const response = await fetch('http://localhost:3001/api/affiliates/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Test successful!');
    } else {
      console.log('❌ Test failed!');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAffiliateEndpoint();
