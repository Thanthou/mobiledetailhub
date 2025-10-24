// backend/bootstrap/server.start.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { loadEnv, env } from './loadEnv.js';
import { setupSecurity } from './setupSecurity.js';
import { setupMiddleware } from './setupMiddleware.js';
import { setupRoutes } from './setupRoutes.js';
import { setupErrors } from './setupErrors.js';
import { logger } from '../config/logger.js';
import { getPool } from '../database/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port-in-use guard - catch EADDRINUSE before it crashes silently
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n❌ ERROR: Port already in use!');
    console.error('   Another server process may still be running.');
    console.error('   Run "npm run kill" to clean up orphaned processes.\n');
    process.exit(1);
  }
  // Re-throw other uncaught exceptions
  throw err;
});

// Create Express app
const app = express();

// Disable strict routing to handle trailing slashes flexibly
app.set('strict routing', false);

// CRITICAL FIX: Override Express's finalhandler to prevent premature 404s
// Express 4.x uses setImmediate() to schedule finalhandler, which fires before async routes complete
// We intercept and check if a route handler is processing (asyncHandler sets res._routeHandled)
const originalHandle = app.handle.bind(app);
app.handle = function(req, res, out) {
  const originalOut = out;
  const newOut = function(err) {
    // Check if:
    // 1. Response already sent (headers sent or finished)
    // 2. A route handler is processing (asyncHandler sets this flag)
    if (res.headersSent || res.finished || res._routeHandled) {
      // Route is being handled, don't invoke finalhandler
      return;
    }
    // No route handling this, invoke finalhandler
    if (typeof originalOut === 'function') {
      originalOut(err);
    }
  };
  originalHandle(req, res, newOut);
};

// Phase 1: Load environment variables
await loadEnv();

// Phase 2: Initialize database pool
// The pool is initialized on first use via getPool()
// No explicit initialization needed
console.log('🗄️  Database pool ready (lazy initialization)');

// Phase 3: Setup security layer
setupSecurity(app);

// Phase 4: Setup core middleware
setupMiddleware(app);

// Phase 5: Mount API routes
setupRoutes(app);

// Phase 6: Setup static file serving for frontend apps (production only)
const NODE_ENV = env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
  // Production: Serve built frontend apps based on subdomain
  const publicPath = path.join(__dirname, '../public');
  
  // Serve shared static assets
  app.use(express.static(publicPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  
  // SPA fallback - serve appropriate app based on subdomain
  app.get('*', (req, res) => {
    const hostname = req.hostname.toLowerCase();
    const subdomain = hostname.split('.')[0];
    
    let htmlFile;
    
    // Admin subdomain
    if (subdomain === 'admin') {
      htmlFile = path.join(publicPath, 'admin/index.html');
    }
    // Main site (no subdomain or www)
    else if (subdomain === 'www' || hostname === env.BASE_DOMAIN) {
      htmlFile = path.join(publicPath, 'main/index.html');
    }
    // Tenant subdomains
    else {
      htmlFile = path.join(publicPath, 'tenant/index.html');
    }
    
    if (existsSync(htmlFile)) {
      res.sendFile(htmlFile);
    } else {
      res.status(404).send('Application not found');
    }
  });
  
  console.log('📦 Serving static frontend apps (production mode)');
} else {
  // Development: Frontend runs on separate Vite dev servers
  console.log('🔧 Development mode: Frontend apps run on separate ports');
  console.log('   • Main:   http://localhost:5175');
  console.log('   • Admin:  http://admin.localhost:5176');
  console.log('   • Tenant: http://tenant.localhost:5177');
}

// Phase 7: Setup error handling (must be last)
setupErrors(app);

// Start server
const PORT = env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║          🚀 THAT SMART SITE - BACKEND READY 🚀          ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Backend API: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log('');
  
  if (NODE_ENV === 'development') {
    console.log('Frontend Apps (Vite Dev Servers):');
    console.log('  • Main:   http://localhost:5175');
    console.log('  • Admin:  http://admin.localhost:5176');
    console.log('  • Tenant: http://tenant.localhost:5177');
  } else {
    console.log('Frontend Apps (Subdomain-based):');
    console.log('  • Main:   https://thatsmartsite.com');
    console.log('  • Admin:  https://admin.thatsmartsite.com');
    console.log('  • Tenant: https://{slug}.thatsmartsite.com');
  }
  
  console.log('');
  console.log('API Endpoints:');
  console.log(`  • Health:     http://localhost:${PORT}/api/health`);
  console.log(`  • Bootstrap:  http://localhost:${PORT}/api/health/bootstrap`);
  console.log(`  • Auth Info:  http://localhost:${PORT}/api/auth (GET for endpoint list)`);
  console.log(`  • Login:      http://localhost:${PORT}/api/auth/login (POST)`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;

