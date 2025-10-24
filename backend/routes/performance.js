/**
 * Performance Metrics API
 * Provides performance and monitoring data for admin dashboard
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as perfMonitor from '../utils/perfMonitor.js';
import { createModuleLogger } from '../config/logger.js';

const router = express.Router();
const logger = createModuleLogger('performanceRoutes');

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    const error = new Error('Admin access required');
    error.statusCode = 403;
    throw error;
  }
  next();
};

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * GET /api/performance/summary
 * Get overall performance summary
 */
router.get('/summary', asyncHandler(async (req, res) => {
  const summary = perfMonitor.getSummary();

  logger.info({
    event: 'performance_summary_requested',
    userId: req.user.userId
  }, 'Performance summary accessed');

  res.json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /api/performance/routes
 * Get performance stats for all routes
 */
router.get('/routes', asyncHandler(async (req, res) => {
  const { sortBy = 'impact', limit = 50 } = req.query;
  
  let stats = perfMonitor.getAllStats();

  // Apply sorting
  switch (sortBy) {
    case 'duration':
      stats.sort((a, b) => b.avgDuration - a.avgDuration);
      break;
    case 'count':
      stats.sort((a, b) => b.count - a.count);
      break;
    case 'errors':
      stats.sort((a, b) => b.errorCount - a.errorCount);
      break;
    case 'impact':
    default:
      // Already sorted by impact (count * avgDuration)
      break;
  }

  // Apply limit
  if (limit) {
    stats = stats.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    data: stats,
    meta: {
      total: perfMonitor.getAllStats().length,
      returned: stats.length,
      sortBy,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * GET /api/performance/route/:method/:route
 * Get performance stats for a specific route
 */
router.get('/route/:method/*', asyncHandler(async (req, res) => {
  const method = req.params.method.toUpperCase();
  const route = '/' + req.params[0];

  const stats = perfMonitor.getRouteStats(method, route);

  if (!stats) {
    const error = new Error('Route statistics not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /api/performance/recent
 * Get performance metrics for recent requests (default: last 5 minutes)
 */
router.get('/recent', asyncHandler(async (req, res) => {
  const { minutes = 5 } = req.query;
  const recentStats = perfMonitor.getRecentMetrics(parseInt(minutes));

  res.json({
    success: true,
    data: recentStats,
    meta: {
      timeWindow: `${minutes} minutes`,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * GET /api/performance/slow-requests
 * Get routes with slow request warnings
 */
router.get('/slow-requests', asyncHandler(async (req, res) => {
  const allStats = perfMonitor.getAllStats();
  
  const slowRoutes = allStats
    .filter(s => s.slowRequestCount > 0)
    .sort((a, b) => b.slowRequestRate - a.slowRequestRate)
    .map(s => ({
      method: s.method,
      route: s.route,
      avgDuration: s.avgDuration,
      maxDuration: s.maxDuration,
      slowRequestCount: s.slowRequestCount,
      slowRequestRate: s.slowRequestRate,
      totalRequests: s.count
    }));

  res.json({
    success: true,
    data: slowRoutes,
    meta: {
      threshold: perfMonitor.CONFIG.SLOW_REQUEST_THRESHOLD,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * GET /api/performance/errors
 * Get routes with high error rates
 */
router.get('/errors', asyncHandler(async (req, res) => {
  const allStats = perfMonitor.getAllStats();
  
  const errorRoutes = allStats
    .filter(s => s.errorCount > 0)
    .sort((a, b) => b.errorRate - a.errorRate)
    .map(s => ({
      method: s.method,
      route: s.route,
      errorCount: s.errorCount,
      errorRate: s.errorRate,
      totalRequests: s.count
    }));

  res.json({
    success: true,
    data: errorRoutes,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /api/performance/reset
 * Reset all performance metrics (admin only, use with caution)
 */
router.post('/reset', asyncHandler(async (req, res) => {
  perfMonitor.resetMetrics();

  logger.info({
    event: 'performance_metrics_reset',
    userId: req.user.userId,
    userEmail: req.user.email
  }, 'Performance metrics manually reset');

  res.json({
    success: true,
    message: 'Performance metrics reset successfully',
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /api/performance/config
 * Get current performance monitoring configuration
 */
router.get('/config', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      slowRequestThreshold: perfMonitor.CONFIG.SLOW_REQUEST_THRESHOLD,
      maxSamples: perfMonitor.CONFIG.MAX_SAMPLES,
      percentiles: perfMonitor.CONFIG.PERCENTILES
    },
    timestamp: new Date().toISOString()
  });
}));

export default router;

