import * as authService from '../services/authService.js'
import { AUTH_CONFIG } from '../config/auth.js'
import { createModuleLogger } from '../config/logger.js'

const logger = createModuleLogger('authController')

/**
 * Auth Controller
 * Handles HTTP requests and responses for authentication operations
 */

/**
 * Check if email exists
 */
async function checkEmail(req, res) {
  const { email } = req.query;
  
  const exists = await authService.checkEmailExists(email);
  
  res.json({
    success: true,
    exists
  });
}

/**
 * Register new user
 */
async function register(req, res) {
  const userData = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  const result = await authService.registerUser(userData, userAgent, ipAddress);
  
  // Set HttpOnly cookies for enhanced security
  res.cookie('access_token', result.tokens.accessToken, AUTH_CONFIG.getAccessCookieOptions());
  res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, result.tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());
  
  // Return to prevent further execution
  return res.status(201).json({
    success: true,
    user: result.user,
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiresIn: result.tokens.expiresIn,
    refreshExpiresIn: result.tokens.refreshExpiresIn
  });
}

/**
 * Login user
 */
async function login(req, res) {
  logger.info({
    event: 'login_attempt',
    email: req.body.email,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  }, 'Login attempt initiated');
  
  const credentials = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  try {
    console.log('🟢 STEP 6: Calling authService.loginUser...');
    const result = await authService.loginUser(credentials, userAgent, ipAddress);
    console.log('🟢 STEP 7: loginUser returned - Headers sent?', res.headersSent);
    
    logger.info({
      event: 'login_success',
      email: credentials.email,
      userId: result.user.id
    }, 'Login successful');
    
    // Check if headers were already sent (race condition with 404 handler)
    if (res.headersSent) {
      logger.error('Headers already sent before login response');
      return;
    }
    
    console.log('🟢 STEP 8: Setting cookies...');
    // Set HttpOnly cookies for enhanced security
    res.cookie('access_token', result.tokens.accessToken, AUTH_CONFIG.getAccessCookieOptions());
    res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, result.tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());
    
    console.log('🟢 STEP 9: Sending JSON response...');
    // Return to prevent further execution
    return res.json({
      success: true,
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      refreshExpiresIn: result.tokens.refreshExpiresIn
    });
  } catch (error) {
    logger.error({
      event: 'login_error',
      email: credentials.email,
      error: error.message,
      stack: error.stack
    }, 'Login failed');
    throw error;
  }
}

/**
 * Refresh access token
 * SECURITY: Rotates both access and refresh tokens
 */
async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  const result = await authService.refreshAccessToken(token, userAgent, ipAddress);
  
  // Set new access token cookie
  res.cookie('access_token', result.tokens.accessToken, AUTH_CONFIG.getAccessCookieOptions());
  
  // Set new refresh token cookie (rotated for security)
  res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, result.tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());
  
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    user: result.user,
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiresIn: result.tokens.expiresIn,
    refreshExpiresIn: result.tokens.refreshExpiresIn
  });
}

/**
 * Logout user
 */
async function logout(req, res) {
  const { refreshToken: token } = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  await authService.logoutUser(token, userAgent, ipAddress);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
}

/**
 * Logout all devices
 */
async function logoutAll(req, res) {
  const userId = req.user.userId;
  
  await authService.logoutAllDevices(userId);
  
  res.json({
    success: true,
    message: 'All devices logged out successfully'
  });
}

/**
 * Get user tokens
 */
async function getUserTokens(req, res) {
  const userId = req.user.userId;
  
  const tokens = await authService.getUserTokenList(userId);
  
  res.json({
    success: true,
    data: tokens
  });
}

/**
 * Revoke device token
 */
async function revokeDevice(req, res) {
  const userId = req.user.userId;
  const { deviceId } = req.params;
  
  await authService.revokeDeviceTokenById(userId, deviceId);
  
  res.json({
    success: true,
    message: 'Device logged out successfully'
  });
}

/**
 * Get user profile
 */
async function getProfile(req, res) {
  const userId = req.user.userId;
  
  const user = await authService.getUserProfile(userId);
  
  res.json({
    success: true,
    data: user
  });
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  const userId = req.user.userId;
  const updateData = req.body;
  
  const user = await authService.updateUserProfile(userId, updateData);
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}

/**
 * Change password
 */
async function changePassword(req, res) {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  
  await authService.changePassword(userId, currentPassword, newPassword);
  
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}

export {
  checkEmail,
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getUserTokens,
  revokeDevice,
  getProfile,
  updateProfile,
  changePassword
};
