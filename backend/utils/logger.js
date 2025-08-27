const winston = require('winston');

// Create Winston logger with different configurations for different environments
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mdh-backend' },
  transports: []
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
        let logMessage = `${timestamp} [${service}] ${level}: ${message}`;
        if (Object.keys(meta).length > 0) {
          logMessage += ` ${JSON.stringify(meta)}`;
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
if (process.env.NODE_ENV === 'production' && process.env.LOG_FILE) {
  logger.add(new winston.transports.File({
    filename: process.env.LOG_FILE,
    level: 'info'
  }));
  
  // Separate error log file
  logger.add(new winston.transports.File({
    filename: process.env.LOG_FILE.replace('.log', '.error.log'),
    level: 'error'
  }));
}

// Set log level based on environment
if (process.env.NODE_ENV === 'production') {
  logger.level = process.env.LOG_LEVEL || 'warn';
} else {
  logger.level = process.env.LOG_LEVEL || 'debug';
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
