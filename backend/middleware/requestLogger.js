import { v4 as uuidv4 } from 'uuid';
import onFinished from 'on-finished';
import { createRequestLogger as createPinoRequestLogger, logApiRequest } from '../config/logger.js';
import { logger } from '../config/logger.js';
// PII patterns for redaction
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g
};

// Function to scrub PII from message strings
const scrubPII = (message) => {
  if (typeof message !== 'string') {return message;}
  
  let scrubbed = message;
  
  // Replace PII with masked versions
  scrubbed = scrubbed.replace(PII_PATTERNS.email, '[EMAIL]');
  scrubbed = scrubbed.replace(PII_PATTERNS.phone, '[PHONE]');
  scrubbed = scrubbed.replace(PII_PATTERNS.ssn, '[SSN]');
  scrubbed = scrubbed.replace(PII_PATTERNS.creditCard, '[CARD]');
  
  return scrubbed;
};

// Function to scrub PII from objects recursively
const scrubObject = (obj) => {
  if (obj === null || obj === undefined) {return obj;}
  
  if (typeof obj === 'string') {
    return scrubPII(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => scrubObject(item));
  }
  
  if (typeof obj === 'object') {
    const scrubbed = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip certain sensitive keys entirely
      if (['password', 'token', 'secret', 'key', 'authorization'].includes(key.toLowerCase())) {
        scrubbed[key] = '[REDACTED]';
      } else {
        scrubbed[key] = scrubObject(value);
      }
    }
    return scrubbed;
  }
  
  return obj;
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  // Generate unique correlation ID for this request
  req.id = uuidv4();
  
  // Record start time
  req.startTime = Date.now();
  
  // Set global request context for logger
  global.currentRequest = req;
  
  // Add correlation ID to response headers for client tracking
  res.setHeader('X-Request-ID', req.id);
  res.setHeader('X-Correlation-ID', req.id);
  
  // Create request-scoped logger
  req.logger = createPinoRequestLogger(req, res, next);
  
  // Log request start
  logger.info('Request started', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length')
  });
  
  // Use on-finished to log response completion
  // This properly handles all completion scenarios:
  // - Normal response end
  // - Aborted connections (client disconnect)
  // - Errors thrown before res.end()
  // - Piped/streamed responses
  onFinished(res, (err, res) => {
    const duration = Date.now() - req.startTime;
    
    if (err) {
      // Connection was terminated abnormally (client disconnect, error, etc.)
      logger.warn('Request finished with error', {
        requestId: req.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        error: err.message
      });
    } else {
      // Normal completion - use the pino API request logging
      logApiRequest(req, res, duration);
    }
    
    // Clean up global request context
    global.currentRequest = null;
  });
  
  next();
};

// Enhanced logger wrapper that includes request context
const createRequestLogger = (req) => {
  const baseLogger = { ...logger };
  
  // Override logging methods to include request context and scrub PII
  const requestScopedLogger = {};
  
  ['error', 'warn', 'info', 'debug'].forEach(level => {
    requestScopedLogger[level] = (message, data = null) => {
      const requestContext = {
        requestId: req.id,
        method: req.method,
        path: req.path,
        ip: req.ip
      };
      
      // Scrub PII from message and data
      const scrubbedMessage = scrubPII(message);
      const scrubbedData = data ? scrubObject(data) : null;
      
      // Add request context to all logs
      const logData = {
        ...requestContext,
        ...(scrubbedData && { data: scrubbedData })
      };
      
      baseLogger[level](scrubbedMessage, logData);
    };
  });
  
  // Preserve special methods
  ['startup', 'db', 'audit', 'adminAction'].forEach(method => {
    requestScopedLogger[method] = (...args) => {
      const requestContext = {
        requestId: req.id,
        method: req.method,
        path: req.path,
        ip: req.ip
      };
      
      // For special methods, add request context to the data
      if (args.length > 1 && typeof args[1] === 'object') {
        args[1] = { ...requestContext, ...args[1] };
      } else if (args.length === 1) {
        args.push(requestContext);
      }
      
      baseLogger[method](...args);
    };
  });
  
  return requestScopedLogger;
};

export {
  requestLogger,
  createRequestLogger,
  scrubPII,
  scrubObject
};
