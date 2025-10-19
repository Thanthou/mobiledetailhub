import { defineConfig } from 'vite';
import base from './vite.config.base';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  ...base,
  plugins: [react()],
  server: {
    host: 'main.localhost',
    port: 5175,
    hmr: {
      protocol: 'ws',
      host: 'main.localhost',
      port: 5175,
    },
    proxy: base.proxy, // reuse shared proxy config
  },
  build: {
    ...base.build,
    rollupOptions: {
      ...base.build?.rollupOptions,
      input: {
        main: path.resolve(__dirname, 'src/main-site/index.html'),
      },
    },
  },
});
