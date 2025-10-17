#!/usr/bin/env node

/**
 * Test script to check if the development site is accessible
 */

import axios from 'axios';

async function testSiteAccess() {
  const testUrl = 'http://testing-mobile-detail.thatsmartsite.com';
  console.log(`🧪 Testing site accessibility: ${testUrl}\n`);

  try {
    console.log('Making HTTP request...');
    const response = await axios.get(testUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('✅ Site is accessible!');
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log(`Content Length: ${response.data.length} characters`);
    
    // Check if it's HTML
    if (response.data.includes('<html')) {
      console.log('✅ Site returns HTML content');
      
      // Check for common issues
      if (response.data.includes('<!DOCTYPE html>')) {
        console.log('✅ Has DOCTYPE declaration');
      } else {
        console.log('⚠️  Missing DOCTYPE declaration');
      }
      
      if (response.data.includes('<title>')) {
        console.log('✅ Has title tag');
      } else {
        console.log('⚠️  Missing title tag');
      }
      
      if (response.data.includes('<head>')) {
        console.log('✅ Has head section');
      } else {
        console.log('⚠️  Missing head section');
      }
      
      if (response.data.includes('<body>')) {
        console.log('✅ Has body section');
      } else {
        console.log('⚠️  Missing body section');
      }
      
    } else {
      console.log('❌ Site does not return HTML content');
      console.log('First 200 characters:', response.data.substring(0, 200));
    }

  } catch (error) {
    console.log('❌ Site is not accessible:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - Connection refused - site is not running');
      console.log('   - Make sure your frontend development server is running');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   - Domain not found - DNS issue');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   - Request timed out - site is slow or not responding');
    } else {
      console.log(`   - Error: ${error.message}`);
    }
    
    console.log('\n💡 Solutions:');
    console.log('   1. Start your frontend development server');
    console.log('   2. Check if the site is running on the correct port');
    console.log('   3. Verify the domain configuration');
  }
}

testSiteAccess().catch(console.error);
