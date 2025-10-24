/**
 * Unified Logging Configuration
 * Centralized pino logger with structured logging and environment-specific formatting
 */

import pino from 'pino';
// import { env } from './env.js'; // Unused import
import { getLoggingConfig } from './logging-environments.js';

/**
 * Create base logger configuration
 */
const createLoggerConfig = () => {
  const environmentConfig = getLoggingConfig();
  
  const baseConfig = {
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      log: (object) => {
        // Add correlation ID if present
        if (object.correlationId) {
          // Keep correlation ID as is
        }
        return object;
      }
    },
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
      // Custom serializers for our app
      user: (user) => {
        if (!user) {
          return user;
        }
        return {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          // Don't log sensitive fields
        };
      },
      error: (error) => {
        if (!error) {
          return error;
        }
        return {
          message: error.message,
          stack: error.stack,
          code: error.code,
          statusCode: error.statusCode,
          // Don't log sensitive error details
        };
      }
    }
  };

  return {
    ...baseConfig,
    ...environmentConfig
  };
};

/**
 * Create the main logger instance
 */
const logger = pino(createLoggerConfig());

/**
 * Create child loggers for different modules
 */
const createModuleLogger = (moduleName) => {
  return logger.child({ module: moduleName });
};

/**
 * Create request logger with correlation ID
 */
const createRequestLogger = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
                       req.headers['x-request-id'] || 
                       `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  
  const requestLogger = logger.child({ 
    correlationId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  req.logger = requestLogger;
  res.logger = requestLogger;
  
  next();
};

/**
 * Performance logging helper
 */
const logPerformance = (operation, startTime, metadata = {}) => {
  const duration = Date.now() - startTime;
  logger.info({
    operation,
    duration: `${duration}ms`,
    ...metadata
  }, `Performance: ${operation} completed in ${duration}ms`);
};

/**
 * Security event logging
 */
const logSecurityEvent = (event, details = {}) => {
  logger.warn({
    securityEvent: event,
    timestamp: new Date().toISOString(),
    ...details
  }, `Security Event: ${event}`);
};

/**
 * Business event logging
 */
const logBusinessEvent = (event, details = {}) => {
  logger.info({
    businessEvent: event,
    timestamp: new Date().toISOString(),
    ...details
  }, `Business Event: ${event}`);
};

/**
 * Error logging with context
 */
const logError = (error, context = {}) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    ...context
  }, `Error: ${error.message}`);
};

/**
 * Database query logging
 */
const logDatabaseQuery = (query, duration, params = []) => {
  logger.debug({
    query: query.replace(/\s+/g, ' ').trim(),
    duration: `${duration}ms`,
    paramCount: params.length,
    // Don't log actual parameters for security
  }, 'Database Query');
};

/**
 * API request/response logging
 */
const logApiRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    correlationId: req.correlationId
  };

  if (res.statusCode >= 400) {
    logger.warn(logData, `API Request: ${req.method} ${req.originalUrl} - ${res.statusCode}`);
  } else {
    logger.debug(logData, `API Request: ${req.method} ${req.originalUrl} - ${res.statusCode}`);
  }
};

/**
 * Health check logging
 */
const logHealthCheck = (status, details = {}) => {
  const level = status === 'healthy' ? 'info' : 'warn';
  logger[level]({
    healthStatus: status,
    timestamp: new Date().toISOString(),
    ...details
  }, `Health Check: ${status}`);
};

export {
  logger,
  createModuleLogger,
  createRequestLogger,
  logPerformance,
  logSecurityEvent,
  logBusinessEvent,
  logError,
  logDatabaseQuery,
  logApiRequest,
  logHealthCheck
};
