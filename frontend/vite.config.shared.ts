import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

//─────────────────────────────────────────────
// 🔧 Static backend port configuration
//─────────────────────────────────────────────
const backendPort = 3001;

//─────────────────────────────────────────────
// 🚀 Shared Vite Configuration
//─────────────────────────────────────────────
export const sharedConfig: UserConfig = {
  base: './', // Important for multi-entry static builds
  
  plugins: [
    react({
      fastRefresh: true, // Enable HMR for better DX
    }),
    // Bundle analyzer (only when ANALYZE env var is set)
    process.env['ANALYZE'] &&
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@admin': path.resolve(__dirname, 'src/admin-app'),
      '@tenant': path.resolve(__dirname, 'src/tenant-app'),
      '@main': path.resolve(__dirname, 'src/main-site'),
    },
    // ✅ Prevent React duplication across sub-apps
    dedupe: ['react', 'react-dom', 'scheduler'],
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  define: {
    // Inject backend URL for frontend use
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
      `http://localhost:${backendPort}`
    ),
  },

  server: {
    fs: {
      allow: ['..'], // Allow accessing files from parent directory (src/)
    },
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err) => {
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

  build: {
    // Disable minification for easier debugging
    minify: false,
    // Optimize for better performance
    target: 'esnext',
    // Always enable source maps for debugging
    sourcemap: true,
    
    rollupOptions: {
      // Exclude problematic files from build
      external: (id: string) => {
        return id.includes('.legacy') || id.includes('_archive');
      },
      output: {
        // Split vendor chunks to isolate dependencies
        manualChunks: (id: string) => {
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
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
};

// Export as default for convenience
export default defineConfig(sharedConfig);

