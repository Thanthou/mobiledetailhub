/**
 * Google Reviews API Routes
 * 
 * Fetches reviews from Google Business Profile with mock fallback
 * Supports OAuth integration and graceful degradation
 */

import express from 'express';
import { getGoogleReviews } from '../services/googleApi.js';
import { isDummyTenant } from '../utils/tenantUtils.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseFormatter.js';

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
        status: 'error',
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
      
      return sendSuccess(res, 'Mock reviews returned for dummy tenant', {
        reviews: mockReviews,
        source: 'mock',
        tenantSlug
      });
    }

    // For real tenants with no reviews, return empty array
    if (!reviews || reviews.length === 0) {
      logger.info('No reviews found for tenant', { tenantSlug });
      return sendSuccess(res, 'No reviews found', {
        reviews: [],
        source: 'google',
        tenantSlug
      });
    }

    // Return real Google reviews
    sendSuccess(res, 'Google reviews fetched successfully', {
      reviews: reviews,
      source: 'google',
      tenantSlug
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
        
        sendSuccess(res, 'Mock reviews returned (error fetching Google reviews)', {
          reviews: mockReviews,
          source: 'mock',
          tenantSlug: req.params.tenantSlug
        });
      } else {
        // For real tenants, return empty array on error
        sendSuccess(res, 'No reviews available (error fetching Google reviews)', {
          reviews: [],
          source: 'google',
          tenantSlug: req.params.tenantSlug
        });
      }
    } catch (mockError) {
      logger.error('Failed to load mock reviews', { error: mockError.message });
      res.status(500).json({
        status: 'error',
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
    
    sendSuccess(res, 'Google Reviews service is healthy', {
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
      status: 'error',
      service: 'google-reviews',
      error: error.message,
      status: 'unhealthy'
    });
  }
});

export default router;
