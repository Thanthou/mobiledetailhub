# Unified Logging System

This document describes the unified logging system implemented with Pino for structured, performant logging across the backend.

## Overview

The logging system provides:
- **Structured JSON logging** for production
- **Pretty-printed logs** for development
- **Automatic PII redaction** for security
- **Request correlation IDs** for tracing
- **Module-specific loggers** for better organization
- **Performance logging** helpers
- **Security event logging**

## Configuration

### Environment-Specific Logging

- **Development**: Pretty-printed logs with colors and emojis
- **Test**: Minimal error-only logging
- **Production**: JSON logs to stdout or file

### Log Levels

- `TRACE`: Very detailed debugging information
- `DEBUG`: Detailed debugging information
- `INFO`: General information about application flow
- `WARN`: Warning messages for potentially harmful situations
- `ERROR`: Error messages for error events
- `FATAL`: Very severe error events that will presumably lead the application to abort

## Usage

### Basic Logging

```javascript
const { createModuleLogger } = require('../config/logger');
const logger = createModuleLogger('myModule');

// Basic logging
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', { error: error.message });
logger.warn('Rate limit exceeded', { ip: '192.168.1.1' });
```

### Request-Scoped Logging

```javascript
// In middleware
const { createRequestLogger } = require('../config/logger');

const requestLogger = createRequestLogger(req, res, next);
// Use req.logger in your route handlers
req.logger.info('Processing payment', { amount: 100 });
```

### Specialized Logging

```javascript
const { logPerformance, logSecurityEvent, logBusinessEvent } = require('../config/logger');

// Performance logging
const startTime = Date.now();
// ... do work ...
logPerformance('database-query', startTime, { query: 'SELECT * FROM users' });

// Security events
logSecurityEvent('failed-login', { ip: '192.168.1.1', email: 'user@example.com' });

// Business events
logBusinessEvent('user-registration', { userId: 123, plan: 'premium' });
```

## PII Redaction

The logging system automatically redacts sensitive information:

- Passwords and tokens
- Email addresses (in some contexts)
- Phone numbers
- Credit card numbers
- SSNs
- API keys and secrets

## Request Correlation

Every request gets a unique correlation ID that's included in all logs, making it easy to trace requests across the system.

## Performance

Pino is one of the fastest Node.js loggers, with minimal overhead:
- **~5x faster** than Winston
- **~10x faster** than Bunyan
- **Minimal memory usage**

## Log Aggregation

In production, logs are output as structured JSON, making them easy to aggregate with tools like:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd
- CloudWatch
- Datadog

## Examples

### Development Output
```
🕐 2024-01-15 10:30:45.123 ℹ️ INFO [myModule] User logged in {"userId":123,"email":"user@example.com"}
```

### Production Output
```json
{"level":"INFO","time":"2024-01-15T10:30:45.123Z","module":"myModule","msg":"User logged in","userId":123,"email":"user@example.com"}
```

## Best Practices

1. **Use structured logging**: Always include relevant context
2. **Don't log sensitive data**: Let the redaction system handle it
3. **Use appropriate log levels**: Don't log everything as INFO
4. **Include correlation IDs**: For request tracing
5. **Log errors with context**: Include stack traces and relevant data
6. **Use module loggers**: For better organization

## Migration from Winston

The system maintains backward compatibility with the existing Winston-based logger API, so existing code continues to work without changes.

## Configuration Files

- `config/logger.js`: Main logging configuration
- `config/logging-environments.js`: Environment-specific settings
- `utils/logger.js`: Backward-compatible wrapper
- `middleware/requestLogger.js`: Request logging middleware
