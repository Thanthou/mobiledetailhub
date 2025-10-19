/**
 * System Health Check Routes
 * Provides endpoints for system health monitoring (liveness, readiness, etc.)
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = express.Router();
import { getPool } from '../database/pool.js';
import logger from '../utils/logger.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

// Track shutdown status for graceful shutdown
let isShuttingDown = false;

/**
 * GET /api/health
 * Comprehensive health check with database status
 */
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Check database connectivity
    let dbStatus = { connected: false, status: 'Disconnected', queryTime: null, dbTime: null };
    
    try {
      const pool = await getPool();
      const dbStartTime = Date.now();
      const result = await pool.query('SELECT NOW() as current_time');
      const dbEndTime = Date.now();
      
      dbStatus = {
        connected: true,
        status: 'Connected',
        queryTime: `${dbEndTime - dbStartTime}ms`,
        dbTime: result.rows[0].current_time
      };
    } catch (dbError) {
      dbStatus = {
        connected: false,
        status: 'Error',
        queryTime: null,
        dbTime: null,
        error: dbError.message
      };
    }

    const responseTime = Date.now() - startTime;

    sendSuccess(res, 'System health check successful', {
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime(),
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external
      },
      responseTime: `${responseTime}ms`,
      pid: process.pid,
      nodeVersion: process.version,
      shutdown: isShuttingDown
    });

  } catch (error) {
    logger.error('Health check error:', error);
    sendError(res, 'Health check failed', error.message, 500);
  }
});

/**
 * GET /api/health/live
 * Liveness check - always returns 200 if process is responsive
 */
router.get('/live', (req, res) => {
  sendSuccess(res, 'System is alive', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid,
    memory: {
      rss: process.memoryUsage().rss,
      heapUsed: process.memoryUsage().heapUsed
    }
  });
});

/**
 * GET /api/health/ready
 * Readiness check - returns 200 if ready to receive traffic, 503 if not
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if we're shutting down
    if (isShuttingDown) {
      return res.status(503).json({
        status: 'not_ready',
        reason: 'shutting_down',
        timestamp: new Date().toISOString()
      });
    }

    try {
      // Quick database ping
      const pool = await getPool();
      const startTime = Date.now();
      await pool.query('SELECT 1');
      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) { // 5 second timeout
        return res.status(503).json({
          status: 'not_ready',
          reason: 'database_slow',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        });
      }

      sendSuccess(res, 'System is ready', {
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          responseTime: `${responseTime}ms`
        },
        uptime: process.uptime()
      });

    } catch (dbError) {
      return sendError(res, 'Database connection failed', dbError.message, 503);
    }

  } catch (error) {
    logger.error('Readiness check error:', error);
    sendError(res, 'Internal error during readiness check', error.message, 503);
  }
});

/**
 * GET /api/health/db-status
 * Database connection status only
 */
router.get('/db-status', async (req, res) => {
  try {
    const pool = await getPool();
    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    const responseTime = Date.now() - startTime;

    sendSuccess(res, 'Database connection successful', {
      responseTime: `${responseTime}ms`,
      currentTime: result.rows[0].current_time,
      dbVersion: result.rows[0].db_version
    });

  } catch (error) {
    sendError(res, 'Database connection failed', error.message, 503);
  }
});

/**
 * GET /api/health/test-db
 * Simple database connection test
 */
router.get('/test-db', async (req, res) => {
  try {
    const pool = await getPool();
    const startTime = Date.now();
    await pool.query('SELECT 1 as test');
    const responseTime = Date.now() - startTime;

    sendSuccess(res, 'Database connection successful', {
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    sendError(res, 'Database connection failed', error.message, 500);
  }
});

/**
 * Update shutdown status for graceful shutdown
 */
function updateShutdownStatus(shuttingDown) {
  isShuttingDown = shuttingDown;
}

// Export the router and the updateShutdownStatus function
export default router;
export { updateShutdownStatus };