/**
 * Unified Error Service
 * 
 * Provides centralized error handling, logging, and monitoring across all layers.
 * Integrates with existing logging infrastructure while adding tenant context and correlation.
 */

import { logger, createModuleLogger, logError, logSecurityEvent, logBusinessEvent } from '../config/logger.js';
import { getPool } from '../database/pool.js';

const serviceLogger = createModuleLogger('unifiedErrorService');

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories
 */
export const ERROR_CATEGORY = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  DATABASE: 'database',
  NETWORK: 'network',
  BUSINESS_LOGIC: 'business_logic',
  SYSTEM: 'system',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  USER_INPUT: 'user_input'
};

/**
 * Unified error class with enhanced context
 */
export class UnifiedError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'UnifiedError';
    
    // Core error properties
    this.code = options.code || 'UNKNOWN_ERROR';
    this.statusCode = options.statusCode || 500;
    this.severity = options.severity || ERROR_SEVERITY.MEDIUM;
    this.category = options.category || ERROR_CATEGORY.SYSTEM;
    
    // Context properties
    this.tenantId = options.tenantId;
    this.userId = options.userId;
    this.correlationId = options.correlationId;
    this.requestId = options.requestId;
    
    // Additional metadata
    this.metadata = options.metadata || {};
    this.timestamp = new Date().toISOString();
    this.stack = this.stack;
    
    // Retry information
    this.retryable = options.retryable || false;
    this.retryAfter = options.retryAfter;
    
    // User-facing information
    this.userMessage = options.userMessage || message;
    this.developerMessage = options.developerMessage || message;
  }

  /**
   * Convert to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      severity: this.severity,
      category: this.category,
      tenantId: this.tenantId,
      userId: this.userId,
      correlationId: this.correlationId,
      requestId: this.requestId,
      metadata: this.metadata,
      timestamp: this.timestamp,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      userMessage: this.userMessage,
      developerMessage: this.developerMessage,
      stack: this.stack
    };
  }
}

/**
 * Error context builder
 */
export class ErrorContextBuilder {
  constructor() {
    this.context = {};
  }

  tenant(tenantId, tenantSlug = null) {
    this.context.tenantId = tenantId;
    this.context.tenantSlug = tenantSlug;
    return this;
  }

  user(userId, email = null) {
    this.context.userId = userId;
    this.context.userEmail = email;
    return this;
  }

  request(req) {
    this.context.correlationId = req.id || req.correlationId;
    this.context.requestId = req.id;
    this.context.method = req.method;
    this.context.url = req.originalUrl || req.url;
    this.context.userAgent = req.get('User-Agent');
    this.context.ip = req.ip;
    return this;
  }

  metadata(data) {
    this.context.metadata = { ...this.context.metadata, ...data };
    return this;
  }

  build() {
    return { ...this.context };
  }
}

/**
 * Unified error service
 */
export class UnifiedErrorService {
  constructor() {
    this.errorCounts = new Map();
    this.recentErrors = [];
    this.maxRecentErrors = 100;
  }

  /**
   * Create error context builder
   */
  context() {
    return new ErrorContextBuilder();
  }

  /**
   * Log and handle error with full context
   */
  async handleError(error, context = {}) {
    try {
      // Enhance error with context
      const enhancedError = this.enhanceError(error, context);
      
      // Log the error
      await this.logError(enhancedError, context);
      
      // Track error metrics
      this.trackError(enhancedError);
      
      // Store recent errors for monitoring
      this.storeRecentError(enhancedError);
      
      // Check for alert conditions
      await this.checkAlerts(enhancedError);
      
      return enhancedError;
    } catch (loggingError) {
      // Fallback logging if our error service fails
      serviceLogger.error('Failed to handle error in UnifiedErrorService', {
        originalError: error.message,
        loggingError: loggingError.message
      });
      return error;
    }
  }

  /**
   * Enhance error with context information
   */
  enhanceError(error, context) {
    if (error instanceof UnifiedError) {
      // Merge context into existing error
      return new UnifiedError(error.message, {
        ...error.toJSON(),
        ...context,
        metadata: { ...error.metadata, ...context.metadata }
      });
    }

    // Create new UnifiedError from regular error
    return new UnifiedError(error.message, {
      code: error.code || 'UNKNOWN_ERROR',
      statusCode: error.statusCode || 500,
      severity: this.determineSeverity(error),
      category: this.determineCategory(error),
      stack: error.stack,
      ...context
    });
  }

  /**
   * Log error with appropriate level and context
   */
  async logError(error, context = {}) {
    const logData = {
      ...error.toJSON(),
      ...context,
      timestamp: new Date().toISOString()
    };

    // Choose log level based on severity
    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        logger.fatal(logData, `CRITICAL ERROR: ${error.message}`);
        break;
      case ERROR_SEVERITY.HIGH:
        logger.error(logData, `HIGH SEVERITY ERROR: ${error.message}`);
        break;
      case ERROR_SEVERITY.MEDIUM:
        logger.warn(logData, `MEDIUM SEVERITY ERROR: ${error.message}`);
        break;
      case ERROR_SEVERITY.LOW:
        logger.info(logData, `LOW SEVERITY ERROR: ${error.message}`);
        break;
      default:
        logger.error(logData, `ERROR: ${error.message}`);
    }

    // Log to database for persistent storage
    await this.logToDatabase(error, context);
  }

  /**
   * Log error to database for analysis
   */
  async logToDatabase(error, context = {}) {
    try {
      const pool = await getPool();
      
      const query = `
        INSERT INTO system.error_logs (
          error_code, error_message, error_category, severity,
          tenant_id, user_id, correlation_id, request_id,
          metadata, stack_trace, user_message,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      await pool.query(query, [
        error.code,
        error.message,
        error.category,
        error.severity,
        error.tenantId,
        error.userId,
        error.correlationId,
        error.requestId,
        JSON.stringify(error.metadata),
        error.stack,
        error.userMessage,
        new Date()
      ]);

    } catch (dbError) {
      // Don't let database logging failures break the application
      serviceLogger.error('Failed to log error to database', {
        originalError: error.message,
        dbError: dbError.message
      });
    }
  }

  /**
   * Track error metrics for monitoring
   */
  trackError(error) {
    const key = `${error.category}:${error.code}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);
  }

  /**
   * Store recent errors for monitoring
   */
  storeRecentError(error) {
    this.recentErrors.unshift(error.toJSON());
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors = this.recentErrors.slice(0, this.maxRecentErrors);
    }
  }

  /**
   * Check for alert conditions
   */
  async checkAlerts(error) {
    // Check for critical errors
    if (error.severity === ERROR_SEVERITY.CRITICAL) {
      await this.sendCriticalAlert(error);
    }

    // Check for error rate spikes
    const errorRate = this.getErrorRate(error.category);
    if (errorRate > 10) { // More than 10 errors per minute
      await this.sendRateAlert(error.category, errorRate);
    }
  }

  /**
   * Send critical error alert
   */
  async sendCriticalAlert(error) {
    // TODO: Integrate with alerting system (Slack, email, etc.)
    serviceLogger.fatal('CRITICAL ERROR ALERT', error.toJSON());
  }

  /**
   * Send error rate alert
   */
  async sendRateAlert(category, rate) {
    // TODO: Integrate with alerting system
    serviceLogger.warn('HIGH ERROR RATE ALERT', {
      category,
      rate,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Determine error severity
   */
  determineSeverity(error) {
    if (error.statusCode >= 500) return ERROR_SEVERITY.HIGH;
    if (error.statusCode >= 400) return ERROR_SEVERITY.MEDIUM;
    if (error.statusCode >= 300) return ERROR_SEVERITY.LOW;
    return ERROR_SEVERITY.MEDIUM;
  }

  /**
   * Determine error category
   */
  determineCategory(error) {
    if (error.name === 'ValidationError') return ERROR_CATEGORY.VALIDATION;
    if (error.name === 'JsonWebTokenError') return ERROR_CATEGORY.AUTHENTICATION;
    if (error.code && error.code.startsWith('23')) return ERROR_CATEGORY.DATABASE;
    if (error.code === 'ECONNREFUSED') return ERROR_CATEGORY.NETWORK;
    return ERROR_CATEGORY.SYSTEM;
  }

  /**
   * Get error rate for category
   */
  getErrorRate(category) {
    // Simple implementation - count errors in last minute
    const oneMinuteAgo = new Date(Date.now() - 60000);
    return this.recentErrors.filter(e => 
      e.category === category && new Date(e.timestamp) > oneMinuteAgo
    ).length;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.recentErrors.length,
      errorCounts: Object.fromEntries(this.errorCounts),
      recentErrors: this.recentErrors.slice(0, 10),
      errorRate: {
        authentication: this.getErrorRate(ERROR_CATEGORY.AUTHENTICATION),
        database: this.getErrorRate(ERROR_CATEGORY.DATABASE),
        validation: this.getErrorRate(ERROR_CATEGORY.VALIDATION),
        system: this.getErrorRate(ERROR_CATEGORY.SYSTEM)
      }
    };
  }
}

// Create singleton instance
export const unifiedErrorService = new UnifiedErrorService();

// Export error creation helpers
export const createError = (message, options = {}) => {
  return new UnifiedError(message, options);
};

export const createValidationError = (message, field = null) => {
  return new UnifiedError(message, {
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    severity: ERROR_SEVERITY.LOW,
    category: ERROR_CATEGORY.VALIDATION,
    metadata: { field }
  });
};

export const createAuthenticationError = (message = 'Authentication required') => {
  return new UnifiedError(message, {
    code: 'AUTHENTICATION_ERROR',
    statusCode: 401,
    severity: ERROR_SEVERITY.MEDIUM,
    category: ERROR_CATEGORY.AUTHENTICATION
  });
};

export const createAuthorizationError = (message = 'Access denied') => {
  return new UnifiedError(message, {
    code: 'AUTHORIZATION_ERROR',
    statusCode: 403,
    severity: ERROR_SEVERITY.MEDIUM,
    category: ERROR_CATEGORY.AUTHORIZATION
  });
};

export const createDatabaseError = (message, originalError = null) => {
  return new UnifiedError(message, {
    code: 'DATABASE_ERROR',
    statusCode: 500,
    severity: ERROR_SEVERITY.HIGH,
    category: ERROR_CATEGORY.DATABASE,
    metadata: { originalError: originalError?.message }
  });
};

export const createBusinessLogicError = (message, metadata = {}) => {
  return new UnifiedError(message, {
    code: 'BUSINESS_LOGIC_ERROR',
    statusCode: 422,
    severity: ERROR_SEVERITY.MEDIUM,
    category: ERROR_CATEGORY.BUSINESS_LOGIC,
    metadata
  });
};
