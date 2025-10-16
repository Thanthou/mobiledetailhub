const authService = require('../services/authService');

/**
 * Auth Controller
 * Handles HTTP requests and responses for authentication operations
 */

/**
 * Check if email exists
 */
async function checkEmail(req, res) {
  const { email } = req.query;
  
  try {
    const exists = await authService.checkEmailExists(email);
    
    res.json({
      success: true,
      exists
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Register new user
 */
async function register(req, res) {
  const userData = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  try {
    const result = await authService.registerUser(userData, userAgent, ipAddress);
    
    // Set HttpOnly cookies for enhanced security
    res.cookie('access_token', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000 // 15 minutes (matches access token expiry)
    });
    
    const { AUTH_CONFIG } = require('../config/auth');
    res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, result.tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());
    
    res.status(201).json({
      success: true,
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      refreshExpiresIn: result.tokens.refreshExpiresIn
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Login user
 */
async function login(req, res) {
  const credentials = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  try {
    const result = await authService.loginUser(credentials, userAgent, ipAddress);
    
    // Set HttpOnly cookies for enhanced security
    res.cookie('access_token', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000 // 15 minutes (matches access token expiry)
    });
    
    const { AUTH_CONFIG } = require('../config/auth');
    res.cookie(AUTH_CONFIG.REFRESH_COOKIE_NAME, result.tokens.refreshToken, AUTH_CONFIG.getRefreshCookieOptions());
    
    res.json({
      success: true,
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      refreshExpiresIn: result.tokens.refreshExpiresIn
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Refresh access token
 */
async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  try {
    const result = await authService.refreshAccessToken(refreshToken, userAgent, ipAddress);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Logout user
 */
async function logout(req, res) {
  const { refreshToken } = req.body;
  const userAgent = req.get('User-Agent');
  const ipAddress = req.ip;
  
  try {
    await authService.logoutUser(refreshToken, userAgent, ipAddress);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Logout all devices
 */
async function logoutAll(req, res) {
  const userId = req.user.userId;
  
  try {
    await authService.logoutAllDevices(userId);
    
    res.json({
      success: true,
      message: 'All devices logged out successfully'
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Get user tokens
 */
async function getUserTokens(req, res) {
  const userId = req.user.userId;
  
  try {
    const tokens = await authService.getUserTokenList(userId);
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Revoke device token
 */
async function revokeDevice(req, res) {
  const userId = req.user.userId;
  const { deviceId } = req.params;
  
  try {
    await authService.revokeDeviceTokenById(userId, deviceId);
    
    res.json({
      success: true,
      message: 'Device logged out successfully'
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Get user profile
 */
async function getProfile(req, res) {
  const userId = req.user.userId;
  
  try {
    const user = await authService.getUserProfile(userId);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  const userId = req.user.userId;
  const updateData = req.body;
  
  try {
    const user = await authService.updateUserProfile(userId, updateData);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Change password
 */
async function changePassword(req, res) {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  
  try {
    await authService.changePassword(userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

module.exports = {
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
