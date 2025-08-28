const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../database/pool');
const { authenticateToken } = require('../middleware/auth');
const { validateBody, sanitize } = require('../middleware/validation');
const { authSchemas, sanitizationSchemas } = require('../utils/validationSchemas');
const { generateTokenPair, blacklistToken } = require('../utils/tokenManager');
const { 
  storeRefreshToken, 
  validateRefreshToken, 
  revokeRefreshToken, 
  revokeAllUserTokens,
  revokeDeviceToken,
  generateDeviceId,
  getUserTokens
} = require('../services/refreshTokenService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { authLimiter, sensitiveAuthLimiter, refreshTokenLimiter } = require('../middleware/rateLimiter');

// User Registration
router.post('/register', 
  sensitiveAuthLimiter,
  sanitize(sanitizationSchemas.auth),
  validateBody(authSchemas.register),
  asyncHandler(async (req, res) => {
    const { email, password, name, phone } = req.body;


    if (!pool) {
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Create user with admin status if applicable
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, phone, is_admin, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, email, name, phone, is_admin, role, created_at',
      [email, hashedPassword, name, phone, isAdmin, isAdmin ? 'admin' : 'user']
    );

    // Generate token pair (access + refresh)
    const tokenPayload = { 
      userId: result.rows[0].id, 
      email: result.rows[0].email, 
      isAdmin 
    };
    
    const tokens = generateTokenPair(tokenPayload);
    
    // Store refresh token in database
    const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
    const tokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
    
    await storeRefreshToken(
      result.rows[0].id,
      tokenHash,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      req.ip,
      req.get('User-Agent'),
      deviceId
    );

    if (isAdmin) {
      // Admin user created
    }

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        phone: result.rows[0].phone,
        is_admin: isAdmin
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn
    });
  })
);

// User Login
router.post('/login', 
  sensitiveAuthLimiter, // Apply sensitive auth rate limiting
  sanitize(sanitizationSchemas.auth),
  validateBody(authSchemas.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!pool) {
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      const error = new Error('Email or password is incorrect');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      const error = new Error('Email or password is incorrect');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    let isAdmin = user.is_admin || false;
    
    // Auto-promote to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
      await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
      isAdmin = true;
    }

    // Generate token pair (access + refresh)
    const tokenPayload = { 
      userId: user.id, 
      email: user.email, 
      isAdmin 
    };
    
    const tokens = generateTokenPair(tokenPayload);
    
    // Store refresh token in database
    const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
    const tokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
    
    await storeRefreshToken(
      user.id,
      tokenHash,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      req.ip,
      req.get('User-Agent'),
      deviceId
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        is_admin: isAdmin
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn
    });
  })
);

// Get Current User (Protected Route)
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const result = await pool.query('SELECT id, email, name, phone, is_admin, created_at FROM users WHERE id = $1', [req.user.userId]);
  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  const user = result.rows[0];
  
  // Check if user should be admin based on environment variable
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
  let isAdmin = user.is_admin || false;
  
  // Auto-promote to admin if email is in ADMIN_EMAILS list
  if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
    await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
    isAdmin = true;
  }
  
  res.json({
    ...user,
    is_admin: isAdmin
  });
}));

/**
 * Refresh token endpoint
 * 
 * Accepts refresh token from:
 * - Request body: { "refreshToken": "..." }
 * - Cookie: refreshToken=...
 * 
 * Returns new access token + optional refresh token
 * No Authorization header required (uses refresh token for authentication)
 */
router.post('/refresh', refreshTokenLimiter, asyncHandler(async (req, res) => {
  // Accept refresh token from body or cookie (flexible input)
  let refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  
  if (!refreshToken) {
    const error = new Error('Refresh token is required in body or cookie');
    error.statusCode = 400;
    throw error;
  }

  // Hash the refresh token for database lookup
  const tokenHash = require('crypto').createHash('sha256').update(refreshToken).digest('hex');
  
  // Validate refresh token
  const tokenRecord = await validateRefreshToken(tokenHash);
  if (!tokenRecord) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Generate new token pair
  const tokenPayload = {
    userId: tokenRecord.user_id,
    email: tokenRecord.email,
    isAdmin: tokenRecord.is_admin
  };
  
  const tokens = generateTokenPair(tokenPayload);
  
  // Update refresh token in database
  const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
  const newTokenHash = require('crypto').createHash('sha256').update(tokens.refreshToken).digest('hex');
  
  await storeRefreshToken(
    tokenRecord.user_id,
    newTokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    req.ip,
    req.get('User-Agent'),
    deviceId
  );

  // Revoke old refresh token
  await revokeRefreshToken(tokenHash);

  // Consistent response format matching login endpoint
  res.json({
    success: true,
    user: {
      id: tokenRecord.user_id,
      email: tokenRecord.email,
      is_admin: tokenRecord.is_admin
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: tokens.expiresIn,
    refreshExpiresIn: tokens.refreshExpiresIn
  });
}));

// Logout endpoint
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    // Blacklist the access token
    blacklistToken(token);
  }

  // Revoke all refresh tokens for the user
  await revokeAllUserTokens(req.user.userId);

  res.json({ success: true, message: 'Logged out successfully' });
}));

// Logout from specific device
router.post('/logout-device', authenticateToken, asyncHandler(async (req, res) => {
  const { deviceId } = req.body;
  
  if (!deviceId) {
    const error = new Error('Device ID is required');
    error.statusCode = 400;
    throw error;
  }

  // Revoke refresh token for specific device
  const revoked = await revokeDeviceToken(req.user.userId, deviceId);
  
  if (revoked) {
    res.json({ success: true, message: 'Device logged out successfully' });
  } else {
    const error = new Error('Device not found or already logged out');
    error.statusCode = 404;
    throw error;
  }
}));

// Get user's active sessions
router.get('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const sessions = await getUserTokens(req.user.userId);
  
  res.json({
    success: true,
    sessions: sessions.map(session => ({
      deviceId: session.device_id,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
      ipAddress: session.ip_address,
      userAgent: session.user_agent
    }))
  });
}));

// Admin promotion endpoint (for development)
router.post('/promote-admin', authLimiter, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (ADMIN_EMAILS.length === 0) {
    const error = new Error('No ADMIN_EMAILS configured');
    error.statusCode = 400;
    throw error;
  }
  
  // Update all users whose emails are in ADMIN_EMAILS to be admins
  const result = await pool.query(
    'UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE email = ANY($1) RETURNING id, email, name',
    [ADMIN_EMAILS]
  );
  
  res.json({
    success: true,
    message: `Promoted ${result.rowCount} users to admin`,
    promoted: result.rows
  });
}));

module.exports = router;
