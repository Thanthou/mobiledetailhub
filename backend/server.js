require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import typed environment variables
const { env } = require('./config/env');

// Import environment validator
const { validateEnvironment } = require('./utils/envValidator');
const logger = require('./utils/logger');

// Import route modules
const healthRoutes = require('./routes/health');
const healthMonitoringRoutes = require('./routes/healthMonitoring');
const serviceAreasRoutes = require('./routes/serviceAreas');
const authRoutes = require('./routes/auth');
const tenantsRoutes = require('./routes/tenants');
const customersRoutes = require('./routes/customers');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const servicesRoutes = require('./routes/services');
const reviewsRoutes = require('./routes/reviews');
const tenantReviewsRoutes = require('./routes/tenantReviews');
const avatarRoutes = require('./routes/avatar');
const scheduleRoutes = require('./routes/schedule');
const galleryRoutes = require('./routes/gallery');
const stockImagesRoutes = require('./routes/stockImages');
const tenantImagesRoutes = require('./routes/tenantImages');
const locationsRoutes = require('./routes/locations');
const websiteContentRoutes = require('./routes/websiteContent');
const previewsRoutes = require('./routes/previews');
const tenantManifestRoutes = require('./routes/tenantManifest');
const paymentsRoutes = require('./routes/payments');
const seoRoutes = require('./routes/seo');
const analyticsRoutes = require('./routes/analytics');

// Get the update function from health routes
const { updateShutdownStatus } = healthRoutes;

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter, adminLimiter, sensitiveAuthLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/requestLogger');

// Import database utilities
const { setupDatabase } = require('./utils/databaseInit');
const { pool } = require('./database/pool');

// Import upload validation utilities
const { validateUploadRequest } = require('./utils/uploadValidator');

// Validate CORS configuration on boot
const validateCorsConfig = () => {
  if (env.NODE_ENV === 'production') {
    const allowedOrigins = env.ALLOWED_ORIGINS?.split(',').filter(origin => origin.trim()) || [];
    if (allowedOrigins.length === 0) {
      logger.error('FATAL: ALLOWED_ORIGINS is empty in production environment');
      logger.error('Please set ALLOWED_ORIGINS environment variable with comma-separated domains');
      process.exit(1);
    }
    logger.info(`Production CORS configured with ${allowedOrigins.length} allowed origins`);
  }
};

// Validate environment variables before starting server
try {
  validateEnvironment();
} catch (error) {
  logger.error('Environment validation failed:', { error: error.message });
  process.exit(1);
}

/**
 * Single source of truth for CORS allowed origins
 * 
 * This ensures consistency across all environments and prevents
 * CORS issues when switching between different dev ports.
 * 
 * Development ports covered:
 * - 3000: React dev server (default)
 * - 5173: Vite dev server (default) 
 * - 5174: Vite dev server (alternate)
 * - 4173: Vite preview server
 * - 127.0.0.1 variants for all ports
 */
const ALLOWED_ORIGINS = {
  development: [
    'http://localhost:3000',    // React dev server (default)
    'http://localhost:3001',    // Backend server (for test pages)
    'http://localhost:5173',    // Vite dev server (default)
    'https://localhost:5173',   // Vite dev server (HTTPS)
    'http://localhost:5174',    // Vite dev server (alternate)
    'http://localhost:5175',    // Vite dev server (alternate)
    'http://localhost:5176',    // Vite dev server (alternate)
    'http://localhost:5177',    // Vite dev server (alternate)
    'http://localhost:4173',    // Vite preview server
    'http://127.0.0.1:3000',   // React dev server (IP variant)
    'http://127.0.0.1:3001',   // Backend server (IP variant)
    'http://127.0.0.1:5173',   // Vite dev server (IP variant)
    'http://127.0.0.1:5174',   // Vite dev server (IP variant, alternate)
    'http://127.0.0.1:4173',   // Vite preview server (IP variant)
    'http://192.168.4.21:3000', // Network React dev server
    'http://192.168.4.21:3001', // Network backend server
    'http://192.168.4.21:5173', // Network Vite dev server
    'http://192.168.4.21:5174', // Network Vite dev server (alternate)
    'http://192.168.4.21:5175', // Network Vite dev server (alternate)
    'http://192.168.4.21:5176', // Network Vite dev server (alternate)
    'http://192.168.4.21:5177', // Network Vite dev server (alternate)
    'http://192.168.4.21:4173'  // Network Vite preview server
  ],
  staging: [
    // Staging domains from environment + localhost for testing
    ...(Array.isArray(env.ALLOWED_ORIGINS) ? env.ALLOWED_ORIGINS : []),
    'http://localhost:3000',
    'http://localhost:5173',
    'https://localhost:5173'
  ],
  production: Array.isArray(env.ALLOWED_ORIGINS) ? env.ALLOWED_ORIGINS : []
};

// Validate CORS configuration
validateCorsConfig();

// Log CORS configuration for current environment
const currentEnv = env.NODE_ENV;
const currentOrigins = ALLOWED_ORIGINS[currentEnv] || ALLOWED_ORIGINS.development;
logger.info(`CORS configured for ${currentEnv} environment with ${currentOrigins.length} allowed origins`);
if (currentEnv === 'development') {
  logger.info('Development origins:', currentOrigins);
}

const app = express();
const PORT = env.PORT;

// Server instance for graceful shutdown
let server = null;

// Graceful shutdown state management
let isShuttingDown = false;
const activeRequests = new Map(); // Map to store request promises
let statusUpdateInterval = null; // Interval for status updates

// Request tracking middleware
const requestTracker = (req, res, next) => {
  // Allow health endpoints during shutdown for monitoring
  if (isShuttingDown && !req.path.startsWith('/api/health')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Server is shutting down, please try again later'
    });
  }

  const requestId = Date.now() + Math.random();
  const requestPromise = new Promise((resolve) => {
    let resolved = false;
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        activeRequests.delete(requestId);
        resolve();
      }
    };
    
    // Track request completion
    res.on('finish', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    
    // Fallback: resolve after a reasonable timeout
    setTimeout(cleanup, 30000); // 30 seconds max
  });
  
  activeRequests.set(requestId, requestPromise);
  next();
};

// CORS configuration based on environment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {return callback(null, true);}
    
    const environment = env.NODE_ENV;
    const allowedOrigins = ALLOWED_ORIGINS[environment] || ALLOWED_ORIGINS.development;
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from unauthorized origin: ${origin}`, {
        environment,
        allowedOrigins: allowedOrigins.length
      });
      // Return proper CORS headers even when denying
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials for HttpOnly cookies
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false, // Ensure preflight requests are handled properly
  maxAge: 86400 // Cache preflight response for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(requestLogger); // Add request logging with correlation IDs and PII scrubbing
// Helmet: relax in dev, tighten in prod
const dev = process.env.NODE_ENV !== 'production';
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: dev ? ["'self'", "'unsafe-inline'"] : ["'self'"],
      styleSrc: dev ? ["'self'", "'unsafe-inline'"] : ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://*.thatsmartsite.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.thatsmartsite.com"
      ],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    },
    reportOnly: false
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: true,
  ienoopen: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(express.json({ limit: '1mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // Limit URL-encoded body size

// Serve static files with caching
app.use('/js', express.static('frontend/public/js'));

// Serve uploaded avatar files
app.use('/uploads', express.static('uploads', {
  maxAge: '1d', // Cache avatars for 1 day
  etag: true,
  lastModified: true
}));

// Serve test page for avatar upload testing
app.get('/test-avatar', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-avatar.html'));
});

// Enhanced request validation middleware
const requestValidationMiddleware = (req, res, next) => {
  // Check if server is shutting down (allow health endpoints for monitoring)
  if (isShuttingDown && !req.path.startsWith('/api/health')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Server is shutting down, please try again later'
    });
  }
  
  // Content-Type validation for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      return res.status(400).json({
        error: 'Content-Type header is required',
        message: 'Please specify the content type for your request'
      });
    }

    // MIME type allowlist for JSON and form data
    const allowedMimeTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data' // For future file uploads
    ];

    const isValidMimeType = allowedMimeTypes.some(allowedType => 
      contentType.startsWith(allowedType)
    );

    if (!isValidMimeType) {
      logger.warn(`Invalid Content-Type rejected: ${contentType} from ${req.ip}`);
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Only JSON, form data, and multipart form data are supported',
        allowedTypes: allowedMimeTypes
      });
    }

    // Enhanced validation for multipart/form-data (future uploads)
    if (contentType.startsWith('multipart/form-data')) {
      const uploadValidation = validateUploadRequest(req);
      if (!uploadValidation.success) {
        logger.warn(`Multipart validation failed: ${uploadValidation.errors.join(', ')} from ${req.ip}`);
        return res.status(400).json({
          error: 'Invalid multipart data',
          message: uploadValidation.errors.join(', '),
          warnings: uploadValidation.warnings
        });
      }
    }
  }

  // Request size validation (additional check beyond express limits)
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 1024 * 1024; // 1MB in bytes
  
  if (contentLength > maxSize) {
    logger.warn(`Request too large rejected: ${contentLength} bytes from ${req.ip}`);
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Request body exceeds maximum allowed size of 1MB',
      maxSize: '1MB',
      receivedSize: `${Math.round(contentLength / 1024)}KB`
    });
  }

  next();
};

app.use(requestValidationMiddleware);
app.use(requestTracker); // Apply request tracking middleware

// Rate limiting strategy:
// - Apply specific rate limiters to sensitive endpoints (auth, admin, uploads)
// - Apply general API limiter to other routes
// - Read-only endpoints (health, service_areas) are NOT rate-limited
//   to prevent slow header/footer performance

// Apply specific rate limiting to sensitive routes
app.use('/api/auth', authLimiter, authRoutes); // Auth-specific rate limiting
app.use('/api/admin', adminLimiter, adminRoutes); // Admin-specific rate limiting

// Apply general API rate limiting to other routes
app.use('/api/tenants', apiLimiter, tenantsRoutes); // Mixed read/write
app.use('/api/customers', apiLimiter, customersRoutes); // Mixed read/write
app.use('/api/services', servicesRoutes); // Mixed read/write - temporarily removed rate limiter
app.use('/api/reviews', apiLimiter, reviewsRoutes); // Mixed read/write
app.use('/api/tenant-reviews', apiLimiter, tenantReviewsRoutes); // Tenant dashboard reviews (no auth required)
app.use('/api/upload', apiLimiter, uploadRoutes); // Upload routes
app.use('/api/avatar', apiLimiter, avatarRoutes); // Avatar routes
app.use('/api/schedule', apiLimiter, scheduleRoutes); // Schedule routes

// Read-only endpoints (no rate limiting to prevent slow header/footer performance)
app.use('/api/health', healthRoutes); // Health checks
app.use('/api/health-monitoring', apiLimiter, healthMonitoringRoutes); // Website health monitoring
app.use('/api/service_areas', serviceAreasRoutes); // Service areas data
app.use('/api/gallery', galleryRoutes); // Gallery images (legacy)
app.use('/api/stock-images', stockImagesRoutes); // Stock images
app.use('/api/tenant-images', tenantImagesRoutes); // Tenant-specific images
app.use('/api/locations', locationsRoutes); // Service areas and locations
app.use('/api/website-content', apiLimiter, websiteContentRoutes); // Website content
app.use('/api/previews', apiLimiter, previewsRoutes); // Preview token generation
app.use('/api/preview', previewsRoutes); // Preview verification (no rate limit for link opens)
app.use('/api/tenant-manifest', tenantManifestRoutes); // Tenant PWA manifests (no rate limit)
app.use('/api/payments', sensitiveAuthLimiter, paymentsRoutes); // Payment processing (sensitive auth rate limiting)
app.use('/api/analytics', apiLimiter, analyticsRoutes); // Analytics tracking (rate limited)

// SEO routes (no rate limit for crawlers)
app.use('/', seoRoutes); // robots.txt and sitemap.xml

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Quick database connectivity check before starting server
async function startServer() {
  logger.info('Testing database connection...');
  try {
    // Quick ping with 1 second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database ping timeout')), 1000)
    );
    
    await Promise.race([
      pool.query('SELECT 1'),
      timeoutPromise
    ]);
    
    logger.info('✅ Database ping successful');
  } catch (error) {
    logger.error('❌ Database ping failed:', { error: error.message });
    process.exit(1);
  }

  // Setup database after successful ping
  logger.info('Setting up database...');
  try {
    await setupDatabase();
    logger.info('✅ Database setup completed successfully');
  } catch (error) {
    logger.error('❌ Database setup failed:', { error: error.message });
    process.exit(1);
  }

  // Start server after successful database setup
  server = app.listen(PORT, '0.0.0.0', () => {
    // Check if we're already shutting down
    if (isShuttingDown) {
      logger.warn('Server startup cancelled - shutdown in progress');
      return;
    }
    
    logger.startup(`Server running on 0.0.0.0:${PORT}`);
    logger.startup(`Accessible from: http://localhost:${PORT} and http://192.168.4.21:${PORT}`);
    logger.startup('Server is fully ready and operational!');
    
    // Start periodic shutdown status updates
    statusUpdateInterval = setInterval(() => {
      updateShutdownStatus({
        isShuttingDown,
        activeRequests: activeRequests.size
      });
    }, 1000); // Update every second
  });
}

// Start the server
startServer();

// Graceful shutdown function
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);
  
  isShuttingDown = true; // Set flag to prevent new requests
  logger.info(`${activeRequests.size} active requests will be allowed to complete.`);

  // Wait for active requests to complete with timeout
  if (activeRequests.size > 0) {
    const timeout = 10000; // 10 seconds timeout
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, timeout));
    
    try {
      await Promise.race([
        Promise.all(Array.from(activeRequests.values())),
        timeoutPromise
      ]);
      logger.info('All active requests have completed successfully');
    } catch {
      logger.warn('Some requests may not have completed within timeout');
    }
  } else {
    logger.info('No active requests to wait for');
  }

  // Stop accepting new connections
  if (server) {
    const serverClosePromise = new Promise((resolve) => {
      server.close(() => {
        logger.info('HTTP server closed');
        resolve();
      });
    });
    
    // Wait for server to close with timeout
    const serverCloseTimeout = new Promise(resolve => setTimeout(resolve, 5000));
    await Promise.race([serverClosePromise, serverCloseTimeout]);
  }
  
  // Clear status update interval
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
    statusUpdateInterval = null;
  }
  
  // Close database pool
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', { error: error.message });
  }
  
  // Flush logger and exit
  try {
    // Final status update
    updateShutdownStatus({
      isShuttingDown: true,
      activeRequests: 0
    });
    
    // Give logger time to flush any pending writes
    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', { error: error.message });
    process.exit(1);
  }
}

// Signal handlers for graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason: reason?.message || reason, promise });
  gracefulShutdown('unhandledRejection');
});