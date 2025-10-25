/**
 * Error Tracking API Routes
 * 
 * Handles frontend error reports and provides error statistics.
 */

import express from 'express';
import { unifiedErrorService } from '../services/unifiedErrorService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createModuleLogger } from '../config/logger.js';
import { getPool } from '../database/pool.js';
import { validateBody } from '../middleware/zodValidation.js';
import { errorTrackingSchemas } from '../schemas/validation/index.js';

const router = express.Router();
const logger = createModuleLogger('errorTrackingRoutes');

/**
 * POST /api/errors/track
 * Receive frontend error reports
 */
router.post('/track', asyncHandler(async (req, res) => {
  try {
    const { errors, sessionId, timestamp } = req.body || {};

    // Be tolerant - if no errors or malformed, just acknowledge and move on
    if (!errors || !Array.isArray(errors) || errors.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No errors to track',
        processed: 0
      });
    }

    logger.debug('Received frontend error report', {
      sessionId,
      errorCount: errors.length,
      timestamp
    });

    // Process each error
    const processedErrors = [];
    for (const frontendError of errors) {
      try {
        // Convert frontend error to unified error
        const unifiedError = new unifiedErrorService.UnifiedError(frontendError.message, {
          code: frontendError.code,
          statusCode: 500, // Frontend errors are treated as 500
          severity: frontendError.severity?.toLowerCase(),
          category: frontendError.category?.toLowerCase(),
          tenantId: frontendError.tenantId,
          userId: frontendError.userId,
          correlationId: frontendError.correlationId,
          metadata: {
            ...frontendError.metadata,
            frontendError: true,
            sessionId: frontendError.sessionId,
            userAgent: frontendError.userAgent,
            url: frontendError.url,
            stack: frontendError.stack,
            componentStack: frontendError.componentStack
          }
        });

        // Handle the error through unified service
        await unifiedErrorService.handleError(unifiedError, {
          frontendError: true,
          sessionId: frontendError.sessionId
        });

        processedErrors.push({
          id: frontendError.sessionId,
          code: frontendError.code,
          processed: true
        });

      } catch (processError) {
        logger.debug('Failed to process frontend error', {
          frontendError: frontendError.code,
          error: processError.message
        });

        processedErrors.push({
          id: frontendError.sessionId,
          code: frontendError.code,
          processed: false,
          error: processError.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        processed: processedErrors.length,
        errors: processedErrors
      },
      meta: {
        timestamp: new Date().toISOString(),
        sessionId
      }
    });

  } catch (error) {
    logger.error('Failed to process error tracking request', {
      error: error.message,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: {
        code: 'ERROR_TRACKING_FAILED',
        message: 'Failed to process error tracking request'
      }
    });
  }
}));

/**
 * GET /api/errors/stats
 * Get error statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const { tenantId, dateRange = '24h' } = req.query;

    // Calculate date filter
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const pool = await getPool();
    
    // Build query with optional tenant filter
    let query = `
      SELECT 
        error_category,
        severity,
        COUNT(*) as count,
        COUNT(DISTINCT tenant_id) as tenant_count,
        COUNT(DISTINCT user_id) as user_count
      FROM system.error_logs
      WHERE created_at >= $1
    `;
    
    const queryParams = [startDate];
    
    if (tenantId) {
      query += ` AND tenant_id = $2`;
      queryParams.push(tenantId);
    }
    
    query += ` GROUP BY error_category, severity ORDER BY count DESC`;

    const result = await pool.query(query, queryParams);

    // Get recent errors
    let recentQuery = `
      SELECT 
        error_code,
        error_message,
        error_category,
        severity,
        tenant_id,
        user_id,
        created_at
      FROM system.error_logs
      WHERE created_at >= $1
    `;
    
    const recentParams = [startDate];
    
    if (tenantId) {
      recentQuery += ` AND tenant_id = $2`;
      recentParams.push(tenantId);
    }
    
    recentQuery += ` ORDER BY created_at DESC LIMIT 20`;

    const recentResult = await pool.query(recentQuery, recentParams);

    // Get error trends (hourly for last 24h)
    const trendsQuery = `
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        error_category,
        COUNT(*) as count
      FROM system.error_logs
      WHERE created_at >= $1
    `;
    
    const trendsParams = [startDate];
    
    if (tenantId) {
      trendsQuery += ` AND tenant_id = $2`;
      trendsParams.push(tenantId);
    }
    
    trendsQuery += ` GROUP BY DATE_TRUNC('hour', created_at), error_category ORDER BY hour DESC`;

    const trendsResult = await pool.query(trendsQuery, trendsParams);

    // Get service-level stats
    const serviceStats = unifiedErrorService.getErrorStats();

    res.json({
      success: true,
      data: {
        summary: {
          totalErrors: result.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          uniqueTenants: new Set(result.rows.map(row => row.tenant_count)).size,
          uniqueUsers: new Set(result.rows.map(row => row.user_count)).size,
          dateRange,
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        },
        byCategory: result.rows.reduce((acc, row) => {
          if (!acc[row.error_category]) {
            acc[row.error_category] = {};
          }
          acc[row.error_category][row.severity] = parseInt(row.count);
          return acc;
        }, {}),
        recentErrors: recentResult.rows.map(row => ({
          code: row.error_code,
          message: row.error_message,
          category: row.error_category,
          severity: row.severity,
          tenantId: row.tenant_id,
          userId: row.user_id,
          timestamp: row.created_at
        })),
        trends: trendsResult.rows.map(row => ({
          hour: row.hour,
          category: row.error_category,
          count: parseInt(row.count)
        })),
        serviceStats
      },
      meta: {
        timestamp: new Date().toISOString(),
        tenantId: tenantId || null
      }
    });

  } catch (error) {
    logger.error('Failed to get error statistics', {
      error: error.message,
      query: req.query
    });

    res.status(500).json({
      success: false,
      error: {
        code: 'STATS_ERROR',
        message: 'Failed to get error statistics'
      }
    });
  }
}));

/**
 * GET /api/errors/health
 * Get error health status
 */
router.get('/health', asyncHandler(async (req, res) => {
  try {
    const stats = unifiedErrorService.getErrorStats();
    
    // Determine health status based on error rates
    const criticalErrors = stats.recentErrors.filter(e => e.severity === 'critical').length;
    const highErrors = stats.recentErrors.filter(e => e.severity === 'high').length;
    
    let healthStatus = 'healthy';
    if (criticalErrors > 0) {
      healthStatus = 'critical';
    } else if (highErrors > 5) {
      healthStatus = 'warning';
    } else if (stats.totalErrors > 50) {
      healthStatus = 'degraded';
    }

    res.json({
      success: true,
      data: {
        status: healthStatus,
        criticalErrors,
        highErrors,
        totalErrors: stats.totalErrors,
        errorRates: stats.errorRate,
        lastChecked: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Failed to get error health status', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_ERROR',
        message: 'Failed to get error health status'
      }
    });
  }
}));

export default router;
