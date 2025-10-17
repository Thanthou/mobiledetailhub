/**
 * Google Reviews API Routes
 * 
 * Fetches reviews from Google Business Profile with mock fallback
 * Supports OAuth integration and graceful degradation
 */

import express from 'express';
import { getGoogleReviews } from '../services/googleApi.js';
import { isDummyTenant } from '../utils/tenantUtils.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/google-reviews/:tenantSlug
 * Fetch Google Business Profile reviews for a tenant
 * Falls back to mock reviews if no OAuth or empty profile
 */
router.get('/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    
    // Validate tenant slug
    if (!tenantSlug || tenantSlug.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Tenant slug is required',
        message: 'Please provide a valid tenant slug'
      });
    }

    logger.info('Fetching Google reviews', { tenantSlug });

    // Attempt to fetch real Google reviews
    const reviews = await getGoogleReviews(tenantSlug);

    // Check if this is the dummy tenant that should show mock reviews
    const isDummy = isDummyTenant(tenantSlug);

    // If no reviews and this is the dummy tenant, use mock data
    if ((!reviews || reviews.length === 0) && isDummy) {
      logger.info('Using mock reviews for dummy tenant', { tenantSlug });
      
      // Import mock data dynamically to avoid startup issues
      const { default: mockReviews } = await import('../mocks/mockReviews.json', {
        assert: { type: 'json' }
      });
      
      return res.json({
        success: true,
        data: mockReviews,
        source: 'mock',
        tenantSlug,
        message: 'Mock reviews returned for dummy tenant'
      });
    }

    // For real tenants with no reviews, return empty array
    if (!reviews || reviews.length === 0) {
      logger.info('No reviews found for tenant', { tenantSlug });
      return res.json({
        success: true,
        data: [],
        source: 'google',
        tenantSlug,
        message: 'No reviews found'
      });
    }

    // Return real Google reviews
    res.json({
      success: true,
      data: reviews,
      source: 'google',
      tenantSlug,
      message: 'Google reviews fetched successfully'
    });

  } catch (error) {
    logger.error('Error fetching Google reviews', { 
      error: error.message, 
      tenantSlug: req.params.tenantSlug 
    });

    try {
      // Only fallback to mock data for dummy tenants
      const isDummy = isDummyTenant(req.params.tenantSlug);
      
      if (isDummy) {
        const { default: mockReviews } = await import('../mocks/mockReviews.json', {
          assert: { type: 'json' }
        });
        
        res.json({
          success: true,
          data: mockReviews,
          source: 'mock',
          tenantSlug: req.params.tenantSlug,
          message: 'Mock reviews returned (error fetching Google reviews)'
        });
      } else {
        // For real tenants, return empty array on error
        res.json({
          success: true,
          data: [],
          source: 'google',
          tenantSlug: req.params.tenantSlug,
          message: 'No reviews available (error fetching Google reviews)'
        });
      }
    } catch (mockError) {
      logger.error('Failed to load mock reviews', { error: mockError.message });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews',
        message: 'Unable to fetch reviews from Google'
      });
    }
  }
});

/**
 * GET /api/google-reviews/:tenantSlug/health
 * Health check for Google Reviews service
 */
router.get('/:tenantSlug/health', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    
    res.json({
      success: true,
      service: 'google-reviews',
      tenantSlug,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      features: {
        googleOAuth: process.env.GOOGLE_OAUTH_CLIENT_ID ? 'configured' : 'not_configured',
        mockFallback: 'enabled'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'google-reviews',
      error: error.message,
      status: 'unhealthy'
    });
  }
});

export default router;
