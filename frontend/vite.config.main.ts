import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'apps/main-site',
  base: '/',
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@/main-site': path.resolve(__dirname, 'apps/main-site/src'),
      '@/admin-app': path.resolve(__dirname, 'apps/admin-app/src'),
      '@/tenant-app': path.resolve(__dirname, 'apps/tenant-app/src'),
      '@/data': path.resolve(__dirname, 'src/data'),
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
      allow: ['../..'], // Allow accessing src directory from apps/main-site
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
    outDir: '../../dist/main-site',
    emptyOutDir: true,
  },
});
