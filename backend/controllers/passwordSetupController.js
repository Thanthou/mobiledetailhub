/**
 * Password Setup Controller
 * Handles password setup for new users with token validation
 */

import * as passwordSetupService from '../services/passwordSetupService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create password setup token for new user
 * POST /api/auth/create-password-setup
 */
const createPasswordSetup = asyncHandler(async (req, res) => {
  const { userId, email } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  if (!userId || !email) {
    return res.status(400).json({
      success: false,
      message: 'User ID and email are required'
    });
  }

  try {
    const result = await passwordSetupService.createPasswordSetupToken(
      userId, 
      email, 
      ipAddress, 
      userAgent
    );

    res.json({
      success: true,
      message: 'Password setup token created successfully',
      data: {
        setupUrl: result.setupUrl,
        expiresAt: result.expiresAt,
        email: result.email,
        name: result.name
      }
    });
  } catch (err) {
    if (err.message.includes('rate limit') || err.message.includes('Too many')) {
      res.status(429).json({
        success: false,
        message: 'Too many setup attempts. Please contact support.'
      });
    } else if (err.message.includes('already has a password')) {
      res.status(400).json({
        success: false,
        message: 'User already has a password set'
      });
    } else if (err.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the setup token. Please try again.'
      });
    }
  }
});

/**
 * Set password using setup token
 * POST /api/auth/setup-password
 */
const setupPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const ipAddress = req.ip;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required'
    });
  }

  // Basic password validation
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  try {
    await passwordSetupService.setPasswordWithToken(token, newPassword, ipAddress);

    res.json({
      success: true,
      message: 'Password has been set successfully. You can now log in with your new password.'
    });
  } catch (err) {
    if (err.message.includes('Invalid or expired')) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired setup token. Please request a new password setup.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while setting your password. Please try again.'
      });
    }
  }
});

/**
 * Validate setup token
 * GET /api/auth/validate-setup-token?token=...
 */
const validateSetupToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Setup token is required'
    });
  }

  try {
    const tokenInfo = await passwordSetupService.validateSetupToken(token);

    if (!tokenInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired setup token'
      });
    }

    res.json({
      success: true,
      valid: true,
      email: tokenInfo.email,
      name: tokenInfo.name,
      expiresAt: tokenInfo.expiresAt
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'An error occurred while validating the setup token'
    });
  }
});

/**
 * Get setup token statistics (admin only)
 * GET /api/auth/setup-stats
 */
const getSetupStats = asyncHandler(async (req, res) => {
  // This should be protected by admin middleware
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const stats = await passwordSetupService.getSetupTokenStats();

    res.json({
      success: true,
      data: stats
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching setup statistics'
    });
  }
});

export {
  createPasswordSetup,
  setupPassword,
  validateSetupToken,
  getSetupStats
};
