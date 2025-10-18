#!/usr/bin/env node
/**
 * Simple Subdomain Middleware Test
 * Tests the subdomain extraction logic without requiring a running server
 */

import { extractSubdomain } from '../backend/middleware/subdomainMiddleware.js';

console.log('🌐 Testing Subdomain Extraction Logic...\n');

const testCases = [
  { hostname: 'localhost', expected: null, description: 'Localhost (no subdomain)' },
  { hostname: 'localhost:3000', expected: null, description: 'Localhost with port' },
  { hostname: 'admin.localhost', expected: 'admin', description: 'Admin subdomain' },
  { hostname: 'admin.localhost:3000', expected: 'admin', description: 'Admin subdomain with port' },
  { hostname: 'test-tenant.localhost', expected: 'test-tenant', description: 'Tenant subdomain' },
  { hostname: 'mobile-detailing.localhost', expected: 'mobile-detailing', description: 'Hyphenated tenant subdomain' },
  { hostname: 'thatsmartsite.com', expected: null, description: 'Main domain' },
  { hostname: 'www.thatsmartsite.com', expected: null, description: 'WWW subdomain' },
  { hostname: 'admin.thatsmartsite.com', expected: 'admin', description: 'Admin production subdomain' },
  { hostname: 'test-tenant.thatsmartsite.com', expected: 'test-tenant', description: 'Tenant production subdomain' },
  { hostname: 'staging.thatsmartsite.com', expected: 'staging', description: 'Staging subdomain' },
  { hostname: 'test.staging.thatsmartsite.com', expected: 'test', description: 'Nested staging subdomain' },
  { hostname: '127.0.0.1', expected: null, description: 'IP address' },
  { hostname: '127.0.0.1:3000', expected: null, description: 'IP address with port' }
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const result = extractSubdomain(testCase.hostname);
  const success = result === testCase.expected;
  
  if (success) {
    console.log(`✅ ${testCase.description}`);
    console.log(`   ${testCase.hostname} → ${result || 'null'}`);
    passed++;
  } else {
    console.log(`❌ ${testCase.description}`);
    console.log(`   ${testCase.hostname} → ${result || 'null'} (expected: ${testCase.expected || 'null'})`);
    failed++;
  }
  console.log('');
}

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All subdomain extraction tests passed!');
} else {
  console.log('⚠️  Some tests failed. Check the implementation.');
  process.exit(1);
}
