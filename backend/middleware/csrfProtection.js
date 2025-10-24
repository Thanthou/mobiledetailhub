/**
 * CSRF Protection Middleware
 * Validates origin header for state-changing requests to prevent CSRF attacks
 */

import { createModuleLogger } from '../config/logger.js';
import { env } from '../config/env.async.js';

const logger = createModuleLogger('csrfProtection');

/**
 * List of allowed origins for CSRF-protected endpoints
 * In production, only allow same-origin requests or trusted domains
 */
const getAllowedOrigins = () => {
  const isProduction = env.NODE_ENV === 'production';
  
  if (isProduction) {
    return [
      'https://thatsmartsite.com',
      'https://www.thatsmartsite.com',
      // Allow subdomains in production
      /^https:\/\/[a-zA-Z0-9-]+\.thatsmartsite\.com$/
    ];
  }
  
  // Development origins
  return [
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:5180',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177',
    'http://127.0.0.1:5178',
    'http://127.0.0.1:5179',
    'http://127.0.0.1:5180',
    // Dev hub proxy
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    // Allow network IPs for mobile testing
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(5175|5176|5177|8080)$/
  ];
};

/**
 * Check if origin is allowed
 */
const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) {
    // No origin header - could be same-origin request or server-to-server
    // In production, we might want to be stricter
    return env.NODE_ENV !== 'production';
  }
  
  // Extract just the origin part from referer (which may include path)
  let originToCheck = origin;
  try {
    const url = new URL(origin);
    originToCheck = `${url.protocol}//${url.host}`;
  } catch (e) {
    // If URL parsing fails, use the origin as-is
    originToCheck = origin;
  }
  
  for (const allowed of allowedOrigins) {
    if (allowed instanceof RegExp) {
      if (allowed.test(originToCheck)) {
        return true;
      }
    } else if (typeof allowed === 'string' && typeof originToCheck === 'string') {
      if (allowed === originToCheck || originToCheck.startsWith(allowed)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * CSRF protection middleware for sensitive endpoints
 * Validates the Origin or Referer header to prevent cross-site requests
 */
export const csrfProtection = (req, res, next) => {
  const origin = req.get('origin') || req.get('referer');
  const allowedOrigins = getAllowedOrigins();
  
  if (!isOriginAllowed(origin, allowedOrigins)) {
    logger.warn({
      event: 'csrf_blocked',
      origin,
      path: req.path,
      method: req.method,
      ip: req.ip,
      correlationId: req.correlationId
    }, 'CSRF attempt blocked: Invalid origin');
    
    return res.status(403).json({
      success: false,
      error: 'Invalid origin for this request',
      code: 'CSRF_PROTECTION'
    });
  }
  
  logger.debug({
    event: 'csrf_validated',
    origin,
    path: req.path,
    correlationId: req.correlationId
  }, 'CSRF check passed');
  
  next();
};

/**
 * Strict CSRF protection for refresh token endpoints
 * In production, requires exact origin match (no wildcards)
 */
export const strictCsrfProtection = (req, res, next) => {
  const origin = req.get('origin') || req.get('referer');
  
  if (!origin) {
    logger.warn({
      event: 'csrf_blocked_no_origin',
      path: req.path,
      method: req.method,
      ip: req.ip,
      correlationId: req.correlationId
    }, 'CSRF blocked: No origin header');
    
    return res.status(403).json({
      success: false,
      error: 'Origin header is required for this request',
      code: 'CSRF_PROTECTION'
    });
  }
  
  const allowedOrigins = getAllowedOrigins();
  
  if (!isOriginAllowed(origin, allowedOrigins)) {
    logger.warn({
      event: 'csrf_blocked',
      origin,
      path: req.path,
      method: req.method,
      ip: req.ip,
      correlationId: req.correlationId
    }, 'CSRF attempt blocked: Invalid origin');
    
    return res.status(403).json({
      success: false,
      error: 'Invalid origin for this request',
      code: 'CSRF_PROTECTION'
    });
  }
  
  next();
};

