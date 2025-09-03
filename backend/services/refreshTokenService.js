/**
 * Refresh Token Service
 * Handles database operations for refresh tokens
 */

const { pool } = require('../database/pool');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Generate a unique device ID based on user agent and IP
 * @param {string} userAgent - User agent string
 * @param {string} ipAddress - IP address
 * @returns {string} Unique device identifier
 */
const generateDeviceId = (userAgent, ipAddress) => {
  const combined = `${userAgent || 'unknown'}-${ipAddress || 'unknown'}`;
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
};

/**
 * Generate a token family ID for token rotation security
 * @returns {string} Unique token family identifier
 */
const generateTokenFamily = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Store a refresh token in the database
 * @param {number} userId - User ID
 * @param {string} tokenHash - Hashed refresh token
 * @param {Date} expiresAt - Token expiration date
 * @param {string} ipAddress - IP address where token was created
 * @param {string} userAgent - User agent string
 * @param {string} deviceId - Device identifier
 * @param {string} tokenFamily - Token family identifier (optional, will generate if not provided)
 * @returns {Promise<Object>} Stored token record
 */
const storeRefreshToken = async (userId, tokenHash, expiresAt, ipAddress, userAgent, deviceId, tokenFamily = null) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    // Generate token family if not provided
    const familyId = tokenFamily || generateTokenFamily();

    // Check if user already has a token for this device
    const existingToken = await pool.query(
      'SELECT id FROM auth.refresh_tokens WHERE user_id = $1 AND device_id = $2',
      [userId, deviceId]
    );

    if (existingToken.rows.length > 0) {
      // Update existing token
      const result = await pool.query(
        `UPDATE auth.refresh_tokens 
         SET token_hash = $1, expires_at = $2, token_family = $3,
             revoked_at = NULL, ip_address = $4, user_agent = $5, created_at = NOW()
         WHERE user_id = $6 AND device_id = $7
         RETURNING *`,
        [tokenHash, expiresAt, familyId, ipAddress, userAgent, userId, deviceId]
      );
      
      logger.info('Updated existing refresh token for device:', { userId, deviceId });
      return result.rows[0];
    } else {
      // Insert new token
      const result = await pool.query(
        `INSERT INTO auth.refresh_tokens 
         (user_id, token_hash, token_family, expires_at, ip_address, user_agent, device_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, tokenHash, familyId, expiresAt, ipAddress, userAgent, deviceId]
      );
      
      logger.info('Stored new refresh token:', { userId, deviceId });
      return result.rows[0];
    }
  } catch (error) {
    logger.error('Error storing refresh token:', { error: error.message, userId });
    throw error;
  }
};

/**
 * Validate a refresh token
 * @param {string} tokenHash - Hashed refresh token
 * @returns {Promise<Object|null>} Token record if valid, null otherwise
 */
const validateRefreshToken = async (tokenHash) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      `SELECT rt.*, u.email, u.is_admin
       FROM auth.refresh_tokens rt
       JOIN auth.users u ON rt.user_id = u.id
       WHERE rt.token_hash = $1 
         AND rt.expires_at > NOW() 
         AND rt.revoked_at IS NULL`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error validating refresh token:', { error: error.message });
    throw error;
  }
};

/**
 * Revoke a refresh token
 * @param {string} tokenHash - Hashed refresh token to revoke
 * @returns {Promise<boolean>} True if token was revoked, false if not found
 */
const revokeRefreshToken = async (tokenHash) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      `UPDATE auth.refresh_tokens 
       SET revoked_at = NOW()
       WHERE token_hash = $1 AND revoked_at IS NULL
       RETURNING id`,
      [tokenHash]
    );

    if (result.rows.length > 0) {
      logger.info('Revoked refresh token:', { tokenHash });
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error revoking refresh token:', { error: error.message, tokenHash });
    throw error;
  }
};

/**
 * Revoke all refresh tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Number of tokens revoked
 */
const revokeAllUserTokens = async (userId) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      `UPDATE auth.refresh_tokens 
       SET revoked_at = NOW()
       WHERE user_id = $1 AND revoked_at IS NULL
       RETURNING id`,
      [userId]
    );

    const revokedCount = result.rows.length;
    if (revokedCount > 0) {
      logger.info('Revoked all refresh tokens for user:', { userId, count: revokedCount });
    }

    return revokedCount;
  } catch (error) {
    logger.error('Error revoking all user tokens:', { error: error.message, userId });
    throw error;
  }
};

/**
 * Revoke refresh token for a specific device
 * @param {number} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {Promise<boolean>} True if token was revoked, false if not found
 */
const revokeDeviceToken = async (userId, deviceId) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      `UPDATE auth.refresh_tokens 
       SET revoked_at = NOW()
       WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
       RETURNING id`,
      [userId, deviceId]
    );

    if (result.rows.length > 0) {
      logger.info('Revoked device refresh token:', { userId, deviceId });
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error revoking device token:', { error: error.message, userId, deviceId });
    throw error;
  }
};

/**
 * Get all active refresh tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of active token records
 */
const getUserTokens = async (userId) => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      `SELECT id, device_id, created_at, expires_at, ip_address, user_agent
       FROM auth.refresh_tokens 
       WHERE user_id = $1 AND expires_at > NOW() AND revoked_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting user tokens:', { error: error.message, userId });
    throw error;
  }
};

/**
 * Clean up expired tokens
 * @returns {Promise<number>} Number of tokens cleaned up
 */
const cleanupExpiredTokens = async () => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(
      'DELETE FROM auth.refresh_tokens WHERE expires_at < NOW() OR revoked_at IS NOT NULL'
    );

    const deletedCount = result.rowCount;
    if (deletedCount > 0) {
      logger.info('Cleaned up expired refresh tokens:', { count: deletedCount });
    }

    return deletedCount;
  } catch (error) {
    logger.error('Error cleaning up expired tokens:', { error: error.message });
    throw error;
  }
};

/**
 * Get token statistics
 * @returns {Promise<Object>} Token statistics
 */
const getTokenStats = async () => {
  try {

    if (!pool) {
      throw new Error('Database connection not available');
    }

    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN expires_at > NOW() AND revoked_at IS NULL THEN 1 END) as active_tokens,
        COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_tokens,
        COUNT(CASE WHEN revoked_at IS NOT NULL THEN 1 END) as revoked_tokens
      FROM auth.refresh_tokens
    `);

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting token stats:', { error: error.message });
    throw error;
  }
};

module.exports = {
  generateDeviceId,
  generateTokenFamily,
  storeRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  revokeDeviceToken,
  getUserTokens,
  cleanupExpiredTokens,
  getTokenStats
};
