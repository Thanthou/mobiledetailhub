import bcrypt from 'bcryptjs';
import { pool } from '../database/pool.js';
import { generateTokenPair } from '../utils/tokenManager.js';
// import { blacklistToken } from '../utils/tokenManager.js'; // Unused import
import { 
  storeRefreshToken, 
  validateRefreshToken, 
  revokeRefreshToken, 
  revokeAllUserTokens,
  revokeDeviceToken,
  generateDeviceId,
  getUserTokens
} from './refreshTokenService.js';
import { env } from '../config/env.js';

/**
 * Auth Service
 * Handles all business logic related to authentication
 */

/**
 * Check if email exists
 */
async function checkEmailExists(email) {
  if (!email) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

  const result = await pool.query('SELECT id FROM auth.users WHERE email = $1', [email]);
  return result.rows.length > 0;
}

/**
 * Register a new user
 */
async function registerUser(userData, userAgent, ipAddress) {
  const { email, password, name, phone } = userData;

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM auth.users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Check if user should be admin based on environment variable
  const ADMIN_EMAILS = env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin = ADMIN_EMAILS.includes(email);

  // Create user with admin status if applicable
  const result = await pool.query(
    'INSERT INTO auth.users (email, password_hash, name, phone, is_admin, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email, name, phone, is_admin, created_at',
    [email, hashedPassword, name, phone, isAdmin]
  );

  // Generate token pair (access + refresh)
  const tokenPayload = { 
    userId: result.rows[0].id, 
    email: result.rows[0].email, 
    isAdmin 
  };
  
  const tokens = generateTokenPair(tokenPayload);
  
  // Store refresh token in database
  const deviceId = generateDeviceId(userAgent, ipAddress);
  const tokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
  
  await storeRefreshToken(
    result.rows[0].id,
    tokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceId,
    userAgent,
    ipAddress
  );

  return {
    user: result.rows[0],
    tokens,
    deviceId
  };
}

/**
 * Login user
 */
async function loginUser(credentials, userAgent, ipAddress) {
  const { email, password } = credentials;

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

  // Find user by email
  const result = await pool.query(
    'SELECT id, email, password_hash, name, phone, is_admin, created_at FROM auth.users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    const error = new Error('Email or password is incorrect');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    const error = new Error('Email or password is incorrect');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Check if user should be admin based on environment variable
  const ADMIN_EMAILS = env.ADMIN_EMAILS?.split(',') || [];
  let isAdmin = user.is_admin || false;
  
  // Auto-promote to admin if email is in ADMIN_EMAILS list
  if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
    await pool.query('UPDATE auth.users SET is_admin = TRUE WHERE id = $1', [user.id]);
    isAdmin = true;
  }

  // Generate token pair
  const tokenPayload = { 
    userId: user.id, 
    email: user.email, 
    isAdmin 
  };
  
  const tokens = generateTokenPair(tokenPayload);
  
  // Store refresh token
  const deviceId = generateDeviceId(userAgent, ipAddress);
  const tokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
  
  await storeRefreshToken(
    user.id,
    tokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceId,
    userAgent,
    ipAddress
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      is_admin: isAdmin,
      created_at: user.created_at
    },
    tokens,
    deviceId
  };
}

/**
 * Refresh access token
 */
async function refreshAccessToken(refreshToken, userAgent, ipAddress) {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  // Validate refresh token
  const tokenData = await validateRefreshToken(refreshToken, userAgent, ipAddress);
  if (!tokenData) {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Get user data
  const result = await pool.query(
    'SELECT id, email, name, phone, is_admin FROM auth.users WHERE id = $1',
    [tokenData.userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const user = result.rows[0];

  // Generate new access token
  const tokenPayload = { 
    userId: user.id, 
    email: user.email, 
    isAdmin: user.is_admin 
  };
  
  const tokens = generateTokenPair(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      is_admin: user.is_admin
    },
    tokens
  };
}

/**
 * Logout user
 */
async function logoutUser(refreshToken, userAgent, ipAddress) {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  // Revoke refresh token
  const success = await revokeRefreshToken(refreshToken, userAgent, ipAddress);
  
  if (!success) {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  return { success: true };
}

/**
 * Logout all devices
 */
async function logoutAllDevices(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  await revokeAllUserTokens(userId);
  return { success: true };
}

/**
 * Get user tokens
 */
async function getUserTokenList(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  const tokens = await getUserTokens(userId);
  return tokens;
}

/**
 * Revoke specific device token
 */
async function revokeDeviceTokenById(userId, deviceId) {
  if (!userId || !deviceId) {
    const error = new Error('User ID and Device ID are required');
    error.statusCode = 400;
    throw error;
  }

  const success = await revokeDeviceToken(userId, deviceId);
  
  if (!success) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return { success: true };
}

/**
 * Get user profile
 */
async function getUserProfile(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    'SELECT id, email, name, phone, is_admin, created_at FROM auth.users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, updateData) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  const { name, phone } = updateData;
  const updateFields = [];
  const values = [];
  let paramCount = 0;

  if (name !== undefined) {
    updateFields.push(`name = $${++paramCount}`);
    values.push(name);
  }

  if (phone !== undefined) {
    updateFields.push(`phone = $${++paramCount}`);
    values.push(phone);
  }

  if (updateFields.length === 0) {
    const error = new Error('No fields to update');
    error.statusCode = 400;
    throw error;
  }

  updateFields.push(`updated_at = NOW()`);
  values.push(userId);

  const query = `
    UPDATE auth.users 
    SET ${updateFields.join(', ')} 
    WHERE id = $${++paramCount}
    RETURNING id, email, name, phone, is_admin, created_at, updated_at
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

/**
 * Change password
 */
async function changePassword(userId, currentPassword, newPassword) {
  if (!userId || !currentPassword || !newPassword) {
    const error = new Error('User ID, current password, and new password are required');
    error.statusCode = 400;
    throw error;
  }

  // Get current password hash
  const result = await pool.query(
    'SELECT password_hash FROM auth.users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!isValidPassword) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await pool.query(
    'UPDATE auth.users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [hashedPassword, userId]
  );

  return { success: true };
}

export {
  checkEmailExists,
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getUserTokenList,
  revokeDeviceTokenById,
  getUserProfile,
  updateUserProfile,
  changePassword
};
