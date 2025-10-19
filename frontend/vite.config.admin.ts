import { defineConfig } from 'vite';
import base from './vite.config.base';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  ...base,
  plugins: [react()],
  server: {
    host: 'admin.localhost',
    port: 5177,
    hmr: {
      protocol: 'ws',
      host: 'admin.localhost',
      port: 5177,
    },
    proxy: base.proxy, // reuse shared proxy config
  },
  build: {
    ...base.build,
    rollupOptions: {
      ...base.build?.rollupOptions,
      input: {
        admin: path.resolve(__dirname, 'src/admin-app/index.html'),
      },
    },
  },
});
