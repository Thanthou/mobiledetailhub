/**
 * Tenant Dashboard Controller
 * 
 * Handles HTTP requests for tenant dashboard analytics and aggregated data.
 */

import * as tenantAnalyticsService from '../services/tenantAnalyticsService.js';
import { generateTenantApiResponse, generateTenantErrorResponse } from '../utils/tenantContextContract.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('tenantDashboardController');

/**
 * GET /api/tenants/:tenantSlug/dashboard
 * Get comprehensive dashboard analytics for a tenant
 */
async function getTenantDashboard(req, res) {
  try {
    const { tenantSlug } = req.params;
    const { dateRange = '30d', includeDetails = false } = req.query;

    logger.info('Fetching tenant dashboard', { 
      tenantSlug, 
      dateRange, 
      requestId: req.id 
    });

    // Validate date range
    const validDateRanges = ['7d', '30d', '90d', '1y'];
    if (!validDateRanges.includes(dateRange)) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'INVALID_DATE_RANGE',
        message: 'Invalid date range. Must be one of: 7d, 30d, 90d, 1y'
      }, { requestId: req.id }));
    }

    // Get tenant ID from context (set by withTenant middleware)
    if (!req.tenant || !req.tenant.id) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'NO_TENANT_CONTEXT',
        message: 'Tenant context not available'
      }, { requestId: req.id }));
    }

    const tenantId = req.tenant.id;
    const options = {
      dateRange,
      includeDetails: includeDetails === 'true'
    };

    // Get dashboard analytics
    const dashboardData = await tenantAnalyticsService.getTenantDashboardAnalytics(
      tenantId, 
      options
    );

    // Add request metadata
    dashboardData.meta = {
      requestId: req.id,
      generatedAt: new Date().toISOString(),
      tenantSlug,
      dateRange,
      includeDetails: options.includeDetails
    };

    logger.info('Tenant dashboard generated successfully', { 
      tenantSlug, 
      tenantId,
      requestId: req.id,
      dataPoints: Object.keys(dashboardData).length 
    });

    res.json(generateTenantApiResponse(dashboardData, {
      requestId: req.id,
      tenantSlug,
      dateRange
    }));

  } catch (error) {
    logger.error('Error fetching tenant dashboard', { 
      tenantSlug: req.params.tenantSlug,
      error: error.message,
      requestId: req.id 
    });

    const statusCode = error.statusCode || 500;
    const errorCode = error.code || 'DASHBOARD_ERROR';

    res.status(statusCode).json(generateTenantErrorResponse({
      code: errorCode,
      message: error.message || 'Failed to fetch tenant dashboard'
    }, { requestId: req.id }));
  }
}

/**
 * GET /api/tenants/:tenantSlug/dashboard/overview
 * Get basic tenant overview stats
 */
async function getTenantOverview(req, res) {
  try {
    const { tenantSlug } = req.params;
    const { dateRange = '30d' } = req.query;

    if (!req.tenant || !req.tenant.id) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'NO_TENANT_CONTEXT',
        message: 'Tenant context not available'
      }, { requestId: req.id }));
    }

    const tenantId = req.tenant.id;
    const dateFilter = getDateFilter(dateRange);

    const basicStats = await tenantAnalyticsService.getBasicTenantStats(
      tenantId, 
      dateFilter
    );

    res.json(generateTenantApiResponse(basicStats, {
      requestId: req.id,
      tenantSlug,
      dateRange
    }));

  } catch (error) {
    logger.error('Error fetching tenant overview', { 
      tenantSlug: req.params.tenantSlug,
      error: error.message,
      requestId: req.id 
    });

    res.status(error.statusCode || 500).json(generateTenantErrorResponse({
      code: error.code || 'OVERVIEW_ERROR',
      message: error.message || 'Failed to fetch tenant overview'
    }, { requestId: req.id }));
  }
}

/**
 * GET /api/tenants/:tenantSlug/dashboard/reviews
 * Get detailed review analytics
 */
async function getTenantReviews(req, res) {
  try {
    const { tenantSlug } = req.params;
    const { dateRange = '30d', limit = 10, offset = 0 } = req.query;

    if (!req.tenant || !req.tenant.id) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'NO_TENANT_CONTEXT',
        message: 'Tenant context not available'
      }, { requestId: req.id }));
    }

    const tenantId = req.tenant.id;
    const dateFilter = getDateFilter(dateRange);

    const reviewStats = await tenantAnalyticsService.getReviewAnalytics(
      tenantId, 
      dateFilter
    );

    // Apply pagination to recent reviews
    const paginatedReviews = reviewStats.recentReviews.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );

    const responseData = {
      ...reviewStats,
      recentReviews: paginatedReviews,
      pagination: {
        total: reviewStats.recentReviews.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < reviewStats.recentReviews.length
      }
    };

    res.json(generateTenantApiResponse(responseData, {
      requestId: req.id,
      tenantSlug,
      dateRange
    }));

  } catch (error) {
    logger.error('Error fetching tenant reviews', { 
      tenantSlug: req.params.tenantSlug,
      error: error.message,
      requestId: req.id 
    });

    res.status(error.statusCode || 500).json(generateTenantErrorResponse({
      code: error.code || 'REVIEWS_ERROR',
      message: error.message || 'Failed to fetch tenant reviews'
    }, { requestId: req.id }));
  }
}

/**
 * GET /api/tenants/:tenantSlug/dashboard/performance
 * Get performance analytics
 */
async function getTenantPerformance(req, res) {
  try {
    const { tenantSlug } = req.params;
    const { dateRange = '30d' } = req.query;

    if (!req.tenant || !req.tenant.id) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'NO_TENANT_CONTEXT',
        message: 'Tenant context not available'
      }, { requestId: req.id }));
    }

    const tenantId = req.tenant.id;
    const dateFilter = getDateFilter(dateRange);

    const performanceStats = await tenantAnalyticsService.getPerformanceAnalytics(
      tenantId, 
      dateFilter
    );

    res.json(generateTenantApiResponse(performanceStats, {
      requestId: req.id,
      tenantSlug,
      dateRange
    }));

  } catch (error) {
    logger.error('Error fetching tenant performance', { 
      tenantSlug: req.params.tenantSlug,
      error: error.message,
      requestId: req.id 
    });

    res.status(error.statusCode || 500).json(generateTenantErrorResponse({
      code: error.code || 'PERFORMANCE_ERROR',
      message: error.message || 'Failed to fetch tenant performance'
    }, { requestId: req.id }));
  }
}

/**
 * GET /api/tenants/:tenantSlug/dashboard/activity
 * Get recent activity summary
 */
async function getTenantActivity(req, res) {
  try {
    const { tenantSlug } = req.params;
    const { dateRange = '30d', limit = 20 } = req.query;

    if (!req.tenant || !req.tenant.id) {
      return res.status(400).json(generateTenantErrorResponse({
        code: 'NO_TENANT_CONTEXT',
        message: 'Tenant context not available'
      }, { requestId: req.id }));
    }

    const tenantId = req.tenant.id;
    const dateFilter = getDateFilter(dateRange);

    const activityStats = await tenantAnalyticsService.getRecentActivity(
      tenantId, 
      dateFilter
    );

    // Limit activities
    const limitedActivities = activityStats.activities.slice(0, parseInt(limit));

    const responseData = {
      ...activityStats,
      activities: limitedActivities
    };

    res.json(generateTenantApiResponse(responseData, {
      requestId: req.id,
      tenantSlug,
      dateRange
    }));

  } catch (error) {
    logger.error('Error fetching tenant activity', { 
      tenantSlug: req.params.tenantSlug,
      error: error.message,
      requestId: req.id 
    });

    res.status(error.statusCode || 500).json(generateTenantErrorResponse({
      code: error.code || 'ACTIVITY_ERROR',
      message: error.message || 'Failed to fetch tenant activity'
    }, { requestId: req.id }));
  }
}

/**
 * Helper function to get date filter
 */
function getDateFilter(dateRange) {
  const now = new Date();
  let startDate;

  switch (dateRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    range: dateRange
  };
}

export {
  getTenantDashboard,
  getTenantOverview,
  getTenantReviews,
  getTenantPerformance,
  getTenantActivity
};
