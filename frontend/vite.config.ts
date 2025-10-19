import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import fs from 'fs';

import { manualChunks } from './config/chunks';

// Get dynamic backend port
function getBackendPort() {
  try {
    const portFile = path.join(__dirname, '../.backend-port.json');
    if (fs.existsSync(portFile)) {
      const portData = JSON.parse(fs.readFileSync(portFile, 'utf8'));
      return portData.port || 3001;
    }
  } catch (error) {
    // Fallback to default
  }
  return 3001;
}

const backendPort = getBackendPort();

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Important for multi-entry builds
  plugins: [
    react({
      // Disable React Fast Refresh to prevent HMR issues
      fastRefresh: false,
    }),
    // Bundle analyzer - only in build mode
    process.env['ANALYZE'] && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean) as any,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@admin': path.resolve(__dirname, 'src/admin-app'),
      '@tenant': path.resolve(__dirname, 'src/tenant-app'),
      '@main': path.resolve(__dirname, 'src/main-site'),
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Allow access from network
    // port: 5177, // Let Vite auto-detect available port
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.localhost', // Allow all localhost subdomains
      '.lvh.me', // Allow all lvh.me subdomains for local testing
      '.thatsmartsite.com', // Allow all thatsmartsite.com subdomains
    ],
    hmr: {
      port: -1, // Disable HMR completely
      host: null,
    },
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (_proxyReq, _req) => {
            // console.log('Proxying:', req.method, req.url, req.headers['content-type']);
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err.message);
          });
        },
      },
      '/uploads': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Inject backend URL for frontend use
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(`http://localhost:${backendPort}`),
  },
  build: {
    // DEBUG: Disable minification to get readable error messages
    minify: false,
    // Optimize for better performance
    target: 'esnext',
    // DEBUG: Always enable source maps for debugging
    sourcemap: true,
    rollupOptions: {
      // Multiple entry points for main-site, admin, and tenant apps
      input: {
        main: path.resolve(__dirname, 'index.html'), // Main site = Marketing site
        'main-site': path.resolve(__dirname, 'src/main-site/index.html'),
        admin: path.resolve(__dirname, 'src/admin-app/index.html'),
        tenant: path.resolve(__dirname, 'src/tenant-app/index.html'),
      },
      // Exclude problematic files from build
      external: (id) => {
        return id.includes('.legacy') || id.includes('_archive');
      },
      output: {
        // DEBUG: Split vendor chunks to isolate circular imports
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          if (id.includes('@tanstack')) return 'query-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: '[name]/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure HTML files go to the correct location
        dir: 'dist',
      },
    },
  },
});
