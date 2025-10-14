const winston = require('winston');
const { env } = require('../config/env');

// Create Winston logger with different configurations for different environments
const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'platform-backend' },
  transports: []
});

// Add console transport for development
if (env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf((info) => {
        const { timestamp, level, message, service, ...rest } = info;
        const meta = rest || {};
        let logMessage = `${timestamp || ''} [${service || 'backend'}] ${level}: ${message}`;
        // Only add meta if there are keys and they're not Winston internals
        const metaKeys = Object.keys(meta).filter(key => !['timestamp', 'level', 'message', 'service'].includes(key));
        if (metaKeys.length > 0) {
          const metaObj = {};
          metaKeys.forEach(key => metaObj[key] = meta[key]);
          logMessage += ` ${JSON.stringify(metaObj)}`;
        }
        return logMessage;
      })
    )
  }));
} else {
  // Production: JSON format for log aggregation
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }));
}

// Add file transport for production if LOG_FILE is specified
if (env.NODE_ENV === 'production' && env.LOG_FILE) {
  logger.add(new winston.transports.File({
    filename: env.LOG_FILE,
    level: 'info'
  }));
  
  // Separate error log file
  logger.add(new winston.transports.File({
    filename: env.LOG_FILE.replace('.log', '.error.log'),
    level: 'error'
  }));
}

// Set log level based on environment
if (env.NODE_ENV === 'production') {
  logger.level = env.LOG_LEVEL || 'warn';
} else {
  logger.level = env.LOG_LEVEL || 'debug';
}

// Create a wrapper that maintains the existing API
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
      logger.error(message, enrichedData);
    } else {
      logger.error(message);
    }
  },

  warn: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.warn(message, enrichedData);
    } else {
      logger.warn(message);
    }
  },

  info: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.info(message, enrichedData);
    } else {
      logger.info(message);
    }
  },

  debug: (message, data = null) => {
    const enrichedData = loggerWrapper._addRequestContext(data);
    if (enrichedData) {
      logger.debug(message, enrichedData);
    } else {
      logger.debug(message);
    }
  },

  // Special method for startup/shutdown messages that should always show
  startup: (message) => {
    logger.info(`🚀 ${message}`);
  },

  // Special method for database connection messages
  db: (message, data = null) => {
    if (data) {
      logger.info(`🗄️ ${message}`, data);
    } else {
      logger.info(`🗄️ ${message}`);
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
    
    logger.info(`🔍 AUDIT: ${action} on ${entity}`, auditData);
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
    
    logger.info(`👑 ADMIN: ${action} on ${entity}`, adminData);
  }
};

module.exports = loggerWrapper;
