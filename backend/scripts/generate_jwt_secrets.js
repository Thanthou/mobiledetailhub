#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Generates secure random secrets for JWT_SECRET and JWT_REFRESH_SECRET
 */

const crypto = require('crypto');

console.log('🔐 JWT Secret Generator');
console.log('========================\n');

// Generate JWT_SECRET
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('');

// Generate JWT_REFRESH_SECRET
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_REFRESH_SECRET:');
console.log(jwtRefreshSecret);
console.log('');

console.log('📝 Copy these to your .env file:');
console.log('========================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log('');

console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('=============================');
console.log('• Never share these secrets');
console.log('• Use different secrets for each environment');
console.log('• Store securely and never commit to version control');
console.log('• Rotate secrets regularly in production');
console.log('');

console.log('✅ Secrets generated successfully!');
console.log('📁 Add them to your backend/.env file');
