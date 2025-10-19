#!/usr/bin/env node

/**
 * SEO Configuration Provisioning Script
 * 
 * Extends tenant provisioning to include SEO configuration.
 * This ensures Cursor's schema diff sees website.seo_config and
 * ties the new SEO layer to real data.
 */

import { pool } from '../../backend/database/pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load industry SEO defaults from JSON files
 */
function loadIndustryDefaults(industry) {
  const defaultsPath = path.resolve(__dirname, '../../../frontend/src/shared/seo/seoDefaults', `${industry}.json`);
  
  if (!fs.existsSync(defaultsPath)) {
    console.warn(`⚠️  No SEO defaults found for industry: ${industry}`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(defaultsPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading SEO defaults for ${industry}:`, error.message);
    return null;
  }
}

/**
 * Provision SEO configuration for a tenant
 */
async function provisionSeoConfig(tenantId, industry, businessName) {
  const defaults = loadIndustryDefaults(industry);
  
  if (!defaults) {
    console.log(`⚠️  Skipping SEO config for tenant ${tenantId} (no defaults for ${industry})`);
    return false;
  }
  
  // Generate tenant-specific SEO content
  const metaTitle = `${businessName} - ${defaults.title}`;
  const metaDescription = defaults.description.replace('Expert', `${businessName} provides expert`);
  const keywords = [...defaults.keywords];
  
  try {
    await pool.query(`
      INSERT INTO website.seo_config (
        business_id, 
        meta_title, 
        meta_description, 
        keywords,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (business_id) 
      DO UPDATE SET
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        keywords = EXCLUDED.keywords,
        updated_at = NOW()
    `, [tenantId, metaTitle, metaDescription, keywords]);
    
    console.log(`✅ SEO config provisioned for tenant ${tenantId} (${industry})`);
    return true;
  } catch (error) {
    console.error(`❌ Error provisioning SEO config for tenant ${tenantId}:`, error.message);
    return false;
  }
}

/**
 * Provision SEO config for all existing tenants
 */
async function provisionAllTenants() {
  console.log('🚀 Starting SEO configuration provisioning...\n');
  
  try {
    // Get all tenants
    const result = await pool.query(`
      SELECT 
        b.id,
        b.name as business_name,
        b.industry,
        b.created_at
      FROM tenants.business b
      LEFT JOIN website.seo_config sc ON sc.business_id = b.id
      WHERE sc.id IS NULL
      ORDER BY b.created_at DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('✅ All tenants already have SEO configuration');
      return;
    }
    
    console.log(`📊 Found ${result.rows.length} tenants without SEO configuration\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const tenant of result.rows) {
      console.log(`🔧 Processing tenant: ${tenant.business_name} (${tenant.industry})`);
      
      const success = await provisionSeoConfig(
        tenant.id, 
        tenant.industry, 
        tenant.business_name
      );
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    console.log('\n📈 Provisioning Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📊 Total: ${result.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error during SEO provisioning:', error.message);
    throw error;
  }
}

/**
 * Create SEO config for a specific tenant
 */
async function provisionSingleTenant(tenantId) {
  console.log(`🚀 Provisioning SEO config for tenant ${tenantId}...\n`);
  
  try {
    const result = await pool.query(`
      SELECT id, name as business_name, industry
      FROM tenants.business 
      WHERE id = $1
    `, [tenantId]);
    
    if (result.rows.length === 0) {
      console.error(`❌ Tenant ${tenantId} not found`);
      return false;
    }
    
    const tenant = result.rows[0];
    console.log(`📊 Tenant: ${tenant.business_name} (${tenant.industry})`);
    
    const success = await provisionSeoConfig(tenant.id, tenant.industry, tenant.business_name);
    
    if (success) {
      console.log('✅ SEO configuration provisioned successfully');
    }
    
    return success;
    
  } catch (error) {
    console.error('❌ Error provisioning SEO config:', error.message);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
🔧 SEO Configuration Provisioning Script

Usage:
  node scripts/seo/provision-config.js [options] [tenantId]

Arguments:
  tenantId    Optional. Provision SEO config for specific tenant ID

Options:
  --help      Show this help message
  --all       Provision SEO config for all tenants (default)

Examples:
  node scripts/seo/provision-config.js --all
  node scripts/seo/provision-config.js 123
    `);
} else {
  const tenantId = args.find(arg => !arg.startsWith('--'));
  
  if (tenantId) {
    provisionSingleTenant(tenantId)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    provisionAllTenants()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { provisionSeoConfig, provisionAllTenants, provisionSingleTenant };
