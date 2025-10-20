import { defineConfig, mergeConfig } from 'vite';
import { sharedConfig } from './vite.config.shared';
import path from 'path';

export default defineConfig(
  mergeConfig(sharedConfig, {
    server: {
      host: 'tenant.localhost',
      port: 5179,
      hmr: {
        protocol: 'ws',
        host: 'tenant.localhost',
        port: 5179,
      },
    },
    build: {
      outDir: 'dist/tenant-app',
      rollupOptions: {
        input: {
          tenant: path.resolve(__dirname, 'tenant-app/index.html'),
        },
      },
    },
  })
);
