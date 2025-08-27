const express = require('express');
const router = express.Router();
const { getConnectionStatus, isConnected, executeQuery } = require('../utils/dbHelper');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { getConnectionHealth } = require('../database/connection');
const { migrationTracker } = require('../utils/migrationTracker');

// Get shutdown status from server.js (will be set by server)
let shutdownStatus = {
  isShuttingDown: false,
  activeRequests: 0
};

// Function to update shutdown status (called from server.js)
const updateShutdownStatus = (status) => {
  shutdownStatus = status;
};



// Liveness endpoint - only checks if process is responsive
// Always returns 200 if event loop is working (for Kubernetes/container orchestration)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    }
  });
});

// Readiness endpoint - checks if service is ready to receive traffic
// Includes database connectivity and migration version checks
router.get('/ready', asyncHandler(async (req, res) => {
  const connectionHealth = getConnectionHealth();
  
  // Check database connectivity
  let dbReady = false;
  let dbError = null;
  let migrationStatus = null;
  
  try {
    if (connectionHealth.connected && connectionHealth.circuitBreaker.state !== 'OPEN') {
      // Test actual database query
      const result = await executeQuery('SELECT NOW() as current_time');
      dbReady = true;
      
      // Get migration status using the tracker
      try {
        await migrationTracker.initialize();
        migrationStatus = await migrationTracker.getStatus();
      } catch (migrationError) {
        logger.warn('Failed to get migration status:', { error: migrationError.message });
        migrationStatus = { currentVersion: 'unknown', isHealthy: false };
      }
    }
  } catch (error) {
    dbError = error.message;
    logger.error('Database readiness check failed:', { error: error.message });
  }
  
  // Service is ready if database is connected and responsive
  const isReady = dbReady && connectionHealth.circuitBreaker.state !== 'OPEN';
  
  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        circuitBreaker: connectionHealth.circuitBreaker.state,
        isReady: true,
        migrationVersion: migrationStatus?.currentVersion || 'unknown',
        migrationStatus: migrationStatus
      },
      service: {
        uptime: process.uptime(),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: connectionHealth.connected,
        circuitBreaker: connectionHealth.circuitBreaker.state,
        isReady: false,
        error: dbError || (connectionHealth.circuitBreaker.state === 'OPEN' ? 'Circuit breaker open' : 'Not connected'),
        migrationVersion: migrationStatus?.currentVersion || 'unknown',
        migrationStatus: migrationStatus
      },
      service: {
        uptime: process.uptime(),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  }
}));

// Health check route (comprehensive health information)
router.get('/', asyncHandler(async (req, res) => {
  // Get comprehensive health information including circuit breaker status
  const dbConnected = await isConnected();
  const connectionStatus = await getConnectionStatus();
  const connectionHealth = getConnectionHealth();
  
  if (dbConnected && connectionHealth.isReady) {
    // Test database query performance
    const startTime = Date.now();
    const dbResult = await executeQuery('SELECT NOW()');
    const queryTime = Date.now() - startTime;
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        status: 'Connected',
        queryTime: `${queryTime}ms`,
        dbTime: dbResult.rows[0].now,
        pool: connectionStatus,
        circuitBreaker: connectionHealth.circuitBreaker
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } else {
    const error = new Error('Database connection not available');
    error.statusCode = 503;
    throw error;
  }
}));

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working', timestamp: new Date().toISOString() });
});

// Test DB connection route
router.get('/test-db', asyncHandler(async (req, res) => {
  const result = await executeQuery('SELECT NOW()');
  res.json(result.rows[0]);
}));

// Database connection status route
router.get('/db-status', asyncHandler(async (req, res) => {
  const status = await getConnectionStatus();
  res.json({
    timestamp: new Date().toISOString(),
    ...status
  });
}));

// Migration status route
router.get('/migrations', asyncHandler(async (req, res) => {
  try {
    await migrationTracker.initialize();
    const status = await migrationTracker.getStatus();
    const history = await migrationTracker.getMigrationHistory(20);
    
    res.json({
      timestamp: new Date().toISOString(),
      status,
      history
    });
  } catch (error) {
    logger.error('Failed to get migration status:', { error: error.message });
    res.status(500).json({
      error: 'Failed to get migration status',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

// Shutdown status endpoint
router.get('/shutdown-status', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    ...shutdownStatus
  });
});

// Export both the router and the updateShutdownStatus function
module.exports = Object.assign(router, { updateShutdownStatus });
