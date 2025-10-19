import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import fs from 'fs';

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

// Shared base configuration
export default defineConfig({
  base: './', // Important for multi-entry builds
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
  define: {
    // Inject backend URL for frontend use
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(`http://localhost:${backendPort}`),
  },
  // Shared proxy configuration
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
  build: {
    // DEBUG: Disable minification to get readable error messages
    minify: false,
    // Optimize for better performance
    target: 'esnext',
    // DEBUG: Always enable source maps for debugging
    sourcemap: true,
    rollupOptions: {
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
