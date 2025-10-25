/**
 * Analytics Routes (Hardened)
 * 
 * Provides analytics event tracking with:
 * - Factory pattern for pool injection (fail fast)
 * - Unified tenant resolution via middleware
 * - Rate limiting to prevent abuse
 * - Ingest key verification
 * - Disk-based queue for resilience
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { logger } from '../config/logger.js';
import { validateBody, validateParams, validateQuery } from '../middleware/zodValidation.js';
import { analyticsSchemas } from '../schemas/validation/index.js';
import { analyticsLimiter } from '../middleware/rateLimiter.js';
import { tenantResolverWithDB } from '../middleware/tenantResolver.js';
import { queueEvent, getQueueSize } from '../utils/analyticsQueue.js';
import { env } from '../config/env.async.js';

/**
 * Create analytics router with injected dependencies
 * @param {object} pool - Database pool instance (required)
 * @returns {Router} Express router
 */
export default function createAnalyticsRouter(pool) {
  if (!pool) {
    throw new Error('Analytics router requires a database pool');
  }

  const router = express.Router();

  /**
   * Middleware: Verify ingest key (simple spam prevention)
   * Optional - only checks if ANALYTICS_INGEST_KEY is set
   */
  const verifyIngestKey = (req, res, next) => {
    const ingestKey = env.ANALYTICS_INGEST_KEY;
    
    // Skip verification if no key is configured
    if (!ingestKey) {
      return next();
    }

    const providedKey = req.get('X-Analytics-Key') || req.body.ingestKey;
    
    if (providedKey !== ingestKey) {
      logger.warn('Invalid analytics ingest key', {
        ip: req.ip,
        host: req.get('host'),
        providedKey: providedKey ? '***' : 'none'
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid or missing ingest key'
      });
    }

    next();
  };

  /**
   * POST /api/analytics/track
   * Track custom analytics events
   */
  router.post('/track',
    analyticsLimiter,
    tenantResolverWithDB(pool),
    verifyIngestKey,
    validateBody(analyticsSchemas.track),
    asyncHandler(async (req, res) => {
      const { event, parameters, userProperties, customDimensions, timestamp } = req.body;
      
      // Validate required fields
      if (!event) {
        const error = new Error('Event name is required for analytics tracking');
        error.statusCode = 400;
        throw error;
      }

      // Get client information
      const clientInfo = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        timestamp: timestamp || new Date().toISOString()
      };

      // Check if tenant was resolved
      const tenantId = req.tenantId;
      
      if (!tenantId) {
        logger.warn('Analytics event without valid tenant', {
          event,
          host: req.get('host'),
          slug: req.tenantSlug
        });
        
        return res.status(202).json({
          success: true,
          message: 'Event recorded (no tenant)',
          queued: false
        });
      }

      // Prepare event data
      const eventData = {
        tenant_id: tenantId,
        event_name: event,
        event_parameters: JSON.stringify(parameters || {}),
        user_properties: JSON.stringify(userProperties || {}),
        custom_dimensions: JSON.stringify(customDimensions || {}),
        client_info: JSON.stringify(clientInfo),
        created_at: new Date()
      };

      // Try to store in database
      try {
        await pool.query(`
          INSERT INTO analytics.events (
            tenant_id,
            event_name,
            event_parameters,
            user_properties,
            custom_dimensions,
            client_info,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          eventData.tenant_id,
          eventData.event_name,
          eventData.event_parameters,
          eventData.user_properties,
          eventData.custom_dimensions,
          eventData.client_info,
          eventData.created_at
        ]);

        logger.info('Analytics event tracked', {
          event,
          tenantId,
          host: req.get('host'),
          parameters: parameters ? Object.keys(parameters).length : 0
        });

        res.status(200).json({
          success: true,
          message: 'Analytics event tracked successfully',
          queued: false
        });
      } catch (dbError) {
        // Database failed - queue event to disk for later processing
        logger.warn('Database unavailable, queuing analytics event', {
          error: dbError.message,
          event,
          tenantId
        });

        const queued = queueEvent(eventData);
        
        res.status(202).json({
          success: true,
          message: 'Event queued for processing',
          queued,
          queueSize: queued ? getQueueSize() : undefined
        });
      }
    })
  );

  /**
   * GET /api/analytics/events/:tenantId
   * Get analytics events for a tenant (admin only)
   */
  router.get('/events/:tenantId', 
    validateParams(analyticsSchemas.getEvents.pick({ tenantId: true })),
    validateQuery(analyticsSchemas.getEvents.omit({ tenantId: true })),
    authenticateToken, 
    requireAdmin, 
    asyncHandler(async (req, res) => {
      const { tenantId } = req.params;
      const { limit = 100, offset = 0, eventType } = req.query;

      // Log admin access to analytics data
      logger.info('Admin analytics access', {
        userId: req.user.userId,
        email: req.user.email,
        tenantId,
        eventType,
        limit,
        offset,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      let query = `
        SELECT 
          id,
          event_name,
          event_parameters,
          user_properties,
          custom_dimensions,
          client_info,
          created_at
        FROM analytics.events
        WHERE tenant_id = $1
      `;
      
      const queryParams = [tenantId];
      
      if (eventType) {
        query += ` AND event_name = $${queryParams.length + 1}`;
        queryParams.push(eventType);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, queryParams);

      res.json({
        success: true,
        events: result.rows,
        total: result.rows.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    })
  );

  /**
   * GET /api/analytics/summary/:tenantId
   * Get analytics summary for a tenant (admin only)
   */
  router.get('/summary/:tenantId', 
    validateParams(analyticsSchemas.getSummary.pick({ tenantId: true })),
    validateQuery(analyticsSchemas.getSummary.omit({ tenantId: true })),
    authenticateToken, 
    requireAdmin, 
    asyncHandler(async (req, res) => {
      const { tenantId } = req.params;
      const { days = 30 } = req.query;

      // Log admin access to analytics summary
      logger.info('Admin analytics summary access', {
        userId: req.user.userId,
        email: req.user.email,
        tenantId,
        days,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      const result = await pool.query(`
        SELECT 
          event_name,
          COUNT(*) as event_count,
          COUNT(DISTINCT client_info->>'ip') as unique_visitors,
          DATE_TRUNC('day', created_at) as date
        FROM analytics.events
        WHERE tenant_id = $1 
          AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
        GROUP BY event_name, DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `, [tenantId]);

      // Process results into summary format
      const summary = {
        totalEvents: 0,
        uniqueVisitors: 0,
        eventsByType: {},
        eventsByDay: {},
        dateRange: {
          start: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        }
      };

      result.rows.forEach(row => {
        summary.totalEvents += parseInt(row.event_count);
        summary.uniqueVisitors += parseInt(row.unique_visitors);
        
        // Events by type
        if (!summary.eventsByType[row.event_name]) {
          summary.eventsByType[row.event_name] = 0;
        }
        summary.eventsByType[row.event_name] += parseInt(row.event_count);
        
        // Events by day
        const date = row.date.toISOString().split('T')[0];
        if (!summary.eventsByDay[date]) {
          summary.eventsByDay[date] = 0;
        }
        summary.eventsByDay[date] += parseInt(row.event_count);
      });

      res.json({
        success: true,
        summary,
        days: parseInt(days)
      });
    })
  );

  /**
   * GET /api/analytics/queue/status
   * Get queue status (admin only, for monitoring)
   */
  router.get('/queue/status',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const queueSize = getQueueSize();
      
      res.json({
        success: true,
        queueSize,
        queueFile: 'backend/logs/analytics-queue.jsonl'
      });
    })
  );

  return router;
}

