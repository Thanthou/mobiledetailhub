/**
 * Token Manager
 * Handles JWT access tokens and refresh tokens with security best practices
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('./logger');

/**
 * Token configuration
 */
const TOKEN_CONFIG = {
  // Access token: short-lived for security
  ACCESS_TOKEN: {
    expiresIn: '15m', // 15 minutes
    algorithm: 'HS256'
  },
  // Refresh token: longer-lived but revocable
  REFRESH_TOKEN: {
    expiresIn: '7d', // 7 days
    algorithm: 'HS256'
  }
};

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.expiresIn,
    algorithm: TOKEN_CONFIG.ACCESS_TOKEN.algorithm,
    issuer: 'mdh-backend',
    audience: 'mdh-users'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  // Use JWT_SECRET if JWT_REFRESH_SECRET is not available
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: TOKEN_CONFIG.REFRESH_TOKEN.expiresIn,
    algorithm: TOKEN_CONFIG.REFRESH_TOKEN.algorithm,
    issuer: 'mdh-backend',
    audience: 'mdh-users'
  });
};

/**
 * Generate secure random refresh token (alternative approach)
 * @param {number} userId - User ID
 * @returns {string} Secure random refresh token
 */
const generateSecureRefreshToken = (userId) => {
  const randomBytes = crypto.randomBytes(32);
  const timestamp = Date.now();
  const token = `${userId}.${timestamp}.${randomBytes.toString('hex')}`;
  
  // Hash the token for storage
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return {
    token,
    hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [TOKEN_CONFIG.ACCESS_TOKEN.algorithm],
      issuer: 'mdh-backend',
      audience: 'mdh-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  // Use JWT_SECRET if JWT_REFRESH_SECRET is not available
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  try {
    return jwt.verify(token, secret, {
      algorithms: [TOKEN_CONFIG.REFRESH_TOKEN.algorithm],
      issuer: 'mdh-backend',
      audience: 'mdh-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for logging/debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload (unverified)
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token:', { error: error.message });
    return null;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Token expiration time
 */
const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return Date.now() >= expiration.getTime();
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration
 */
const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  return Math.max(0, expiration.getTime() - Date.now());
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} payload - Token payload
 * @returns {Object} Object containing access and refresh tokens
 */
const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.expiresIn,
    refreshExpiresIn: TOKEN_CONFIG.REFRESH_TOKEN.expiresIn
  };
};

/**
 * Blacklist a token (for logout)
 * @param {string} token - Token to blacklist
 * @param {number} expiresIn - Time in seconds until token expires
 */
const blacklistToken = (token, expiresIn = 900) => { // Default 15 minutes
  // In a production environment, you would store this in Redis or database
  // For now, we'll use a simple in-memory store (not recommended for production)
  if (!global.tokenBlacklist) {
    global.tokenBlacklist = new Map();
  }
  
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    const ttl = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
    global.tokenBlacklist.set(token, Date.now() + (ttl * 1000));
    
    // Clean up expired entries
    setTimeout(() => {
      global.tokenBlacklist.delete(token);
    }, ttl * 1000);
  }
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {boolean} True if token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  if (!global.tokenBlacklist) return false;
  return global.tokenBlacklist.has(token);
};

/**
 * Clear expired blacklist entries
 */
const cleanupBlacklist = () => {
  if (!global.tokenBlacklist) return;
  
  const now = Date.now();
  for (const [token, expiresAt] of global.tokenBlacklist.entries()) {
    if (now >= expiresAt) {
      global.tokenBlacklist.delete(token);
    }
  }
};

// Clean up blacklist every hour
setInterval(cleanupBlacklist, 60 * 60 * 1000);

module.exports = {
  TOKEN_CONFIG,
  generateAccessToken,
  generateRefreshToken,
  generateSecureRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  generateTokenPair,
  blacklistToken,
  isTokenBlacklisted,
  cleanupBlacklist
};
