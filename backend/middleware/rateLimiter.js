const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiting configurations for different route types
 * 
 * IMPORTANT: Read-only endpoints (GET /api/mdh-config, GET /api/affiliates) 
 * are NOT rate-limited to prevent slow header/footer performance.
 * Only apply rate limiting to:
 * - Write operations (POST, PUT, DELETE)
 * - Heavy endpoints (uploads, admin operations)
 * - Authentication endpoints (security)
 * 
 * AUTH RATE LIMITING STRATEGY:
 * - General auth: 20 requests/15min (allows refresh tokens + multiple tabs)
 * - Sensitive auth: 3 requests/5min (login, password reset, registration)
 * - Refresh tokens: 50 requests/15min (allows app recovery)
 */

// Auth routes rate limiting - balanced approach for security vs usability
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to allow refresh tokens and multiple tabs
  skipSuccessfulRequests: true, // Don't count successful requests against limit
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Rate limit exceeded for auth endpoint', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many authentication attempts from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

// Stricter rate limiting for sensitive auth endpoints (login, password reset)
const sensitiveAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 requests per 5 minutes for sensitive operations
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Sensitive auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many sensitive authentication attempts from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

// Lenient rate limiting for refresh tokens - allows app recovery
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Higher limit for refresh tokens to allow app recovery
  skipSuccessfulRequests: true, // Don't count successful refreshes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Refresh token rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many refresh token requests from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

// Admin routes rate limiting - reasonable limits for admin dashboard usage
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for admin endpoints
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Rate limit exceeded for admin endpoint', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      userId: req.user?.userId || 'unknown',
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many admin requests from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

// Stricter rate limiting for critical admin operations (deletions, role changes)
const criticalAdminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // limit each IP to 2 requests per 5 minutes for critical operations
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Critical admin rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      userId: req.user?.userId || 'unknown',
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many critical admin operations from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

// General API rate limiting for other routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests against rate limit
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Rate limit exceeded for API endpoint', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many requests from this IP, please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

module.exports = {
  authLimiter,
  sensitiveAuthLimiter,
  refreshTokenLimiter,
  adminLimiter,
  criticalAdminLimiter,
  apiLimiter
};
