/**
 * Unified API Response Formatter
 * Provides consistent response structure across all API endpoints
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {string|null} error - Technical error details (optional)
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const sendError = (res, message, error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error
  });
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {string} message - Validation error message
 * @param {Object} validationErrors - Validation error details (optional)
 * @param {number} statusCode - HTTP status code (default: 400)
 */
export const sendValidationError = (res, message, validationErrors = null, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    validation: validationErrors
  });
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message (optional)
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  // Don't send if headers already sent
  if (res.headersSent) {
    return;
  }
  
  return res.status(404).json({
    status: 'error',
    message,
    error: 'NOT_FOUND'
  });
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message (optional)
 */
export const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    status: 'error',
    message,
    error: 'UNAUTHORIZED'
  });
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message (optional)
 */
export const sendForbidden = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    status: 'error',
    message,
    error: 'FORBIDDEN'
  });
};
