import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      shared: resolve(__dirname, '../shared'),
    },
  },
  // Handle client-side routing in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Ensure proper handling of client-side routes
  server: {
    historyApiFallback: true,
  },
});
