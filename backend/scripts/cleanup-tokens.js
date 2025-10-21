/**
 * Token Cleanup Script
 * Removes expired and revoked tokens from the database
 * 
 * This script can be run manually or scheduled via cron
 */

import { cleanupExpiredTokens } from '../services/refreshTokenService.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('cleanup-tokens');

/**
 * Clean up expired tokens
 */
export async function cleanupTokens() {
  try {
    logger.info('Starting token cleanup...');
    
    const deletedCount = await cleanupExpiredTokens();
    
    logger.info('Token cleanup completed', { 
      deletedCount,
      timestamp: new Date().toISOString()
    });
    
    return deletedCount;
  } catch (error) {
    logger.error('Token cleanup failed', { 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
}

// Allow running as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupTokens()
    .then((count) => {
      console.log(`✅ Cleaned up ${count} expired tokens`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    });
}

