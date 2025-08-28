/**
 * Test HTTP Authentication Endpoints
 * Tests the actual login and refresh endpoints
 * Run with: node scripts/test_http_auth.js
 */

const http = require('http');

const testLogin = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'testpassword123'
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

async function testHttpAuth() {
  console.log('🌐 Testing HTTP Authentication Endpoints...\n');

  try {
    // Test login endpoint
    console.log('🔐 Testing login endpoint...');
    const loginResult = await testLogin();
    
    if (loginResult.statusCode === 200) {
      console.log('✅ Login successful!');
      console.log('   Status:', loginResult.statusCode);
      console.log('   Success:', loginResult.data.success);
      console.log('   User ID:', loginResult.data.user?.id);
      console.log('   Access Token:', loginResult.data.accessToken ? '✅ Present' : '❌ Missing');
      console.log('   Refresh Token:', loginResult.data.refreshToken ? '✅ Present' : '❌ Missing');
      console.log('   Expires In:', loginResult.data.expiresIn);
      console.log('   Refresh Expires In:', loginResult.data.refreshExpiresIn);
      
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
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Fix: Make sure the server is running on port 3001');
      console.log('   Run: npm start');
    }
  }
}

// Run the test
testHttpAuth();
