#!/usr/bin/env node

/**
 * Asset Access Test Script
 * 
 * Tests that assets are accessible via HTTP from the development servers.
 * This verifies that the Vite configuration is working correctly with
 * the new shared public directory structure.
 */

import https from 'https';
import http from 'http';

// Test configuration
const tests = [
  {
    name: 'Tenant App - Favicon',
    url: 'http://tenant.localhost:5177/favicon.ico',
    expectedType: 'image/x-icon'
  },
  {
    name: 'Tenant App - Mobile Detailing Logo',
    url: 'http://tenant.localhost:5177/industries/mobile-detailing/icons/logo.webp',
    expectedType: 'image/webp'
  },
  {
    name: 'Tenant App - Shared Logo',
    url: 'http://tenant.localhost:5177/images/shared/icons/logo.png',
    expectedType: 'image/png'
  },
  {
    name: 'Tenant App - Gallery Data',
    url: 'http://tenant.localhost:5177/industries/mobile-detailing/data/gallery.json',
    expectedType: 'application/json'
  }
];

/**
 * Test a single URL
 */
function testUrl(test) {
  return new Promise((resolve) => {
    const url = new URL(test.url);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode === 200 && 
                       res.headers['content-type']?.includes(test.expectedType.split('/')[0]);
        
        resolve({
          name: test.name,
          url: test.url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          size: data.length,
          success
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        name: test.name,
        url: test.url,
        status: 0,
        contentType: null,
        size: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: test.name,
        url: test.url,
        status: 0,
        contentType: null,
        size: 0,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Testing Asset Access via HTTP');
  console.log('═'.repeat(60));
  console.log(`🕐 Test Time: ${new Date().toLocaleString()}\n`);

  const results = [];
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}...`);
    const result = await testUrl(test);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.name}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Content-Type: ${result.contentType}`);
      console.log(`   Size: ${result.size} bytes\n`);
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Content-Type: ${result.contentType || 'N/A'}`);
      console.log(`   Error: ${result.error || 'Unknown error'}\n`);
    }
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('📊 Test Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All asset access tests passed!');
    console.log('The shared public directory is working correctly.');
  } else {
    console.log('\n⚠️  Some asset access tests failed.');
    console.log('Please check the Vite configuration and server setup.');
  }

  return failed === 0;
}

// Run the tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
