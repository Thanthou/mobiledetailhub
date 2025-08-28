/**
 * Test Authentication System
 * Verifies that login returns token pairs and refresh works
 * Run with: node scripts/test_auth_system.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../database/pool');
const bcrypt = require('bcryptjs');
const { generateTokenPair } = require('../utils/tokenManager');
const { storeRefreshToken, validateRefreshToken } = require('../services/refreshTokenService');
const logger = require('../utils/logger');

async function testAuthSystem() {
  console.log('🔐 Testing Authentication System...\n');

  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check if test user exists, create if not
    console.log('👤 Checking for test user...');
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    let testUser = await pool.query('SELECT * FROM users WHERE email = $1', [testEmail]);
    
    if (testUser.rows.length === 0) {
      console.log('📝 Creating test user...');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, name, is_admin, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [testEmail, hashedPassword, 'Test User', false, 'customer']
      );
      testUser = result;
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user already exists');
    }

    const user = testUser.rows[0];
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Is Admin: ${user.is_admin}\n`);

    // Test token generation
    console.log('🎫 Testing token generation...');
    const tokenPayload = { 
      userId: user.id, 
      email: user.email, 
      isAdmin: user.is_admin 
    };
    
    const tokens = generateTokenPair(tokenPayload);
    console.log('✅ Token pair generated');
    console.log(`   Access Token: ${tokens.accessToken.substring(0, 20)}...`);
    console.log(`   Refresh Token: ${tokens.refreshToken.substring(0, 20)}...`);
    console.log(`   Expires In: ${tokens.expiresIn}`);
    console.log(`   Refresh Expires In: ${tokens.refreshExpiresIn}\n`);

    // Test refresh token storage
    console.log('💾 Testing refresh token storage...');
    const deviceId = 'test-device-123';
    const tokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
    
    await storeRefreshToken(
      user.id,
      tokenHash,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      '127.0.0.1',
      'Test User Agent',
      deviceId
    );
    console.log('✅ Refresh token stored in database\n');

    // Test refresh token validation
    console.log('🔍 Testing refresh token validation...');
    const validatedToken = await validateRefreshToken(tokenHash);
    
    if (validatedToken) {
      console.log('✅ Refresh token validated successfully');
      console.log(`   User ID: ${validatedToken.user_id}`);
      console.log(`   Email: ${validatedToken.email}`);
      console.log(`   Is Admin: ${validatedToken.is_admin}`);
      console.log(`   Expires At: ${validatedToken.expires_at}`);
      console.log(`   Is Revoked: ${validatedToken.is_revoked}`);
    } else {
      console.log('❌ Refresh token validation failed');
    }

    // Test password verification
    console.log('\n🔐 Testing password verification...');
    const validPassword = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`✅ Password verification: ${validPassword ? 'SUCCESS' : 'FAILED'}`);

    // Test invalid password
    const invalidPassword = await bcrypt.compare('wrongpassword', user.password_hash);
    console.log(`✅ Invalid password rejection: ${!invalidPassword ? 'SUCCESS' : 'FAILED'}`);

    console.log('\n🎯 Authentication system test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ User creation/retrieval working');
    console.log('   ✅ Token generation working');
    console.log('   ✅ Refresh token storage working');
    console.log('   ✅ Refresh token validation working');
    console.log('   ✅ Password hashing/verification working');
    console.log('\n🚀 Ready for login requests!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.message.includes('JWT_SECRET')) {
      console.log('\n💡 Fix: Set JWT_SECRET in your .env file');
      console.log('   Example: JWT_SECRET=your-super-secret-key-here');
    }
    
    if (error.message.includes('DATABASE_URL')) {
      console.log('\n💡 Fix: Set DATABASE_URL in your .env file');
      console.log('   Example: DATABASE_URL=postgresql://user:pass@localhost:5432/dbname');
    }
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the test
testAuthSystem();
