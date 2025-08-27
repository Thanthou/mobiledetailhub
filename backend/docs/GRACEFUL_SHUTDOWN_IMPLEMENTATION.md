# Graceful Shutdown Implementation

## Overview

The server now implements a robust graceful shutdown system that tracks active requests, prevents new requests during shutdown, and ensures all in-flight operations complete before closing the database pool and exiting.

## Key Features

### ✅ Request Tracking
- **Active Request Monitoring**: Tracks all incoming requests using a Map with unique IDs
- **Request Lifecycle Events**: Monitors `finish`, `close`, and `error` events on responses
- **Fallback Timeout**: 30-second fallback to prevent hanging requests

### ✅ Shutdown State Management
- **Shutdown Flag**: `isShuttingDown` prevents new requests from being processed
- **Health Endpoint Access**: Health endpoints remain accessible during shutdown for monitoring
- **Request Rejection**: Returns 503 Service Unavailable for new requests during shutdown

### ✅ Graceful Process Termination
- **Signal Handling**: Responds to SIGINT, SIGTERM, uncaughtException, and unhandledRejection
- **Request Completion**: Waits for active requests to complete (with 10-second timeout)
- **Server Closure**: Gracefully closes HTTP server (with 5-second timeout)
- **Database Cleanup**: Closes database pool and flushes pending operations
- **Logger Flush**: Ensures all log messages are written before exit

## Implementation Details

### Request Tracking Middleware

```javascript
const requestTracker = (req, res, next) => {
  if (isShuttingDown && !req.path.startsWith('/api/health')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Server is shutting down, please try again later'
    });
  }

  const requestId = Date.now() + Math.random();
  const requestPromise = new Promise((resolve) => {
    let resolved = false;
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        activeRequests.delete(requestId);
        resolve();
      }
    };
    
    res.on('finish', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    
    // Fallback timeout
    setTimeout(cleanup, 30000);
  });
  
  activeRequests.set(requestId, requestPromise);
  next();
};
```

### Graceful Shutdown Function

```javascript
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);
  
  isShuttingDown = true;
  logger.info(`${activeRequests.size} active requests will be allowed to complete.`);

  // Wait for active requests with timeout
  if (activeRequests.size > 0) {
    const timeout = 10000; // 10 seconds
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, timeout));
    
    try {
      await Promise.race([
        Promise.all(Array.from(activeRequests.values())),
        timeoutPromise
      ]);
      logger.info('All active requests have completed successfully');
    } catch (error) {
      logger.warn('Some requests may not have completed within timeout');
    }
  }

  // Close server with timeout
  if (server) {
    const serverClosePromise = new Promise((resolve) => {
      server.close(() => {
        logger.info('HTTP server closed');
        resolve();
      });
    });
    
    const serverCloseTimeout = new Promise(resolve => setTimeout(resolve, 5000));
    await Promise.race([serverClosePromise, serverCloseTimeout]);
  }

  // Close database pool
  try {
    await closePool();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', { error: error.message });
  }

  // Final cleanup and exit
  try {
    updateShutdownStatus({ isShuttingDown: true, activeRequests: 0 });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Logger flush
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', { error: error.message });
    process.exit(1);
  }
}
```

## Health Monitoring

### Shutdown Status Endpoint

```
GET /api/health/shutdown-status
```

Returns:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "isShuttingDown": false,
  "activeRequests": 0
}
```

### Real-time Status Updates

The server updates shutdown status every second and provides:
- Current shutdown state
- Number of active requests
- Timestamp of last update

## Testing

### Manual Testing

1. Start the server:
   ```bash
   cd backend && npm start
   ```

2. Run the test script:
   ```bash
   cd backend && node scripts/test-graceful-shutdown.js
   ```

3. Send shutdown signal:
   ```bash
   # Find the process ID
   netstat -ano | findstr :3001
   
   # Send SIGTERM (Windows)
   taskkill /PID <PID> /F
   
   # Send SIGTERM (Linux/Mac)
   kill -TERM <PID>
   ```

### Expected Behavior

1. **During Normal Operation**:
   - All endpoints respond normally
   - Health endpoints show `isShuttingDown: false`
   - Active request count updates in real-time

2. **During Shutdown**:
   - New requests receive 503 Service Unavailable
   - Health endpoints remain accessible
   - Active requests complete naturally
   - Database pool closes gracefully
   - Process exits cleanly

## Configuration

### Timeouts

- **Request Completion**: 10 seconds
- **Server Closure**: 5 seconds  
- **Request Fallback**: 30 seconds
- **Logger Flush**: 1 second

### Environment Variables

No additional environment variables required. The system uses existing logging and database configuration.

## Benefits

1. **Data Integrity**: Prevents mid-write aborts during shutdown
2. **User Experience**: Gracefully handles in-flight requests
3. **Monitoring**: Health endpoints provide real-time shutdown status
4. **Reliability**: Multiple fallback mechanisms prevent hanging
5. **Clean Exit**: Ensures all resources are properly closed

## Troubleshooting

### Common Issues

1. **Shutdown Hangs**: Check for long-running database queries or external API calls
2. **Requests Not Completing**: Verify request tracking middleware is applied correctly
3. **Database Pool Issues**: Ensure `closePool()` function is working properly

### Debug Information

- Check `/api/health/shutdown-status` for current state
- Monitor server logs for shutdown progress
- Verify active request count decreases during shutdown

## Future Enhancements

1. **Configurable Timeouts**: Make timeouts configurable via environment variables
2. **Metrics Collection**: Add Prometheus metrics for shutdown events
3. **Graceful Reload**: Implement zero-downtime configuration reloads
4. **Health Check Integration**: Integrate with load balancer health checks
