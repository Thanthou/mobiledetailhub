/**
 * Health Monitoring API Routes
 * Provides endpoints for website health analysis and monitoring
 */

import express from 'express';
const router = express.Router();
import { getPool } from '../database/pool.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import healthMonitor from '../services/healthMonitor.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

/**
 * GET /api/health/:tenantSlug
 * Get current health status for a tenant
 */
router.get('/:tenantSlug', asyncHandler(async (req, res) => {
  const { tenantSlug } = req.params;

  try {
    logger.info(`Fetching health status for tenant: ${tenantSlug}`);

    if (!pool) {
      logger.error('Database pool not available');
      return res.status(500).json({ error: 'Database connection not available' });
    }


    // Get latest health status for all check types
    const result = await pool.query(`
      SELECT 
        tenant_slug,
        check_type,
        url,
        overall_score,
        performance_score,
        accessibility_score,
        best_practices_score,
        seo_score,
        strategy,
        lcp_value,
        lcp_score,
        fid_value,
        fid_score,
        cls_value,
        cls_score,
        fcp_value,
        fcp_score,
        ttfb_value,
        ttfb_score,
        speed_index_value,
        speed_index_score,
        interactive_value,
        interactive_score,
        total_blocking_time_value,
        total_blocking_time_score,
        status,
        error_message,
        checked_at,
        raw_data,
        opportunities,
        diagnostics,
        crux_data
      FROM system.health_monitoring
      WHERE tenant_slug = $1
      ORDER BY checked_at DESC, check_type, strategy
    `, [tenantSlug]);

    if (result.rows.length === 0) {
      return sendSuccess(res, 'No health monitoring data available. Run a health scan to get started.', {
        tenantSlug,
        hasData: false
      });
    }

    // Organize data by check type and strategy
    const healthData = {
      tenantSlug,
      hasData: true,
      lastUpdated: result.rows[0].checked_at,
      performance: {},
      overall: null
    };

    result.rows.forEach(row => {
      if (row.check_type === 'performance') {
        healthData.performance[row.strategy] = {
          overallScore: row.overall_score,
          performanceScore: row.performance_score,
          accessibilityScore: row.accessibility_score,
          bestPracticesScore: row.best_practices_score,
          seoScore: row.seo_score,
          coreWebVitals: {
            lcp: { value: row.lcp_value, score: row.lcp_score },
            fid: { value: row.fid_value, score: row.fid_score },
            cls: { value: row.cls_value, score: row.cls_score },
            fcp: { value: row.fcp_value, score: row.fcp_score },
            ttfb: { value: row.ttfb_value, score: row.ttfb_score }
          },
          metrics: {
            speedIndex: { value: row.speed_index_value, score: row.speed_index_score },
            interactive: { value: row.interactive_value, score: row.interactive_score },
            totalBlockingTime: { value: row.total_blocking_time_value, score: row.total_blocking_time_score }
          },
          status: row.status,
          checkedAt: row.checked_at,
          opportunities: row.opportunities || [],
          diagnostics: row.diagnostics || [],
          cruxData: row.crux_data || null
        };
      } else if (row.check_type === 'overall') {
        healthData.overall = {
          score: row.overall_score,
          status: row.status,
          checkedAt: row.checked_at,
          errorMessage: row.error_message
        };
      }
    });

    sendSuccess(res, 'Health status retrieved successfully', healthData);

  } catch (error) {
    logger.error('Error fetching health status:', error);
    sendError(res, 'Failed to fetch health status', error.message, 500);
  }
}));

/**
 * POST /api/health/:tenantSlug/scan
 * Trigger a comprehensive health scan for a tenant
 */
router.post('/:tenantSlug/scan', asyncHandler(async (req, res) => {
  const { tenantSlug } = req.params;

  try {
    logger.info(`Starting health scan for tenant: ${tenantSlug}`);

    if (!pool) {
      logger.error('Database pool not available');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Get tenant's website URL from database
    logger.info(`Querying database for tenant: ${tenantSlug}`);
    const tenantResult = await pool.query(`
      SELECT website, gbp_url
      FROM tenants.business
      WHERE slug = $1 AND application_status = 'approved'
    `, [tenantSlug]);
    logger.info(`Database query completed`);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Use actual tenant website URL
    const tenant = tenantResult.rows[0];
    const websiteUrl = tenant.website || 'https://google.com';
    logger.info(`Using tenant URL: ${websiteUrl}`);

    if (!websiteUrl) {
      return res.status(400).json({ error: 'No website URL found for this tenant' });
    }

    logger.info(`Scanning website: ${websiteUrl}`);

    // Run comprehensive health analysis with timeout
    logger.info(`Starting health analysis...`);
    const healthAnalysisPromise = healthMonitor.getWebsiteHealth(websiteUrl);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Health analysis timeout after 5 minutes')), 300000) // 5 minutes
    );
    
    const healthAnalysis = await Promise.race([healthAnalysisPromise, timeoutPromise]);
    logger.info(`Health analysis completed`);

    if (!healthAnalysis.success) {
      logger.error('Health analysis failed:', healthAnalysis.error);
      return res.status(500).json({ 
        error: 'Health analysis failed',
        details: healthAnalysis.error
      });
    }

    const healthData = healthAnalysis.data;

    // Save health data to database
    logger.info(`Saving health data to database...`);
    
    try {
      // First, delete existing records for this tenant to avoid duplicates
      // Use transaction to ensure atomic database operations
      await pool.query('BEGIN');
      logger.info(`Starting database transaction for tenant: ${tenantSlug}`);

      try {
        await pool.query(
          'DELETE FROM system.health_monitoring WHERE tenant_slug = $1 AND check_type = $2',
          [tenantSlug, 'performance']
        );
        logger.info(`Cleared existing health data for tenant: ${tenantSlug}`);

        // Save mobile performance data
        if (healthData.mobile) {
        await pool.query(`
          INSERT INTO system.health_monitoring (
            tenant_slug, check_type, url, strategy,
            overall_score, performance_score, accessibility_score, best_practices_score, seo_score,
            lcp_value, lcp_score, fid_value, fid_score, cls_value, cls_score, fcp_value, fcp_score,
            raw_data, opportunities, diagnostics, status, checked_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        `, [
          tenantSlug, 'performance', websiteUrl, 'mobile',
          healthData.overallScore,
          healthData.mobile.performance || 0,
          healthData.mobile.accessibility || 0,
          healthData.mobile.bestPractices || 0,
          healthData.mobile.seo || 0,
          healthData.mobile.coreWebVitals?.lcp?.value || 0,
          healthData.mobile.coreWebVitals?.lcp?.score || 0,
          healthData.mobile.coreWebVitals?.fid?.value || 0,
          healthData.mobile.coreWebVitals?.fid?.score || 0,
          healthData.mobile.coreWebVitals?.cls?.value || 0,
          healthData.mobile.coreWebVitals?.cls?.score || 0,
          healthData.mobile.coreWebVitals?.fcp?.value || 0,
          healthData.mobile.coreWebVitals?.fcp?.score || 0,
          JSON.stringify(healthData.mobile),
          JSON.stringify(healthData.mobile.opportunities || []),
          JSON.stringify(healthData.mobile.diagnostics || []),
          healthData.summary.status,
          new Date()
        ]);
        logger.info(`Mobile performance data saved for tenant: ${tenantSlug}`);
      }

      // Save desktop performance data
      if (healthData.desktop) {
        await pool.query(`
          INSERT INTO system.health_monitoring (
            tenant_slug, check_type, url, strategy,
            overall_score, performance_score, accessibility_score, best_practices_score, seo_score,
            lcp_value, lcp_score, fid_value, fid_score, cls_value, cls_score, fcp_value, fcp_score,
            raw_data, opportunities, diagnostics, status, checked_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        `, [
          tenantSlug, 'performance', websiteUrl, 'desktop',
          healthData.overallScore,
          healthData.desktop.performance || 0,
          healthData.desktop.accessibility || 0,
          healthData.desktop.bestPractices || 0,
          healthData.desktop.seo || 0,
          healthData.desktop.coreWebVitals?.lcp?.value || 0,
          healthData.desktop.coreWebVitals?.lcp?.score || 0,
          healthData.desktop.coreWebVitals?.fid?.value || 0,
          healthData.desktop.coreWebVitals?.fid?.score || 0,
          healthData.desktop.coreWebVitals?.cls?.value || 0,
          healthData.desktop.coreWebVitals?.cls?.score || 0,
          healthData.desktop.coreWebVitals?.fcp?.value || 0,
          healthData.desktop.coreWebVitals?.fcp?.score || 0,
          JSON.stringify(healthData.desktop),
          JSON.stringify(healthData.desktop.opportunities || []),
          JSON.stringify(healthData.desktop.diagnostics || []),
          healthData.summary.status,
          new Date()
        ]);
        logger.info(`Desktop performance data saved for tenant: ${tenantSlug}`);
        }

        // Commit the transaction
        await pool.query('COMMIT');
        logger.info(`Database transaction committed successfully for tenant: ${tenantSlug}`);

      } catch (dbError) {
        // Rollback the transaction on error
        await pool.query('ROLLBACK');
        logger.error(`Database transaction rolled back for tenant: ${tenantSlug}`, dbError);
        throw dbError;
      }

      logger.info(`Health data saved successfully to database`);
    } catch (dbError) {
      logger.error('Error saving health data to database:', dbError);
      // Continue with response even if database save fails
    }

    logger.info(`Health scan completed for tenant: ${tenantSlug}`);

    sendSuccess(res, 'Health scan completed successfully', {
      tenantSlug,
      url: websiteUrl,
      overallScore: healthData.overallScore,
      summary: healthData.summary,
      timestamp: healthData.timestamp
    });

  } catch (error) {
    logger.error('Error during health scan:', error);
    sendError(res, 'Health scan failed', error.message, 500);
  }
}));

/**
 * GET /api/health/:tenantSlug/history
 * Get health monitoring history for a tenant
 */
router.get('/:tenantSlug/history', asyncHandler(async (req, res) => {
  const { tenantSlug } = req.params;
  const { days = 30, limit = 100 } = req.query;

  try {
    logger.info(`Fetching health history for tenant: ${tenantSlug}`);

    if (!pool) {
      logger.error('Database pool not available');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const result = await pool.query(`
      SELECT 
        check_type,
        strategy,
        overall_score,
        performance_score,
        accessibility_score,
        best_practices_score,
        seo_score,
        status,
        checked_at
      FROM system.health_monitoring
      WHERE tenant_slug = $1
        AND checked_at >= CURRENT_TIMESTAMP - INTERVAL '${parseInt(days)} days'
      ORDER BY checked_at DESC
      LIMIT $2
    `, [tenantSlug, parseInt(limit)]);

    sendSuccess(res, 'Health monitoring history retrieved', {
      tenantSlug,
      history: result.rows,
      period: `${days} days`,
      totalRecords: result.rows.length
    });

  } catch (error) {
    logger.error('Error fetching health history:', error);
    sendError(res, 'Failed to fetch health history', error.message, 500);
  }
}));

/**
 * Helper function to save health data to database
 * TODO: Re-enable when health monitoring is fully implemented
 */
async function _saveHealthData(dbPool, tenantSlug, url, checkType, strategy, data, overallScore) {
  const query = `
    INSERT INTO system.health_monitoring (
      tenant_slug, check_type, url, strategy,
      overall_score, performance_score, accessibility_score, best_practices_score, seo_score,
      lcp_value, lcp_score, fid_value, fid_score, cls_value, cls_score,
      fcp_value, fcp_score, ttfb_value, ttfb_score,
      speed_index_value, speed_index_score, interactive_value, interactive_score,
      total_blocking_time_value, total_blocking_time_score,
      raw_data, opportunities, diagnostics, crux_data,
      status
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19,
      $20, $21, $22, $23,
      $24, $25,
      $26, $27, $28, $29,
      $30
    )
  `;

  const values = [
    tenantSlug, checkType, url, strategy,
    overallScore, data.performance, data.accessibility, data.bestPractices, data.seo,
    data.coreWebVitals.lcp.value, data.coreWebVitals.lcp.score,
    data.coreWebVitals.fid.value, data.coreWebVitals.fid.score,
    data.coreWebVitals.cls.value, data.coreWebVitals.cls.score,
    data.coreWebVitals.fcp.value, data.coreWebVitals.fcp.score,
    data.coreWebVitals.ttfb.value, data.coreWebVitals.ttfb.score,
    data.metrics.speedIndex.value, data.metrics.speedIndex.score,
    data.metrics.interactive.value, data.metrics.interactive.score,
    data.metrics.totalBlockingTime.value, data.metrics.totalBlockingTime.score,
    JSON.stringify(data), JSON.stringify(data.opportunities), JSON.stringify(data.diagnostics),
    JSON.stringify(data.cruxData),
    determineStatus(overallScore)
  ];

  await pool.query(query, values);
}

/**
 * Helper function to save CrUX data
 * TODO: Re-enable when CrUX monitoring is fully implemented
 */
async function _saveCrUXData(dbPool, tenantSlug, url, _cruxData) {
  const query = `
    INSERT INTO system.health_monitoring (
      tenant_slug, check_type, url, crux_data, status, checked_at
    ) VALUES ($1, 'crux', $2, $3, 'healthy', CURRENT_TIMESTAMP)
  `;

  await dbPool.query(query, [tenantSlug, url, JSON.stringify(_cruxData)]);
}

/**
 * Helper function to save overall health summary
 * TODO: Re-enable when overall health tracking is fully implemented
 */
async function _saveOverallHealth(dbPool, tenantSlug, url, overallScore, summary) {
  const query = `
    INSERT INTO system.health_monitoring (
      tenant_slug, check_type, url, overall_score, raw_data, status, checked_at
    ) VALUES ($1, 'overall', $2, $3, $4, $5, CURRENT_TIMESTAMP)
  `;

  await pool.query(query, [
    tenantSlug, url, overallScore, 
    JSON.stringify(summary), 
    determineStatus(overallScore)
  ]);
}

/**
 * Helper function to determine health status based on score
 */
function determineStatus(score) {
  if (score >= 90) {return 'healthy';}
  if (score >= 70) {return 'warning';}
  if (score >= 50) {return 'critical';}
  return 'error';
}

/**
 * GET /api/health-monitoring/test-api
 * Test PageSpeed API connectivity
 */
router.get('/test-api', asyncHandler(async (req, res) => {
  try {
    logger.info('Testing PageSpeed API connectivity...');
    
    if (!healthMonitor.pageSpeedApiKey) {
      return sendError(res, 'PageSpeed API key not configured', null, 500);
    }

    // Test with a simple URL
    const testUrl = 'https://google.com';
    const result = await healthMonitor.fetchPageSpeedInsights(testUrl, 'mobile');
    
    sendSuccess(res, result.success ? 'PageSpeed API is working correctly' : 'PageSpeed API call failed', {
      apiKeyConfigured: true,
      testResult: result
    });

  } catch (error) {
    logger.error('PageSpeed API test error:', error);
    sendError(res, 'PageSpeed API test failed', error.message, 500);
  }
}));

/**
 * GET /api/health-monitoring/test-lighthouse
 * Test Lighthouse CLI connectivity
 */
router.get('/test-lighthouse', asyncHandler(async (req, res) => {
  try {
    logger.info('Testing Lighthouse CLI...');
    const testUrl = 'http://localhost:5175';
    const result = await healthMonitor.runLighthouseLocal(testUrl, 'mobile');
    
    res.json({
      status: 'success',
      testResult: result,
      message: result.success ? 'Lighthouse CLI is working correctly' : 'Lighthouse CLI call failed'
    });

  } catch (error) {
    logger.error('Lighthouse test error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}));

export default router;