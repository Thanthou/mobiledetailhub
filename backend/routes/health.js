const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { pool } = require('../database/pool');

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
router.get('/ready', asyncHandler(async (req, res) => {
  let dbReady = false;
  let dbError = null;
  
  try {
    // Quick database ping with 250ms timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database readiness timeout')), 250)
    );
    
    await Promise.race([
      pool.query('SELECT 1'),
      timeoutPromise
    ]);
    
    dbReady = true;
  } catch (error) {
    dbError = error.message;
  }
  
  if (dbReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: true
      }
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: dbError
      }
    });
  }
}));

// Health check route (comprehensive health information)
router.get('/', asyncHandler(async (req, res) => {
  // Test database connection and performance
  let dbConnected = false;
  let queryTime = null;
  let dbTime = null;
  
  try {
    const startTime = Date.now();
    const result = await pool.query('SELECT NOW()');
    queryTime = Date.now() - startTime;
    dbTime = result.rows[0].now;
    dbConnected = true;
  } catch (error) {
    logger.error('Health check database query failed:', { error: error.message });
  }
  
  if (dbConnected) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        status: 'Connected',
        queryTime: `${queryTime}ms`,
        dbTime: dbTime
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
  const result = await pool.query('SELECT NOW()');
  res.json(result.rows[0]);
}));

// Database connection status route
router.get('/db-status', asyncHandler(async (req, res) => {
  let connected = false;
  try {
    await pool.query('SELECT 1');
    connected = true;
  } catch (error) {
    connected = false;
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    connected,
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
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
