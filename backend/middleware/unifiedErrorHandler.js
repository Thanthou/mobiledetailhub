/**
 * Unified Error Handler Middleware
 * 
 * Enhanced error handling that integrates with the unified error service.
 * Provides consistent error responses and comprehensive logging.
 */

import { 
  unifiedErrorService, 
  UnifiedError,
  ERROR_SEVERITY,
  ERROR_CATEGORY 
} from '../services/unifiedErrorService.js';
import { createModuleLogger } from '../config/logger.js';
import { generateTenantApiResponse, generateTenantErrorResponse } from '../utils/tenantContextContract.js';

const logger = createModuleLogger('unifiedErrorHandler');

/**
 * Enhanced error handler middleware
 * Must be the last middleware in the chain
 */
export const unifiedErrorHandler = async (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  try {
    // Build error context
    const context = unifiedErrorService.context()
      .request(req)
      .tenant(req.tenant?.id, req.tenant?.slug)
      .user(req.user?.userId, req.user?.email)
      .metadata({
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        body: req.body ? Object.keys(req.body) : null, // Log body keys, not values
        query: req.query,
        params: req.params
      })
      .build();

    // Handle the error through unified service
    const unifiedError = await unifiedErrorService.handleError(err, context);

    // Generate appropriate response
    const response = generateErrorResponse(unifiedError, req);

    // Set response headers
    if (unifiedError.correlationId) {
      res.setHeader('X-Correlation-ID', unifiedError.correlationId);
    }
    if (unifiedError.requestId) {
      res.setHeader('X-Request-ID', unifiedError.requestId);
    }

    // Send response
    res.status(unifiedError.statusCode).json(response);

  } catch (handlerError) {
    // Fallback error handling if our unified handler fails
    logger.error('Unified error handler failed', {
      originalError: err.message,
      handlerError: handlerError.message,
      url: req.url,
      method: req.method
    });

    // Send basic error response
    res.status(500).json({
      success: false,
      error: {
        code: 'ERROR_HANDLER_FAILED',
        message: 'An error occurred while processing your request',
        details: process.env.NODE_ENV === 'development' ? handlerError.message : null
      },
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Generate appropriate error response based on error type
 */
function generateErrorResponse(error, req) {
  // Use tenant context contract format if available
  if (req.tenant) {
    return generateTenantErrorResponse({
      code: error.code,
      message: error.userMessage || error.message,
      details: process.env.NODE_ENV === 'development' ? error.developerMessage : null
    }, {
      requestId: error.requestId,
      tenantId: error.tenantId,
      correlationId: error.correlationId
    });
  }

  // Standard error response format
  return {
    success: false,
    error: {
      code: error.code,
      message: error.userMessage || error.message,
      details: process.env.NODE_ENV === 'development' ? error.developerMessage : null
    },
    meta: {
      requestId: error.requestId,
      correlationId: error.correlationId,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 404 handler for unmatched routes
 */
export const unifiedNotFoundHandler = async (req, res) => {
  const context = unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .user(req.user?.userId, req.user?.email)
    .metadata({
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    })
    .build();

  const notFoundError = new UnifiedError(
    `Route ${req.method} ${req.url} not found`,
    {
      code: 'ROUTE_NOT_FOUND',
      statusCode: 404,
      severity: ERROR_SEVERITY.LOW,
      category: ERROR_CATEGORY.SYSTEM,
      userMessage: 'The requested resource was not found',
      ...context
    }
  );

  await unifiedErrorService.handleError(notFoundError, context);

  const response = generateErrorResponse(notFoundError, req);
  res.status(404).json(response);
};

/**
 * Enhanced async error wrapper
 */
export const unifiedAsyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // Let the unified error handler process the error
      next(error);
    }
  };
};

/**
 * Validation error handler
 */
export const handleValidationError = (errors, req) => {
  const context = unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .user(req.user?.userId, req.user?.email)
    .metadata({ validationErrors: errors })
    .build();

  return new UnifiedError(
    'Validation failed',
    {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      severity: ERROR_SEVERITY.LOW,
      category: ERROR_CATEGORY.VALIDATION,
      userMessage: 'Please check your input and try again',
      developerMessage: `Validation failed: ${JSON.stringify(errors)}`,
      metadata: { validationErrors: errors },
      ...context
    }
  );
};

/**
 * Database error handler
 */
export const handleDatabaseError = (error, req, operation = 'database operation') => {
  const context = unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .user(req.user?.userId, req.user?.email)
    .metadata({ operation, originalError: error.message })
    .build();

  return new UnifiedError(
    `Database ${operation} failed`,
    {
      code: 'DATABASE_ERROR',
      statusCode: 500,
      severity: ERROR_SEVERITY.HIGH,
      category: ERROR_CATEGORY.DATABASE,
      userMessage: 'A database error occurred. Please try again later.',
      developerMessage: error.message,
      metadata: { operation, originalError: error.message },
      ...context
    }
  );
};

/**
 * Authentication error handler
 */
export const handleAuthenticationError = (message = 'Authentication required', req = null) => {
  const context = req ? unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .metadata({ authError: true })
    .build() : {};

  return new UnifiedError(
    message,
    {
      code: 'AUTHENTICATION_ERROR',
      statusCode: 401,
      severity: ERROR_SEVERITY.MEDIUM,
      category: ERROR_CATEGORY.AUTHENTICATION,
      userMessage: 'Please log in to access this resource',
      developerMessage: message,
      ...context
    }
  );
};

/**
 * Authorization error handler
 */
export const handleAuthorizationError = (message = 'Access denied', req = null) => {
  const context = req ? unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .user(req.user?.userId, req.user?.email)
    .metadata({ authzError: true })
    .build() : {};

  return new UnifiedError(
    message,
    {
      code: 'AUTHORIZATION_ERROR',
      statusCode: 403,
      severity: ERROR_SEVERITY.MEDIUM,
      category: ERROR_CATEGORY.AUTHORIZATION,
      userMessage: 'You do not have permission to access this resource',
      developerMessage: message,
      ...context
    }
  );
};

/**
 * Business logic error handler
 */
export const handleBusinessLogicError = (message, metadata = {}, req = null) => {
  const context = req ? unifiedErrorService.context()
    .request(req)
    .tenant(req.tenant?.id, req.tenant?.slug)
    .user(req.user?.userId, req.user?.email)
    .metadata({ businessLogicError: true, ...metadata })
    .build() : {};

  return new UnifiedError(
    message,
    {
      code: 'BUSINESS_LOGIC_ERROR',
      statusCode: 422,
      severity: ERROR_SEVERITY.MEDIUM,
      category: ERROR_CATEGORY.BUSINESS_LOGIC,
      userMessage: message,
      developerMessage: message,
      metadata,
      ...context
    }
  );
};
