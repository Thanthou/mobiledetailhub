#!/usr/bin/env node
/**
 * Live Subdomain Test
 * Tests the actual running server with subdomain functionality
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testSubdomainLive() {
  console.log('🌐 Testing Live Subdomain Functionality...\n');

  const testCases = [
    {
      name: 'Main Site (localhost)',
      hostname: 'localhost',
      expectedType: 'main'
    },
    {
      name: 'Admin Subdomain',
      hostname: 'admin.localhost',
      expectedType: 'admin'
    },
    {
      name: 'Tenant Subdomain',
      hostname: 'test-tenant.localhost',
      expectedType: 'tenant'
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Hostname: ${testCase.hostname}`);
    
    try {
      // Test subdomain info endpoint
      const infoResponse = await fetch(`${BASE_URL}/api/subdomain/info`, {
        headers: {
          'Host': testCase.hostname,
          'User-Agent': 'SubdomainTest/1.0'
        }
      });
      
      if (!infoResponse.ok) {
        console.log(`❌ Info endpoint failed: ${infoResponse.status}`);
        continue;
      }
      
      const infoData = await infoResponse.json();
      console.log(`✅ Info Response:`, JSON.stringify(infoData.data, null, 2));
      
      // Test subdomain test endpoint
      const testResponse = await fetch(`${BASE_URL}/api/subdomain/test`, {
        headers: {
          'Host': testCase.hostname,
          'User-Agent': 'SubdomainTest/1.0'
        }
      });
      
      if (!testResponse.ok) {
        console.log(`❌ Test endpoint failed: ${testResponse.status}`);
        continue;
      }
      
      const testData = await testResponse.json();
      console.log(`✅ Test Response:`, JSON.stringify(testData.data, null, 2));
      
      // Validate type
      if (testData.data.type === testCase.expectedType) {
        console.log(`✅ Type matches expected: ${testData.data.type}`);
      } else {
        console.log(`❌ Type mismatch: expected ${testCase.expectedType}, got ${testData.data.type}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the test
testSubdomainLive().catch(console.error);
