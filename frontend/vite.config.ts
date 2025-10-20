import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";
import path from "path";
import fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

//──────────────────────────────────────────────
// 🔧 Backend Port Detection (for proxy)
//──────────────────────────────────────────────
function getBackendPort() {
  try {
    const portFile = path.join(__dirname, "../.backend-port.json");
    if (fs.existsSync(portFile)) {
      const portData = JSON.parse(fs.readFileSync(portFile, "utf8"));
      return portData.port || 3001;
    }
  } catch {
    // ignore
  }
  return 3001;
}

const backendPort = getBackendPort();

//──────────────────────────────────────────────
// ⚙️ Vite Config
//──────────────────────────────────────────────
export default defineConfig({
  base: "./", // ✅ ensures relative asset paths (critical!)
  plugins: [
    react({
      fastRefresh: false, // avoids HMR issues
    }),
    process.env["ANALYZE"] &&
      visualizer({
        filename: "dist/bundle-analysis.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@admin": path.resolve(__dirname, "src/admin-app"),
      "@tenant": path.resolve(__dirname, "src/tenant-app"),
      "@main": path.resolve(__dirname, "src/main-site"),
    },
    dedupe: ['react', 'react-dom', 'scheduler'],
  },

  optimizeDeps: {
    exclude: ["lucide-react"],
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".localhost",
      ".lvh.me",
      ".thatsmartsite.com",
    ],
    hmr: {
      port: -1,
      host: null,
    },
    proxy: {
      "/api": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  define: {
    "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
      `http://localhost:${backendPort}`
    ),
  },

  build: {
    outDir: "dist",
    sourcemap: true,
    target: "esnext",
    minify: false, // easier debugging
    rollupOptions: {
      input: {
        "main-site": path.resolve(__dirname, "apps/main-site/index.html"),
        "tenant-app": path.resolve(__dirname, "apps/tenant-app/index.html"),
        "admin-app": path.resolve(__dirname, "apps/admin-app/index.html"),
      },
      external: (id) => id.includes('.legacy') || id.includes('_archive'),
      output: {
        // ✅ ensures each app's assets stay in its own folder
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router'))
            return 'react-vendor';
          if (id.includes('@tanstack')) return 'query-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
        // Entry files go flat (no folder prefix) - Vite places them via input keys
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name?.includes("main-site"))
            return "main-site/assets/[name]-[hash].js";
          if (chunkInfo.name?.includes("tenant-app"))
            return "tenant-app/assets/[name]-[hash].js";
          if (chunkInfo.name?.includes("admin-app"))
            return "admin-app/assets/[name]-[hash].js";
          return "assets/[name]-[hash].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.includes("main-site"))
            return "main-site/assets/[name]-[hash].[ext]";
          if (assetInfo.name?.includes("tenant-app"))
            return "tenant-app/assets/[name]-[hash].[ext]";
          if (assetInfo.name?.includes("admin-app"))
            return "admin-app/assets/[name]-[hash].[ext]";
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
});
