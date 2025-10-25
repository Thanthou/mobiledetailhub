#!/usr/bin/env node

/**
 * Seed Tenants Script
 * 
 * Seeds demo tenants from JSON fixture files.
 * Only tenants with "enabled": true will be seeded.
 * 
 * Usage:
 *   node scripts/seeding/seed-tenants.js           # Seed all enabled tenants
 *   node scripts/seeding/seed-tenants.js --clean   # Delete all demo tenants first
 *   node scripts/seeding/seed-tenants.js --force   # Recreate existing tenants
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TenantFactory } from './factories/tenantFactory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line args
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');
const shouldForce = args.includes('--force');
const shouldRemove = args.includes('--remove');

/**
 * Load all JSON files from data directory
 */
function loadFixtures() {
  const dataDir = path.join(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  const fixtures = [];
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Only include if enabled is true
    if (data.enabled === true) {
      fixtures.push({
        filename: file,
        data: data
      });
    }
  }
  
  return fixtures;
}

/**
 * Clean existing demo tenants
 */
async function cleanDemoTenants() {
  console.log('\n🧹 Cleaning existing demo tenants...');
  
  const dataDir = path.join(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    try {
      await TenantFactory.delete(data.slug);
    } catch (error) {
      // Continue even if delete fails
      console.log(`   ⚠️  Could not delete ${data.slug}: ${error.message}`);
    }
  }
  
  console.log('✅ Cleanup complete');
}

/**
 * Main seeding function
 */
async function seedTenants() {
  try {
    // If --remove flag, just delete and exit
    if (shouldRemove) {
      console.log('🗑️  Removing demo tenants...\n');
      await cleanDemoTenants();
      console.log('\n✅ All demo tenants removed!\n');
      process.exit(0);
    }
    
    console.log('🌱 Starting tenant seeding...\n');
    
    // Clean first if requested
    if (shouldClean) {
      await cleanDemoTenants();
      console.log('\n');
    }
    
    // Load fixtures
    const fixtures = loadFixtures();
    
    if (fixtures.length === 0) {
      console.log('⚠️  No enabled tenants found in data/ directory');
      console.log('   Set "enabled": true in JSON files to seed them\n');
      process.exit(0);
    }
    
    console.log(`Found ${fixtures.length} enabled tenant(s) to seed:\n`);
    fixtures.forEach(f => {
      console.log(`  • ${f.data.business_name} (${f.filename})`);
    });
    
    // Seed each tenant
    const results = [];
    for (const fixture of fixtures) {
      try {
        // Check if exists
        const exists = await TenantFactory.exists(fixture.data.slug);
        
        if (exists && !shouldForce && !shouldClean) {
          console.log(`\n⏭️  Skipping ${fixture.data.business_name} (already exists)`);
          console.log(`   Use --force to recreate existing tenants`);
          continue;
        }
        
        const result = await TenantFactory.create(fixture.data);
        results.push({
          success: true,
          tenant: result.tenant,
          user: result.user
        });
      } catch (error) {
        console.error(`\n❌ Failed to seed ${fixture.data.business_name}:`);
        console.error(`   ${error.message}`);
        results.push({
          success: false,
          error: error.message
        });
      }
    }
    
    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Seeding Complete!');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed}`);
    }
    
    // Show tenant info
    if (successful > 0) {
      console.log('\n📋 Seeded Tenants:\n');
      results.filter(r => r.success).forEach(r => {
        console.log(`🏢 ${r.tenant.business_name}`);
        console.log(`   URL: https://${r.tenant.slug}.thatsmartsite.com`);
        console.log(`   Login: ${r.user.email}`);
        console.log('');
      });
    }
    
    console.log('💡 Tips:');
    console.log('   • Add more tenants: Create JSON files in scripts/seeding/data/');
    console.log('   • Enable/disable: Set "enabled": true/false in JSON files');
    console.log('   • Clean and reseed: npm run seed:clean\n');
    
    process.exit(failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Fatal error during seeding:');
    console.error(error);
    process.exit(1);
  }
}

// Run seeding
seedTenants();

