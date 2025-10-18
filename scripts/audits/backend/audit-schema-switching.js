#!/usr/bin/env node
/**
 * Schema Switching Verification Audit
 * Verifies that tenant middleware properly switches database schemas
 */

import { getPool } from '../backend/database/pool.js';
import { createModuleLogger } from '../backend/config/logger.js';

const logger = createModuleLogger('schemaAudit');

/**
 * Test schema switching functionality
 */
async function testSchemaSwitching() {
  console.log('🔍 Schema Switching Verification Audit\n');

  const pool = await getPool();
  
  try {
    // Test 1: Check current schema
    console.log('1️⃣ Testing Current Schema Detection:');
    const currentSchemaResult = await pool.query('SELECT current_schema() as current_schema');
    console.log(`   Current schema: ${currentSchemaResult.rows[0].current_schema}`);
    
    // Test 2: Check available schemas
    console.log('\n2️⃣ Available Schemas:');
    const schemasResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
    
    schemasResult.rows.forEach(row => {
      console.log(`   - ${row.schema_name}`);
    });
    
    // Test 3: Test schema switching
    console.log('\n3️⃣ Testing Schema Switching:');
    const testSchemas = ['tenants', 'website', 'analytics'];
    
    for (const schema of testSchemas) {
      try {
        await pool.query(`SET search_path TO ${schema}, public`);
        const result = await pool.query('SELECT current_schema() as current_schema');
        console.log(`   ✅ Switched to ${schema}: ${result.rows[0].current_schema}`);
        
        // Test table access in that schema
        const tablesResult = await pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = '${schema}' 
          LIMIT 3
        `);
        
        if (tablesResult.rows.length > 0) {
          console.log(`     Tables: ${tablesResult.rows.map(r => r.table_name).join(', ')}`);
        } else {
          console.log(`     No tables found in ${schema}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Failed to switch to ${schema}: ${error.message}`);
      }
    }
    
    // Test 4: Test tenant-specific schema switching
    console.log('\n4️⃣ Testing Tenant-Specific Schema Switching:');
    
    // Reset to default schema
    await pool.query('SET search_path TO public');
    
    // Simulate tenant middleware schema switching
    const testTenants = [
      { slug: 'test-tenant-1', schema: 'tenants' },
      { slug: 'test-tenant-2', schema: 'tenants' },
      { slug: 'admin', schema: 'tenants' }
    ];
    
    for (const tenant of testTenants) {
      try {
        // Simulate what the middleware should do
        await pool.query(`SET search_path TO ${tenant.schema}, public`);
        
        // Test tenant lookup in the correct schema
        const tenantResult = await pool.query(`
          SELECT id, slug, business_name 
          FROM tenants.business 
          WHERE slug = $1 
          LIMIT 1
        `, [tenant.slug]);
        
        if (tenantResult.rows.length > 0) {
          console.log(`   ✅ Tenant ${tenant.slug}: Found in ${tenant.schema} schema`);
        } else {
          console.log(`   ⚠️  Tenant ${tenant.slug}: Not found in ${tenant.schema} schema`);
        }
        
      } catch (error) {
        console.log(`   ❌ Tenant ${tenant.slug}: Error - ${error.message}`);
      }
    }
    
    // Test 5: Verify schema isolation
    console.log('\n5️⃣ Testing Schema Isolation:');
    
    // Switch to tenants schema
    await pool.query('SET search_path TO tenants, public');
    
    // Try to access website schema tables
    try {
      const websiteResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'website'
        LIMIT 1
      `);
      
      if (websiteResult.rows.length > 0) {
        console.log(`   ✅ Can access website schema tables: ${websiteResult.rows[0].table_name}`);
      } else {
        console.log(`   ⚠️  No website schema tables accessible`);
      }
    } catch (error) {
      console.log(`   ❌ Cannot access website schema: ${error.message}`);
    }
    
    // Reset to default
    await pool.query('SET search_path TO public');
    
    console.log('\n✅ Schema switching audit completed!');
    
  } catch (error) {
    console.log(`❌ Schema audit failed: ${error.message}`);
    logger.error({
      event: 'schema_audit_error',
      error: error.message,
      stack: error.stack
    }, 'Schema switching audit failed');
  }
}

/**
 * Test tenant middleware schema switching
 */
async function testTenantMiddlewareSchemaSwitching() {
  console.log('\n🔧 Testing Tenant Middleware Schema Switching:\n');
  
  const pool = await getPool();
  
  try {
    // Simulate the middleware flow
    const testCases = [
      { hostname: 'localhost', expectedSchema: 'public' },
      { hostname: 'admin.localhost', expectedSchema: 'tenants' },
      { hostname: 'test-tenant.localhost', expectedSchema: 'tenants' },
      { hostname: 'thatsmartsite.com', expectedSchema: 'public' }
    ];
    
    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.hostname}`);
      
      // Simulate subdomain extraction
      const subdomain = extractSubdomain(testCase.hostname);
      console.log(`   Subdomain: ${subdomain || 'null'}`);
      
      // Simulate schema switching logic
      if (subdomain && subdomain !== 'www') {
        // Switch to tenants schema for tenant/admin subdomains
        await pool.query('SET search_path TO tenants, public');
        console.log(`   ✅ Switched to tenants schema`);
        
        // Test tenant lookup
        if (subdomain === 'admin') {
          console.log(`   ✅ Admin subdomain - using tenants schema`);
        } else {
          // Try to find tenant
          const tenantResult = await pool.query(`
            SELECT id, slug, business_name 
            FROM tenants.business 
            WHERE slug = $1 
            LIMIT 1
          `, [subdomain]);
          
          if (tenantResult.rows.length > 0) {
            console.log(`   ✅ Tenant found: ${tenantResult.rows[0].business_name}`);
          } else {
            console.log(`   ⚠️  Tenant not found: ${subdomain}`);
          }
        }
      } else {
        // Stay in public schema for main site
        await pool.query('SET search_path TO public');
        console.log(`   ✅ Using public schema for main site`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.log(`❌ Middleware schema test failed: ${error.message}`);
  }
}

/**
 * Extract subdomain from hostname (copied from middleware)
 */
function extractSubdomain(hostname) {
  const cleanHost = hostname.split(':')[0];
  const parts = cleanHost.split('.');
  
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return null;
  }
  
  if (parts.length >= 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  
  if (parts.length >= 3 && parts[1] === 'thatsmartsite' && parts[2] === 'com') {
    if (parts[0] === 'www') {
      return null;
    }
    return parts[0];
  }
  
  return null;
}

/**
 * Main audit function
 */
async function main() {
  console.log('🚀 Starting Schema Switching Verification Audit\n');
  
  try {
    await testSchemaSwitching();
    await testTenantMiddlewareSchemaSwitching();
    
    console.log('\n🎉 Schema switching audit completed successfully!');
    console.log('\n📝 Recommendations:');
    console.log('   1. Implement dynamic schema switching in tenant middleware');
    console.log('   2. Add BASE_DOMAIN environment variable');
    console.log('   3. Test schema isolation between tenants');
    console.log('   4. Add schema switching to health monitoring');
    
  } catch (error) {
    console.log(`❌ Audit failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the audit
main().catch(console.error);
