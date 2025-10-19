/**
 * Runtime Configuration Endpoint
 * 
 * Provides runtime configuration to frontend applications
 * This allows changing API URLs and other settings without rebuilding
 */

import express from 'express';
import { logger } from '../config/logger.js';

const router = express.Router();

/**
 * GET /api/config
 * Returns runtime configuration for frontend applications
 */
router.get('/', (req, res) => {
  try {
    const config = {
      // API Configuration
      apiBaseUrl: process.env.API_BASE_URL || '/api',
      apiUrl: process.env.API_URL || '',
      
      // Third-party API Keys (only public keys)
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
      
      // Feature Flags
      features: {
        serviceWorker: process.env.ENABLE_SERVICE_WORKER === 'true',
        analytics: process.env.ENABLE_ANALYTICS === 'true',
        maps: process.env.ENABLE_GOOGLE_MAPS === 'true',
        stripe: process.env.ENABLE_STRIPE === 'true',
        debugMode: process.env.NODE_ENV === 'development'
      },
      
      // Environment info
      environment: {
        mode: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        buildTime: process.env.BUILD_TIME || new Date().toISOString()
      },
      
      // Multi-tenant configuration
      tenant: {
        defaultDomain: process.env.DEFAULT_DOMAIN || 'thatsmartsite.com',
        subdomainPattern: process.env.SUBDOMAIN_PATTERN || '*.thatsmartsite.com'
      }
    };
    
    // Add CORS headers for cross-origin requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Cache the config for 5 minutes
    res.header('Cache-Control', 'public, max-age=300');
    res.header('ETag', `"config-${Date.now()}"`);
    
    res.json({
      success: true,
      config,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error serving runtime config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load configuration',
      message: error.message
    });
  }
});

/**
 * GET /api/config/health
 * Health check for configuration service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
