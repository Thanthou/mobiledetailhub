import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/zodValidation.js';
import { authSchemas } from '../schemas/apiSchemas.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authLimiter, sensitiveAuthLimiter, refreshTokenLimiter } from '../middleware/rateLimiter.js';
import * as authController from '../controllers/authController.js';
import * as passwordResetController from '../controllers/passwordResetController.js';
import * as passwordSetupController from '../controllers/passwordSetupController.js';
import { getPool } from '../database/pool.js';
import * as authService from '../services/authService.js';
import { createModuleLogger } from '../config/logger.js';

const router = express.Router();
const logger = createModuleLogger('authRoutes');

// Check if email exists (for onboarding validation)
router.get('/check-email', 
  authLimiter, 
  validateQuery(authSchemas.checkEmail),
  asyncHandler(authController.checkEmail)
);

// User Registration
router.post('/register', 
  sensitiveAuthLimiter,
  validateBody(authSchemas.register),
  asyncHandler(authController.register)
);

// User Login
router.post('/login', 
  sensitiveAuthLimiter,
  validateBody(authSchemas.login),
  asyncHandler(authController.login)
);

// Get Current User (Protected Route)
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {

  const pool = await getPool();
  
  const result = await pool.query('SELECT id, email, name, phone, is_admin, created_at FROM auth.users WHERE id = $1', [req.user.userId]);
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
    await pool.query('UPDATE auth.users SET is_admin = TRUE WHERE id = $1', [user.id]);
    isAdmin = true;
  }
  
  // Check if user is a tenant and get tenant ID
  let tenantId = null;
  if (!isAdmin) {
    const tenantResult = await pool.query(
      'SELECT id FROM tenants.business WHERE user_id = $1 LIMIT 1',
      [user.id]
    );
    if (tenantResult.rows.length > 0) {
      tenantId = tenantResult.rows[0].id;
    }
  }
  
  res.json({
    ...user,
    is_admin: isAdmin,
    tenant_id: tenantId
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
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  
  if (!refreshToken) {
    const error = new Error('Refresh token is required in body or cookie');
    error.statusCode = 400;
    throw error;
  }

  // Hash the refresh token for database lookup
  const crypto = await import('crypto');
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  // Validate refresh token
  const tokenRecord = await authService.validateRefreshToken(tokenHash);
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
  
  const tokens = authService.generateTokenPair(tokenPayload);
  
  // Update refresh token in database
  const deviceId = authService.generateDeviceId(req.get('User-Agent'), req.ip);
  const newTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
  
  await authService.storeRefreshToken(
    tokenRecord.user_id,
    newTokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    req.ip,
    req.get('User-Agent'),
    deviceId
  );

  // Revoke old refresh token
  await authService.revokeRefreshToken(tokenHash);

  // Set HttpOnly cookies for enhanced security
  const { AUTH_CONFIG } = await import('../config/auth.js');
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000 // 15 minutes (matches access token expiry)
  });
  
  res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());

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
    // Blacklist the access token with additional context
    await authService.blacklistToken(token, {
      reason: 'logout',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Revoke all refresh tokens for the user
  await authService.revokeAllUserTokens(req.user.userId);

  // Clear HttpOnly cookies
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  
  const { AUTH_CONFIG: AUTH_CFG } = await import('../config/auth.js');
  res.clearCookie(AUTH_CFG.REFRESH_COOKIE_NAME, AUTH_CFG.getRefreshCookieOptions());

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
  const revoked = await authService.revokeDeviceToken(req.user.userId, deviceId);
  
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
  const sessions = await authService.getUserTokenList(req.user.userId);
  
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

// Password Reset Routes
router.post('/request-password-reset', 
  authLimiter,
  validateBody(authSchemas.requestPasswordReset),
  passwordResetController.requestPasswordReset
);

router.post('/reset-password', 
  authLimiter,
  validateBody(authSchemas.resetPassword),
  passwordResetController.resetPassword
);

router.get('/validate-reset-token', 
  authLimiter,
  passwordResetController.validateResetToken
);

router.get('/reset-stats', 
  authenticateToken,
  passwordResetController.getResetStats
);

// Password Setup Routes (for new users)
router.post('/create-password-setup', 
  authLimiter,
  passwordSetupController.createPasswordSetup
);

router.post('/setup-password', 
  authLimiter,
  passwordSetupController.setupPassword
);

router.get('/validate-setup-token', 
  authLimiter,
  passwordSetupController.validateSetupToken
);

router.get('/setup-stats', 
  authenticateToken,
  passwordSetupController.getSetupStats
);

// Admin promotion endpoint (for development)
router.post('/promote-admin', authLimiter, asyncHandler(async (req, res) => {

  const pool = await getPool();
  
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (ADMIN_EMAILS.length === 0) {
    const error = new Error('No ADMIN_EMAILS configured');
    error.statusCode = 400;
    throw error;
  }
  
  // Update all users whose emails are in ADMIN_EMAILS to be admins
  const result = await pool.query(
    'UPDATE auth.users SET is_admin = TRUE WHERE email = ANY($1) RETURNING id, email, name',
    [ADMIN_EMAILS]
  );
  
  res.json({
    success: true,
    message: `Promoted ${result.rowCount} users to admin`,
    promoted: result.rows
  });
}));

export default router;
