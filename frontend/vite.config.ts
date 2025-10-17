import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

import { manualChunks } from './config/chunks';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 5176, // Use current port
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
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
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Enable minification for production builds
    minify: 'esbuild',
    // Optimize for better performance
    target: 'esnext',
    // Enable source maps for debugging (disable in production)
    sourcemap: process.env['NODE_ENV'] !== 'production',
    rollupOptions: {
      // Exclude problematic files from build
      external: (id) => {
        return id.includes('.legacy') || id.includes('_archive');
      },
      output: {
        // Centralized chunk strategy from config/chunks.ts
        manualChunks,
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
