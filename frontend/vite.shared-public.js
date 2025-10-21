import path from "path";

/**
 * Shared public configuration for all apps
 * - Points to frontend/apps/public
 * - Adds safe fs.allow & watcher ignores
 */
export const sharedPublicConfig = {
  publicDir: path.resolve(__dirname, "apps/public"),
  server: {
    fs: {
      strict: false,
      allow: ["apps/public", "apps/main-site", "apps/admin-app", "apps/tenant-app", "node_modules"],
    },
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.port-registry.json",
        "**/.vite/**",
      ],
    },
  },
};
