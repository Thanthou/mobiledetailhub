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
    host: true, // Allow access from network
    port: 5173, // Preferred port, but will try next available if taken
    proxy: {
      '/api': 'http://192.168.4.21:3001',
      '/uploads': 'http://192.168.4.21:3001',
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
