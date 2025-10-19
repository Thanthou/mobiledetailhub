// Load environment variables FIRST to avoid early warnings
import dotenv from 'dotenv'
import path from 'path'

// Load .env from root directory (one level up from backend/)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

// Set default log level AFTER .env is loaded
if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = 'error'
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
import { fileURLToPath } from 'url'

// Environment validation will be done after server starts

import { tenantResolver } from './middleware/tenantResolver.js'
import { 
  createSubdomainMiddleware, 
  createAdminSubdomainMiddleware,
  addTenantContext 
} from './middleware/subdomainMiddleware.js'
import paymentRoutes from './routes/payments.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import tenantsRoutes from './routes/tenants.js'
import adminRoutes from './routes/admin.js'
import subdomainTestRoutes from './routes/subdomainTest.js'
import locationsRoutes from './routes/locations.js'
import websiteContentRoutes from './routes/websiteContent.js'
import googleReviewsRoutes from './routes/googleReviews.js'
import googleAuthRoutes from './routes/googleAuth.js'
import googleAnalyticsRoutes from './routes/googleAnalytics.js'
import healthMonitoringRoutes from './routes/healthMonitoring.js'
import reviewsRoutes from './routes/reviews.js'
import domainRoutes from './routes/domains.js'

// Suppress debug/info noise in development
if (process.env.LOG_LEVEL !== 'debug') {
  console.debug = () => {}
  console.info = () => {}
}

const app = express()

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

// Subdomain middleware - handles slug.thatsmartsite.com routing
app.use(createSubdomainMiddleware({
  defaultTenant: null,
  redirectInvalid: false, // Disable redirect for development testing
  enableCaching: true,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
}))

// Admin subdomain middleware - handles admin.thatsmartsite.com
app.use(createAdminSubdomainMiddleware())

// Legacy tenant resolver (for backward compatibility)
app.use(tenantResolver)

// Add tenant context to responses
app.use(addTenantContext)

// ✅ Global parsers BEFORE routes
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

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
app.use('/api/locations', locationsRoutes)
app.use('/api/website-content', websiteContentRoutes)
app.use('/api/google-reviews', googleReviewsRoutes)
app.use('/api/google/analytics', googleAnalyticsRoutes)
app.use('/api/google', googleAuthRoutes)
app.use('/api/health-monitoring', healthMonitoringRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/subdomain', subdomainTestRoutes)
app.use('/api/domains', domainRoutes)
logger.info('Reviews routes loaded at /api/reviews')
logger.info('Subdomain test routes loaded at /api/subdomain')
logger.info('Domain routes loaded at /api/domains')

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

// 4️⃣ Serve main-site files (marketing/landing)
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

// 6️⃣ Fallback router (3-layer architecture)
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
})

// Centralized error handler middleware
app.use((err, req, res, next) => {
  logger.error({ error: err }, 'Express error handler caught error');
  if (!res.headersSent) {
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Try to load dynamic port from port finder, fallback to env or default
let PORT = process.env.PORT || 3001;
try {
  const portFile = path.join(__dirname, '../.backend-port.json');
  if (fs.existsSync(portFile)) {
    const portData = JSON.parse(fs.readFileSync(portFile, 'utf8'));
    PORT = portData.port;
  }
} catch (error) {
  // Fallback to default if port file doesn't exist or is invalid
}

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

// Async initialization after server starts
async function initializeAsync() {
  try {
    logger.info('Testing async environment validation...')
    const { loadEnv } = await import('./config/env.js')
    const env = await loadEnv()
    logger.info({
      environment: env.NODE_ENV,
      databaseUrlExists: !!env.DATABASE_URL
    }, 'Environment validation passed')
    
    // Update OAuth redirect URI with dynamic port
    try {
      const { updateOAuthRedirect } = await import('../scripts/devtools/cli/update-oauth-redirect.js')
      updateOAuthRedirect()
    } catch (error) {
      logger.warn('Could not update OAuth redirect URI:', error.message)
    }
    
    // Initialize HealthMonitor after environment is loaded
    const { default: healthMonitor } = await import('./services/healthMonitor.js')
    healthMonitor.initialize()
    
    // Test database connection (non-blocking)
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
    }, 'Async initialization failed - server is still running, but some features may not work')
  }
}