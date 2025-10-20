import { defineConfig, mergeConfig } from 'vite';
import { sharedConfig } from './vite.config.shared';
import path from 'path';

export default defineConfig(
  mergeConfig(sharedConfig, {
    server: {
      host: 'main.localhost',
      port: 5175,
      hmr: {
        protocol: 'ws',
        host: 'main.localhost',
        port: 5175,
      },
    },
    build: {
      outDir: 'dist/main-site',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'main-site/index.html'),
        },
      },
    },
  })
);
