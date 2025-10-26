import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { sharedPublicConfig } from './vite.shared-public.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'apps/main',
  base: '/',
  envDir: path.resolve(__dirname, '..'), // Load .env from project root (parent of frontend/)
  publicDir: sharedPublicConfig.publicDir, // Shared public folder
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@/main': path.resolve(__dirname, 'apps/main/src'),
      '@main': path.resolve(__dirname, 'apps/main/src'),
      '@/admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@/data': path.resolve(__dirname, 'src/data'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@/../config': path.resolve(__dirname, 'config'),
    },
    dedupe: ['react', 'react-dom', 'scheduler'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5175,
    strictPort: true,
    host: '0.0.0.0',
    open: false,
    cors: true,
    fs: {
      allow: ['../..'], // Allow accessing src directory from apps/main
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
  },
});
