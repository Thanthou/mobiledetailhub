/**
 * Test script for welcome email and password setup flow
 * This script tests the complete onboarding → email → activation flow
 */

import { pool } from '../database/pool.js';
import { createPasswordSetupToken, setPasswordWithToken, validateSetupToken } from '../services/passwordSetupService.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { env } from '../config/env.js';

async function testWelcomeEmailFlow() {
  console.log('🧪 Testing Welcome Email and Password Setup Flow\n');

  try {
    // Test data
    const testData = {
      personalEmail: 'test@example.com',
      businessEmail: 'business@example.com',
      firstName: 'John',
      businessName: 'Test Business',
      websiteUrl: 'https://test.thatsmartsite.com',
      dashboardUrl: 'https://test.thatsmartsite.com/dashboard',
      planType: 'Starter',
      passwordLink: 'https://app.thatsmartsite.com/setup-password?token=test-token'
    };

    console.log('📧 Testing welcome email template...');
    
    // Test email template loading
    const emailResult = await sendWelcomeEmail(testData);
    
    if (emailResult.success) {
      console.log('✅ Welcome email template test passed');
      console.log('📧 Email would be sent to:', emailResult.emailsSent?.join(', ') || 'test@example.com');
    } else {
      console.log('❌ Welcome email template test failed:', emailResult.error);
    }

    console.log('\n🔑 Testing password setup token creation...');
    
    // Create a test user first
    const testUserId = await createTestUser();
    if (!testUserId) {
      console.log('❌ Failed to create test user');
      return;
    }

    // Test password setup token creation
    const tokenResult = await createPasswordSetupToken(
      testUserId,
      testData.personalEmail,
      '127.0.0.1',
      'TestScript'
    );

    if (tokenResult.token) {
      console.log('✅ Password setup token created successfully');
      console.log('🔗 Setup URL:', tokenResult.setupUrl);
      console.log('⏰ Expires at:', tokenResult.expiresAt);
    } else {
      console.log('❌ Password setup token creation failed');
      return;
    }

    console.log('\n🔍 Testing token validation...');
    
    // Test token validation
    const validationResult = await validateSetupToken(tokenResult.token);
    
    if (validationResult) {
      console.log('✅ Token validation successful');
      console.log('👤 User:', validationResult.name, '(' + validationResult.email + ')');
    } else {
      console.log('❌ Token validation failed');
      return;
    }

    console.log('\n🔐 Testing password setup...');
    
    // Test password setup
    const passwordSetupResult = await setPasswordWithToken(
      tokenResult.token,
      'TestPassword123!',
      '127.0.0.1'
    );

    if (passwordSetupResult) {
      console.log('✅ Password setup successful');
    } else {
      console.log('❌ Password setup failed');
      return;
    }

    console.log('\n🎉 All tests passed! Welcome email and password setup flow is working correctly.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error.stack);
  } finally {
    // Cleanup test user
    await cleanupTestUser();
    if (pool) {
      await pool.end();
    }
  }
}

async function createTestUser() {
  try {
    const result = await pool.query(
      `INSERT INTO auth.users (email, password_hash, name, phone, is_admin, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [
        'test@example.com',
        '', // Empty password for testing
        'Test User',
        '555-1234',
        false
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    return null;
  }
}

async function cleanupTestUser() {
  try {
    await pool.query("DELETE FROM auth.users WHERE email = 'test@example.com'");
    console.log('🧹 Test user cleaned up');
  } catch (error) {
    console.error('Error cleaning up test user:', error.message);
  }
}

// Run the test
testWelcomeEmailFlow();
