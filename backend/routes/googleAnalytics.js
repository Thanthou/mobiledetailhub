import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../config/logger.js';
import { getPool } from '../database/pool.js';
import { env } from '../config/env.js';
import * as analyticsService from '../services/googleAnalytics.js';

const router = express.Router();

/**
 * Google Analytics OAuth Routes
 * Handles OAuth flow for GA4 integration
 */

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Google Analytics routes are working!', timestamp: new Date().toISOString() });
});

/**
 * GET /api/google/analytics/auth
 * Initiates OAuth flow by redirecting to Google's consent screen
 */
router.get('/auth', asyncHandler(async (req, res) => {
  logger.info('Google Analytics auth route called');
  try {
    // Get tenant_id from session or query params
    const tenantId = req.query.tenant_id || req.user?.tenant_id;
    logger.info('Tenant ID:', tenantId);
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
        message: 'Please provide a tenant_id parameter'
      });
    }

    // Verify tenant exists and is approved
    const tenantResult = await pool.query(
      'SELECT id, slug FROM tenants.business WHERE id = $1 AND application_status = $2',
      [tenantId, 'approved']
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'Tenant not found or not approved'
      });
    }

    // Build OAuth URL
    logger.info('Environment variables:', {
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI || 'MISSING'
    });
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', `${env.GOOGLE_REDIRECT_URI.replace('/oauth/callback', '/analytics/callback')}`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage'
    ].join(' '));
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', tenantId); // Pass tenant_id in state for callback

    logger.info('Redirecting tenant to Google Analytics OAuth', {
      tenantId,
      authUrl: authUrl.toString()
    });

    res.redirect(authUrl.toString());

  } catch (error) {
    logger.error('Error initiating Google Analytics OAuth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate OAuth flow',
      message: error.message
    });
  }
}));

/**
 * GET /api/google/analytics/callback
 * Handles OAuth callback from Google and exchanges code for tokens
 */
router.get('/callback', asyncHandler(async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
      logger.error('Google Analytics OAuth error:', { error, state });
      return res.status(400).json({
        success: false,
        error: 'OAuth authorization failed',
        message: `Google OAuth error: ${error}`
      });
    }

    // Validate required parameters
    if (!code || !state) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'Authorization code and state are required'
      });
    }

    const tenantId = state;

    // Verify tenant exists
    const tenantResult = await pool.query(
      'SELECT id, slug, business_name FROM tenants.business WHERE id = $1 AND application_status = $2',
      [tenantId, 'approved']
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'Tenant not found or not approved'
      });
    }

    const tenant = tenantResult.rows[0];

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${env.GOOGLE_REDIRECT_URI.replace('/oauth/callback', '/analytics/callback')}`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error('Failed to exchange code for tokens:', {
        status: tokenResponse.status,
        error: errorData
      });
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Get user's GA properties to find the default one
    let propertyId = null; // Will be set to actual property ID if found
    
    try {
      const propertiesResponse = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accounts',
        {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        }
      );

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        
        // For now, we'll store the first property found
        // In a real implementation, you might want to let users choose
        if (propertiesData.accounts && propertiesData.accounts.length > 0) {
          const account = propertiesData.accounts[0];
          propertyId = account.name; // This will be in format "accounts/123456789"
        }
      } else {
        logger.warn('Failed to fetch GA properties, using default property ID:', {
          status: propertiesResponse.status
        });
      }
    } catch (propertyError) {
      logger.warn('Error fetching GA properties, using default property ID:', propertyError);
    }

    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    // Store tokens in database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete existing tokens for this tenant
      await client.query(
        'DELETE FROM analytics.google_analytics_tokens WHERE tenant_id = $1',
        [tenantId]
      );

      // Insert new tokens with service information
      await client.query(
        `INSERT INTO analytics.google_analytics_tokens 
         (tenant_id, access_token, refresh_token, property_id, expires_at, service_type, scopes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          tenantId,
          tokenData.access_token,
          tokenData.refresh_token || null,
          propertyId,
          expiresAt,
          'unified_google_services', // Service type
          [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/business.manage',
            'https://www.googleapis.com/auth/plus.business.manage'
          ] // Granted scopes
        ]
      );

      await client.query('COMMIT');

      logger.info('Google Analytics tokens stored successfully', {
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        businessName: tenant.business_name,
        propertyId
      });

      // Redirect back to tenant dashboard with success message
      res.redirect(`${env.FRONTEND_URL}/${tenant.slug}/dashboard?ga_connected=true`);

    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }

  } catch (error) {
    logger.error('Error in Google Analytics OAuth callback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete OAuth flow',
      message: error.message
    });
  }
}));

/**
 * GET /api/google/analytics/status
 * Check if tenant has connected Google Analytics
 */
router.get('/status', asyncHandler(async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || req.user?.tenant_id;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const result = await pool.query(
      'SELECT id, property_id, expires_at, created_at FROM analytics.google_analytics_tokens WHERE tenant_id = $1',
      [tenantId]
    );

    const isConnected = result.rows.length > 0;
    const tokenData = result.rows[0] || null;

    res.json({
      success: true,
      connected: isConnected,
      data: tokenData ? {
        propertyId: tokenData.property_id,
        expiresAt: tokenData.expires_at,
        connectedAt: tokenData.created_at
      } : null
    });

  } catch (error) {
    logger.error('Error checking Google Analytics status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check connection status',
      message: error.message
    });
  }
}));

/**
 * GET /api/google/analytics/summary
 * Get analytics summary data for a tenant
 */
router.get('/summary', asyncHandler(async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || req.user?.tenant_id;
    const days = parseInt(req.query.days) || 7;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const summary = await analyticsService.getAnalyticsSummary(tenantId, days);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data',
      message: error.message
    });
  }
}));

/**
 * GET /api/google/analytics/realtime
 * Get real-time analytics data for a tenant
 */
router.get('/realtime', asyncHandler(async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || req.user?.tenant_id;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const realtimeData = await analyticsService.getRealtimeData(tenantId);

    res.json({
      success: true,
      data: realtimeData
    });

  } catch (error) {
    logger.error('Error fetching realtime data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch realtime data',
      message: error.message
    });
  }
}));

export default router;
