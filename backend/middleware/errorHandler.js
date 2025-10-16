/**
 * Error Handling Middleware
 * Provides centralized error handling for the application
 */

import logger from '../utils/logger.js';
import { ValidationError } from '../utils/validators.js';
import { errorMonitor } from '../utils/errorMonitor.js';

/**
 * Error handler middleware
 * Must be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler to avoid double-send
  if (res.headersSent) {
    return next(err);
  }
  // Log the error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });

  // Capture error in our monitoring system
  errorMonitor.captureRequestError(req, res, err);

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: [{
        field: err.field,
        message: err.message,
        value: err.value
      }]
    });
  }

  // Handle Zod validation errors
  if (err.code === 'VALIDATION_ERROR' || err.code === 'SANITIZATION_ERROR') {
    return res.status(400).json({
      error: err.message,
      code: err.code,
      details: err.details || []
    });
  }

  // Handle database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Database service unavailable',
      message: 'Please try again later'
    });
  }

  // Handle database constraint violations
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced record does not exist'
    });
  }

  if (err.code === '23514') { // Check violation
    return res.status(400).json({
      error: 'Invalid data',
      message: 'Data does not meet requirements'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Authentication token has expired'
    });
  }

  // Handle rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }

  // Handle request size errors
  if (err.status === 413) {
    return res.status(413).json({
      error: 'Request too large',
      message: 'Request body exceeds size limit'
    });
  }

  // Handle syntax errors in JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }

  // Handle multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'Uploaded file exceeds size limit'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      error: 'Too many files',
      message: 'Too many files uploaded'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected file field',
      message: 'Unexpected file field in upload'
    });
  }

  // Handle custom upload validation errors
  if (err.statusCode === 415) {
    return res.status(415).json({
      error: 'Unsupported media type',
      message: err.message || 'File type not supported'
    });
  }

  if (err.statusCode === 413) {
    return res.status(413).json({
      error: 'Request entity too large',
      message: err.message || 'Upload exceeds size limits'
    });
  }

  // Handle generic database errors
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Database error',
      message: 'Invalid data provided'
    });
  }

  // Handle generic server errors
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'Server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
};

/**
 * 404 handler for unmatched routes
 */
const notFoundHandler = (req, res) => {
  logger.warn('Route not found:', {
    url: req.url,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress
  });

  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
