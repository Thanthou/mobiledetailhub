# Logging Configuration

This backend now uses a structured logging system that respects environment-based log levels to reduce excessive console output in production.

## Environment Variables

### NODE_ENV
- **development**: Defaults to DEBUG level (all messages)
- **production**: Defaults to WARN level (only errors and warnings)

### LOG_LEVEL
Override the default log level for your environment:
- **error**: Only error messages
- **warn**: Errors and warnings
- **info**: Errors, warnings, and info messages
- **debug**: All messages (including debug)

## Examples

### Development (.env)
```bash
NODE_ENV=development
LOG_LEVEL=debug  # Optional, defaults to debug in development
```

### Production (.env)
```bash
NODE_ENV=production
LOG_LEVEL=warn   # Optional, defaults to warn in production
```

## Log Levels

### ERROR (0)
Critical errors that require immediate attention
- Database connection failures
- Authentication failures
- Critical system errors

### WARN (1)
Warning messages for potential issues
- Database connection retries
- Missing optional configuration
- Deprecated feature usage

### INFO (2)
General information about system operation
- Server startup/shutdown
- Database connections established
- Affiliate applications processed

### DEBUG (3)
Detailed debugging information
- Request/response data
- Database query details
- Step-by-step process logs

## Usage in Code

```javascript
const logger = require('./utils/logger');

// Different log levels
logger.error('Critical error occurred', { error: err.message });
logger.warn('Warning message', { data: someData });
logger.info('Information message', { count: resultCount });
logger.debug('Debug information', { request: req.body });

// Special methods
logger.startup('Server starting...');  // Always shows
logger.db('Database connected');       // Database-specific logging
```

## Benefits

1. **Production Safety**: Debug logs are automatically hidden in production
2. **Performance**: Reduced console output in production environments
3. **Structured Data**: Logs include structured data for better parsing
4. **Environment Aware**: Automatically adjusts based on NODE_ENV
5. **Consistent Format**: All logs follow the same timestamp and level format

## Migration Notes

All `console.log`, `console.error`, and `console.warn` statements have been replaced with appropriate logger calls. The logging system maintains the same information while providing better control over output verbosity.
