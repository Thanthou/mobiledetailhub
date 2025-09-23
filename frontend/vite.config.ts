import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';

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
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Feature chunks - split by top-level feature folder
          if (id.includes('src/features/') && /src\/features\/([^/]+)/.test(id)) {
            const match = id.match(/src\/features\/([^/]+)/);
            if (match) {
              return `feature-${match[1]}`;
            }
          }
          
          // Shared UI components
          if (id.includes('shared/ui')) {
            return 'shared-ui';
          }
          
          // Shared utilities and hooks
          if (id.includes('shared/utils') || id.includes('shared/hooks')) {
            return 'shared-utils';
          }
        },
      },
    },
  },
});
