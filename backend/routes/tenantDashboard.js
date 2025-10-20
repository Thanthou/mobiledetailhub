/**
 * Tenant Dashboard Routes
 * 
 * API routes for tenant dashboard analytics and aggregated data.
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { withTenant, validateTenantExists } from '../middleware/withTenant.js';
import { validateTenantAccess, validateTenantApproved, addTenantHeaders, logTenantContext } from '../middleware/tenantValidation.js';
import {
  getTenantDashboard,
  getTenantOverview,
  getTenantReviews,
  getTenantPerformance,
  getTenantActivity
} from '../controllers/tenantDashboardController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Dashboard routes require authentication and tenant context
 */
router.use(authenticateToken);
router.use(withTenant);
router.use(validateTenantExists);
router.use(validateTenantApproved);
router.use(validateTenantAccess);
router.use(addTenantHeaders);
router.use(logTenantContext);

/**
 * GET /api/tenants/:tenantSlug/dashboard
 * Get comprehensive dashboard analytics
 * 
 * Query parameters:
 * - dateRange: 7d, 30d, 90d, 1y (default: 30d)
 * - includeDetails: true/false (default: false)
 * 
 * Response includes:
 * - overview: Basic tenant stats
 * - reviews: Review analytics and trends
 * - performance: Website performance metrics
 * - activity: Recent activity summary
 * - services: Service analytics
 * - summary: Health score and recommendations
 */
router.get('/:tenantSlug/dashboard', asyncHandler(getTenantDashboard));

/**
 * GET /api/tenants/:tenantSlug/dashboard/overview
 * Get basic tenant overview statistics
 * 
 * Query parameters:
 * - dateRange: 7d, 30d, 90d, 1y (default: 30d)
 * 
 * Response includes:
 * - Basic tenant info
 * - Review counts and ratings
 * - Activity metrics
 * - Trend indicators
 */
router.get('/:tenantSlug/dashboard/overview', asyncHandler(getTenantOverview));

/**
 * GET /api/tenants/:tenantSlug/dashboard/reviews
 * Get detailed review analytics
 * 
 * Query parameters:
 * - dateRange: 7d, 30d, 90d, 1y (default: 30d)
 * - limit: Number of recent reviews to return (default: 10)
 * - offset: Pagination offset (default: 0)
 * 
 * Response includes:
 * - Review distribution by rating
 * - Recent reviews with pagination
 * - Review trends over time
 * - Source breakdown
 */
router.get('/:tenantSlug/dashboard/reviews', asyncHandler(getTenantReviews));

/**
 * GET /api/tenants/:tenantSlug/dashboard/performance
 * Get performance analytics
 * 
 * Query parameters:
 * - dateRange: 7d, 30d, 90d, 1y (default: 30d)
 * 
 * Response includes:
 * - Website performance metrics
 * - SEO scores
 * - Social media engagement
 * - Core Web Vitals
 */
router.get('/:tenantSlug/dashboard/performance', asyncHandler(getTenantPerformance));

/**
 * GET /api/tenants/:tenantSlug/dashboard/activity
 * Get recent activity summary
 * 
 * Query parameters:
 * - dateRange: 7d, 30d, 90d, 1y (default: 30d)
 * - limit: Number of activities to return (default: 20)
 * 
 * Response includes:
 * - Recent activities timeline
 * - Activity counts by type
 * - Engagement metrics
 */
router.get('/:tenantSlug/dashboard/activity', asyncHandler(getTenantActivity));

export default router;
