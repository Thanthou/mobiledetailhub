require('dotenv').config();
const { pool } = require('../database/pool');
const logger = require('../utils/logger');
const axios = require('axios');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

async function testDatabaseConnection() {
  logger.info('🔌 Testing database connection...');
  try {
    await pool.query('SELECT 1');
    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', { error: error.message });
    return false;
  }
}

async function testRefreshTokensSchema() {
  logger.info('📋 Testing refresh_tokens table schema...');
  try {
    // Check if legacy 'ip' column exists
    const legacyColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens' 
      AND column_name = 'ip'
    `);
    
    if (legacyColumn.rows.length > 0) {
      logger.error('❌ Legacy "ip" column still exists!');
      return false;
    }
    
    // Check if correct 'ip_address' column exists
    const correctColumn = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'refresh_tokens' 
      AND column_name = 'ip_address'
    `);
    
    if (correctColumn.rows.length === 0) {
      logger.error('❌ Correct "ip_address" column missing!');
      return false;
    }
    
    if (correctColumn.rows[0].data_type !== 'inet') {
      logger.error('❌ ip_address column is not INET type!');
      return false;
    }
    
    logger.info('✅ Refresh tokens schema is correct');
    return true;
  } catch (error) {
    logger.error('❌ Schema check failed:', { error: error.message });
    return false;
  }
}

async function testRateLimiting() {
  logger.info('🚦 Testing rate limiting configuration...');
  try {
    // Test read-only endpoints (should not be rate limited)
    const readEndpoints = [
      '/api/mdh-config',
      '/api/health',
      '/api/service_areas'
    ];
    
    for (const endpoint of readEndpoints) {
      logger.info(`  Testing ${endpoint}...`);
      
      // Make multiple rapid requests to see if rate limiting kicks in
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(axios.get(`${BASE_URL}${endpoint}`).catch(err => err.response?.status));
      }
      
      const results = await Promise.all(promises);
      const rateLimited = results.some(status => status === 429);
      
      if (rateLimited) {
        logger.error(`❌ ${endpoint} is still rate limited!`);
        return false;
      }
      
      logger.info(`  ✅ ${endpoint} - no rate limiting (correct)`);
    }
    
    logger.info('✅ Read-only endpoints are not rate limited');
    return true;
  } catch (error) {
    logger.error('❌ Rate limiting test failed:', { error: error.message });
    return false;
  }
}

async function testConfigAsset() {
  logger.info('📁 Testing config asset serving...');
  try {
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}/js/mdh-config.js`);
    const loadTime = Date.now() - startTime;
    
    if (response.status !== 200) {
      logger.error('❌ Config asset returned non-200 status:', { status: response.status });
      return false;
    }
    
    // Check if it's cached
    const cacheControl = response.headers['cache-control'];
    const etag = response.headers['etag'];
    
    logger.info(`  ✅ Config asset loaded in ${loadTime}ms`);
    logger.info(`  Cache-Control: ${cacheControl || 'not set'}`);
    logger.info(`  ETag: ${etag || 'not set'}`);
    
    if (cacheControl && cacheControl.includes('max-age')) {
      logger.info('✅ Config asset has caching headers');
    } else {
      logger.warn('⚠️  Config asset missing cache headers');
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Config asset test failed:', { error: error.message });
    return false;
  }
}

async function testLoginFlow() {
  logger.info('🔐 Testing login flow...');
  try {
    // First, try to get a fresh session
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (loginResponse.status !== 200) {
      logger.error('❌ Login failed:', { status: loginResponse.status, data: loginResponse.data });
      return false;
    }
    
    const { accessToken, refreshToken } = loginResponse.data;
    
    if (!accessToken || !refreshToken) {
      logger.error('❌ Login response missing tokens');
      return false;
    }
    
    logger.info('✅ Login successful, tokens received');
    
    // Check if refresh token was stored in database
    const tokenCheck = await pool.query(`
      SELECT token_hash, ip_address, revoked_at, is_revoked
      FROM refresh_tokens 
      WHERE token_hash = $1
    `, [refreshToken]);
    
    if (tokenCheck.rows.length === 0) {
      logger.error('❌ Refresh token not found in database');
      return false;
    }
    
    const tokenRow = tokenCheck.rows[0];
    logger.info('✅ Refresh token stored in database');
    logger.info(`  IP Address: ${tokenRow.ip_address || 'NULL'}`);
    logger.info(`  Revoked: ${tokenRow.is_revoked}`);
    logger.info(`  Revoked At: ${tokenRow.revoked_at || 'NULL'}`);
    
    if (!tokenRow.ip_address) {
      logger.warn('⚠️  IP address not populated in refresh token');
    }
    
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('❌ Login flow test failed:', { error: error.message });
    return false;
  }
}

async function testTokenRefresh(accessToken, refreshToken) {
  logger.info('🔄 Testing token refresh flow...');
  try {
    // Wait a moment to ensure token is processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to refresh the token
    const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh`, {
      refreshToken
    });
    
    if (refreshResponse.status !== 200) {
      logger.error('❌ Token refresh failed:', { status: refreshResponse.status, data: refreshResponse.data });
      return false;
    }
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
    
    if (!newAccessToken || !newRefreshToken) {
      logger.error('❌ Refresh response missing tokens');
      return false;
    }
    
    logger.info('✅ Token refresh successful');
    
    // Verify the old refresh token is marked as revoked
    const oldTokenCheck = await pool.query(`
      SELECT is_revoked, revoked_at
      FROM refresh_tokens 
      WHERE token_hash = $1
    `, [refreshToken]);
    
    if (oldTokenCheck.rows.length > 0) {
      const oldToken = oldTokenCheck.rows[0];
      if (oldToken.is_revoked) {
        logger.info('✅ Old refresh token properly revoked');
      } else {
        logger.warn('⚠️  Old refresh token not marked as revoked');
      }
    }
    
    // Test that subsequent refresh calls with old token fail
    try {
      await axios.post(`${BASE_URL}/api/auth/refresh`, {
        refreshToken
      });
      logger.error('❌ Old refresh token still works - should be revoked!');
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        logger.info('✅ Old refresh token properly rejected');
      } else {
        logger.warn('⚠️  Unexpected error with old token:', { status: error.response?.status });
      }
    }
    
    return { newAccessToken, newRefreshToken };
  } catch (error) {
    logger.error('❌ Token refresh test failed:', { error: error.message });
    return false;
  }
}

async function runAllTests() {
  logger.info('🚀 Starting comprehensive smoke tests for all patches...\n');
  
  const results = {
    database: false,
    schema: false,
    rateLimiting: false,
    configAsset: false,
    login: false,
    refresh: false
  };
  
  try {
    // Test 1: Database connection
    results.database = await testDatabaseConnection();
    if (!results.database) {
      logger.error('❌ Database test failed - stopping tests');
      return results;
    }
    
    // Test 2: Schema validation
    results.schema = await testRefreshTokensSchema();
    if (!results.schema) {
      logger.error('❌ Schema test failed - stopping tests');
      return results;
    }
    
    // Test 3: Rate limiting
    results.rateLimiting = await testRateLimiting();
    
    // Test 4: Config asset
    results.configAsset = await testConfigAsset();
    
    // Test 5: Login flow
    const loginResult = await testLoginFlow();
    if (loginResult && loginResult.accessToken && loginResult.refreshToken) {
      results.login = true;
      
      // Test 6: Token refresh
      results.refresh = await testTokenRefresh(loginResult.accessToken, loginResult.refreshToken);
    }
    
  } catch (error) {
    logger.error('❌ Test suite failed:', { error: error.message });
  }
  
  // Summary
  logger.info('\n📊 Test Results Summary:');
  logger.info(`  Database Connection: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  Schema Validation: ${results.schema ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  Rate Limiting: ${results.rateLimiting ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  Config Asset: ${results.configAsset ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  Login Flow: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  Token Refresh: ${results.refresh ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    logger.info('\n🎉 All smoke tests passed! Your patches are working correctly.');
  } else {
    logger.error('\n⚠️  Some tests failed. Please review the issues above.');
  }
  
  return results;
}

// Run the tests
if (require.main === module) {
  runAllTests()
    .then((results) => {
      const allPassed = Object.values(results).every(result => result === true);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((error) => {
      logger.error('❌ Test suite crashed:', { error: error.message });
      process.exit(1);
    });
}

module.exports = { runAllTests };
