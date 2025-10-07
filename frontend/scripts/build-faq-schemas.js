#!/usr/bin/env node

/**
 * Build-time FAQ schema generation script
 * Generates FAQPage JSON-LD schemas for all pages
 * 
 * Usage:
 *   node scripts/build-faq-schemas.js
 *   npm run build:faq-schemas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import FAQ data (this would be compiled from TypeScript in a real build)
// For now, we'll use a simplified approach
function loadFAQData() {
  try {
    // Load general FAQs from the utils
    const generalFAQPath = path.join(__dirname, '../src/features/faq/utils/general.ts');
    const generalFAQContent = fs.readFileSync(generalFAQPath, 'utf8');
    
    // Extract FAQ items (simplified parsing)
    const faqMatches = generalFAQContent.match(/\{[^}]*"question":\s*"[^"]*"[^}]*\}/g);
    const generalFAQs = faqMatches ? faqMatches.map((match, index) => {
      const questionMatch = match.match(/"question":\s*"([^"]*)"/);
      const answerMatch = match.match(/"answer":\s*"([^"]*)"/);
      return {
        id: `general-${index}`,
        question: questionMatch ? questionMatch[1] : '',
        answer: answerMatch ? answerMatch[1] : ''
      };
    }) : [];

    return generalFAQs;
  } catch (error) {
    console.warn('Could not load general FAQs:', error.message);
    return [];
  }
}

function loadLocationData() {
  const locationDir = path.join(__dirname, '../src/data/locations');
  const locations = [];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.json') && item !== 'locations.json') {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const data = JSON.parse(content);
          locations.push(data);
        } catch (error) {
          console.error(`Error loading ${fullPath}:`, error.message);
        }
      }
    });
  }

  if (fs.existsSync(locationDir)) {
    scanDirectory(locationDir);
  }

  return locations;
}

function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q || faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a || faq.answer
      }
    }))
  };
}

function buildFAQSchemas() {
  console.log('🔧 Building FAQ schemas...\n');

  const generalFAQs = loadFAQData();
  const locationDataArray = loadLocationData();

  console.log(`Found ${generalFAQs.length} general FAQs`);
  console.log(`Found ${locationDataArray.length} location files\n`);

  const schemas = {};
  let totalSchemas = 0;

  // Generate main site FAQ schema
  if (generalFAQs.length > 0) {
    const convertedFAQs = generalFAQs.map(faq => ({
      q: faq.question,
      a: faq.answer
    }));
    schemas['main-site-faq.json'] = generateFAQSchema(convertedFAQs);
    totalSchemas++;
    console.log('✅ Generated main site FAQ schema');
  } else {
    console.log('⚠️  No general FAQs found for main site');
  }

  // Generate location FAQ schemas
  let locationsWithFAQs = 0;
  locationDataArray.forEach(locationData => {
    if (locationData.faqs && locationData.faqs.length > 0) {
      schemas[`locations/${locationData.slug}-faq.json`] = generateFAQSchema(locationData.faqs);
      totalSchemas++;
      locationsWithFAQs++;
      console.log(`✅ Generated FAQ schema for ${locationData.slug}`);
    } else {
      console.log(`⚠️  No FAQs found for ${locationData.slug}`);
    }
  });

  // Generate manifest
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    statistics: {
      totalLocations: locationDataArray.length,
      locationsWithFAQs,
      totalLocationFAQs: locationDataArray.reduce((total, location) => 
        total + (location.faqs?.length || 0), 0
      ),
      mainSiteFAQs: generalFAQs.length,
      totalSchemas
    },
    schemas: Object.keys(schemas)
  };

  schemas['manifest.json'] = manifest;

  // Write schemas to output directory
  const outputDir = path.join(__dirname, '../public/schemas');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const locationsDir = path.join(outputDir, 'locations');
  if (!fs.existsSync(locationsDir)) {
    fs.mkdirSync(locationsDir, { recursive: true });
  }

  Object.entries(schemas).forEach(([filename, schema]) => {
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    console.log(`📄 Wrote ${filename}`);
  });

  // Summary
  console.log('\n📊 Build Summary:');
  console.log(`   Total schemas generated: ${totalSchemas}`);
  console.log(`   Main site FAQ schema: ${generalFAQs.length > 0 ? '✅' : '❌'}`);
  console.log(`   Location FAQ schemas: ${locationsWithFAQs}/${locationDataArray.length}`);
  console.log(`   Output directory: ${outputDir}`);

  if (totalSchemas === 0) {
    console.log('\n⚠️  No FAQ schemas were generated. Consider adding FAQs to your data files.');
  } else {
    console.log('\n✅ FAQ schema build completed successfully!');
  }
}

// Run the build if this script is executed directly
buildFAQSchemas();
