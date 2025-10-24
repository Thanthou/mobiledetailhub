/**
 * Runtime Configuration Endpoint
 * 
 * Provides runtime configuration to frontend applications
 * This allows changing API URLs and other settings without rebuilding
 */

import express from 'express';
import { logger } from '../config/logger.js';
import { env } from '../config/env.async.js';

const router = express.Router();

/**
 * GET /api/config
 * Returns runtime configuration for frontend applications
 * 
 * This endpoint provides runtime configuration that can be changed without rebuilding.
 * The frontend fetches this at boot and uses it to configure API URLs, feature flags, etc.
 */
router.get('/', (req, res) => {
  try {
    // Determine API base URL based on environment
    const apiBaseUrl = env.NODE_ENV === 'production'
      ? (env.API_BASE_URL || '/api')
      : '/api'; // Always use proxy in development
    
    const apiUrl = env.NODE_ENV === 'production'
      ? (env.API_URL || '')
      : ''; // Empty in dev to use Vite proxy
    
    const config = {
      // API Configuration
      apiBaseUrl,
      apiUrl,
      backendUrl: env.NODE_ENV === 'development' 
        ? `http://localhost:${env.PORT || 3001}`
        : '',
      
      // Third-party API Keys (only public keys - NEVER send private keys!)
      googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,
      stripePublishableKey: env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
      
      // Feature Flags (runtime toggleable)
      features: {
        serviceWorker: env.ENABLE_SERVICE_WORKER === 'true' && env.NODE_ENV === 'production',
        analytics: env.ENABLE_ANALYTICS !== 'false', // Enabled by default
        maps: env.ENABLE_GOOGLE_MAPS !== 'false', // Enabled by default
        stripe: env.ENABLE_STRIPE !== 'false', // Enabled by default
        debugMode: env.NODE_ENV === 'development',
        booking: env.ENABLE_BOOKING !== 'false', // Enabled by default
        reviews: env.ENABLE_REVIEWS !== 'false', // Enabled by default
      },
      
      // Environment info
      environment: {
        mode: env.NODE_ENV || 'development',
        version: env.APP_VERSION || '1.0.0',
        buildTime: env.BUILD_TIME || new Date().toISOString(),
        commitHash: env.COMMIT_HASH || 'unknown',
      },
      
      // Multi-tenant configuration
      tenant: {
        defaultDomain: env.BASE_DOMAIN || 'thatsmartsite.com',
        subdomainPattern: `*.${env.BASE_DOMAIN || 'thatsmartsite.com'}`,
        allowCustomDomains: env.ALLOW_CUSTOM_DOMAINS !== 'false',
      },
      
      // Client-side settings
      client: {
        maxUploadSize: parseInt(env.MAX_UPLOAD_SIZE || '5242880'), // 5MB default
        sessionTimeout: parseInt(env.SESSION_TIMEOUT || '86400000'), // 24h default
        enableOfflineMode: env.ENABLE_OFFLINE_MODE === 'true',
      }
    };
    
    // Add CORS headers for cross-origin requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Cache the config for 5 minutes
    res.header('Cache-Control', 'public, max-age=300');
    
    // Add informative headers
    res.header('X-Config-Version', env.APP_VERSION || '1.0.0');
    res.header('X-Config-Timestamp', new Date().toISOString());
    
    logger.debug('Runtime config served', {
      environment: config.environment.mode,
      serviceWorkerEnabled: config.features.serviceWorker,
      apiBaseUrl: config.apiBaseUrl
    });
    
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
