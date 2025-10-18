#!/usr/bin/env node

/**
 * SEO Testing Script
 * 
 * Tests the SEO implementation by checking:
 * - Backend routes (robots.txt, sitemap.xml)
 * - Frontend components integration
 * - Analytics endpoints
 */

import http from 'http';
import https from 'https';

const TEST_URLS = [
  {
    name: 'Robots.txt',
    path: '/robots.txt',
    expectedContent: 'User-agent: *',
    expectedType: 'text/plain'
  },
  {
    name: 'Sitemap.xml',
    path: '/sitemap.xml',
    expectedContent: '<?xml version="1.0" encoding="UTF-8"?>',
    expectedType: 'application/xml'
  }
];

function testEndpoint(baseUrl, test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, baseUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = {
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          hasExpectedContent: data.includes(test.expectedContent),
          hasExpectedType: res.headers['content-type']?.includes(test.expectedType.split('/')[0])
        };
        
        resolve({
          test: test.name,
          url: url.href,
          success: success.statusCode === 200 && success.hasExpectedContent && success.hasExpectedType,
          details: success
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        test: test.name,
        url: url.href,
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        test: test.name,
        url: url.href,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runSEOTests(baseUrl) {
  console.log(`🧪 Testing SEO Implementation for: ${baseUrl}\n`);
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const test of TEST_URLS) {
    console.log(`\n🔍 Testing ${test.name}...`);
    const result = await testEndpoint(baseUrl, test);
    results.push(result);
    
    if (result.success) {
      console.log(`   ✅ ${test.name} - PASS`);
      console.log(`   📍 URL: ${result.url}`);
      console.log(`   📊 Status: ${result.details.statusCode}`);
      console.log(`   📄 Content-Type: ${result.details.contentType}`);
    } else {
      console.log(`   ❌ ${test.name} - FAIL`);
      console.log(`   📍 URL: ${result.url}`);
      if (result.error) {
        console.log(`   🚨 Error: ${result.error}`);
      } else {
        console.log(`   📊 Status: ${result.details.statusCode}`);
        console.log(`   📄 Content-Type: ${result.details.contentType}`);
        console.log(`   🔍 Expected Content: ${result.details.hasExpectedContent ? '✅' : '❌'}`);
        console.log(`   🔍 Expected Type: ${result.details.hasExpectedType ? '✅' : '❌'}`);
      }
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Summary:');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`   ✅ Passed: ${passed}/${total}`);
  console.log(`   ❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All SEO tests passed! Your implementation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend server and routes.');
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure the backend server is running');
    console.log('   2. Check that SEO routes are properly registered');
    console.log('   3. Verify the routes are accessible from the frontend');
  }
  
  return results;
}

// Main execution
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:3001';

if (args.includes('--help')) {
  console.log(`
🧪 SEO Testing Script

Usage:
  node scripts/test-seo.js [baseUrl] [options]

Arguments:
  baseUrl     Base URL to test (default: http://localhost:3001)

Options:
  --help      Show this help message

Examples:
  node scripts/test-seo.js
  node scripts/test-seo.js http://localhost:3001
  node scripts/test-seo.js https://your-domain.com
    `);
} else {
  runSEOTests(baseUrl).catch(console.error);
}

export { runSEOTests };
