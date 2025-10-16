#!/usr/bin/env node

/**
 * Token Cleanup Script
 * Cleans up expired password reset tokens and refresh tokens
 * Run this as a cron job every hour
 */

const { pool } = require('../database/pool');
const passwordResetService = require('../services/passwordResetService');
const { revokeExpiredTokens } = require('../services/refreshTokenService');
const { createModuleLogger } = require('../config/logger');
const logger = createModuleLogger('cleanup-tokens');

/**
 * Main cleanup function
 */
async function cleanupTokens() {
  console.log('🧹 Starting token cleanup...');
  
  let totalCleaned = 0;
  
  try {
    // Clean up expired password reset tokens
    console.log('  📧 Cleaning password reset tokens...');
    const resetTokensCleaned = await passwordResetService.cleanupExpiredTokens();
    totalCleaned += resetTokensCleaned;
    console.log(`  ✅ Cleaned ${resetTokensCleaned} password reset tokens`);
    
    // Clean up expired refresh tokens
    console.log('  🔄 Cleaning refresh tokens...');
    const refreshTokensCleaned = await revokeExpiredTokens();
    totalCleaned += refreshTokensCleaned;
    console.log(`  ✅ Cleaned ${refreshTokensCleaned} refresh tokens`);
    
    // Clean up blacklisted tokens (if using database blacklist)
    if (pool) {
      console.log('  🚫 Cleaning blacklisted tokens...');
      const blacklistResult = await pool.query(
        'DELETE FROM auth.token_blacklist WHERE expires_at < NOW()'
      );
      const blacklistCleaned = blacklistResult.rowCount || 0;
      totalCleaned += blacklistCleaned;
      console.log(`  ✅ Cleaned ${blacklistCleaned} blacklisted tokens`);
    }
    
    console.log(`🎉 Token cleanup completed! Total cleaned: ${totalCleaned}`);
    
    // Log statistics
    const stats = await passwordResetService.getResetTokenStats();
    logger.info('Token cleanup completed', {
      totalCleaned,
      resetTokenStats: stats
    });
    
  } catch (error) {
    console.error('❌ Token cleanup failed:', error.message);
    logger.error('Token cleanup failed', { error: error.message });
    process.exit(1);
  }
}

/**
 * Run cleanup if called directly
 */
if (require.main === module) {
  cleanupTokens()
    .then(() => {
      console.log('✅ Cleanup script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { cleanupTokens };
