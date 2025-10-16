/**
 * Password Reset Service
 * Handles secure password reset with token management and cleanup
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../database/pool.js';
import { env } from '../config/env.js';
import * as emailService from './emailService.js';
import { createModuleLogger } from '../config/logger.js';
const logger = createModuleLogger('passwordResetService');

const RESET_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 3; // Max reset attempts per hour
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure reset token
 * @returns {string} Secure random token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a reset token for storage
 * @param {string} token - Plain text token
 * @returns {string} Hashed token
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Request password reset
 * @param {string} email - User email
 * @param {string} ipAddress - Request IP
 * @param {string} userAgent - Request user agent
 * @returns {Promise<boolean>} Success status
 */
const requestPasswordReset = async (email, ipAddress, userAgent) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, name FROM auth.users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists - return success anyway
      logger.info('Password reset requested for non-existent email', { email, ipAddress });
      return true;
    }

    const user = userResult.rows[0];

    // Check rate limiting (max 3 attempts per hour)
    const oneHourAgo = new Date(Date.now() - ATTEMPT_WINDOW);
    const attemptsResult = await pool.query(
      `SELECT COUNT(*) as count FROM auth.password_reset_tokens 
       WHERE user_id = $1 AND created_at > $2`,
      [user.id, oneHourAgo]
    );

    const attemptCount = parseInt(attemptsResult.rows[0].count);
    if (attemptCount >= MAX_ATTEMPTS) {
      logger.warn('Password reset rate limit exceeded', { email, ipAddress, attempts: attemptCount });
      throw new Error('Too many reset attempts. Please try again later.');
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

    // Store reset token
    await pool.query(
      `INSERT INTO auth.password_reset_tokens 
       (user_id, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, hashedToken, expiresAt, ipAddress, userAgent]
    );

    // Send reset email
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresIn: '15 minutes'
    });

    logger.info('Password reset token generated', { 
      userId: user.id, 
      email: user.email, 
      ipAddress 
    });

    return true;
  } catch (error) {
    logger.error('Error requesting password reset', { 
      error: error.message, 
      email, 
      ipAddress 
    });
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @param {string} ipAddress - Request IP
 * @returns {Promise<boolean>} Success status
 */
const resetPassword = async (token, newPassword, ipAddress) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    const hashedToken = hashResetToken(token);

    // Find valid reset token
    const tokenResult = await pool.query(
      `SELECT prt.*, u.email, u.name 
       FROM auth.password_reset_tokens prt
       JOIN auth.users u ON prt.user_id = u.id
       WHERE prt.token_hash = $1 
       AND prt.expires_at > NOW() 
       AND prt.used_at IS NULL`,
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const resetToken = tokenResult.rows[0];
    const userId = resetToken.user_id;

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
        'UPDATE auth.password_reset_tokens SET used_at = NOW() WHERE id = $1',
        [resetToken.id]
      );

      // Revoke all existing refresh tokens for security
      await pool.query(
        'UPDATE auth.refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
        [userId]
      );

      await pool.query('COMMIT');

      logger.info('Password reset successful', { 
        userId, 
        email: resetToken.email, 
        ipAddress 
      });

      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    logger.error('Error resetting password', { 
      error: error.message, 
      ipAddress 
    });
    throw error;
  }
};

/**
 * Validate reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object|null>} Token info if valid
 */
const validateResetToken = async (token) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    const hashedToken = hashResetToken(token);

    const result = await pool.query(
      `SELECT prt.*, u.email, u.name 
       FROM auth.password_reset_tokens prt
       JOIN auth.users u ON prt.user_id = u.id
       WHERE prt.token_hash = $1 
       AND prt.expires_at > NOW() 
       AND prt.used_at IS NULL`,
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
    logger.error('Error validating reset token', { error: error.message });
    return null;
  }
};

/**
 * Clean up expired reset tokens
 * @returns {Promise<number>} Number of tokens cleaned up
 */
const cleanupExpiredTokens = async () => {
  if (!pool) {
    logger.warn('Database connection not available for token cleanup');
    return 0;
  }

  try {
    const result = await pool.query(
      'DELETE FROM auth.password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL'
    );

    const cleanedCount = result.rowCount;
    if (cleanedCount > 0) {
      logger.info('Cleaned up expired password reset tokens', { count: cleanedCount });
    }

    return cleanedCount;
  } catch (error) {
    logger.error('Error cleaning up expired reset tokens', { error: error.message });
    return 0;
  }
};

/**
 * Get reset token statistics
 * @returns {Promise<Object>} Token statistics
 */
const getResetTokenStats = async () => {
  if (!pool) {
    return { active: 0, expired: 0, used: 0 };
  }

  try {
    const result = await pool.query(`
      SELECT 
        COUNT(CASE WHEN expires_at > NOW() AND used_at IS NULL THEN 1 END) as active,
        COUNT(CASE WHEN expires_at <= NOW() AND used_at IS NULL THEN 1 END) as expired,
        COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used
      FROM auth.password_reset_tokens
    `);

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting reset token stats', { error: error.message });
    return { active: 0, expired: 0, used: 0 };
  }
};

export {
  requestPasswordReset,
  resetPassword,
  validateResetToken,
  cleanupExpiredTokens,
  getResetTokenStats,
  RESET_TOKEN_EXPIRY,
  MAX_ATTEMPTS,
  ATTEMPT_WINDOW
};
