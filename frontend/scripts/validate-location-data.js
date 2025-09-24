#!/usr/bin/env node

/**
 * Build-time validation script for location data
 * Run this script to validate all location JSON files before deployment
 * 
 * Usage:
 *   node scripts/validate-location-data.js
 *   npm run validate-location-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import validation functions (this will be compiled from TypeScript)
// For now, we'll use a simplified validation approach
function validateLocationData(data, filename) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  const requiredFields = ['slug', 'city', 'stateCode', 'state', 'postalCode', 'urlPath', 'seo', 'hero'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate slug format
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  // Validate state code
  if (data.stateCode && !/^[A-Z]{2}$/.test(data.stateCode)) {
    errors.push('State code must be 2 uppercase letters');
  }
  
  // Validate postal code
  if (data.postalCode && !/^\d{5}(-\d{4})?$/.test(data.postalCode)) {
    errors.push('Postal code must be valid ZIP format (12345 or 12345-6789)');
  }
  
  // Validate URL path
  if (data.urlPath && !data.urlPath.startsWith('/') || !data.urlPath.endsWith('/')) {
    errors.push('URL path must start and end with /');
  }
  
  // Validate coordinates
  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  
  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  // Validate pricing modifier
  if (data.pricingModifierPct !== undefined) {
    if (data.pricingModifierPct < -0.5 || data.pricingModifierPct > 1.0) {
      errors.push('Pricing modifier must be between -0.5 (-50%) and 1.0 (+100%)');
    }
  }
  
  // Validate SEO fields
  if (data.seo) {
    if (!data.seo.title) {
      errors.push('SEO title is required');
    }
    if (!data.seo.description) {
      errors.push('SEO description is required');
    }
  }
  
  // Validate hero fields
  if (data.hero) {
    if (!data.hero.h1) {
      errors.push('Hero H1 is required');
    }
  }
  
  // Validate images
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((image, index) => {
      if (!image.url) {
        errors.push(`Image ${index}: URL is required`);
      }
      if (!image.alt) {
        errors.push(`Image ${index}: Alt text is required`);
      }
      if (!image.role) {
        errors.push(`Image ${index}: Role is required`);
      }
      const validRoles = ['hero', 'gallery', 'process', 'result', 'auto', 'marine', 'rv'];
      if (image.role && !validRoles.includes(image.role)) {
        errors.push(`Image ${index}: Role must be one of: ${validRoles.join(', ')}`);
      }
    });
  }
  
  // Validate FAQs
  if (data.faqs && Array.isArray(data.faqs)) {
    data.faqs.forEach((faq, index) => {
      if (!faq.q) {
        errors.push(`FAQ ${index}: Question is required`);
      }
      if (!faq.a) {
        errors.push(`FAQ ${index}: Answer is required`);
      }
    });
  }
  
  // Validate service area
  if (data.serviceArea && data.serviceArea.postalCodes) {
    if (!Array.isArray(data.serviceArea.postalCodes)) {
      errors.push('Service area postal codes must be an array');
    } else {
      data.serviceArea.postalCodes.forEach((zip, index) => {
        if (!/^\d{5}(-\d{4})?$/.test(zip)) {
          errors.push(`Service area postal code ${index}: Must be valid ZIP format`);
        }
      });
    }
  }
  
  // Warnings for missing optional but recommended fields
  if (!data.faqs || data.faqs.length === 0) {
    warnings.push('No FAQs provided - consider adding location-specific FAQs');
  }
  
  if (!data.neighborhoods || data.neighborhoods.length === 0) {
    warnings.push('No neighborhoods listed - consider adding local neighborhoods for SEO');
  }
  
  if (!data.localConditions || data.localConditions.length === 0) {
    warnings.push('No local conditions listed - consider adding location-specific conditions');
  }
  
  if (!data.images || data.images.length === 0) {
    warnings.push('No images provided - consider adding location-specific images');
  }
  
  return { errors, warnings };
}

function findLocationFiles() {
  const locationDir = path.join(__dirname, '../src/data/areas');
  const files = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.json')) {
        files.push(fullPath);
      }
    });
  }
  
  if (fs.existsSync(locationDir)) {
    scanDirectory(locationDir);
  }
  
  return files;
}

function validateAllLocationFiles() {
  console.log('🔍 Validating location data files...\n');
  
  const locationFiles = findLocationFiles();
  console.log(`Found ${locationFiles.length} location files:`, locationFiles.map(f => path.basename(f)));
  
  if (locationFiles.length === 0) {
    console.log('⚠️  No location files found in src/data/areas/');
    return;
  }
  
  let totalErrors = 0;
  let totalWarnings = 0;
  let validFiles = 0;
  
  locationFiles.forEach(filePath => {
    const filename = path.relative(process.cwd(), filePath);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      const { errors, warnings } = validateLocationData(data, filename);
      
      if (errors.length === 0) {
        console.log(`✅ ${filename}`);
        validFiles++;
        
        if (warnings.length > 0) {
          warnings.forEach(warning => {
            console.log(`   ⚠️  ${warning}`);
          });
        }
      } else {
        console.log(`❌ ${filename}`);
        errors.forEach(error => {
          console.log(`   ❌ ${error}`);
        });
        
        if (warnings.length > 0) {
          warnings.forEach(warning => {
            console.log(`   ⚠️  ${warning}`);
          });
        }
      }
      
      totalErrors += errors.length;
      totalWarnings += warnings.length;
      
    } catch (error) {
      console.log(`❌ ${filename}`);
      console.log(`   ❌ JSON parse error: ${error.message}`);
      totalErrors++;
    }
    
    console.log(''); // Empty line for readability
  });
  
  // Summary
  console.log('📊 Validation Summary:');
  console.log(`   Files processed: ${locationFiles.length}`);
  console.log(`   Valid files: ${validFiles}`);
  console.log(`   Files with errors: ${locationFiles.length - validFiles}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log(`   Total warnings: ${totalWarnings}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ Validation failed! Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All location files are valid!');
    if (totalWarnings > 0) {
      console.log(`⚠️  ${totalWarnings} warnings found - consider addressing these for better data quality.`);
    }
  }
}

// Always run validation when script is executed
validateAllLocationFiles();

export { validateLocationData, validateAllLocationFiles };
