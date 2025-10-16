// Re-export the unified pino logger
import { logger as pinoLogger } from '../config/logger.js';
// import { createModuleLogger } from '../config/logger.js'; // Unused import

// Create the main logger instance
const logger = pinoLogger;

// Create a wrapper that maintains the existing API but uses pino
const loggerWrapper = {
  // Add request context if available
  _addRequestContext: (meta) => {
    // If we're in a request context, add request info
    if (global.currentRequest) {
      return {
        ...meta,
        requestId: global.currentRequest.id,
        method: global.currentRequest.method,
        path: global.currentRequest.path,
        ip: global.currentRequest.ip
      };
    }
    return meta;
  },
  
  error: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.error({ ...enrichedData }, message);
    } else {
      logger.error(message);
    }
  },

  warn: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.warn({ ...enrichedData }, message);
    } else {
      logger.warn(message);
    }
  },

  info: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.info({ ...enrichedData }, message);
    } else {
      logger.info(message);
    }
  },

  debug: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.debug({ ...enrichedData }, message);
    } else {
      logger.debug(message);
    }
  },

  // Special method for startup/shutdown messages that should always show
  startup: (message) => {
    logger.info({ type: 'startup' }, `🚀 ${message}`);
  },

  // Special method for database connection messages
  db: (message, data = null) => {
    if (data) {
      logger.info({ type: 'database', ...data }, `🗄️ ${message}`);
    } else {
      logger.info({ type: 'database' }, `🗄️ ${message}`);
    }
  },

  // Special method for audit logging - structured logging for admin actions
  audit: (action, entity, before, after, actor = null) => {
    const auditData = {
      actor: actor || 'unknown',
      action,
      entity,
      before: before || null,
      after: after || null,
      timestamp: new Date().toISOString(),
      type: 'audit'
    };
    
    logger.info(auditData, `🔍 AUDIT: ${action} on ${entity}`);
  },

  // Special method for admin action logging
  adminAction: (action, entity, details, actor = null) => {
    const adminData = {
      actor: actor || 'unknown',
      action,
      entity,
      details: details || {},
      timestamp: new Date().toISOString(),
      type: 'admin_action'
    };
    
    logger.info(adminData, `👑 ADMIN: ${action} on ${entity}`);
  }
};

export default loggerWrapper;
