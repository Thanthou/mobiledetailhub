// Set default log level BEFORE any imports that might use logging
if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = 'error'
}

// Load environment variables from .env file (if it exists)
import dotenv from 'dotenv'
import path from 'path'
import { existsSync } from 'fs'

// Try to load .env from multiple locations
const envPaths = [
  path.resolve(process.cwd(), '.env'),           // Current directory
  path.resolve(process.cwd(), '../.env'),        // Parent directory (dev)
  path.resolve(process.cwd(), '../../.env')      // Root directory (dev)
]

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    console.log(`📄 Loading .env from: ${envPath}`)
    dotenv.config({ path: envPath })
    break
  }
}

// In production, environment variables should be set by the platform
if (process.env.NODE_ENV === 'production') {
  console.log('🏭 Production mode: Using platform environment variables')
}

import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'

// Test environment validation early
try {
  console.log('🔍 Testing environment validation...')
  const { env } = await import('./config/env.js')
  console.log('✅ Environment validation passed')
} catch (error) {
  console.error('❌ Environment validation failed:', error.message)
  console.error('This will cause the server to fail to start')
  process.exit(1)
}

import { tenantResolver } from './middleware/tenantResolver.js'
import paymentRoutes from './routes/payments.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import tenantsRoutes from './routes/tenants.js'
import adminRoutes from './routes/admin.js'
import locationsRoutes from './routes/locations.js'
import websiteContentRoutes from './routes/websiteContent.js'
import googleReviewsRoutes from './routes/googleReviews.js'
import googleAuthRoutes from './routes/googleAuth.js'
import googleAnalyticsRoutes from './routes/googleAnalytics.js'
import healthMonitoringRoutes from './routes/healthMonitoring.js'
import reviewsRoutes from './routes/reviews.js'

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
    
    // Development origins
    const devOrigins = [
      'http://localhost:5175',
      'http://localhost:5176', 
      'http://localhost:5177',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177'
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

// Tenant resolver middleware - must come before routes
app.use(tenantResolver)

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
console.log('Reviews routes loaded at /api/reviews')

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
  ? path.join(__dirname, 'public', 'dist', 'admin')
  : path.join(__dirname, '../frontend/dist/admin');

app.use(
  '/admin',
  express.static(adminPath, {
    maxAge: '1h',
  })
);

// 3️⃣ Serve tenant-specific files
const tenantPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public', 'dist', 'tenant')
  : path.join(__dirname, '../frontend/dist/tenant');

app.use(
  '/tenant',
  express.static(tenantPath, {
    maxAge: '1h',
  })
);

// 4️⃣ Serve other static files (shared, images, etc.)
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

// 5️⃣ Fallback router (domain-based HTML only)
app.get('*', (req, res) => {
  const host = req.hostname.toLowerCase();
  const isAdminDomain =
    host === 'thatsmartsite.com' ||
    host === 'www.thatsmartsite.com' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'thatsmartsite-backend.onrender.com';

  const htmlFile = isAdminDomain
    ? path.join(__dirname, process.env.NODE_ENV === 'production' ? 'public/dist/admin/index.html' : '../frontend/dist/admin/index.html')
    : path.join(__dirname, process.env.NODE_ENV === 'production' ? 'public/dist/tenant/index.html' : '../frontend/dist/tenant/index.html');

  res.sendFile(htmlFile);
})

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  if (!res.headersSent) {
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

const PORT = process.env.PORT || 3001
const HOST = '0.0.0.0'

console.log(`🚀 Starting server on ${HOST}:${PORT}`)
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`🔗 Database URL exists: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`)
console.log(`🔑 JWT_SECRET exists: ${process.env.JWT_SECRET ? 'YES' : 'NO'}`)
console.log(`💳 STRIPE_SECRET_KEY exists: ${process.env.STRIPE_SECRET_KEY ? 'YES' : 'NO'}`)
console.log(`📧 SENDGRID_API_KEY exists: ${process.env.SENDGRID_API_KEY ? 'YES' : 'NO'}`)

try {
  app.listen(PORT, HOST, () => {
    console.log(`✅ Backend server started successfully`)
    console.log(`🌐 Listening on ${HOST}:${PORT}`)
    console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`)
    console.log(`📊 Detailed health: http://${HOST}:${PORT}/api/health/detailed`)
    console.log(`🏗️  Environment: ${process.env.NODE_ENV || 'development'}`)
  })
} catch (error) {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
}