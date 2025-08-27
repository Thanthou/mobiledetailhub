# Request Logging Implementation

## Overview
Enhanced request logging system with correlation IDs, request timing, and automatic PII (Personally Identifiable Information) scrubbing.

## Features

### ✅ Correlation IDs
- Unique UUID generated for each request
- Added to `req.id` for internal use
- Included in `X-Request-ID` response header
- All logs include correlation ID for request tracing

### ✅ Request Timing
- Start time recorded when request begins
- Duration calculated and logged when request completes
- Performance monitoring for all endpoints

### ✅ PII Scrubbing
- **Emails**: `user@example.com` → `[EMAIL]`
- **Phone Numbers**: `(555) 123-4567` → `[PHONE]`
- **SSNs**: `123-45-6789` → `[SSN]`
- **Credit Cards**: `1234-5678-9012-3456` → `[CARD]`
- **Sensitive Keys**: `password`, `token`, `secret` → `[REDACTED]`

### ✅ Request Context
All logs automatically include:
- `requestId`: Correlation ID
- `method`: HTTP method
- `path`: Request path
- `ip`: Client IP address

## Implementation

### Middleware Location
```javascript
// backend/middleware/requestLogger.js
app.use(requestLogger); // Added after CORS, before other middleware
```

### Usage in Routes
```javascript
// Automatic request context in all logs
logger.info('User action completed', { userId: 123, action: 'login' });
// Output includes: requestId, method, path, ip + your data
```

### PII Scrubbing
```javascript
// Automatic scrubbing of sensitive data
logger.info('User registered', { 
  email: 'user@example.com',  // → [EMAIL]
  phone: '(555) 123-4567'    // → [PHONE]
});
```

## Log Output Examples

### Request Start
```json
{
  "level": "info",
  "message": "Request started",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/auth/login",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "contentType": "application/json",
  "contentLength": "156"
}
```

### Request Completion
```json
{
  "level": "info",
  "message": "Request completed",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/auth/login",
  "statusCode": 200,
  "duration": "45ms",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

### Business Logic Logs
```json
{
  "level": "info",
  "message": "User login successful",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/auth/login",
  "ip": "192.168.1.100",
  "data": {
    "userId": 123,
    "email": "[EMAIL]",
    "action": "login"
  }
}
```

## Benefits

1. **Request Tracing**: Follow requests through the system using correlation IDs
2. **Performance Monitoring**: Track response times for all endpoints
3. **Security**: Automatic PII redaction prevents sensitive data exposure
4. **Debugging**: Easy correlation of logs across different components
5. **Compliance**: Helps meet data protection requirements

## Testing

Run the test script to verify functionality:
```bash
cd backend
node scripts/test-request-logging.js
```

## Configuration

No additional configuration required. The middleware automatically:
- Generates UUIDs for correlation
- Scans and redacts PII patterns
- Adds request context to all logs
- Manages request lifecycle timing
