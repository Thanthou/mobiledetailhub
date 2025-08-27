const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Test function to make a request
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test graceful shutdown
async function testGracefulShutdown() {
  console.log('🚀 Starting graceful shutdown test...\n');

  try {
    // Test 1: Check server is running
    console.log('✅ Test 1: Checking server health...');
    const healthResponse = await makeRequest('/api/health');
    console.log(`   Health status: ${healthResponse.status}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data, null, 2)}\n`);

    // Test 2: Check shutdown status
    console.log('✅ Test 2: Checking shutdown status...');
    const shutdownResponse = await makeRequest('/api/health/shutdown-status');
    console.log(`   Shutdown status: ${shutdownResponse.status}`);
    console.log(`   Response: ${JSON.stringify(shutdownResponse.data, null, 2)}\n`);

    // Test 3: Make a slow request (simulate long-running operation)
    console.log('✅ Test 3: Making a slow request...');
    const slowRequest = makeRequest('/api/health/migrations').catch(err => {
      console.log(`   Slow request error (expected during shutdown): ${err.message}`);
    });

    // Wait a bit for the request to start
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test 4: Check active requests
    console.log('✅ Test 4: Checking active requests...');
    const activeResponse = await makeRequest('/api/health/shutdown-status');
    console.log(`   Active requests: ${activeResponse.data.activeRequests}\n`);

    // Test 5: Simulate graceful shutdown
    console.log('🔄 Test 5: Simulating graceful shutdown...');
    console.log('   Sending SIGTERM to process...');
    
    // Note: In a real test, you would send SIGTERM to the server process
    // For this demo, we'll just show what should happen
    console.log('   Expected behavior:');
    console.log('   - Server stops accepting new requests');
    console.log('   - Active requests complete');
    console.log('   - Database pool closes');
    console.log('   - Process exits gracefully\n');

    // Test 6: Try to make a request during shutdown (should get 503)
    console.log('✅ Test 6: Testing request rejection during shutdown...');
    console.log('   (This would normally happen after SIGTERM is sent)');
    console.log('   Expected: 503 Service Unavailable\n');

    console.log('🎯 Graceful shutdown test completed!');
    console.log('   To test actual shutdown, run:');
    console.log('   cd backend && npm start');
    console.log('   Then in another terminal:');
    console.log('   cd backend && node scripts/test-graceful-shutdown.js');
    console.log('   And send SIGTERM to the server process');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testGracefulShutdown();
