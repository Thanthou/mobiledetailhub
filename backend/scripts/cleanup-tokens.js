#!/usr/bin/env node

/**
 * Token Cleanup Script
 * Cleans up expired password reset tokens and refresh tokens
 * Run this as a cron job every hour
 */

import { pool } from '../database/pool.js';
import * as passwordResetService from '../services/passwordResetService.js';
import { cleanupExpiredTokens } from '../services/refreshTokenService.js';
import { createModuleLogger } from '../config/logger.js';
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
    const refreshTokensCleaned = await cleanupExpiredTokens();
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
// Run cleanup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
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

export { cleanupTokens };
