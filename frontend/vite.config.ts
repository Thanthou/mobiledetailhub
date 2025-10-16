import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';

import { manualChunks } from './config/chunks';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    port: 5175, // Use current port
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
    rollupOptions: {
      output: {
        // Centralized chunk strategy from config/chunks.ts
        manualChunks,
      },
    },
  },
});
