// Load environment variables FIRST to avoid early warnings
import dotenv from 'dotenv'
import path from 'path'

// Load .env from root directory (one level up from backend/)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

// Set default log level AFTER .env is loaded
if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'info' : 'error'
}
import { existsSync, readFileSync } from 'fs'
import { logger, createModuleLogger } from './config/logger.js'

// Check if .env was loaded and log the path
const envPaths = [
  path.resolve(process.cwd(), '.env'),           // Current directory
  path.resolve(process.cwd(), '../.env'),        // Parent directory (dev)
  path.resolve(process.cwd(), '../../.env')      // Root directory (dev)
]

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    logger.info({ envPath }, 'Loading .env file')
    break
  }
}

// In production, environment variables should be set by the platform
if (process.env.NODE_ENV === 'production') {
  logger.info('Production mode: Using platform environment variables')
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { fileURLToPath } from 'url'

// 🔒 CRITICAL: Validate environment BEFORE starting server
// This ensures JWT secrets and DATABASE_URL are present in production
import { loadEnv } from './config/env.js'
const env = await loadEnv()
logger.info({
  environment: env.NODE_ENV,
  databaseUrlExists: !!env.DATABASE_URL,
  jwtConfigured: !!(env.JWT_SECRET && env.JWT_REFRESH_SECRET)
}, '✅ Environment validation passed - proceeding with server initialization')

import { requestLogger } from './middleware/requestLogger.js';
import { tenantResolver } from './middleware/tenantResolver.js'
import { 
  createSubdomainMiddleware, 
  createAdminSubdomainMiddleware,
  addTenantContext 
} from './middleware/subdomainMiddleware.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { csrfProtection } from './middleware/csrfProtection.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import paymentRoutes from './routes/payments.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import tenantsRoutes from './routes/tenants.js'
import adminRoutes from './routes/admin.js'
import subdomainTestRoutes from './routes/subdomainTest.js'
import locationsRoutes from './routes/locations.js'
import websiteContentRoutes from './routes/websiteContent.js'
import googleReviewsRoutes from './routes/googleReviews.js'
import configRoutes from './routes/config.js'
import googleAuthRoutes from './routes/googleAuth.js'
import googleAnalyticsRoutes from './routes/googleAnalytics.js'
import healthMonitoringRoutes from './routes/healthMonitoring.js'
import reviewsRoutes from './routes/reviews.js'
import domainRoutes from './routes/domains.js'
import tenantDashboardRoutes from './routes/tenantDashboard.js'
import previewRoutes from './routes/previews.js'
import createAnalyticsRouter from './routes/analytics.new.js'
import { startAutoFlush } from './utils/analyticsQueue.js'
import { getPool } from './database/pool.js'
// Missing routes that need to be mounted
import seoRoutes from './routes/seo.js'
import avatarRoutes from './routes/avatar.js'
import servicesRoutes from './routes/services.js'
import serviceAreasRoutes from './routes/serviceAreas.js'
import customersRoutes from './routes/customers.js'
import scheduleRoutes from './routes/schedule.js'
import tenantImagesRoutes from './routes/tenantImages.js'
import tenantManifestRoutes from './routes/tenantManifest.js'
import tenantReviewsRoutes from './routes/tenantReviews.js'
import galleryRoutes from './routes/gallery.js'
import errorTrackingRoutes from './routes/errorTracking.js'

// Suppress debug/info noise in development
if (process.env.LOG_LEVEL !== 'debug') {
  console.debug = () => {}
  console.info = () => {}
}

const app = express()

// Initialize pool and analytics router with resilience
let analyticsRouter;
let autoFlushHandle;

try {
  const pool = await getPool();
  analyticsRouter = createAnalyticsRouter(pool);
  autoFlushHandle = startAutoFlush(pool);
  logger.info('Analytics router initialized with database pool');
} catch (error) {
  logger.error('Failed to initialize analytics router', { error: error.message });
  // Create a dummy router that returns 503
  analyticsRouter = express.Router();
  analyticsRouter.all('*', (req, res) => {
    res.status(503).json({
      success: false,
      error: 'Analytics service temporarily unavailable'
    });
  });
}

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Compression disabled - was causing image serving issues

// CORS configuration for development and production
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) {
      return cb(null, true); // curl, servers, etc.
    }
    
    // Development origins - support dynamic ports
    const devOrigins = [
      'http://localhost:5175',
      'http://localhost:5176', 
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177',
      'http://127.0.0.1:5178',
      'http://127.0.0.1:5179',
      'http://127.0.0.1:5180'
    ];
    
    // Production origins - include subdomains
    const prodOrigins = [
      'https://thatsmartsite.com',
      'https://www.thatsmartsite.com'
    ];
    
    // Allow subdomains of thatsmartsite.com
    const isSubdomain = /^https:\/\/[a-zA-Z0-9-]+\.thatsmartsite\.com$/.test(origin);
    
    // Check if origin is allowed
    const isDevOrigin = devOrigins.some(devOrigin => origin.startsWith(devOrigin));
    const isProdOrigin = prodOrigins.includes(origin);
    const isNetworkOrigin = /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(5175|5176|5177)$/.test(origin);
    
    const ok = isDevOrigin || isProdOrigin || isNetworkOrigin || isSubdomain;
    cb(null, ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions))

// Security headers middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// Request logging middleware (must come before tenant resolution for proper correlation)
app.use(requestLogger);

// 1️⃣ Admin subdomain middleware - handles admin.thatsmartsite.com (must come first)
app.use(createAdminSubdomainMiddleware())

// 2️⃣ Subdomain middleware - handles slug.thatsmartsite.com routing
app.use(createSubdomainMiddleware({
  defaultTenant: null,
  redirectInvalid: false, // Disable redirect for development testing
  enableCaching: true,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
}))

// 3️⃣ Legacy tenant resolver (for backward compatibility and fallback)
app.use(tenantResolver)

// 4️⃣ Add tenant context to responses
app.use(addTenantContext)

// ✅ Global parsers BEFORE routes
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// 🔒 Security middleware
// Rate limiting for all API routes (configured for development with high limits)
app.use('/api', apiLimiter)

// CSRF protection for state-changing requests (POST, PUT, DELETE)
const csrfProtectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
app.use((req, res, next) => {
  // Skip CSRF for health checks and GET requests
  if (req.path.startsWith('/api/health') || !csrfProtectedMethods.includes(req.method)) {
    return next();
  }
  csrfProtection(req, res, next);
})

// Debug echo route (keep during dev)
app.post('/api/debug/body', (req, res) => {
  res.json({ headers: req.headers, body: req.body })
})

// API Routes - MUST come before static file serving
app.use('/api/payments', paymentRoutes)
// Health routes moved to /api/health/detailed (see below)
app.use('/api/auth', authRoutes)
app.use('/api/tenants', tenantsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRouter)
app.use('/api/locations', locationsRoutes)
app.use('/api/website-content', websiteContentRoutes)
app.use('/api/google-reviews', googleReviewsRoutes)
app.use('/api/config', configRoutes)
app.use('/api/google/analytics', googleAnalyticsRoutes)
app.use('/api/google', googleAuthRoutes)
app.use('/api/health-monitoring', healthMonitoringRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/subdomain', subdomainTestRoutes)
app.use('/api/domains', domainRoutes)
app.use('/api/dashboard', tenantDashboardRoutes)
app.use('/api/previews', previewRoutes)
// Newly mounted routes (previously unreachable)
app.use('/api/services', servicesRoutes)
app.use('/api/service-areas', serviceAreasRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/avatar', avatarRoutes)
app.use('/api/tenant-images', tenantImagesRoutes)
app.use('/api/tenant-reviews', tenantReviewsRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/errors', errorTrackingRoutes)
// SEO routes at root level (for robots.txt, sitemap.xml, manifest.json)
app.use('/', seoRoutes)
app.use('/', tenantManifestRoutes)
logger.info('Analytics routes loaded at /api/analytics (hardened)')
logger.info('Reviews routes loaded at /api/reviews')
logger.info('Subdomain test routes loaded at /api/subdomain')
logger.info('Domain routes loaded at /api/domains')
logger.info('Tenant dashboard routes loaded at /api/dashboard')
logger.info('Preview routes loaded at /api/previews')

// Development: simple health check
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (_req, res) => res.send('Backend online 🚀'))
}

// Simple health check for Render (no database dependency)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'thatsmartsite-backend',
    uptime: process.uptime()
  })
})

// Comprehensive health check with database status at /api/health/detailed
app.use('/api/health/detailed', healthRoutes)

// 1️⃣ Serve *all* built assets first (shared for both apps)
// In production, assets are in backend/public/dist/assets
// In development, they're in frontend/dist/assets
const assetsPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'public', 'dist', 'assets')
  : path.join(__dirname, '../frontend/dist/assets');

app.use(
  '/assets',
  express.static(assetsPath, {
    maxAge: '1y',
    immutable: true,
  })
);

// 2️⃣ Serve admin-specific files
const adminPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public', 'admin')
  : path.join(__dirname, '../frontend/dist/admin');

app.use(
  '/admin',
  express.static(adminPath, {
    maxAge: '1h',
  })
);

// 3️⃣ Serve tenant-specific files
const tenantPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public', 'tenant')
  : path.join(__dirname, '../frontend/dist/tenant');

app.use(
  '/tenant',
  express.static(tenantPath, {
    maxAge: '1h',
  })
);

// 4️⃣ Serve main app files (marketing/landing)
const mainPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public', 'main')
  : path.join(__dirname, '../frontend/dist/main');

app.use(
  '/',
  express.static(mainPath, {
    maxAge: '1h',
  })
);

// 5️⃣ Serve other static files (shared, images, etc.)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set immutable cache for hashed assets (JS/CSS)
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
  }
}))

// 🔧 Error handlers MUST come before catch-all routes
// 404 handler for API routes that don't match
app.use('/api/*', notFoundHandler);

// Centralized error handler middleware (4 parameters required)
app.use(errorHandler);

// 6️⃣ Fallback router (3-layer architecture) - serves static HTML for SPAs
app.get('*', (req, res) => {
  const host = req.hostname.toLowerCase();
  const requestPath = req.path;
  
  // Admin routes
  if (requestPath.startsWith('/admin')) {
    const htmlFile = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, 'public/admin/index.html')
      : path.join(__dirname, '../frontend/dist/admin/index.html');
    return res.sendFile(htmlFile);
  }
  
  // Tenant routes
  if (requestPath.startsWith('/tenant')) {
    const htmlFile = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, 'public/tenant/index.html')
      : path.join(__dirname, '../frontend/dist/tenant/index.html');
    return res.sendFile(htmlFile);
  }
  
  // Main site (marketing/landing) - default for root and other paths
  const htmlFile = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'public/main/index.html')
    : path.join(__dirname, '../frontend/dist/main/index.html');
  
  res.sendFile(htmlFile);
});

// Static port configuration (no dynamic port detection)
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;
const HOST = '0.0.0.0'

logger.info({
  host: HOST,
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
  databaseUrlExists: !!process.env.DATABASE_URL,
  workingDirectory: process.cwd(),
  serverFile: import.meta.url
}, 'Starting server');

// Start server FIRST, then do async initialization
app.listen(PORT, HOST, () => {
  logger.info({
    host: HOST,
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    healthCheck: `http://localhost:${PORT}/api/health`,
    detailedHealth: `http://localhost:${PORT}/api/health/detailed`
  }, 'Backend server started successfully');
  
  // Now do async initialization after server is listening
  initializeAsync()
})

// Async initialization after server starts (non-critical operations only)
async function initializeAsync() {
  // Update OAuth redirect URI with dynamic port (non-critical)
  try {
    const { updateOAuthRedirect } = await import('../scripts/devtools/cli/update-oauth-redirect.js')
    updateOAuthRedirect()
    logger.info('OAuth redirect URI updated')
  } catch (error) {
    logger.warn('Could not update OAuth redirect URI:', error.message)
  }
  
  // Initialize HealthMonitor (non-critical)
  try {
    const { default: healthMonitor } = await import('./services/healthMonitor.js')
    healthMonitor.initialize()
    logger.info('Health monitor initialized')
  } catch (error) {
    logger.warn('Could not initialize health monitor:', error.message)
  }
  
  // Test database connection (critical - crash if it fails in production)
  try {
    logger.info('Testing database connection...')
    const { getPool } = await import('./database/pool.js')
    const pool = await getPool()
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    logger.info('Database connection verified')
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack
    }, '❌ Database connection failed')
    
    // In production, database is critical - crash immediately
    if (process.env.NODE_ENV === 'production') {
      logger.error('FATAL: Cannot start server without database in production')
      process.exit(1)
    }
    
    logger.warn('Continuing in development mode without database')
  }
  
  // Initialize cron jobs for automated maintenance
  try {
    const { initializeCronJobs } = await import('./services/cronService.js')
    initializeCronJobs()
    logger.info('Cron jobs initialized (token cleanup every hour)')
  } catch (error) {
    logger.warn('Could not initialize cron jobs:', error.message)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Stop cron jobs
  try {
    const { stopCronJobs } = await import('./services/cronService.js');
    stopCronJobs();
    logger.info('Cron jobs stopped');
  } catch (error) {
    logger.warn('Could not stop cron jobs:', error.message);
  }
  
  // Stop analytics queue auto-flush
  if (autoFlushHandle) {
    const { stopAutoFlush } = await import('./utils/analyticsQueue.js');
    stopAutoFlush(autoFlushHandle);
  }
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  // Stop cron jobs
  try {
    const { stopCronJobs } = await import('./services/cronService.js');
    stopCronJobs();
    logger.info('Cron jobs stopped');
  } catch (error) {
    logger.warn('Could not stop cron jobs:', error.message);
  }
  
  // Stop analytics queue auto-flush
  if (autoFlushHandle) {
    const { stopAutoFlush } = await import('./utils/analyticsQueue.js');
    stopAutoFlush(autoFlushHandle);
  }
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});