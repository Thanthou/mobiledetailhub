/**
 * Token Manager
 * Handles JWT access tokens and refresh tokens with security best practices
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('./logger');
const { env } = require('../config/env');
const { pool } = require('../database/pool');

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
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  // Generate unique JWT ID for blacklist accuracy
  const jwtid = crypto.randomUUID();
  
  // Use jwtid option instead of adding jti to payload to avoid conflict
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.expiresIn,
    algorithm: TOKEN_CONFIG.ACCESS_TOKEN.algorithm,
    issuer: 'mdh-backend',
    audience: 'mdh-users',
    jwtid: jwtid,
    header: { 
      kid: env.JWT_KID || 'primary' // Key ID for future key rotation
    }
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  // Use JWT_SECRET if JWT_REFRESH_SECRET is not available
  const secret = env.JWT_REFRESH_SECRET || env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  // Generate unique JWT ID for refresh token tracking
  const jwtid = crypto.randomUUID();
  
  // Use jwtid option instead of adding jti to payload to avoid conflict
  return jwt.sign(payload, secret, {
    expiresIn: TOKEN_CONFIG.REFRESH_TOKEN.expiresIn,
    algorithm: TOKEN_CONFIG.REFRESH_TOKEN.algorithm,
    issuer: 'mdh-backend',
    audience: 'mdh-users',
    jwtid: jwtid,
    header: { 
      kid: env.JWT_KID || 'primary' // Key ID for future key rotation
    }
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
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not configured');
  }

  try {
    return jwt.verify(token, env.JWT_SECRET, {
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
  const secret = env.JWT_REFRESH_SECRET || env.JWT_SECRET;
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
  if (!expiration) {return true;}
  return Date.now() >= expiration.getTime();
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration
 */
const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) {return 0;}
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
 * Blacklist a token (for logout) - Database persistent version
 * @param {string} token - Token to blacklist
 * @param {Object} options - Additional options
 * @param {string} options.reason - Reason for blacklisting (default: 'logout')
 * @param {string} options.ipAddress - IP address of the request
 * @param {string} options.userAgent - User agent of the request
 */
const blacklistToken = async (token, options = {}) => {
  if (!pool) {
    logger.warn('Database connection not available for token blacklisting, falling back to memory');
    return blacklistTokenInMemory(token);
  }

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      logger.warn('Invalid token provided for blacklisting');
      return false;
    }

    const {
      reason = 'logout',
      ipAddress = null,
      userAgent = null
    } = options;

    // Calculate expiration time
    const expiresAt = new Date(decoded.exp * 1000);
    
    // Create token hash for exact matching
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Insert into database blacklist
    const result = await pool.query(`
      INSERT INTO auth.token_blacklist 
      (token_jti, token_hash, user_id, expires_at, reason, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (token_jti) DO NOTHING
      RETURNING id
    `, [
      decoded.jti,
      tokenHash,
      decoded.userId,
      expiresAt,
      reason,
      ipAddress,
      userAgent
    ]);

    if (result.rows.length > 0) {
      logger.info('Token blacklisted successfully', { 
        jti: decoded.jti, 
        userId: decoded.userId,
        reason 
      });
      return true;
    } else {
      logger.warn('Token already blacklisted', { jti: decoded.jti });
      return true; // Already blacklisted, consider it successful
    }
  } catch (error) {
    logger.error('Error blacklisting token in database', { error: error.message });
    // Fallback to memory blacklist
    return blacklistTokenInMemory(token);
  }
};

/**
 * Fallback in-memory blacklist (for when database is unavailable)
 * @param {string} token - Token to blacklist
 */
const blacklistTokenInMemory = (token) => {
  if (!global.tokenBlacklist) {
    global.tokenBlacklist = new Map();
  }
  
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    const ttl = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
    
    // Store both the full token and its JTI for more efficient lookups
    global.tokenBlacklist.set(token, Date.now() + (ttl * 1000));
    
    // Also store by JTI for more efficient revocation by JTI
    if (decoded.jti) {
      if (!global.tokenBlacklistByJTI) {
        global.tokenBlacklistByJTI = new Map();
      }
      global.tokenBlacklistByJTI.set(decoded.jti, Date.now() + (ttl * 1000));
    }
    
    // Clean up expired entries
    setTimeout(() => {
      global.tokenBlacklist.delete(token);
      if (decoded.jti && global.tokenBlacklistByJTI) {
        global.tokenBlacklistByJTI.delete(decoded.jti);
      }
    }, ttl * 1000);
  }
};

/**
 * Check if token is blacklisted - Database persistent version
 * @param {string} token - Token to check
 * @returns {boolean} True if token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  if (!pool) {
    logger.warn('Database connection not available for token blacklist check, falling back to memory');
    return isTokenBlacklistedInMemory(token);
  }

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.jti) {
      return false;
    }

    // Check database blacklist
    const result = await pool.query(`
      SELECT 1 FROM auth.token_blacklist 
      WHERE token_jti = $1 AND expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `, [decoded.jti]);

    if (result.rows.length > 0) {
      logger.debug('Token found in blacklist', { jti: decoded.jti });
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error checking token blacklist in database', { error: error.message });
    // Fallback to memory check
    return isTokenBlacklistedInMemory(token);
  }
};

/**
 * Fallback in-memory blacklist check (for when database is unavailable)
 * @param {string} token - Token to check
 * @returns {boolean} True if token is blacklisted
 */
const isTokenBlacklistedInMemory = (token) => {
  if (!global.tokenBlacklist) {return false;}
  
  // Check by full token first
  if (global.tokenBlacklist.has(token)) {return true;}
  
  // Also check by JTI for more efficient lookups
  const decoded = decodeToken(token);
  if (decoded && decoded.jti && global.tokenBlacklistByJTI) {
    return global.tokenBlacklistByJTI.has(decoded.jti);
  }
  
  return false;
};

/**
 * Blacklist token by JTI (JWT ID) for efficient revocation
 * @param {string} jti - JWT ID to blacklist
 * @param {number} expiresIn - Time in seconds until token expires
 */
const blacklistTokenByJTI = (jti, expiresIn = 900) => {
  if (!global.tokenBlacklistByJTI) {
    global.tokenBlacklistByJTI = new Map();
  }
  
  const ttl = Math.max(0, expiresIn);
  global.tokenBlacklistByJTI.set(jti, Date.now() + (ttl * 1000));
  
  // Clean up expired entry
  setTimeout(() => {
    if (global.tokenBlacklistByJTI) {
      global.tokenBlacklistByJTI.delete(jti);
    }
  }, ttl * 1000);
};

/**
 * Clear expired blacklist entries
 */
const cleanupBlacklist = () => {
  const now = Date.now();
  
  // Clean up main token blacklist
  if (global.tokenBlacklist) {
    for (const [token, expiresAt] of global.tokenBlacklist.entries()) {
      if (now >= expiresAt) {
        global.tokenBlacklist.delete(token);
      }
    }
  }
  
  // Clean up JTI-based blacklist
  if (global.tokenBlacklistByJTI) {
    for (const [jti, expiresAt] of global.tokenBlacklistByJTI.entries()) {
      if (now >= expiresAt) {
        global.tokenBlacklistByJTI.delete(jti);
      }
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
  blacklistTokenByJTI,
  isTokenBlacklisted,
  cleanupBlacklist
};
