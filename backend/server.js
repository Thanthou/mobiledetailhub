// Set default log level BEFORE any imports that might use logging
if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = 'error'
}

// Load environment variables from root .env file
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
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
    
    // Production origins
    const prodOrigins = [
      'https://thatsmartsite.com',
      'https://www.thatsmartsite.com'
    ];
    
    // Check if origin is allowed
    const isDevOrigin = devOrigins.some(devOrigin => origin.startsWith(devOrigin));
    const isProdOrigin = prodOrigins.includes(origin);
    const isNetworkOrigin = /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(5175|5176|5177)$/.test(origin);
    
    const ok = isDevOrigin || isProdOrigin || isNetworkOrigin;
    cb(null, ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions))

// ✅ Global parsers BEFORE routes
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Debug echo route (keep during dev)
app.post('/api/debug/body', (req, res) => {
  res.json({ headers: req.headers, body: req.body })
})

// API Routes - MUST come before static file serving
app.use('/api/payments', paymentRoutes)
app.use('/api/health', healthRoutes)
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

// Serve static files from frontend/dist in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Serve frontend for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    // Serve index.html for all non-API routes
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Development: simple health check
  app.get('/', (_req, res) => res.send('Backend online 🚀'))
}

// Explicit health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'thatsmartsite-backend'
  })
})

// Serve static frontend files with proper cache headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set immutable cache for hashed assets (JS/CSS)
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
  }
}))

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://localhost:${PORT} (LAN enabled)`)
})