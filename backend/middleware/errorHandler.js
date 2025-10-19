/**
 * Error Handling Middleware
 * Provides centralized error handling for the application
 */

import { logger } from '../config/logger.js';
import { ValidationError } from '../utils/validators.js';
import { errorMonitor } from '../utils/errorMonitor.js';
import { sendError, sendValidationError, sendNotFound } from '../utils/responseFormatter.js';

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
    return sendValidationError(res, 'Validation failed', [{
      field: err.field,
      message: err.message,
      value: err.value
    }]);
  }

  // Handle Zod validation errors
  if (err.code === 'VALIDATION_ERROR' || err.code === 'SANITIZATION_ERROR') {
    return sendValidationError(res, err.message, err.details || []);
  }

  // Handle database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return sendError(res, 'Database service unavailable', err.code, 503);
  }

  // Handle database constraint violations
  if (err.code === '23505') { // Unique violation
    return sendError(res, 'A record with this information already exists', 'Duplicate entry', 409);
  }

  if (err.code === '23503') { // Foreign key violation
    return sendError(res, 'Referenced record does not exist', 'Invalid reference', 400);
  }

  if (err.code === '23514') { // Check violation
    return sendError(res, 'Data does not meet requirements', 'Invalid data', 400);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Authentication token is invalid', 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired', 'Token expired', 401);
  }

  // Handle rate limiting errors
  if (err.status === 429) {
    return sendError(res, 'Please try again later', 'Too many requests', 429);
  }

  // Handle request size errors
  if (err.status === 413) {
    return sendError(res, 'Request body exceeds size limit', 'Request too large', 413);
  }

  // Handle syntax errors in JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Request body contains invalid JSON', 'Invalid JSON', 400);
  }

  // Handle multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'Uploaded file exceeds size limit', 'File too large', 413);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return sendError(res, 'Too many files uploaded', 'Too many files', 413);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, 'Unexpected file field in upload', 'Unexpected file field', 400);
  }

  // Handle custom upload validation errors
  if (err.statusCode === 415) {
    return sendError(res, err.message || 'File type not supported', 'Unsupported media type', 415);
  }

  if (err.statusCode === 413) {
    return sendError(res, err.message || 'Upload exceeds size limits', 'Request entity too large', 413);
  }

  // Handle generic database errors
  if (err.code && err.code.startsWith('23')) {
    return sendError(res, 'Invalid data provided', 'Database error', 400);
  }

  // Handle generic server errors
  if (err.status) {
    return sendError(res, err.message || 'Server error', null, err.status);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : (err.message || 'Internal server error');
  
  return sendError(res, message, 'Server error', statusCode);
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

  return sendNotFound(res, `Route ${req.method} ${req.url} not found`);
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
