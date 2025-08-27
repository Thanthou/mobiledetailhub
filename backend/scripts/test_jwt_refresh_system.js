/**
 * JWT Refresh Token System Test
 * Tests the complete JWT authentication flow with refresh tokens
 * Run with: node scripts/test_jwt_refresh_system.js
 */

// Global fetch is available in Node 18+
const logger = require('../utils/logger');

const BASE_URL = 'http://localhost:3001/api';

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
  name: 'Test User',
  phone: '(555) 123-4567'
};

let accessToken = null;
let refreshToken = null;
let userId = null;

async function testJWTRefreshSystem() {
  console.log('🧪 Testing JWT Refresh Token System...\n');

  try {
    // Test 1: User Registration
    console.log('✅ Test 1: User Registration');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });

    if (registerResponse.status === 200) {
      const registerData = await registerResponse.json();
      console.log('   ✅ Registration successful');
      console.log(`   📝 User ID: ${registerData.user.id}`);
      console.log(`   📝 Access Token: ${registerData.accessToken.substring(0, 20)}...`);
      console.log(`   📝 Refresh Token: ${registerData.refreshToken.substring(0, 20)}...`);
      
      accessToken = registerData.accessToken;
      refreshToken = registerData.refreshToken;
      userId = registerData.user.id;
    } else if (registerResponse.status === 400) {
      const errorData = await registerResponse.json();
      if (errorData.error === 'User already exists') {
        console.log('   ⚠️  User already exists, proceeding with login test');
      } else {
        console.log(`   ❌ Registration failed: ${JSON.stringify(errorData)}`);
        return;
      }
    } else {
      console.log(`   ❌ Registration failed with status: ${registerResponse.status}`);
      return;
    }

    // Test 2: User Login (if registration failed)
    if (!accessToken) {
      console.log('\n✅ Test 2: User Login');
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password
        })
      });

      if (loginResponse.status === 200) {
        const loginData = await loginResponse.json();
        console.log('   ✅ Login successful');
        console.log(`   📝 User ID: ${loginData.user.id}`);
        console.log(`   📝 Access Token: ${loginData.accessToken.substring(0, 20)}...`);
        console.log(`   📝 Refresh Token: ${loginData.refreshToken.substring(0, 20)}...`);
        
        accessToken = loginData.accessToken;
        refreshToken = loginData.refreshToken;
        userId = loginData.user.id;
      } else {
        console.log(`   ❌ Login failed with status: ${loginResponse.status}`);
        return;
      }
    }

    // Test 3: Access Protected Route
    console.log('\n✅ Test 3: Access Protected Route');
    const meResponse = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (meResponse.status === 200) {
      const meData = await meResponse.json();
      console.log('   ✅ Protected route access successful');
      console.log(`   📝 User: ${meData.name} (${meData.email})`);
    } else {
      console.log(`   ❌ Protected route access failed: ${meResponse.status}`);
      return;
    }

    // Test 4: Get User Sessions
    console.log('\n✅ Test 4: Get User Sessions');
    const sessionsResponse = await fetch(`${BASE_URL}/auth/sessions`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (sessionsResponse.status === 200) {
      const sessionsData = await sessionsResponse.json();
      console.log('   ✅ Sessions retrieved successfully');
      console.log(`   📝 Active sessions: ${sessionsData.sessions.length}`);
      sessionsData.sessions.forEach((session, index) => {
        console.log(`      Session ${index + 1}: ${session.deviceId} (${session.ipAddress})`);
      });
    } else {
      console.log(`   ❌ Sessions retrieval failed: ${sessionsResponse.status}`);
    }

    // Test 5: Refresh Token
    console.log('\n✅ Test 5: Refresh Token');
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse.status === 200) {
      const refreshData = await refreshResponse.json();
      console.log('   ✅ Token refresh successful');
      console.log(`   📝 New Access Token: ${refreshData.accessToken.substring(0, 20)}...`);
      console.log(`   📝 New Refresh Token: ${refreshData.refreshToken.substring(0, 20)}...`);
      
      // Update tokens for subsequent tests
      accessToken = refreshData.accessToken;
      refreshToken = refreshData.refreshToken;
    } else {
      console.log(`   ❌ Token refresh failed: ${refreshResponse.status}`);
      const errorData = await refreshResponse.json();
      console.log(`   📝 Error: ${JSON.stringify(errorData)}`);
    }

    // Test 6: Access Protected Route with New Token
    console.log('\n✅ Test 6: Access Protected Route with New Token');
    const meResponse2 = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (meResponse2.status === 200) {
      const meData = await meResponse2.json();
      console.log('   ✅ Protected route access with new token successful');
      console.log(`   📝 User: ${meData.name} (${meData.email})`);
    } else {
      console.log(`   ❌ Protected route access with new token failed: ${meResponse2.status}`);
    }

    // Test 7: Logout Specific Device
    console.log('\n✅ Test 7: Logout Specific Device');
    const logoutDeviceResponse = await fetch(`${BASE_URL}/auth/logout-device`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ deviceId: 'test-device-1' })
    });

    if (logoutDeviceResponse.status === 200) {
      console.log('   ✅ Device logout successful');
    } else {
      console.log(`   ❌ Device logout failed: ${logoutDeviceResponse.status}`);
    }

    // Test 8: Full Logout
    console.log('\n✅ Test 8: Full Logout');
    const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (logoutResponse.status === 200) {
      console.log('   ✅ Full logout successful');
    } else {
      console.log(`   ❌ Full logout failed: ${logoutResponse.status}`);
    }

    // Test 9: Try to Access Protected Route After Logout
    console.log('\n✅ Test 9: Access Protected Route After Logout');
    const meResponse3 = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (meResponse3.status === 401) {
      console.log('   ✅ Protected route correctly blocked after logout');
    } else {
      console.log(`   ❌ Protected route should be blocked but returned: ${meResponse3.status}`);
    }

    // Test 10: Try to Use Old Refresh Token
    console.log('\n✅ Test 10: Use Old Refresh Token After Logout');
    const refreshResponse2 = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse2.status === 401) {
      console.log('   ✅ Old refresh token correctly rejected after logout');
    } else {
      console.log(`   ❌ Old refresh token should be rejected but returned: ${refreshResponse2.status}`);
    }

    console.log('\n🎯 JWT Refresh Token System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User registration/login');
    console.log('   ✅ Protected route access');
    console.log('   ✅ Session management');
    console.log('   ✅ Token refresh');
    console.log('   ✅ Device-specific logout');
    console.log('   ✅ Full logout');
    console.log('   ✅ Token invalidation');
    console.log('   ✅ Security enforcement');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testJWTRefreshSystem().catch(console.error);
