#!/usr/bin/env node
/**
 * Create Test Tenant
 * Creates a test tenant for subdomain testing
 */

import { getPool } from '../backend/database/pool.js';

async function createTestTenant() {
  console.log('🏢 Creating test tenant...');
  
  const pool = await getPool();
  
  try {
    // Create test tenant
    const result = await pool.query(`
      INSERT INTO tenants.business (
        slug, 
        business_name, 
        industry, 
        business_email, 
        application_status,
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug, business_name
    `, [
      'test-tenant',
      'Test Mobile Detailing',
      'mobile-detailing',
      'test@example.com',
      'approved'
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Test tenant created successfully!');
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Slug: ${result.rows[0].slug}`);
      console.log(`   Business: ${result.rows[0].business_name}`);
    } else {
      console.log('ℹ️  Test tenant already exists');
    }
    
    // Verify tenant exists
    const verifyResult = await pool.query(`
      SELECT id, slug, business_name, application_status 
      FROM tenants.business 
      WHERE slug = 'test-tenant'
    `);
    
    if (verifyResult.rows.length > 0) {
      console.log('\n✅ Verification successful:');
      console.log(`   ${verifyResult.rows[0].business_name} (${verifyResult.rows[0].slug})`);
      console.log(`   Status: ${verifyResult.rows[0].application_status}`);
    }
    
  } catch (error) {
    console.log(`❌ Error creating test tenant: ${error.message}`);
    process.exit(1);
  }
  
  process.exit(0);
}

createTestTenant().catch(console.error);
