import { defineConfig } from 'vite';
import base from './vite.config.base';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  ...base,
  plugins: [react()],
  server: {
    host: 'tenant.localhost',
    port: 5179,
    hmr: {
      protocol: 'ws',
      host: 'tenant.localhost',
      port: 5179,
    },
    proxy: base.proxy, // reuse shared proxy config
  },
  build: {
    ...base.build,
    rollupOptions: {
      ...base.build?.rollupOptions,
      input: {
        tenant: path.resolve(__dirname, 'src/tenant-app/index.html'),
      },
    },
  },
});
