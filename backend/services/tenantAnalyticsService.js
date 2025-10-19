/**
 * Tenant Analytics Service
 * 
 * Provides aggregated analytics data for tenant dashboards.
 * Combines data from multiple sources: bookings, reviews, performance metrics, etc.
 */

import { getPool } from '../database/pool.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('tenantAnalyticsService');

/**
 * Get comprehensive tenant dashboard analytics
 * @param {string} tenantId - Tenant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Dashboard analytics data
 */
async function getTenantDashboardAnalytics(tenantId, options = {}) {
  const {
    dateRange = '30d', // 7d, 30d, 90d, 1y
    includeDetails = false
  } = options;

  try {
    logger.info('Fetching tenant dashboard analytics', { tenantId, dateRange });

    // Calculate date range
    const dateFilter = getDateFilter(dateRange);
    
    // Execute all analytics queries in parallel
    const [
      basicStats,
      reviewStats,
      performanceStats,
      recentActivity,
      serviceStats
    ] = await Promise.all([
      getBasicTenantStats(tenantId, dateFilter),
      getReviewAnalytics(tenantId, dateFilter),
      getPerformanceAnalytics(tenantId, dateFilter),
      getRecentActivity(tenantId, dateFilter),
      getServiceAnalytics(tenantId, dateFilter)
    ]);

    // Combine all analytics data
    const dashboardData = {
      tenant: {
        id: tenantId,
        dateRange,
        generatedAt: new Date().toISOString()
      },
      overview: basicStats,
      reviews: reviewStats,
      performance: performanceStats,
      activity: recentActivity,
      services: serviceStats,
      summary: generateSummary(basicStats, reviewStats, performanceStats)
    };

    logger.info('Tenant dashboard analytics generated successfully', { 
      tenantId, 
      dateRange,
      dataPoints: Object.keys(dashboardData).length 
    });

    return dashboardData;

  } catch (error) {
    logger.error('Error generating tenant dashboard analytics', { 
      tenantId, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * Get basic tenant statistics
 */
async function getBasicTenantStats(tenantId, dateFilter) {
  const pool = await getPool();
  
  const query = `
    SELECT 
      b.id,
      b.slug,
      b.business_name,
      b.industry,
      b.application_status,
      b.created_at,
      b.last_activity,
      COUNT(DISTINCT r.id) as total_reviews,
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(DISTINCT CASE WHEN r.created_at >= $2 THEN r.id END) as recent_reviews,
      COUNT(DISTINCT CASE WHEN r.rating >= 4 THEN r.id END) as positive_reviews,
      COUNT(DISTINCT CASE WHEN r.rating <= 2 THEN r.id END) as negative_reviews
    FROM tenants.business b
    LEFT JOIN reputation.reviews r ON r.tenant_slug = b.slug
    WHERE b.id = $1 AND b.application_status = 'approved'
    GROUP BY b.id, b.slug, b.business_name, b.industry, b.application_status, b.created_at, b.last_activity
  `;

  const result = await pool.query(query, [tenantId, dateFilter.startDate]);
  
  if (result.rows.length === 0) {
    throw new Error('Tenant not found or not approved');
  }

  const row = result.rows[0];
  
  return {
    id: row.id,
    slug: row.slug,
    businessName: row.business_name,
    industry: row.industry,
    status: row.application_status,
    createdAt: row.created_at,
    lastActivity: row.last_activity,
    totalReviews: parseInt(row.total_reviews),
    averageRating: parseFloat(row.average_rating) || 0,
    recentReviews: parseInt(row.recent_reviews),
    positiveReviews: parseInt(row.positive_reviews),
    negativeReviews: parseInt(row.negative_reviews),
    reviewTrend: calculateReviewTrend(row.recent_reviews, row.total_reviews)
  };
}

/**
 * Get review analytics
 */
async function getReviewAnalytics(tenantId, dateFilter) {
  const pool = await getPool();
  
  // Get tenant slug for review queries
  const tenantQuery = await pool.query('SELECT slug FROM tenants.business WHERE id = $1', [tenantId]);
  if (tenantQuery.rows.length === 0) {
    throw new Error('Tenant not found');
  }
  const tenantSlug = tenantQuery.rows[0].slug;

  // Get review distribution by rating
  const distributionQuery = `
    SELECT 
      rating,
      COUNT(*) as count
    FROM reputation.reviews
    WHERE tenant_slug = $1
    GROUP BY rating
    ORDER BY rating DESC
  `;

  // Get recent reviews with details
  const recentReviewsQuery = `
    SELECT 
      id,
      customer_name,
      rating,
      comment,
      created_at,
      source
    FROM reputation.reviews
    WHERE tenant_slug = $1 AND created_at >= $2
    ORDER BY created_at DESC
    LIMIT 10
  `;

  // Get review trends over time
  const trendsQuery = `
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as review_count,
      AVG(rating) as avg_rating
    FROM reputation.reviews
    WHERE tenant_slug = $1 AND created_at >= $2
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC
    LIMIT 12
  `;

  const [distributionResult, recentResult, trendsResult] = await Promise.all([
    pool.query(distributionQuery, [tenantSlug]),
    pool.query(recentReviewsQuery, [tenantSlug, dateFilter.startDate]),
    pool.query(trendsQuery, [tenantSlug, dateFilter.startDate])
  ]);

  return {
    distribution: distributionResult.rows.map(row => ({
      rating: parseInt(row.rating),
      count: parseInt(row.count)
    })),
    recentReviews: recentResult.rows.map(row => ({
      id: row.id,
      customerName: row.customer_name,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      source: row.source
    })),
    trends: trendsResult.rows.map(row => ({
      month: row.month,
      reviewCount: parseInt(row.review_count),
      averageRating: parseFloat(row.avg_rating) || 0
    }))
  };
}

/**
 * Get performance analytics (website performance, SEO, etc.)
 */
async function getPerformanceAnalytics(tenantId, dateFilter) {
  // For now, return mock performance data
  // TODO: Integrate with actual performance monitoring
  return {
    websitePerformance: {
      pageLoadTime: 2.3,
      mobileScore: 85,
      desktopScore: 92,
      coreWebVitals: {
        lcp: 2.1,
        fid: 45,
        cls: 0.05
      }
    },
    seoScore: {
      overall: 78,
      technical: 85,
      content: 72,
      backlinks: 65
    },
    socialMedia: {
      facebook: { followers: 1250, engagement: 4.2 },
      instagram: { followers: 890, engagement: 6.8 },
      google: { reviews: 45, rating: 4.6 }
    }
  };
}

/**
 * Get recent activity summary
 */
async function getRecentActivity(tenantId, dateFilter) {
  const pool = await getPool();
  
  // Get tenant slug
  const tenantQuery = await pool.query('SELECT slug FROM tenants.business WHERE id = $1', [tenantId]);
  if (tenantQuery.rows.length === 0) {
    throw new Error('Tenant not found');
  }
  const tenantSlug = tenantQuery.rows[0].slug;

  // Get recent reviews
  const reviewsQuery = `
    SELECT 
      'review' as type,
      customer_name as title,
      rating,
      created_at,
      'New review received' as description
    FROM reputation.reviews
    WHERE tenant_slug = $1 AND created_at >= $2
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const result = await pool.query(reviewsQuery, [tenantSlug, dateFilter.startDate]);

  return {
    activities: result.rows.map(row => ({
      type: row.type,
      title: row.title,
      description: row.description,
      rating: row.rating,
      timestamp: row.created_at
    })),
    totalActivities: result.rows.length
  };
}

/**
 * Get service analytics
 */
async function getServiceAnalytics(tenantId, dateFilter) {
  const pool = await getPool();
  
  // Get service categories and counts
  const servicesQuery = `
    SELECT 
      service_category,
      COUNT(*) as service_count,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_services
    FROM tenants.services
    WHERE business_id = $1
    GROUP BY service_category
    ORDER BY service_count DESC
  `;

  const result = await pool.query(servicesQuery, [tenantId]);

  return {
    categories: result.rows.map(row => ({
      category: row.service_category,
      totalServices: parseInt(row.service_count),
      activeServices: parseInt(row.active_services)
    })),
    totalServices: result.rows.reduce((sum, row) => sum + parseInt(row.service_count), 0),
    activeServices: result.rows.reduce((sum, row) => sum + parseInt(row.active_services), 0)
  };
}

/**
 * Generate summary insights
 */
function generateSummary(basicStats, reviewStats, performanceStats) {
  const insights = [];
  
  // Review insights
  if (basicStats.averageRating >= 4.5) {
    insights.push({
      type: 'positive',
      category: 'reviews',
      message: `Excellent rating of ${basicStats.averageRating.toFixed(1)} stars!`
    });
  } else if (basicStats.averageRating < 3.0) {
    insights.push({
      type: 'warning',
      category: 'reviews',
      message: `Rating of ${basicStats.averageRating.toFixed(1)} stars needs improvement`
    });
  }

  // Activity insights
  if (basicStats.recentReviews > 0) {
    insights.push({
      type: 'info',
      category: 'activity',
      message: `${basicStats.recentReviews} new reviews this period`
    });
  }

  // Performance insights
  if (performanceStats.websitePerformance.mobileScore < 70) {
    insights.push({
      type: 'warning',
      category: 'performance',
      message: 'Mobile performance needs optimization'
    });
  }

  return {
    insights,
    overallHealth: calculateOverallHealth(basicStats, performanceStats),
    recommendations: generateRecommendations(basicStats, reviewStats, performanceStats)
  };
}

/**
 * Calculate overall health score
 */
function calculateOverallHealth(basicStats, performanceStats) {
  let score = 0;
  let factors = 0;

  // Review factor (40% weight)
  if (basicStats.averageRating > 0) {
    score += (basicStats.averageRating / 5) * 40;
    factors += 40;
  }

  // Performance factor (30% weight)
  score += (performanceStats.websitePerformance.mobileScore / 100) * 30;
  factors += 30;

  // Activity factor (30% weight)
  if (basicStats.totalReviews > 0) {
    const activityScore = Math.min(100, (basicStats.totalReviews / 50) * 100);
    score += (activityScore / 100) * 30;
    factors += 30;
  }

  return factors > 0 ? Math.round(score / factors * 100) / 100 : 0;
}

/**
 * Generate recommendations
 */
function generateRecommendations(basicStats, reviewStats, performanceStats) {
  const recommendations = [];

  if (basicStats.averageRating < 4.0) {
    recommendations.push({
      priority: 'high',
      category: 'reviews',
      title: 'Improve Customer Satisfaction',
      description: 'Focus on delivering exceptional service to improve your rating'
    });
  }

  if (performanceStats.websitePerformance.mobileScore < 70) {
    recommendations.push({
      priority: 'medium',
      category: 'performance',
      title: 'Optimize Mobile Performance',
      description: 'Improve page load times and mobile user experience'
    });
  }

  if (basicStats.totalReviews < 10) {
    recommendations.push({
      priority: 'medium',
      category: 'reviews',
      title: 'Encourage More Reviews',
      description: 'Ask satisfied customers to leave reviews to build credibility'
    });
  }

  return recommendations;
}

/**
 * Calculate review trend
 */
function calculateReviewTrend(recentReviews, totalReviews) {
  if (totalReviews === 0) return 'new';
  const ratio = recentReviews / totalReviews;
  if (ratio > 0.3) return 'increasing';
  if (ratio > 0.1) return 'stable';
  return 'decreasing';
}

/**
 * Get date filter for analytics queries
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
  getTenantDashboardAnalytics,
  getBasicTenantStats,
  getReviewAnalytics,
  getPerformanceAnalytics,
  getRecentActivity,
  getServiceAnalytics
};
