#!/usr/bin/env node
/**
 * Subdomain Middleware Test Script
 * Tests the subdomain functionality locally and validates tenant routing
 */

import fetch from 'node-fetch';
import { createModuleLogger } from '../backend/config/logger.js';

const logger = createModuleLogger('subdomainTest');

const BASE_URL = 'http://localhost:3000';
const TEST_CASES = [
  {
    name: 'Main Site (localhost)',
    hostname: 'localhost',
    expectedType: 'main',
    expectedTenant: null
  },
  {
    name: 'Admin Subdomain',
    hostname: 'admin.localhost',
    expectedType: 'admin',
    expectedTenant: null
  },
  {
    name: 'Valid Tenant Subdomain',
    hostname: 'test-tenant.localhost',
    expectedType: 'tenant',
    expectedTenant: 'test-tenant'
  },
  {
    name: 'Invalid Tenant Subdomain',
    hostname: 'nonexistent.localhost',
    expectedType: 'main', // Should redirect to main
    expectedTenant: null
  }
];

/**
 * Test subdomain functionality
 */
async function testSubdomain() {
  console.log('🌐 Testing Subdomain Middleware...\n');

  for (const testCase of TEST_CASES) {
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
      
      // Validate results
      const infoValid = validateInfoResponse(infoData, testCase);
      const testValid = validateTestResponse(testData, testCase);
      
      if (infoValid && testValid) {
        console.log(`✅ ${testCase.name} - PASSED`);
        console.log(`   Type: ${testData.data.type}`);
        console.log(`   Access Level: ${testData.data.accessLevel}`);
        if (testData.data.tenant) {
          console.log(`   Tenant: ${testData.data.tenant.businessName} (${testData.data.tenant.slug})`);
        }
      } else {
        console.log(`❌ ${testCase.name} - FAILED`);
        if (!infoValid) console.log('   Info response validation failed');
        if (!testValid) console.log('   Test response validation failed');
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name} - ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

/**
 * Validate info response
 */
function validateInfoResponse(data, testCase) {
  if (!data.success) return false;
  if (!data.data) return false;
  
  const { data: info } = data;
  
  // Check hostname
  if (info.hostname !== testCase.hostname) {
    console.log(`   Hostname mismatch: expected ${testCase.hostname}, got ${info.hostname}`);
    return false;
  }
  
  // Check tenant slug
  if (testCase.expectedTenant) {
    if (info.tenantSlug !== testCase.expectedTenant) {
      console.log(`   Tenant slug mismatch: expected ${testCase.expectedTenant}, got ${info.tenantSlug}`);
      return false;
    }
  } else {
    if (info.tenantSlug && info.tenantSlug !== 'main-site') {
      console.log(`   Unexpected tenant slug: ${info.tenantSlug}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate test response
 */
function validateTestResponse(data, testCase) {
  if (!data.success) return false;
  if (!data.data) return false;
  
  const { data: testData } = data;
  
  // Check type
  if (testData.type !== testCase.expectedType) {
    console.log(`   Type mismatch: expected ${testCase.expectedType}, got ${testData.type}`);
    return false;
  }
  
  // Check tenant
  if (testCase.expectedTenant) {
    if (!testData.tenant || testData.tenant.slug !== testCase.expectedTenant) {
      console.log(`   Tenant mismatch: expected ${testCase.expectedTenant}, got ${testData.tenant?.slug || 'none'}`);
      return false;
    }
  } else {
    if (testData.tenant) {
      console.log(`   Unexpected tenant: ${testData.tenant.slug}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Test tenant content endpoint
 */
async function testTenantContent() {
  console.log('📄 Testing Tenant Content Endpoint...\n');
  
  try {
    // Test with a valid tenant slug
    const response = await fetch(`${BASE_URL}/api/subdomain/tenant-content/test-tenant`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Tenant content endpoint working');
      console.log(`   Tenant: ${data.data?.tenant?.businessName || 'Unknown'}`);
      console.log(`   Content Types: ${data.data?.contentTypes?.join(', ') || 'None'}`);
    } else {
      console.log(`❌ Tenant content endpoint failed: ${response.status}`);
    }
    
  } catch (error) {
    console.log(`❌ Tenant content test error: ${error.message}`);
  }
  
  console.log('');
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Starting Subdomain Middleware Tests\n');
  
  // Check if server is running
  try {
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    if (!healthResponse.ok) {
      console.log('❌ Server is not running or not responding');
      console.log('Please start the server with: npm run dev:backend');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Cannot connect to server');
    console.log('Please start the server with: npm run dev:backend');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  
  // Run tests
  await testSubdomain();
  await testTenantContent();
  
  console.log('🎉 Subdomain middleware tests completed!');
  console.log('\n📝 To test with real subdomains:');
  console.log('   1. Add entries to your hosts file:');
  console.log('      127.0.0.1 admin.localhost');
  console.log('      127.0.0.1 test-tenant.localhost');
  console.log('   2. Visit: http://admin.localhost:3000/api/subdomain/test');
  console.log('   3. Visit: http://test-tenant.localhost:3000/api/subdomain/test');
}

// Run tests
main().catch(console.error);
