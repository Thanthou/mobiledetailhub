import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { sharedPublicConfig } from './vite.shared-public.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'apps/tenant-app',
  base: '/',
  publicDir: sharedPublicConfig.publicDir, // Shared public folder
  assetsInclude: ['**/*.jfif', '**/*.jpe', '**/*.mp4', '**/*.webm'], // Include JFIF images and videos
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@/main-site': path.resolve(__dirname, 'apps/main-site/src'),
      '@/admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@/tenant-app': path.resolve(__dirname, 'apps/tenant-app/src'),
      '@tenant-app': path.resolve(__dirname, 'apps/tenant-app/src'),
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
    port: 5177,
    strictPort: true,
    host: '0.0.0.0',
    open: false,
    cors: true,
    hmr: {
      host: 'localhost', // Prevent WebSocket reconnect loop
      protocol: 'ws',
    },
    fs: {
      strict: false,
      allow: sharedPublicConfig.server.fs.allow, // Use shared fs config
    },
    watch: {
      ignored: sharedPublicConfig.server.watch.ignored, // CRITICAL: Prevent infinite reload
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
    outDir: '../../dist/tenant-app',
    emptyOutDir: true,
  },
});
