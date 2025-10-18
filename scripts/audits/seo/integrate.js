#!/usr/bin/env node

/**
 * SEO Integration Script
 * 
 * This script helps integrate the new SEO components into existing pages
 * by providing automated suggestions and validation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTEGRATION_TARGETS = [
  {
    file: 'frontend/src/app/pages/HomePage.tsx',
    type: 'page',
    priority: 'high',
    changes: [
      'Replace useSEO() with <SeoHead /> component',
      'Add analytics tracking to quote requests'
    ]
  },
  {
    file: 'frontend/src/app/pages/ServicePage.tsx',
    type: 'page',
    priority: 'high',
    changes: [
      'Add preview detection with isPreview prop',
      'Replace useSEO() with <SeoHead /> component'
    ]
  },
  {
    file: 'frontend/src/features/locations/LocationPage.tsx',
    type: 'page',
    priority: 'high',
    changes: [
      'Replace useMetaTags with <SeoHead /> component',
      'Add location-specific keywords'
    ]
  },
  {
    file: 'frontend/src/features/cta/components/SmartCTAButtons.tsx',
    type: 'component',
    priority: 'medium',
    changes: [
      'Add analytics tracking to button clicks',
      'Track conversion events'
    ]
  },
  {
    file: 'frontend/src/features/quotes/components/QuoteModal.tsx',
    type: 'component',
    priority: 'medium',
    changes: [
      'Add conversion tracking on quote submission',
      'Track quote completion events'
    ]
  }
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

function checkSEOIntegration(filePath, content) {
  const checks = {
    hasSeoHead: content.includes('SeoHead'),
    hasUseSEO: content.includes('useSEO'),
    hasUseMetaTags: content.includes('useMetaTags'),
    hasAnalytics: content.includes('useAnalytics'),
    hasOptimizedImage: content.includes('OptimizedImage')
  };

  return checks;
}

function generateIntegrationReport() {
  console.log('🔍 SEO Integration Analysis Report\n');
  console.log('=' .repeat(50));

  let totalFiles = 0;
  let integratedFiles = 0;
  let partiallyIntegrated = 0;

  INTEGRATION_TARGETS.forEach(target => {
    console.log(`\n📄 ${target.file}`);
    console.log(`   Type: ${target.type} | Priority: ${target.priority}`);
    
    if (!checkFileExists(target.file)) {
      console.log('   ❌ File not found');
      return;
    }

    totalFiles++;
    const content = readFileContent(target.file);
    const checks = checkSEOIntegration(target.file, content);

    console.log('   Current Status:');
    console.log(`   - SeoHead: ${checks.hasSeoHead ? '✅' : '❌'}`);
    console.log(`   - useSEO: ${checks.hasUseSEO ? '⚠️' : '✅'} ${checks.hasUseSEO ? '(should be replaced)' : ''}`);
    console.log(`   - useMetaTags: ${checks.hasUseMetaTags ? '⚠️' : '✅'} ${checks.hasUseMetaTags ? '(should be replaced)' : ''}`);
    console.log(`   - Analytics: ${checks.hasAnalytics ? '✅' : '❌'}`);
    console.log(`   - OptimizedImage: ${checks.hasOptimizedImage ? '✅' : '❌'}`);

    if (checks.hasSeoHead && checks.hasAnalytics) {
      integratedFiles++;
      console.log('   🎉 Fully integrated!');
    } else if (checks.hasSeoHead || checks.hasAnalytics) {
      partiallyIntegrated++;
      console.log('   🔄 Partially integrated');
    } else {
      console.log('   🚧 Needs integration');
    }

    console.log('   Required Changes:');
    target.changes.forEach(change => {
      console.log(`   - ${change}`);
    });
  });

  console.log('\n' + '=' .repeat(50));
  console.log('📊 Integration Summary:');
  console.log(`   Total Files: ${totalFiles}`);
  console.log(`   Fully Integrated: ${integratedFiles}`);
  console.log(`   Partially Integrated: ${partiallyIntegrated}`);
  console.log(`   Needs Integration: ${totalFiles - integratedFiles - partiallyIntegrated}`);
  
  const completionPercentage = Math.round(((integratedFiles + partiallyIntegrated * 0.5) / totalFiles) * 100);
  console.log(`   Completion: ${completionPercentage}%`);

  if (completionPercentage < 50) {
    console.log('\n🚨 Priority Actions:');
    console.log('   1. Integrate SeoHead component into main pages');
    console.log('   2. Add analytics tracking to conversion points');
    console.log('   3. Replace useSEO/useMetaTags with SeoHead');
  } else if (completionPercentage < 80) {
    console.log('\n🔄 Next Steps:');
    console.log('   1. Complete remaining page integrations');
    console.log('   2. Add analytics to all CTA components');
    console.log('   3. Optimize remaining images');
  } else {
    console.log('\n🎉 Great progress! Final touches:');
    console.log('   1. Test all integrations');
    console.log('   2. Validate SEO performance');
    console.log('   3. Monitor analytics data');
  }
}

function generateIntegrationCode(filePath, target) {
  console.log(`\n💡 Integration Code for ${filePath}:`);
  console.log('-'.repeat(50));

  if (target.type === 'page') {
    console.log(`
// 1. Add imports at the top
import { SeoHead } from '@/shared/components/seo/SeoHead';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

// 2. Replace useSEO() or useMetaTags() with:
<SeoHead 
  title="Your Page Title"
  description="Your page description"
  isPreview={isPreview} // Add this for preview detection
/>

// 3. Add analytics tracking (example):
const analytics = useAnalytics();

const handleConversion = () => {
  analytics.trackConversion({
    conversion_type: 'quote_request',
    conversion_value: 150
  });
  // ... existing logic
};
`);
  } else if (target.type === 'component') {
    console.log(`
// 1. Add import
import { useAnalytics } from '@/shared/hooks/useAnalytics';

// 2. Add analytics tracking
const analytics = useAnalytics();

const handleClick = () => {
  analytics.trackEvent({
    event: 'button_click',
    parameters: { 
      button_type: 'quote_request',
      page: 'home'
    }
  });
  // ... existing logic
};
`);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--report')) {
  generateIntegrationReport();
} else if (args.includes('--help')) {
  console.log(`
🔧 SEO Integration Script

Usage:
  node scripts/integrate-seo.js [options]

Options:
  --report    Generate integration analysis report
  --help      Show this help message

Examples:
  node scripts/integrate-seo.js --report
    `);
} else {
  generateIntegrationReport();
  console.log('\n💡 Use --help for more options');
}

export {
  generateIntegrationReport,
  generateIntegrationCode,
  INTEGRATION_TARGETS
};
