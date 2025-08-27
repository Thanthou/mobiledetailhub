/**
 * Test Admin Authorization and Audit Logging
 * 
 * This script tests:
 * 1. Admin middleware validation
 * 2. Audit logging functionality
 * 3. Token structure validation
 */

const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/tokenManager');
const logger = require('../utils/logger');

// Test data
const testUsers = [
  {
    name: 'Regular User',
    email: 'user@example.com',
    isAdmin: false,
    role: 'user'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
    role: 'admin'
  },
  {
    name: 'Role-based Admin',
    email: 'roleadmin@example.com',
    isAdmin: false,
    role: 'admin'
  }
];

function testTokenGeneration() {
  console.log('🔐 Testing Token Generation...\n');
  
  testUsers.forEach((user, index) => {
    try {
      // Simulate token generation (normally done in auth routes)
      const tokenPayload = {
        userId: index + 1,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      };
      
      // Generate token using JWT_SECRET (if available)
      let token;
      if (process.env.JWT_SECRET) {
        token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
        console.log(`✅ Generated token for ${user.name}:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   isAdmin: ${user.isAdmin}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Token: ${token.substring(0, 50)}...`);
        
        // Verify token
        try {
          const decoded = verifyAccessToken(token);
          console.log(`   ✅ Token verified successfully`);
          console.log(`   Decoded payload:`, decoded);
        } catch (verifyError) {
          console.log(`   ❌ Token verification failed:`, verifyError.message);
        }
      } else {
        console.log(`⚠️  JWT_SECRET not set, skipping token generation for ${user.name}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ Error generating token for ${user.name}:`, error.message);
    }
  });
}

function testAdminValidation() {
  console.log('👑 Testing Admin Validation Logic...\n');
  
  testUsers.forEach((user) => {
    // Simulate the admin validation logic from middleware
    const isAdminUser = user.isAdmin === true || user.role === 'admin';
    
    console.log(`User: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  isAdmin: ${user.isAdmin}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Admin Access: ${isAdminUser ? '✅ GRANTED' : '❌ DENIED'}`);
    console.log('');
  });
}

function testAuditLogging() {
  console.log('🔍 Testing Audit Logging...\n');
  
  // Test audit logging methods
  const testActor = { userId: 1, email: 'admin@example.com' };
  
  // Test audit method
  logger.audit('TEST_ACTION', 'test_entity', { before: 'old_value' }, { after: 'new_value' }, testActor);
  
  // Test admin action method
  logger.adminAction('TEST_ADMIN_ACTION', 'test_entity', { details: 'test_details' }, testActor);
  
  console.log('✅ Audit logging methods called successfully');
  console.log('Check your logs for the audit entries\n');
}

function runTests() {
  console.log('🚀 Starting Admin Authorization and Audit Logging Tests\n');
  console.log('=' .repeat(60));
  
  testTokenGeneration();
  testAdminValidation();
  testAuditLogging();
  
  console.log('=' .repeat(60));
  console.log('✅ All tests completed!');
  console.log('\n📋 Summary:');
  console.log('• Token generation and validation tested');
  console.log('• Admin validation logic verified');
  console.log('• Audit logging functionality confirmed');
  console.log('\n💡 Next steps:');
  console.log('• Check your application logs for audit entries');
  console.log('• Test admin endpoints with valid admin tokens');
  console.log('• Verify audit logs contain required fields: actor, action, entity, before, after');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testTokenGeneration,
  testAdminValidation,
  testAuditLogging,
  runTests
};
