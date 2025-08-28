/**
 * Quick Login Test
 * Simple test to verify login endpoint works
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

async function quickTest() {
  console.log('🔐 Quick Login Test...\n');

  try {
    const result = await testLogin();
    
    if (result.statusCode === 200) {
      console.log('✅ Login successful!');
      console.log('   Status:', result.statusCode);
      console.log('   Access Token:', result.data.accessToken ? '✅ Present' : '❌ Missing');
      console.log('   Refresh Token:', result.data.refreshToken ? '✅ Present' : '❌ Missing');
      console.log('   User ID:', result.data.user?.id);
      console.log('\n🚀 Login endpoint is working!');
    } else {
      console.log('❌ Login failed');
      console.log('   Status:', result.statusCode);
      console.log('   Response:', result.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Fix: Make sure the server is running on port 3001');
      console.log('   Run: npm start');
    }
  }
}

quickTest();
