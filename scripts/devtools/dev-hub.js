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

// Serve the port registry as JSON
app.get('/.port-registry.json', (req, res) => {
  if (!fs.existsSync(registryPath)) {
    return res.status(503).json({ error: 'Registry not ready' });
  }
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  res.json(registry);
});

function getTarget(host) {
  if (!fs.existsSync(registryPath)) return null;
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

  // Handle different hostname patterns
  if (host.includes('admin') || host.includes('admin.localhost')) {
    return `http://localhost:${registry.admin}`;
  }
  if (host.includes('tenant') || host.includes('tenant.localhost')) {
    return `http://localhost:${registry.tenant}`;
  }
  if (host.includes('main') || host.includes('main.localhost')) {
    return `http://localhost:${registry.main}`;
  }
  
  // Default to main site
  return `http://localhost:${registry.main}`;
}

// Create proxy middleware that handles all requests
const proxyCache = new Map();
let loggedTargets = new Set();

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
  console.log(`🧭 Dev Hub running on port ${PORT}`);
  console.log(`📱 Main Site: http://main.localhost:${PORT}`);
  console.log(`🔐 Admin App: http://admin.localhost:${PORT}`);
  console.log(`🏢 Tenant App: http://tenant.localhost:${PORT}`);
  console.log(`📊 Registry: http://localhost:${PORT}/.port-registry.json`);
  
  // Show clickable links after a delay to ensure all services are up
  setTimeout(() => {
    console.log('\n🚀 ===== DEVELOPMENT ENVIRONMENT READY =====');
    console.log('📱 Main Website:     http://main.localhost:8080/');
    console.log('🔐 Admin Interface:  http://admin.localhost:8080/');
    console.log('🏢 Tenant Dashboard: http://tenant.localhost:8080/');
    console.log('📊 Port Registry:    http://localhost:8080/.port-registry.json');
    console.log('🔧 Backend API:      http://localhost:3001/api/health');
    console.log('===============================================\n');
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
