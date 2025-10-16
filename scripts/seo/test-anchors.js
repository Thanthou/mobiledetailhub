#!/usr/bin/env node

/**
 * SEO Anchor Test Script
 * 
 * Tests that the minimal SEO skeleton structure is properly anchored
 * and that Cursor will recognize the SEO module boundaries.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEO_ANCHOR_FILES = [
  // Frontend SEO module
  'frontend/src/shared/seo/index.ts',
  'frontend/src/shared/seo/SeoHead.tsx',
  'frontend/src/shared/seo/jsonld.ts',
  'frontend/src/shared/seo/sitemapBuilder.ts',
  'frontend/src/shared/seo/robotsHandler.ts',
  
  // SEO defaults
  'frontend/src/shared/seo/seoDefaults/README.md',
  'frontend/src/shared/seo/seoDefaults/mobile-detailing.json',
  'frontend/src/shared/seo/seoDefaults/lawncare.json',
  'frontend/src/shared/seo/seoDefaults/maid-service.json',
  'frontend/src/shared/seo/seoDefaults/pet-grooming.json',
  
  // Backend SEO routes
  'backend/routes/seo/index.ts',
  'backend/routes/seo/robotsRoute.ts',
  'backend/routes/seo/sitemapRoute.ts',
  
  // Database schema
  'backend/database/schemas/website/seo_config.sql',
  
  // Analytics hook
  'frontend/src/shared/hooks/useAnalytics.ts'
];

function checkFileExists(filePath) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  return fs.existsSync(fullPath);
}

function readFileContent(filePath) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function testSEOAnchors() {
  console.log('🧪 Testing SEO Anchor Structure\n');
  console.log('=' .repeat(60));
  
  let totalFiles = 0;
  let existingFiles = 0;
  let properlyAnchored = 0;
  
  SEO_ANCHOR_FILES.forEach(filePath => {
    totalFiles++;
    console.log(`\n📄 ${filePath}`);
    
    if (!checkFileExists(filePath)) {
      console.log('   ❌ File not found');
      return;
    }
    
    existingFiles++;
    const content = readFileContent(filePath);
    
    // Check for anchor comments
    const hasAnchorComment = content.includes('anchors Cursor') || 
                           content.includes('anchor') ||
                           content.includes('This module');
    
    if (hasAnchorComment) {
      properlyAnchored++;
      console.log('   ✅ Properly anchored');
    } else {
      console.log('   ⚠️  Missing anchor comments');
    }
    
    // Show file size and key content
    const lines = content.split('\n').length;
    console.log(`   📊 ${lines} lines`);
    
    if (filePath.includes('SeoHead.tsx')) {
      const hasTitle = content.includes('<title>');
      const hasNoindex = content.includes('noindex');
      console.log(`   🔍 Title handling: ${hasTitle ? '✅' : '❌'}`);
      console.log(`   🔍 Noindex handling: ${hasNoindex ? '✅' : '❌'}`);
    }
    
    if (filePath.includes('jsonld.ts')) {
      const hasSchema = content.includes('@context');
      const hasBusiness = content.includes('LocalBusiness');
      console.log(`   🔍 Schema generation: ${hasSchema ? '✅' : '❌'}`);
      console.log(`   🔍 Business schema: ${hasBusiness ? '✅' : '❌'}`);
    }
  });
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SEO Anchor Test Results:');
  console.log(`   Total Files Expected: ${totalFiles}`);
  console.log(`   Files Found: ${existingFiles}`);
  console.log(`   Properly Anchored: ${properlyAnchored}`);
  
  const completionPercentage = Math.round((existingFiles / totalFiles) * 100);
  const anchorPercentage = Math.round((properlyAnchored / existingFiles) * 100);
  
  console.log(`   File Completion: ${completionPercentage}%`);
  console.log(`   Anchor Quality: ${anchorPercentage}%`);
  
  if (completionPercentage === 100 && anchorPercentage >= 80) {
    console.log('\n🎉 SEO structure is properly anchored!');
    console.log('   Cursor should now recognize the SEO module boundaries.');
    console.log('   All SEO-related edits will route through the shared/seo/ module.');
  } else if (completionPercentage >= 80) {
    console.log('\n🔄 Almost there! A few files need attention.');
  } else {
    console.log('\n⚠️  SEO structure needs more work.');
    console.log('   Missing files will prevent Cursor from recognizing the architecture.');
  }
  
  return {
    totalFiles,
    existingFiles,
    properlyAnchored,
    completionPercentage,
    anchorPercentage
  };
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
🧪 SEO Anchor Test Script

Usage:
  node scripts/test-seo-anchors.js [options]

Options:
  --help      Show this help message

This script tests that the minimal SEO skeleton structure is properly
anchored for Cursor to recognize and respect the SEO module boundaries.
  `);
} else {
  testSEOAnchors();
}

export { testSEOAnchors };
