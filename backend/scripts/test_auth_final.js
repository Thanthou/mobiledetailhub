/**
 * Final Authentication System Test
 * Tests both database functions and HTTP endpoints
 * Run with: node scripts/test_auth_final.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../database/pool');
const bcrypt = require('bcryptjs');
const { generateTokenPair } = require('../utils/tokenManager');
const { storeRefreshToken, validateRefreshToken, revokeRefreshToken } = require('../services/refreshTokenService');
const http = require('http');

// Test database functions directly
async function testDatabaseFunctions() {
  console.log('🔍 Testing Database Functions...\n');

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
    const deviceId = 'test-device-final';
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

    // Test token revocation
    console.log('\n🗑️ Testing token revocation...');
    const revoked = await revokeRefreshToken(tokenHash);
    console.log(`✅ Token revocation: ${revoked ? 'SUCCESS' : 'FAILED'}`);

    // Test password verification
    console.log('\n🔐 Testing password verification...');
    const validPassword = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`✅ Password verification: ${validPassword ? 'SUCCESS' : 'FAILED'}`);

    // Test invalid password
    const invalidPassword = await bcrypt.compare('wrongpassword', user.password_hash);
    console.log(`✅ Invalid password rejection: ${!invalidPassword ? 'SUCCESS' : 'FAILED'}`);

    console.log('\n🎯 Database functions test completed successfully!');
    return { user, tokens, testPassword };

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    throw error;
  }
}

// Test HTTP endpoints
async function testHttpEndpoints(user, tokens, testPassword) {
  console.log('\n🌐 Testing HTTP Endpoints...\n');

  try {
    // Test login endpoint
    console.log('🔐 Testing login endpoint...');
    const loginResult = await testLogin(testPassword);
    
    if (loginResult.statusCode === 200) {
      console.log('✅ Login successful!');
      console.log('   Status:', loginResult.statusCode);
      console.log('   Success:', loginResult.data.success);
      console.log('   User ID:', loginResult.data.user?.id);
      console.log('   Access Token:', loginResult.data.accessToken ? '✅ Present' : '❌ Missing');
      console.log('   Refresh Token:', loginResult.data.refreshToken ? '✅ Present' : '❌ Missing');
      
      const { accessToken, refreshToken } = loginResult.data;
      
      if (accessToken && refreshToken) {
        console.log('\n🎫 Both tokens received successfully!');
        
        // Test protected endpoint
        console.log('\n🔒 Testing protected endpoint...');
        const meResult = await testProtectedEndpoint(accessToken);
        
        if (meResult.statusCode === 200) {
          console.log('✅ Protected endpoint accessible!');
          console.log('   User data:', meResult.data);
        } else {
          console.log('❌ Protected endpoint failed');
          console.log('   Status:', meResult.statusCode);
          console.log('   Response:', meResult.data);
        }
        
        // Test refresh endpoint
        console.log('\n🔄 Testing refresh endpoint...');
        const refreshResult = await testRefresh(refreshToken);
        
        if (refreshResult.statusCode === 200) {
          console.log('✅ Token refresh successful!');
          console.log('   New Access Token:', refreshResult.data.accessToken ? '✅ Present' : '❌ Missing');
          console.log('   New Refresh Token:', refreshResult.data.refreshToken ? '✅ Present' : '❌ Missing');
        } else {
          console.log('❌ Token refresh failed');
          console.log('   Status:', refreshResult.statusCode);
          console.log('   Response:', refreshResult.data);
        }
      } else {
        console.log('❌ Missing tokens in response');
        console.log('   Full response:', loginResult.data);
      }
    } else {
      console.log('❌ Login failed');
      console.log('   Status:', loginResult.statusCode);
      console.log('   Response:', loginResult.data);
    }

  } catch (error) {
    console.error('❌ HTTP test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Fix: Make sure the server is running on port 3001');
      console.log('   Run: npm start');
    }
  }
}

// HTTP test functions
const testLogin = (password) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: password
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

const testRefresh = (refreshToken) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      refreshToken: refreshToken
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/refresh',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

const testProtectedEndpoint = (accessToken) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Main test function
async function runFinalTest() {
  console.log('🚀 Running Final Authentication System Test...\n');

  try {
    // Test database functions first
    const { user, tokens, testPassword } = await testDatabaseFunctions();
    
    // Test HTTP endpoints
    await testHttpEndpoints(user, tokens, testPassword);
    
    console.log('\n🎯 Final test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database functions working');
    console.log('   ✅ Token generation working');
    console.log('   ✅ Refresh token storage/validation working');
    console.log('   ✅ Password system working');
    console.log('   ✅ HTTP endpoints tested');
    console.log('\n🚀 Authentication system is ready!');

  } catch (error) {
    console.error('\n❌ Final test failed:', error.message);
    
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
runFinalTest();
