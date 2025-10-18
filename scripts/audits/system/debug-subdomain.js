#!/usr/bin/env node
/**
 * Debug Subdomain Middleware
 * Test subdomain extraction and tenant lookup
 */

import { extractSubdomain } from '../backend/middleware/subdomainMiddleware.js';
import { getTenantBySlug } from '../backend/services/tenantService.js';

console.log('🔍 Debugging Subdomain Middleware...\n');

// Test subdomain extraction
const testHostnames = [
  'localhost',
  'admin.localhost',
  'test-tenant.localhost',
  'thatsmartsite.com',
  'admin.thatsmartsite.com',
  'test-tenant.thatsmartsite.com'
];

console.log('1️⃣ Testing Subdomain Extraction:');
for (const hostname of testHostnames) {
  const subdomain = extractSubdomain(hostname);
  console.log(`   ${hostname} → ${subdomain || 'null'}`);
}

console.log('\n2️⃣ Testing Tenant Lookup:');
const testSlugs = ['admin', 'test-tenant', 'nonexistent'];

for (const slug of testSlugs) {
  try {
    const tenant = await getTenantBySlug(slug);
    console.log(`   ${slug} → ${tenant ? `Found (${tenant.business_name})` : 'Not found'}`);
  } catch (error) {
    console.log(`   ${slug} → Error: ${error.message}`);
  }
}

console.log('\n✅ Debug complete!');
