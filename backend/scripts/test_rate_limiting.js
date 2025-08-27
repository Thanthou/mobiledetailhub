/**
 * Test script to verify rate limiting functionality
 * Run with: node scripts/test_rate_limiting.js
 */

// Global fetch is available in Node 18+

const BASE_URL = 'http://localhost:3001/api';

async function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting Implementation...\n');

  // Test 1: Auth endpoint rate limiting
  console.log('✅ Testing Auth Endpoint Rate Limiting:');
  console.log('   Attempting 6 requests to /auth/login (limit: 5 per 15min)...\n');
  
  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      });
      
      if (response.status === 429) {
        console.log(`   Request ${i}: ❌ Rate limited (429) - Expected for request #6`);
        const data = await response.json();
        console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        console.log(`   Request ${i}: ✅ Success (${response.status})`);
      }
    } catch (error) {
      console.log(`   Request ${i}: ❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Admin endpoint rate limiting
  console.log('✅ Testing Admin Endpoint Rate Limiting:');
  console.log('   Attempting 11 requests to /admin/users (limit: 10 per 15min)...\n');
  
  for (let i = 1; i <= 11; i++) {
    try {
      const response = await fetch(`${BASE_URL}/admin/users`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }
      });
      
      if (response.status === 429) {
        console.log(`   Request ${i}: ❌ Rate limited (429) - Expected for request #11`);
        const data = await response.json();
        console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      } else if (response.status === 401) {
        console.log(`   Request ${i}: ✅ Unauthorized (401) - Expected due to fake token`);
      } else {
        console.log(`   Request ${i}: ✅ Success (${response.status})`);
      }
    } catch (error) {
      console.log(`   Request ${i}: ❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: General API rate limiting
  console.log('✅ Testing General API Rate Limiting:');
  console.log('   Attempting 101 requests to /health (limit: 100 per 15min)...\n');
  
  for (let i = 1; i <= 101; i++) {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      
      if (response.status === 429) {
        console.log(`   Request ${i}: ❌ Rate limited (429) - Expected for request #101`);
        const data = await response.json();
        console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
        break; // Stop after hitting rate limit
      } else {
        console.log(`   Request ${i}: ✅ Success (${response.status})`);
      }
    } catch (error) {
      console.log(`   Request ${i}: ❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n🎯 Rate Limiting Test Complete!');
  console.log('\n📋 Summary:');
  console.log('   • Auth endpoints: 5 requests per 15 minutes');
  console.log('   • Admin endpoints: 10 requests per 15 minutes');
  console.log('   • General API: 100 requests per 15 minutes');
  console.log('   • All limits are per IP address');
  console.log('   • Rate limit headers are included in responses');
}

// Run the test
testRateLimiting().catch(console.error);
