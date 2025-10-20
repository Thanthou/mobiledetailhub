#!/usr/bin/env node
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const registryPath = path.join(__dirname, '../../.port-registry.json');

// Load registry once at startup
let registry = null;
try {
  registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
} catch (err) {
  console.error('⚠️  Could not load .port-registry.json:', err.message);
}

// Serve the port registry as JSON
app.get('/.port-registry.json', (req, res) => {
  if (!registry) {
    return res.status(503).json({ error: 'Registry not ready' });
  }
  res.json(registry);
});

/**
 * Get target URL based on hostname
 * @param {string} host - The request hostname (e.g., 'admin.localhost')
 * @returns {string|null} - Target URL (e.g., 'http://localhost:5176') or null
 */
function getTarget(host) {
  if (!registry) return null;

  // Handle different hostname patterns
  if (host.includes('admin')) {
    return `http://localhost:${registry.admin.port}`;
  }
  if (host.includes('tenant')) {
    return `http://localhost:${registry.tenant.port}`;
  }
  if (host.includes('main') || host === 'localhost') {
    return `http://localhost:${registry.main.port}`;
  }
  
  // Default to main site
  return `http://localhost:${registry.main.port}`;
}

// Create proxy middleware that handles all requests
const proxyCache = new Map();
let loggedTargets = new Set();

// ✅ OPTION B: Serve tenant SPA fallback for preview routes (backup safety layer)
app.use((req, res, next) => {
  const host = req.headers.host?.split(':')[0] || '';
  
  console.log(`[HUB] 🔍 Request: ${req.method} ${req.path} | Host: ${host}`);
  
  // Only intercept tenant preview routes
  if (host.includes('tenant') || host.includes('tenant.localhost')) {
    // If request looks like /something-preview or /test-route, serve tenant index.html
    if (/\/.*-preview$/.test(req.path) || req.path === '/test-route') {
      const tenantIndex = path.join(__dirname, '../../frontend/index.tenant.html');
      if (fs.existsSync(tenantIndex)) {
        console.log(`[HUB] 📄 Serving tenant SPA fallback for: ${req.path}`);
        return res.sendFile(tenantIndex);
      }
    }
  }
  
  console.log(`[HUB] ➡️  Proxying to target...`);
  next();
});

app.use((req, res) => {
  const host = req.headers.host?.split(':')[0];
  const target = getTarget(host);
  
  if (!target) {
    res.status(503).send(`
      <html>
        <head><title>Dev Hub - Registry Not Ready</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>🔧 Dev Hub</h1>
          <p>Registry not ready. Please start all apps first.</p>
          <p>Run: <code>npm run dev:all</code></p>
        </body>
      </html>
    `);
    return;
  }

  // Only log each target once to avoid spam
  if (!loggedTargets.has(target)) {
    console.log(`🔁 Proxy: ${host} → ${target}`);
    loggedTargets.add(target);
  }
  
  // Use cached proxy or create new one
  if (!proxyCache.has(target)) {
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true, // Enable WebSocket proxying
      logLevel: 'warn', // Reduce proxy logging
      onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${host}:`, err.message);
        res.status(502).send(`
          <html>
            <head><title>Dev Hub - App Not Running</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>🔧 Dev Hub</h1>
              <p>App not running on ${target}</p>
              <p>Please start the ${host.includes('admin') ? 'admin' : host.includes('tenant') ? 'tenant' : 'main'} app.</p>
            </body>
          </html>
        `);
      },
      onProxyReq: (proxyReq, req, res) => {
        // Ensure proper headers for WebSocket
        if (req.headers.upgrade === 'websocket') {
          proxyReq.setHeader('upgrade', 'websocket');
          proxyReq.setHeader('connection', 'upgrade');
        }
      }
    });
    proxyCache.set(target, proxy);
  }
  
  const proxy = proxyCache.get(target);
  proxy(req, res);
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log('\n🧭 Dev Hub running on port 8080\n');
  
  if (registry) {
    console.log('📍 Proxy Ready:');
    console.log(`   localhost         → localhost:${registry.main.port} (main site)`);
    console.log(`   admin.localhost   → localhost:${registry.admin.port}`);
    console.log(`   tenant.localhost  → localhost:${registry.tenant.port}`);
    console.log(`   backend           → localhost:${registry.backend.port}`);
    console.log('');
  } else {
    console.log('⚠️  Registry not loaded - proxying may fail\n');
  }
  
  // Show clickable links after a delay to ensure all services are up
  setTimeout(() => {
    console.log('🚀 ===== DEVELOPMENT ENVIRONMENT READY =====');
    console.log('📱 Main Website:     http://localhost:8080/');
    console.log('🔐 Admin Interface:  http://admin.localhost:8080/');
    console.log('🏢 Tenant Dashboard: http://tenant.localhost:8080/');
    console.log('📊 Port Registry:    http://localhost:8080/.port-registry.json');
    console.log('🔧 Backend API:      http://localhost:3001/api/health');
    console.log('===============================================\n');
    
    if (registry) {
      // Verify Vite configs match registry
      const warnings = [];
      // Add warning logic if we detect mismatches in the future
      if (warnings.length > 0) {
        console.log('⚠️  Configuration Warnings:');
        warnings.forEach(w => console.log(`   ${w}`));
      }
    }
  }, 3000); // 3 second delay
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  const host = request.headers.host?.split(':')[0];
  const target = getTarget(host);
  
  if (!target) {
    socket.destroy();
    return;
  }
  
  // For Vite HMR WebSocket connections, we need to handle them specially
  if (request.url.includes('?token=') || request.url === '/') {
    // This is likely a Vite HMR WebSocket connection
    if (proxyCache.has(target)) {
      const proxy = proxyCache.get(target);
      proxy.upgrade(request, socket, head);
    } else {
      socket.destroy();
    }
  } else {
    // Regular WebSocket upgrade
    if (proxyCache.has(target)) {
      const proxy = proxyCache.get(target);
      proxy.upgrade(request, socket, head);
    } else {
      socket.destroy();
    }
  }
});
