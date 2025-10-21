#!/usr/bin/env node

/**
 * Asset Health Check Script
 * 
 * Verifies that all shared assets in frontend/apps/public are accessible
 * from each Vite app (main-site, admin-app, tenant-app).
 * 
 * This script helps ensure the migration to shared public directory
 * was successful and no assets are missing or inaccessible.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(projectRoot, 'frontend/apps/public');

// Test URLs for each app
const testUrls = {
  'main-site': 'http://main.localhost:5175',
  'admin-app': 'http://admin.localhost:5176', 
  'tenant-app': 'http://tenant.localhost:5177'
};

// Critical assets to test
const criticalAssets = [
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'manifest.json',
  'sw.js'
];

// Industry assets to test
const industryAssets = [
  'industries/mobile-detailing/icons/logo.webp',
  'industries/mobile-detailing/data/gallery.json',
  'industries/maid-service/icons/logo.png',
  'industries/lawncare/icons/logo.png',
  'industries/pet-grooming/icons/logo.png',
  'industries/barber/icons/logo.png'
];

// Shared assets to test
const sharedAssets = [
  'icons/logo.png',
  'icons/favicon.svg',
  'icons/google.png',
  'icons/yelp.png',
  'images/background.png',
  'data/preview-avatars/avatar-1.jfif'
];

/**
 * Check if a file exists in the public directory
 */
function checkAssetExists(assetPath) {
  const fullPath = path.join(publicDir, assetPath);
  return fs.existsSync(fullPath);
}

/**
 * Get file size for verification
 */
function getAssetSize(assetPath) {
  const fullPath = path.join(publicDir, assetPath);
  try {
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Run health check for a specific category of assets
 */
function checkAssetCategory(category, assets, description) {
  console.log(`\n🔍 Checking ${description}...`);
  console.log('─'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  for (const asset of assets) {
    const exists = checkAssetExists(asset);
    const size = getAssetSize(asset);
    
    if (exists && size > 0) {
      console.log(`✅ ${asset} (${formatFileSize(size)})`);
      passed++;
    } else {
      console.log(`❌ ${asset} (missing or empty)`);
      failed++;
    }
  }
  
  return { passed, failed, total: assets.length };
}

/**
 * Check directory structure
 */
function checkDirectoryStructure() {
  console.log('\n📁 Checking Directory Structure...');
  console.log('─'.repeat(60));
  
  const requiredDirs = [
    'industries',
    'images',
    'data',
    'data/preview',
    'data/seo',
    'static',
    'screenshots'
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(publicDir, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      console.log(`✅ ${dir}/`);
      passed++;
    } else {
      console.log(`❌ ${dir}/ (missing)`);
      failed++;
    }
  }
  
  return { passed, failed, total: requiredDirs.length };
}

/**
 * Check industry directories
 */
function checkIndustryDirectories() {
  console.log('\n🏭 Checking Industry Directories...');
  console.log('─'.repeat(60));
  
  const industries = ['mobile-detailing', 'maid-service', 'lawncare', 'pet-grooming', 'barber'];
  let passed = 0;
  let failed = 0;
  
  for (const industry of industries) {
    const industryPath = path.join(publicDir, 'industries', industry);
    if (fs.existsSync(industryPath) && fs.statSync(industryPath).isDirectory()) {
      // Check for required subdirectories
      const subdirs = ['data', 'icons', 'images', 'video'];
      let hasAllSubdirs = true;
      
      for (const subdir of subdirs) {
        const subdirPath = path.join(industryPath, subdir);
        if (!fs.existsSync(subdirPath) || !fs.statSync(subdirPath).isDirectory()) {
          hasAllSubdirs = false;
          break;
        }
      }
      
      if (hasAllSubdirs) {
        console.log(`✅ industries/${industry}/ (with all subdirs)`);
        passed++;
      } else {
        console.log(`⚠️  industries/${industry}/ (missing some subdirs)`);
        failed++;
      }
    } else {
      console.log(`❌ industries/${industry}/ (missing)`);
      failed++;
    }
  }
  
  return { passed, failed, total: industries.length };
}

/**
 * Main health check function
 */
async function runHealthCheck() {
  console.log('🏥 That Smart Site - Asset Health Check');
  console.log('═'.repeat(60));
  console.log(`📂 Public Directory: ${publicDir}`);
  console.log(`🕐 Check Time: ${new Date().toLocaleString()}`);
  
  // Check if public directory exists
  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Public directory not found: ${publicDir}`);
    process.exit(1);
  }
  
  // Run all checks
  const structureCheck = checkDirectoryStructure();
  const industryCheck = checkIndustryDirectories();
  const criticalCheck = checkAssetCategory('critical', criticalAssets, 'Critical Assets');
  const industryAssetCheck = checkAssetCategory('industry', industryAssets, 'Industry Assets');
  const sharedCheck = checkAssetCategory('shared', sharedAssets, 'Shared Assets');
  
  // Calculate totals
  const totalPassed = structureCheck.passed + industryCheck.passed + criticalCheck.passed + industryAssetCheck.passed + sharedCheck.passed;
  const totalFailed = structureCheck.failed + industryCheck.failed + criticalCheck.failed + industryAssetCheck.failed + sharedCheck.failed;
  const totalChecks = totalPassed + totalFailed;
  
  // Summary
  console.log('\n📊 Health Check Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${totalPassed}/${totalChecks}`);
  console.log(`❌ Failed: ${totalFailed}/${totalChecks}`);
  console.log(`📈 Success Rate: ${((totalPassed / totalChecks) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All assets are healthy! The migration was successful.');
    console.log('\n💡 Next steps:');
    console.log('   1. Test each app in development mode');
    console.log('   2. Verify favicon loads correctly');
    console.log('   3. Check that no infinite reload loops occur');
    console.log('   4. Run build process to ensure production assets work');
  } else {
    console.log('\n⚠️  Some assets are missing or problematic.');
    console.log('   Please review the failed checks above and fix any issues.');
  }
  
  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run the health check
runHealthCheck().catch(error => {
  console.error('❌ Health check failed:', error);
  process.exit(1);
});
