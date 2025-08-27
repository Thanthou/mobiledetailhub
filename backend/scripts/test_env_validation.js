/**
 * Test script for enhanced environment validation
 * Tests various secret strengths and validation scenarios
 */

require('dotenv').config();
const { validateEnvironment } = require('../utils/envValidator');

console.log('🧪 Testing Enhanced Environment Validation\n');

// Set up a complete test environment that passes basic validation
const baseTestEnv = {
  // Database Configuration (required)
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'testdb',
  DB_USER: 'testuser',
  DB_PASSWORD: 'testpass',
  
  // Server Configuration (optional with defaults)
  PORT: '3001',
  
  // Other optional configs
  ALLOWED_ORIGINS: 'http://localhost:3000'
};

// Test scenarios
const testScenarios = [
  {
    name: 'Weak JWT Secret (too short)',
    env: { 
      ...baseTestEnv,
      JWT_SECRET: 'weak', 
      JWT_REFRESH_SECRET: 'weak',
      ADMIN_PASSWORD: 'Str0ng!P@ssw0rd2024'
    },
    shouldPass: false
  },
  {
    name: 'Weak JWT Secret (common pattern)',
    env: { 
      ...baseTestEnv,
      JWT_SECRET: 'admin123admin123admin123admin123', 
      JWT_REFRESH_SECRET: 'admin123admin123admin123admin123',
      ADMIN_PASSWORD: 'Str0ng!P@ssw0rd2024'
    },
    shouldPass: false
  },
  {
    name: 'Strong JWT Secrets',
    env: { 
      ...baseTestEnv,
      JWT_SECRET: 'K8x#mP9$vL2@nQ7&hF4!jR5*wE8^sA3%tY6#uI1&oP9$kL4@mN7!hF2^jR5*wE8',
      JWT_REFRESH_SECRET: 'Q9#wE2$rT7@yU4&iO1!pA6^sD9*fG3%hJ7#kL2&mN5$pQ8@rT1!uI4^oP7*wA0',
      ADMIN_PASSWORD: 'Str0ng!P@ssw0rd2024'
    },
    shouldPass: true
  },
  {
    name: 'Weak Admin Password',
    env: { 
      ...baseTestEnv,
      JWT_SECRET: 'K8x#mP9$vL2@nQ7&hF4!jR5*wE8^sA3%tY6#uI1&oP9$kL4@mN7!hF2^jR5*wE8',
      JWT_REFRESH_SECRET: 'Q9#wE2$rT7@yU4&iO1!pA6^sD9*fG3%hJ7#kL2&mN5$pQ8@rT1!uI4^oP7*wA0',
      ADMIN_PASSWORD: 'admin123'
    },
    shouldPass: false
  },
  {
    name: 'Strong Admin Password',
    env: { 
      ...baseTestEnv,
      JWT_SECRET: 'K8x#mP9$vL2@nQ7&hF4!jR5*wE8^sA3%tY6#uI1&oP9$kL4@mN7!hF2^jR5*wE8',
      JWT_REFRESH_SECRET: 'Q9#wE2$rT7@yU4&iO1!pA6^sD9*fG3%hJ7#kL2&mN5$pQ8@rT1!uI4^oP7*wA0',
      ADMIN_PASSWORD: 'Str0ng!P@ssw0rd2024'
    },
    shouldPass: true
  }
];

console.log('🔧 Testing in DEVELOPMENT mode (warnings only):\n');

// Test in development mode
testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. Testing: ${scenario.name}`);
  
  // Set test environment
  const originalEnv = {};
  Object.keys(scenario.env).forEach(key => {
    originalEnv[key] = process.env[key];
    process.env[key] = scenario.env[key];
  });
  
  // Force development mode
  process.env.NODE_ENV = 'development';
  
  try {
    validateEnvironment();
    if (scenario.shouldPass) {
      console.log('   ✅ PASSED - Validation succeeded as expected');
    } else {
      console.log('   ✅ PASSED - Validation failed as expected (warnings shown)');
    }
  } catch (error) {
    if (!scenario.shouldPass) {
      console.log('   ✅ PASSED - Validation failed as expected');
      console.log(`   📝 Error: ${error.message.split('\n')[0]}`);
    } else {
      console.log('   ❌ FAILED - Validation should have passed but failed');
      console.log(`   📝 Error: ${error.message.split('\n')[0]}`);
    }
  }
  
  // Restore original environment
  Object.keys(scenario.env).forEach(key => {
    process.env[key] = originalEnv[key];
  });
});

console.log('\n🔒 Testing in PRODUCTION mode (blocking weak secrets):\n');

// Test in production mode
testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. Testing: ${scenario.name}`);
  
  // Set test environment
  const originalEnv = {};
  Object.keys(scenario.env).forEach(key => {
    originalEnv[key] = process.env[key];
    process.env[key] = scenario.env[key];
  });
  
  // Force production mode
  process.env.NODE_ENV = 'production';
  
  try {
    validateEnvironment();
    if (scenario.shouldPass) {
      console.log('   ✅ PASSED - Validation succeeded as expected');
    } else {
      console.log('   ❌ FAILED - Validation should have failed but passed');
    }
  } catch (error) {
    if (!scenario.shouldPass) {
      console.log('   ✅ PASSED - Validation failed as expected');
      console.log(`   📝 Error: ${error.message.split('\n')[0]}`);
    } else {
      console.log('   ❌ FAILED - Validation should have passed but failed');
      console.log(`   📝 Error: ${error.message.split('\n')[0]}`);
    }
  }
  
  // Restore original environment
  Object.keys(scenario.env).forEach(key => {
    process.env[key] = originalEnv[key];
  });
});

console.log('\n🧪 Environment validation tests completed!');
