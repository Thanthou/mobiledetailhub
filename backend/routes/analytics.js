const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * POST /api/analytics/track
 * Track custom analytics events
 */
router.post('/track', asyncHandler(async (req, res) => {
  try {
    const { event, parameters, userProperties, customDimensions, timestamp } = req.body;
    
    // Validate required fields
    if (!event) {
      return res.status(400).json({
        error: 'Missing required field: event',
        message: 'Event name is required for analytics tracking'
      });
    }

    // Get client information
    const clientInfo = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      timestamp: timestamp || new Date().toISOString()
    };

    // Extract tenant information from domain
    const host = req.get('host');
    let tenantId = null;
    
    if (pool) {
      try {
        const result = await pool.query(`
          SELECT id, slug, business_name
          FROM tenants.business 
          WHERE website_domain = $1 
             OR $1 LIKE '%' || slug || '%'
          ORDER BY approved_date DESC
          LIMIT 1
        `, [host]);
        
        if (result.rows.length > 0) {
          tenantId = result.rows[0].id;
        }
      } catch (dbError) {
        logger.warn('Database error while tracking analytics:', dbError.message);
      }
    }

    // Store analytics event (if database is available)
    if (pool && tenantId) {
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
          tenantId,
          event,
          JSON.stringify(parameters || {}),
          JSON.stringify(userProperties || {}),
          JSON.stringify(customDimensions || {}),
          JSON.stringify(clientInfo),
          new Date()
        ]);
      } catch (dbError) {
        logger.warn('Failed to store analytics event in database:', dbError.message);
      }
    }

    // Log analytics event
    logger.info('Analytics event tracked', {
      event,
      tenantId,
      host,
      parameters: parameters ? Object.keys(parameters).length : 0
    });

    res.status(200).json({
      success: true,
      message: 'Analytics event tracked successfully',
      eventId: Date.now() // Simple event ID for confirmation
    });

  } catch (error) {
    logger.error('Error tracking analytics event:', error);
    res.status(500).json({
      error: 'Failed to track analytics event',
      message: 'Internal server error while processing analytics data'
    });
  }
}));

/**
 * GET /api/analytics/events/:tenantId
 * Get analytics events for a tenant (admin only)
 */
router.get('/events/:tenantId', asyncHandler(async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { limit = 100, offset = 0, eventType } = req.query;

    if (!pool) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Analytics data is not available'
      });
    }

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

  } catch (error) {
    logger.error('Error fetching analytics events:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics events',
      message: 'Internal server error while retrieving analytics data'
    });
  }
}));

/**
 * GET /api/analytics/summary/:tenantId
 * Get analytics summary for a tenant (admin only)
 */
router.get('/summary/:tenantId', asyncHandler(async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { days = 30 } = req.query;

    if (!pool) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Analytics summary is not available'
      });
    }

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

  } catch (error) {
    logger.error('Error generating analytics summary:', error);
    res.status(500).json({
      error: 'Failed to generate analytics summary',
      message: 'Internal server error while processing analytics data'
    });
  }
}));

module.exports = router;
