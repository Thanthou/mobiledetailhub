import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import fs from 'fs';

//─────────────────────────────────────────────
// 🔧 Helper — dynamic backend port detection
//─────────────────────────────────────────────
function getBackendPort() {
  try {
    const portFile = path.join(__dirname, '../.backend-port.json');
    if (fs.existsSync(portFile)) {
      const portData = JSON.parse(fs.readFileSync(portFile, 'utf8'));
      return portData.port || 3001;
    }
  } catch {
    /* ignore */
  }
  return 3001;
}

const backendPort = getBackendPort();

//─────────────────────────────────────────────
// 🚀 Vite Config
//─────────────────────────────────────────────
export default defineConfig({
  base: './', // Important for multi-entry static builds
  plugins: [
    react({
      fastRefresh: false, // Disable HMR refresh noise
    }),
    process.env['ANALYZE'] &&
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean) as any,

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

  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.localhost',
      '.lvh.me',
      '.thatsmartsite.com',
    ],
    hmr: {
      port: -1,
      host: null,
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

  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
      `http://localhost:${backendPort}`
    ),
  },

  build: {
    minify: false, // Easier debugging of prod builds
    target: 'esnext',
    sourcemap: true,
    outDir: 'dist',

    rollupOptions: {
      // ✅ Only three entry points now
      input: {
        'main-site': path.resolve(__dirname, 'main-site/index.html'),
        'admin-app': path.resolve(__dirname, 'admin-app/index.html'),
        'tenant-app': path.resolve(__dirname, 'tenant-app/index.html'),
      },
      

      external: (id) => id.includes('.legacy') || id.includes('_archive'),

      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router'))
            return 'react-vendor';
          if (id.includes('@tanstack')) return 'query-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          // Place entry JS files in their app folders
          return `${chunkInfo.name}/${chunkInfo.name}-[hash].js`;
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
