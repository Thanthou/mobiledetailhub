#!/usr/bin/env node

/**
 * Test script for Lighthouse CLI integration
 * Run this to verify Lighthouse is working correctly
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import logger from '../utils/logger.js';

async function testLighthouse() {
  console.log('🧪 Testing Lighthouse CLI integration...\n');
  let chrome = null;

  try {
    // Test with localhost (the actual running development server)
    const testUrl = 'http://localhost:5175';
    console.log(`Testing Lighthouse with: ${testUrl}`);

    // Launch Chrome
    console.log('Launching Chrome...');
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
    console.log(`Chrome launched on port ${chrome.port}`);

    const config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    };

    console.log('Running Lighthouse analysis...');
    const runnerResult = await lighthouse(testUrl, {
      port: chrome.port,
      output: 'json'
    }, config);

    if (runnerResult && runnerResult.lhr) {
      const lhr = runnerResult.lhr;
      console.log('✅ Lighthouse analysis successful!');
      console.log('\n📊 Results:');
      console.log(`Performance: ${Math.round((lhr.categories.performance?.score || 0) * 100)}`);
      console.log(`Accessibility: ${Math.round((lhr.categories.accessibility?.score || 0) * 100)}`);
      console.log(`Best Practices: ${Math.round((lhr.categories['best-practices']?.score || 0) * 100)}`);
      console.log(`SEO: ${Math.round((lhr.categories.seo?.score || 0) * 100)}`);
      
      console.log('\n🎯 Core Web Vitals:');
      console.log(`LCP: ${lhr.audits['largest-contentful-paint']?.displayValue || 'N/A'}`);
      console.log(`FID: ${lhr.audits['max-potential-fid']?.displayValue || 'N/A'}`);
      console.log(`CLS: ${lhr.audits['cumulative-layout-shift']?.displayValue || 'N/A'}`);
      
      console.log('\n✅ Lighthouse CLI is working correctly!');
      console.log('You can now run health scans on development URLs.');
      
    } else {
      console.log('❌ Lighthouse returned empty results');
      process.exit(1);
    }

  } catch (error) {
    console.log('❌ Lighthouse test failed:');
    console.log(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Chrome connection failed. This might be due to:');
      console.log('   - Chrome not being installed');
      console.log('   - Antivirus blocking Chrome');
      console.log('   - System permissions issues');
    }
    
    process.exit(1);
  } finally {
    // Clean up Chrome instance
    if (chrome) {
      try {
        await chrome.kill();
        console.log('Chrome instance cleaned up');
      } catch (killError) {
        console.log('Error killing Chrome:', killError.message);
      }
    }
  }
}

// Run the test
testLighthouse().catch(console.error);
