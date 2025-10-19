/**
 * Password Setup Service
 * Handles secure password setup for new users with token management
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getPool } from '../database/pool.js';
import { env } from '../config/env.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('passwordSetupService');

const SETUP_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ATTEMPTS = 5; // Max setup attempts per user
const ATTEMPT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a secure setup token
 * @returns {string} Secure random token
 */
const generateSetupToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a setup token for storage
 * @param {string} token - Plain text token
 * @returns {string} Hashed token
 */
const hashSetupToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Create password setup token for new user
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} ipAddress - Request IP
 * @param {string} userAgent - Request user agent
 * @returns {Promise<Object>} Token info
 */
const createPasswordSetupToken = async (userId, email, ipAddress, userAgent) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    // Check if user exists and doesn't have a password set
    const userResult = await pool.query(
      'SELECT id, email, name, password_hash FROM auth.users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];

    // Check if user already has a password set
    if (user.password_hash && user.password_hash.trim() !== '') {
      throw new Error('User already has a password set');
    }

    // Check rate limiting (max 5 attempts per 24 hours)
    const oneDayAgo = new Date(Date.now() - ATTEMPT_WINDOW);
    const attemptsResult = await pool.query(
      `SELECT COUNT(*) as count FROM auth.password_setup_tokens 
       WHERE user_id = $1 AND created_at > $2`,
      [userId, oneDayAgo]
    );

    const attemptCount = parseInt(attemptsResult.rows[0].count);
    if (attemptCount >= MAX_ATTEMPTS) {
      logger.warn('Password setup rate limit exceeded', { userId, email, ipAddress, attempts: attemptCount });
      throw new Error('Too many setup attempts. Please contact support.');
    }

    // Generate setup token
    const setupToken = generateSetupToken();
    const hashedToken = hashSetupToken(setupToken);
    const expiresAt = new Date(Date.now() + SETUP_TOKEN_EXPIRY);

    // Store setup token
    await pool.query(
      `INSERT INTO auth.password_setup_tokens 
       (user_id, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, hashedToken, expiresAt, ipAddress, userAgent]
    );

    // Create setup URL - redirect to login with token parameter
    const setupUrl = `${env.FRONTEND_URL}/login?setup_token=${setupToken}`;

    logger.info('Password setup token created', { 
      userId, 
      email: user.email, 
      ipAddress 
    });

    return {
      token: setupToken,
      setupUrl,
      expiresAt,
      email: user.email,
      name: user.name
    };
  } catch (error) {
    logger.error('Error creating password setup token', { 
      error: error.message, 
      userId, 
      email, 
      ipAddress 
    });
    throw error;
  }
};

/**
 * Set password using setup token
 * @param {string} token - Setup token
 * @param {string} newPassword - New password
 * @param {string} ipAddress - Request IP
 * @returns {Promise<boolean>} Success status
 */
const setPasswordWithToken = async (token, newPassword, ipAddress) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    const hashedToken = hashSetupToken(token);

    // Find valid setup token
    const tokenResult = await pool.query(
      `SELECT pst.*, u.email, u.name 
       FROM auth.password_setup_tokens pst
       JOIN auth.users u ON pst.user_id = u.id
       WHERE pst.token_hash = $1 
       AND pst.expires_at > NOW() 
       AND pst.used_at IS NULL`,
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      throw new Error('Invalid or expired setup token');
    }

    const setupToken = tokenResult.rows[0];
    const userId = setupToken.user_id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and mark token as used
    await pool.query('BEGIN');

    try {
      // Update user password
      await pool.query(
        'UPDATE auth.users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, userId]
      );

      // Mark token as used
      await pool.query(
        'UPDATE auth.password_setup_tokens SET used_at = NOW() WHERE id = $1',
        [setupToken.id]
      );

      // Revoke all existing refresh tokens for security
      await pool.query(
        'UPDATE auth.refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
        [userId]
      );

      await pool.query('COMMIT');

      logger.info('Password setup successful', { 
        userId, 
        email: setupToken.email, 
        ipAddress 
      });

      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    logger.error('Error setting password with token', { 
      error: error.message, 
      ipAddress 
    });
    throw error;
  }
};

/**
 * Validate setup token
 * @param {string} token - Setup token
 * @returns {Promise<Object|null>} Token info if valid
 */
const validateSetupToken = async (token) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    const hashedToken = hashSetupToken(token);

    const result = await pool.query(
      `SELECT pst.*, u.email, u.name 
       FROM auth.password_setup_tokens pst
       JOIN auth.users u ON pst.user_id = u.id
       WHERE pst.token_hash = $1 
       AND pst.expires_at > NOW() 
       AND pst.used_at IS NULL`,
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      userId: result.rows[0].user_id,
      email: result.rows[0].email,
      name: result.rows[0].name,
      expiresAt: result.rows[0].expires_at
    };
  } catch (error) {
    logger.error('Error validating setup token', { error: error.message });
    return null;
  }
};

/**
 * Clean up expired setup tokens
 * @returns {Promise<number>} Number of tokens cleaned up
 */
const cleanupExpiredTokens = async () => {
  if (!pool) {
    logger.warn('Database connection not available for token cleanup');
    return 0;
  }

  try {
    const result = await pool.query(
      'DELETE FROM auth.password_setup_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL'
    );

    const cleanedCount = result.rowCount;
    if (cleanedCount > 0) {
      logger.info('Cleaned up expired password setup tokens', { count: cleanedCount });
    }

    return cleanedCount;
  } catch (error) {
    logger.error('Error cleaning up expired setup tokens', { error: error.message });
    return 0;
  }
};

/**
 * Get setup token statistics
 * @returns {Promise<Object>} Token statistics
 */
const getSetupTokenStats = async () => {
  if (!pool) {
    return { active: 0, expired: 0, used: 0 };
  }

  try {
    const result = await pool.query(`
      SELECT 
        COUNT(CASE WHEN expires_at > NOW() AND used_at IS NULL THEN 1 END) as active,
        COUNT(CASE WHEN expires_at <= NOW() AND used_at IS NULL THEN 1 END) as expired,
        COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used
      FROM auth.password_setup_tokens
    `);

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting setup token stats', { error: error.message });
    return { active: 0, expired: 0, used: 0 };
  }
};

export {
  createPasswordSetupToken,
  setPasswordWithToken,
  validateSetupToken,
  cleanupExpiredTokens,
  getSetupTokenStats,
  SETUP_TOKEN_EXPIRY,
  MAX_ATTEMPTS,
  ATTEMPT_WINDOW
};
