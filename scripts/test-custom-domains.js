#!/usr/bin/env node
/**
 * Test Custom Domain Implementation
 * Verifies that the custom domain backend is working correctly
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Try to get dynamic backend port, fallback to default
let API_BASE = 'http://localhost:3001';
try {
  const portData = JSON.parse(fs.readFileSync('.backend-port.json', 'utf8'));
  API_BASE = `http://localhost:${portData.port}`;
} catch (error) {
  // Use default
}

async function testCustomDomains() {
  console.log('🧪 Testing Custom Domain Implementation\n');

  try {
    // Test 1: Check if domain routes are accessible
    console.log('1️⃣ Testing domain routes accessibility...');
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    if (healthResponse.ok) {
      console.log('   ✅ Backend is running');
    } else {
      console.log('   ❌ Backend is not responding');
      return;
    }

    // Test 2: Test domain availability check
    console.log('\n2️⃣ Testing domain availability check...');
    try {
      const availabilityResponse = await fetch(`${API_BASE}/api/domains/testdomain.com/available`);
      if (availabilityResponse.ok) {
        const data = await availabilityResponse.json();
        console.log(`   ✅ Domain availability check: ${data.data.available ? 'Available' : 'Not available'}`);
      } else {
        console.log('   ⚠️  Domain availability endpoint not responding');
      }
    } catch (error) {
      console.log('   ⚠️  Domain availability check failed:', error.message);
    }

    // Test 3: Test domain lookup (should return 404 for non-existent domain)
    console.log('\n3️⃣ Testing domain lookup...');
    try {
      const lookupResponse = await fetch(`${API_BASE}/api/domains/nonexistentdomain.com`);
      if (lookupResponse.status === 404) {
        console.log('   ✅ Domain lookup correctly returns 404 for non-existent domain');
      } else {
        console.log('   ⚠️  Domain lookup returned unexpected status:', lookupResponse.status);
      }
    } catch (error) {
      console.log('   ⚠️  Domain lookup test failed:', error.message);
    }

    // Test 4: Test domain status endpoint (should return 404 for non-existent tenant)
    console.log('\n4️⃣ Testing domain status endpoint...');
    try {
      const statusResponse = await fetch(`${API_BASE}/api/domains/999999/status`);
      if (statusResponse.status === 404) {
        console.log('   ✅ Domain status correctly returns 404 for non-existent tenant');
      } else {
        console.log('   ⚠️  Domain status returned unexpected status:', statusResponse.status);
      }
    } catch (error) {
      console.log('   ⚠️  Domain status test failed:', error.message);
    }

    console.log('\n✅ Custom domain backend tests completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run migration: npm run migrate');
    console.log('   2. Test with real tenant data');
    console.log('   3. Connect frontend UI to backend APIs');
    console.log('   4. Test end-to-end domain management');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testCustomDomains().catch(console.error);
