/**
 * Password Reset Controller
 * Handles password reset request and reset endpoints
 */

const passwordResetService = require('../services/passwordResetService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Request password reset
 * POST /api/auth/request-password-reset
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  try {
    await passwordResetService.requestPasswordReset(email, ipAddress, userAgent);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    // Don't reveal specific error details for security
    if (error.message.includes('rate limit') || error.message.includes('Too many')) {
      res.status(429).json({
        success: false,
        message: 'Too many reset attempts. Please try again later.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request. Please try again.'
      });
    }
  }
});

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const ipAddress = req.ip;

  try {
    await passwordResetService.resetPassword(token, newPassword, ipAddress);

    res.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    if (error.message.includes('Invalid or expired')) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new password reset.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while resetting your password. Please try again.'
      });
    }
  }
});

/**
 * Validate reset token
 * GET /api/auth/validate-reset-token?token=...
 */
const validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Reset token is required'
    });
  }

  try {
    const tokenInfo = await passwordResetService.validateResetToken(token);

    if (!tokenInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      valid: true,
      email: tokenInfo.email,
      name: tokenInfo.name,
      expiresAt: tokenInfo.expiresAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while validating the reset token'
    });
  }
});

/**
 * Get password reset statistics (admin only)
 * GET /api/auth/reset-stats
 */
const getResetStats = asyncHandler(async (req, res) => {
  // This should be protected by admin middleware
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const stats = await passwordResetService.getResetTokenStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching reset statistics'
    });
  }
});

module.exports = {
  requestPasswordReset,
  resetPassword,
  validateResetToken,
  getResetStats
};
