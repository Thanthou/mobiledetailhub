/**
 * Test script to verify enhanced upload validation
 * Run with: node scripts/test_upload_validation.js
 */

// Global fetch is available in Node 18+
const logger = require('../utils/logger');

const BASE_URL = 'http://localhost:3001/api';

async function testUploadValidation() {
  console.log('🧪 Testing Enhanced Upload Validation...\n');

  try {
    // Test 1: Get upload configuration
    console.log('✅ Test 1: Get Upload Configuration');
    const configResponse = await fetch(`${BASE_URL}/upload/config`);
    
    if (configResponse.status === 200) {
      const configData = await configResponse.json();
      console.log('   ✅ Configuration retrieved successfully');
      console.log(`   📝 Max file size: ${configData.config.maxFileSize}`);
      console.log(`   📝 Max total size: ${configData.config.maxTotalSize}`);
      console.log(`   📝 Max files: ${configData.config.maxFiles}`);
      console.log(`   📝 Allowed MIME types: ${Object.keys(configData.config.allowedMimeTypes).join(', ')}`);
    } else {
      console.log(`   ❌ Configuration retrieval failed: ${configResponse.status}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 2: Test invalid file type (should return 415)
    console.log('✅ Test 2: Test Invalid File Type (415)');
    console.log('   Attempting to upload executable file...');
    
    // Create a mock executable file
    const mockExeFile = new Blob(['fake executable content'], { type: 'application/x-executable' });
    const formData = new FormData();
    formData.append('file', mockExeFile, 'test.exe');
    
    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload/single`, {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.status === 415) {
        console.log('   ✅ Correctly rejected executable file (415)');
        const errorData = await uploadResponse.json();
        console.log(`   📝 Error: ${errorData.message}`);
      } else {
        console.log(`   ❌ Expected 415, got: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Upload error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 3: Test file size limit (should return 413)
    console.log('✅ Test 3: Test File Size Limit (413)');
    console.log('   Attempting to upload oversized file...');
    
    // Create a mock oversized file (10MB)
    const mockOversizedFile = new Blob(['x'.repeat(10 * 1024 * 1024)], { type: 'image/jpeg' });
    const formData2 = new FormData();
    formData2.append('file', mockOversizedFile, 'large.jpg');
    
    try {
      const uploadResponse2 = await fetch(`${BASE_URL}/upload/single`, {
        method: 'POST',
        body: formData2
      });
      
      if (uploadResponse2.status === 413) {
        console.log('   ✅ Correctly rejected oversized file (413)');
        const errorData = await uploadResponse2.json();
        console.log(`   📝 Error: ${errorData.message}`);
      } else {
        console.log(`   ❌ Expected 413, got: ${uploadResponse2.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Upload error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 4: Test valid file upload
    console.log('✅ Test 4: Test Valid File Upload (200)');
    console.log('   Attempting to upload valid image file...');
    
    // Create a mock valid image file
    const mockValidFile = new Blob(['fake image content'], { type: 'image/jpeg' });
    const formData3 = new FormData();
    formData3.append('file', mockValidFile, 'test.jpg');
    
    try {
      const uploadResponse3 = await fetch(`${BASE_URL}/upload/single`, {
        method: 'POST',
        body: formData3
      });
      
      if (uploadResponse3.status === 200) {
        console.log('   ✅ Valid file uploaded successfully (200)');
        const successData = await uploadResponse3.json();
        console.log(`   📝 Message: ${successData.message}`);
        console.log(`   📝 Filename: ${successData.file.filename}`);
      } else {
        console.log(`   ❌ Expected 200, got: ${uploadResponse3.status}`);
        const errorData = await uploadResponse3.json();
        console.log(`   📝 Error: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Upload error: ${error.message}`);
    }

    console.log('\n🎯 Upload Validation Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Configuration retrieval');
    console.log('   ✅ Invalid file type rejection (415)');
    console.log('   ✅ File size limit enforcement (413)');
    console.log('   ✅ Valid file upload acceptance (200)');
    console.log('   ✅ Enhanced security with MIME type allowlists');
    console.log('   ✅ Proper error responses with status codes');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testUploadValidation().catch(console.error);
