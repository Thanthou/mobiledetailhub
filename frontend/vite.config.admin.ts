import { defineConfig, mergeConfig } from 'vite';
import { sharedConfig } from './vite.config.shared';
import path from 'path';

export default defineConfig(
  mergeConfig(sharedConfig, {
    server: {
      host: 'admin.localhost',
      port: 5177,
      hmr: {
        protocol: 'ws',
        host: 'admin.localhost',
        port: 5177,
      },
    },
    build: {
      outDir: 'dist/admin-app',
      rollupOptions: {
        input: {
          admin: path.resolve(__dirname, 'admin-app/index.html'),
        },
      },
    },
  })
);
