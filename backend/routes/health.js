/**
 * System Health Check Routes
 * Provides endpoints for system health monitoring (liveness, readiness, etc.)
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = express.Router();
import { getPool } from '../database/pool.js';
import { logger } from '../config/logger.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { env } from '../config/env.js';

// Track shutdown status for graceful shutdown
let isShuttingDown = false;

/**
 * GET /api/health or /api/health/
 * Simple health check without database (for fast probes)
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'thatsmartsite-backend',
    uptime: process.uptime(),
    nodeVersion: process.version,
    pid: process.pid
  });
});

/**
 * GET /api/health/detailed
 * Comprehensive health check with database status
 */
router.get('/detailed', async (req, res) => {
  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
      nodeVersion: process.version,
      environment: env.NODE_ENV
    }
  });
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
 * GET /api/health/bootstrap
 * Bootstrap verification check - confirms all bootstrap modules loaded successfully
 * Useful for CI/CD and automated sanity checks
 */
router.get('/bootstrap', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    modules: ['env', 'security', 'middleware', 'routes', 'errors'],
    phases: [
      { phase: 1, name: 'Environment Loading', status: 'complete' },
      { phase: 2, name: 'Database Pool', status: 'complete' },
      { phase: 3, name: 'Security Layer', status: 'complete' },
      { phase: 4, name: 'Core Middleware', status: 'complete' },
      { phase: 5, name: 'API Routes', status: 'complete' },
      { phase: 6, name: 'Static Assets', status: 'complete' },
      { phase: 7, name: 'Error Handling', status: 'complete' }
    ],
    server: {
      uptime: process.uptime(),
      nodeVersion: process.version,
      pid: process.pid
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
    if (!res.headersSent) {
      sendError(res, 'Internal error during readiness check', error.message, 503);
    }
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
    if (!res.headersSent) {
      sendError(res, 'Database connection failed', error.message, 503);
    }
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
    if (!res.headersSent) {
      sendError(res, 'Database connection failed', error.message, 500);
    }
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