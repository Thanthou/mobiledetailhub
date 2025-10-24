# Unified Error & Logging System

This document describes the comprehensive error handling and logging system that provides consistent error management across all layers of the application.

## Overview

The unified error and logging system provides:

- **Consistent Error Handling**: Standardized error responses and logging across backend and frontend
- **Comprehensive Context**: Correlation IDs, tenant context, and user information in all logs
- **Error Tracking**: Frontend error reporting and backend error storage
- **Monitoring & Alerting**: Error rate monitoring and alert conditions
- **Performance Insights**: Error trends and patterns analysis

## Architecture

### Backend Components

1. **Unified Error Service** (`backend/services/unifiedErrorService.js`)
   - Core error handling and logging service
   - Error classification and severity management
   - Database error storage and retrieval
   - Error rate monitoring and alerting

2. **Unified Error Handler Middleware** (`backend/middleware/unifiedErrorHandler.js`)
   - Express middleware for error handling
   - Context building and error enhancement
   - Consistent error response formatting
   - Integration with existing middleware

3. **Error Tracking API** (`backend/routes/errorTracking.js`)
   - RESTful endpoints for frontend error reporting
   - Error statistics and health monitoring
   - Error trend analysis

4. **Database Schema** (`backend/migrations/001_create_error_logs_table.sql`)
   - Structured error storage with full context
   - Optimized indexes for querying and analysis
   - Tenant and user correlation

### Frontend Components

1. **Error Tracking Service** (`frontend/src/shared/services/errorTrackingService.ts`)
   - Frontend error collection and reporting
   - Offline error queuing and batch reporting
   - Error classification and context building

2. **Unified Error Boundary** (`frontend/src/shared/ui/layout/UnifiedErrorBoundary.tsx`)
   - Enhanced React error boundary with error tracking
   - User-friendly error recovery interface
   - Error reporting capabilities

3. **Error Tracking Hooks** (integrated into error tracking service)
   - React hooks for error tracking in components
   - Tenant and user context integration
   - Performance and validation error tracking

## Error Classification

### Severity Levels

- **CRITICAL**: System-breaking errors that require immediate attention
- **HIGH**: Serious errors that affect functionality
- **MEDIUM**: Moderate errors that impact user experience
- **LOW**: Minor errors with minimal impact

### Error Categories

- **AUTHENTICATION**: Login and authentication failures
- **AUTHORIZATION**: Permission and access control errors
- **VALIDATION**: Input validation and data format errors
- **DATABASE**: Database connection and query errors
- **NETWORK**: Network connectivity and API errors
- **BUSINESS_LOGIC**: Application logic and workflow errors
- **SYSTEM**: System-level and infrastructure errors
- **SECURITY**: Security-related errors and violations
- **PERFORMANCE**: Performance issues and bottlenecks
- **USER_INPUT**: User interaction and input errors
- **FRONTEND**: Frontend-specific errors and component failures

## Usage Examples

### Backend Error Handling

```javascript
import { unifiedErrorService, createError } from '../services/unifiedErrorService.js';

// Create and handle errors
const error = createError('Database connection failed', {
  code: 'DATABASE_CONNECTION_ERROR',
  statusCode: 500,
  severity: 'HIGH',
  category: 'DATABASE',
  tenantId: req.tenant?.id,
  userId: req.user?.userId
});

await unifiedErrorService.handleError(error, {
  correlationId: req.id,
  requestId: req.id,
  metadata: { operation: 'user_login' }
});
```

### Frontend Error Tracking

```typescript
import { useErrorTracking } from '@/shared/services/errorTrackingService';

function MyComponent() {
  const { trackError, trackApiError, trackValidationError } = useErrorTracking();

  const handleSubmit = async (data) => {
    try {
      // Validate data
      if (!data.email) {
        trackValidationError('Email is required', 'email', data.email);
        return;
      }

      // Make API call
      await apiClient.post('/api/users', data);
    } catch (error) {
      trackApiError(error, '/api/users', 'POST', error.status);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Error Boundary Usage

```tsx
import { UnifiedErrorBoundary } from '@/shared/ui/layout/UnifiedErrorBoundary';

function App() {
  return (
    <UnifiedErrorBoundary componentName="App">
      <MyApp />
    </UnifiedErrorBoundary>
  );
}
```

## API Endpoints

### Error Tracking

#### POST `/api/errors/track`
Receive frontend error reports

**Request Body:**
```json
{
  "errors": [
    {
      "message": "Component render failed",
      "code": "COMPONENT_ERROR",
      "severity": "HIGH",
      "category": "FRONTEND",
      "stack": "...",
      "metadata": { "component": "UserProfile" }
    }
  ],
  "sessionId": "session_123",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### GET `/api/errors/stats`
Get error statistics and trends

**Query Parameters:**
- `tenantId`: Filter by tenant (optional)
- `dateRange`: 1h, 24h, 7d, 30d (default: 24h)

#### GET `/api/errors/health`
Get error health status

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "criticalErrors": 0,
    "highErrors": 2,
    "totalErrors": 45,
    "errorRates": {
      "authentication": 5,
      "database": 2,
      "validation": 15
    }
  }
}
```

## Error Response Format

All errors follow a consistent response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": "Technical details (development only)"
  },
  "meta": {
    "requestId": "req_123",
    "correlationId": "corr_456",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Database Schema

### Error Logs Table

```sql
CREATE TABLE system.error_logs (
    id SERIAL PRIMARY KEY,
    error_code VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(50),
    user_id VARCHAR(50),
    correlation_id VARCHAR(100),
    request_id VARCHAR(100),
    metadata JSONB,
    stack_trace TEXT,
    user_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Monitoring and Alerting

### Error Rate Monitoring

- **Critical Errors**: Immediate alerts for any critical errors
- **High Error Rate**: Alerts when error rate exceeds 10 errors per minute
- **Trend Analysis**: Monitoring error trends over time

### Health Checks

- **Error Health Status**: Overall system health based on error rates
- **Category Analysis**: Error distribution by category
- **Tenant Isolation**: Error tracking per tenant for multi-tenant monitoring

## Performance Considerations

### Error Queue Management

- **Frontend Queuing**: Offline error queuing with batch reporting
- **Database Batching**: Efficient database writes for error storage
- **Index Optimization**: Optimized database indexes for query performance

### Caching Strategy

- **Error Statistics**: Cached error statistics with configurable TTL
- **Health Status**: Cached health status with real-time updates
- **Rate Limiting**: Error reporting rate limiting to prevent abuse

## Security Considerations

### Data Privacy

- **Sensitive Data**: Automatic scrubbing of sensitive information from logs
- **User Context**: Secure handling of user and tenant context
- **Error Details**: Development vs production error detail exposure

### Access Control

- **Tenant Isolation**: Error data isolation between tenants
- **Admin Access**: Restricted access to error statistics and logs
- **API Security**: Authentication and authorization for error tracking endpoints

## Integration Points

### Existing Systems

- **Logger Integration**: Seamless integration with existing pino logger
- **Middleware Compatibility**: Works with existing Express middleware
- **Database Integration**: Uses existing database connection pool

### Future Enhancements

- **External Monitoring**: Integration with external monitoring services
- **Alert Channels**: Slack, email, and webhook alert integrations
- **Error Analytics**: Advanced error pattern analysis and ML insights

## Troubleshooting

### Common Issues

1. **Error Tracking Failures**: Check network connectivity and API endpoint availability
2. **Database Logging Issues**: Verify database connection and table permissions
3. **Frontend Error Boundaries**: Ensure proper error boundary placement in component tree

### Debugging

- **Development Mode**: Enhanced error details in development environment
- **Correlation IDs**: Use correlation IDs to trace errors across services
- **Error Statistics**: Monitor error statistics for pattern identification

## Best Practices

### Error Handling

- **Fail Fast**: Detect and handle errors as early as possible
- **Context Preservation**: Maintain error context throughout the error handling chain
- **User Experience**: Provide meaningful error messages to users

### Logging

- **Structured Logging**: Use structured logging for better analysis
- **Correlation**: Include correlation IDs in all log entries
- **Tenant Context**: Always include tenant context in multi-tenant scenarios

### Monitoring

- **Proactive Monitoring**: Set up alerts before issues become critical
- **Trend Analysis**: Monitor error trends over time for early detection
- **Performance Impact**: Monitor the performance impact of error handling

This unified error and logging system provides a robust foundation for error management, monitoring, and debugging across the entire application stack.
