/**
 * Input Validation Middleware
 * Provides middleware functions for validating request data
 */

import { ValidationError, sanitizers } from '../utils/validators.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('validation');

/**
 * Generic validation middleware
 * @param {Function} validationFn - Function that performs validation and returns errors array
 * @returns {Function} Express middleware function
 */
const validate = (validationFn) => {
  return (req, res, next) => {
    try {
      const errors = validationFn(req);
      if (errors && errors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }
      next();
    } catch (error) {
      logger.error('Validation error:', { error: error.message });
      if (error instanceof ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: [{
            field: error.field,
            message: error.message,
            value: error.value
          }]
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request body
 * @param {Object} schema - Validation schema object
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return validate((req) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      // Handle nested object validation (e.g., 'base_location.city')
      let value;
      if (field.includes('.')) {
        const keys = field.split('.');
        value = req.body;
        for (const key of keys) {
          value = value && value[key];
        }
      } else {
        value = req.body[field];
      }
      
      try {
        // Apply each validation rule
        for (const rule of rules) {
          if (typeof rule === 'function') {
            rule(value, field);
          } else if (typeof rule === 'object') {
            const { validator, ...params } = rule;
            if (typeof validator === 'function') {
              validator(value, field, ...Object.values(params));
            }
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push({
            field: error.field,
            message: error.message,
            value: error.value
          });
        } else {
          throw error;
        }
      }
    }
    
    return errors;
  });
};

/**
 * Validate request parameters
 * @param {Object} schema - Validation schema object
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return validate((req) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.params[field];
      
      try {
        // Apply each validation rule
        for (const rule of rules) {
          if (typeof rule === 'function') {
            rule(value, field);
          } else if (typeof rule === 'object') {
            const { validator, ...params } = rule;
            if (typeof validator === 'function') {
              validator(value, field, ...Object.values(params));
            }
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push({
            field: error.field,
            message: error.message,
            value: error.value
          });
        } else {
          throw error;
        }
      }
    }
    
    return errors;
  });
};

/**
 * Validate request query parameters
 * @param {Object} schema - Validation schema object
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return validate((req) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.query[field];
      
      try {
        // Apply each validation rule
        for (const rule of rules) {
          if (typeof rule === 'function') {
            rule(value, field);
          } else if (typeof rule === 'object') {
            const { validator, ...params } = rule;
            if (typeof validator === 'function') {
              validator(value, field, ...Object.values(params));
            }
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push({
            field: error.field,
            message: error.message,
            value: error.value
          });
        } else {
          throw error;
        }
      }
    }
    
    return errors;
  });
};

/**
 * Sanitize request data
 * @param {Object} sanitizers - Object mapping field names to sanitization functions
 * @returns {Function} Express middleware function
 */
const sanitize = (sanitizationSchema) => {
  return (req, res, next) => {
    try {
      // Sanitize body
      if (req.body && sanitizationSchema.body) {
        for (const [field, sanitizerName] of Object.entries(sanitizationSchema.body)) {
          if (req.body[field] !== undefined && sanitizers[sanitizerName]) {
            req.body[field] = sanitizers[sanitizerName](req.body[field]);
          }
        }
      }
      
      // Sanitize params
      if (req.params && sanitizationSchema.params) {
        for (const [field, sanitizerName] of Object.entries(sanitizationSchema.params)) {
          if (req.params[field] !== undefined && sanitizers[sanitizerName]) {
            req.params[field] = sanitizers[sanitizerName](req.params[field]);
          }
        }
      }
      
      // Sanitize query
      if (req.query && sanitizationSchema.query) {
        for (const [field, sanitizerName] of Object.entries(sanitizationSchema.query)) {
          if (req.query[field] !== undefined && sanitizers[sanitizerName]) {
            req.query[field] = sanitizers[sanitizerName](req.query[field]);
          }
        }
      }
      
      next();
    } catch (error) {
      logger.error('Sanitization error:', { error: error.message });
      next(error);
    }
  };
};

/**
 * Rate limiting middleware (DEPRECATED - Use express-rate-limit instead)
 * @param {Object} options - Rate limiting options
 * @returns {Function} Express middleware function
 * @deprecated This function is deprecated. Use the dedicated rate limiting middleware from rateLimiter.js instead.
 */
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    statusCode = 429
  } = options;
  
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const record = requests.get(ip);
      
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
      } else {
        record.count++;
      }
      
      if (record.count > max) {
        return res.status(statusCode).json({ error: message });
      }
    }
    
    next();
  };
};

/**
 * Input size limiting middleware
 * @param {Object} options - Size limiting options
 * @returns {Function} Express middleware function
 */
const limitInputSize = (options = {}) => {
  const {
    maxBodySize = '1mb',
    maxParamLength = 100,
    maxQueryLength = 100
  } = options;
  
  return (req, res, next) => {
    try {
      // Check body size
      if (req.body && typeof req.body === 'string' && req.body.length > parseSize(maxBodySize)) {
        return res.status(413).json({ error: 'Request body too large' });
      }
      
      // Check param lengths
      for (const [key, value] of Object.entries(req.params || {})) {
        if (typeof value === 'string' && value.length > maxParamLength) {
          return res.status(400).json({ error: `Parameter ${key} too long` });
        }
      }
      
      // Check query lengths
      for (const [key, value] of Object.entries(req.query || {})) {
        if (typeof value === 'string' && value.length > maxQueryLength) {
          return res.status(400).json({ error: `Query parameter ${key} too long` });
        }
      }
      
      next();
    } catch (error) {
      logger.error('Input size validation error:', { error: error.message });
      next(error);
    }
  };
};

/**
 * Parse size string to bytes
 * @param {string} size - Size string (e.g., '1mb', '100kb')
 * @returns {number} Size in bytes
 */
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) {
    return parseInt(size) || 1024 * 1024; // Default to 1MB
  }
  
  const [, value, unit] = match;
  return parseFloat(value) * units[unit];
}

/**
 * Review-specific validation middleware
 */
import { reviewSchemas } from '../utils/validationSchemas.js';

const validateReviewSubmission = validateBody(reviewSchemas.submission);
const validateReviewUpdate = validateBody(reviewSchemas.update);
const validateReviewVote = validateBody(reviewSchemas.vote);

export {
  validate,
  validateBody,
  validateParams,
  validateQuery,
  sanitize,
  rateLimit,
  limitInputSize,
  validateReviewSubmission,
  validateReviewUpdate,
  validateReviewVote
};
