import rateLimit from 'express-rate-limit';
import { logger } from '../config/logger.js';
// ⚠️  DEVELOPMENT MODE: Rate limiting is DISABLED
// All limits set to 10,000 requests per window to prevent development issues
// Change max values back to production limits when deploying

/**
 * Rate limiting configurations for different route types
 * 
 * ⚠️  DEVELOPMENT MODE: Rate limiting is DISABLED
 * All rate limits set to 10,000 requests per window to prevent development issues.
 * 
 * IMPORTANT: Read-only endpoints (GET /api/tenants, GET /api/service_areas) 
 * are NOT rate-limited to prevent slow header/footer performance.
 * Only apply rate limiting to:
 * - Write operations (POST, PUT, DELETE)
 * - Heavy endpoints (uploads, admin operations)
 * - Authentication endpoints (security)
 * 
 * AUTH RATE LIMITING STRATEGY (DISABLED):
 * - General auth: 10,000 requests/15min (effectively disabled)
 * - Sensitive auth: 10,000 requests/5min (effectively disabled)
 * - Refresh tokens: 10,000 requests/15min (effectively disabled)
 * 
 * TODO: Re-enable rate limiting for production by changing max values back to:
 * - General auth: 20 requests/15min
 * - Sensitive auth: 3 requests/5min  
 * - Refresh tokens: 50 requests/15min
 * - Admin: 50 requests/15min
 * - Critical admin: 2 requests/5min
 * - API: 100 requests/15min
 */

// Auth routes rate limiting - DISABLED for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// Stricter rate limiting for sensitive auth endpoints - DISABLED for development
const sensitiveAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// Lenient rate limiting for refresh tokens - DISABLED for development
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// Admin routes rate limiting - DISABLED for development
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// Stricter rate limiting for critical admin operations - DISABLED for development
const criticalAdminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// General API rate limiting for other routes - DISABLED for development
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Extremely high limit - effectively disabled
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

// Analytics ingest endpoint rate limiting
// More permissive than auth but still prevents abuse
const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 10000, // 200 events per 15min in prod, disabled in dev
  skipSuccessfulRequests: false, // Count all requests to prevent spam
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(req.rateLimit.resetTime / 1000);
    
    logger.warn('Analytics rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      host: req.get('host'),
      tenantSlug: req.tenantSlug,
      retryAfter: retryAfterSeconds
    });
    
    res.set('Retry-After', retryAfterSeconds);
    res.status(429).json({
      code: 'RATE_LIMITED',
      error: 'Too many analytics requests. Please try again later.',
      retryAfterSeconds: retryAfterSeconds,
      remainingAttempts: 0,
      resetTime: req.rateLimit.resetTime
    });
  }
});

export {
  authLimiter,
  sensitiveAuthLimiter,
  refreshTokenLimiter,
  adminLimiter,
  criticalAdminLimiter,
  apiLimiter,
  analyticsLimiter
};
