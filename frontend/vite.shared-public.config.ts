/**
 * Shared Public Directory Configuration for Vite Multi-App Monorepo
 * 
 * This module provides a reusable configuration for sharing the frontend/public
 * folder across all three Vite apps (main-site, admin-app, tenant-app).
 * 
 * Problem Solved:
 * - Prevents asset duplication
 * - Avoids infinite HMR reload loops
 * - Maintains single source of truth for industry assets
 * 
 * Usage:
 * Import this in each app's vite.config.ts and spread the config.
 */

import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Shared public directory configuration
 * 
 * Points to frontend/apps/public/ (sibling to main-site, admin-app, tenant-app)
 * Configured to prevent file watcher loops
 */
export const sharedPublicConfig = {
  /**
   * Public directory - shared across all apps
   * Contains favicon.ico and industry-specific assets (mobile-detailing/, maid-service/, etc.)
   */
  publicDir: path.resolve(__dirname, 'apps/public'),
  
  /**
   * Server configuration for shared public
   */
  server: {
    fs: {
      // Allow Vite to serve files from the shared public directory
      strict: false,
      allow: [
        path.resolve(__dirname, 'apps/public'),
        path.resolve(__dirname, 'apps/main-site'),
        path.resolve(__dirname, 'apps/admin-app'),
        path.resolve(__dirname, 'apps/tenant-app'),
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
    
    watch: {
      // CRITICAL: Prevent infinite reload loops
      // Don't watch the shared public folder - static assets don't need HMR
      ignored: [
        '**/apps/public/**',      // Shared public folder (NO HMR needed)
        '**/.port-registry.json', // Port registry updates
        '**/node_modules/**',     // Dependencies
        '**/.vite/**',            // Vite cache
        '**/dist/**',             // Build output
      ],
    },
  },
};

/**
 * Get the shared public directory path
 * Useful for programmatic asset resolution
 */
export const getSharedPublicPath = () => path.resolve(__dirname, 'public');

/**
 * Check if an asset exists in the shared public directory
 * 
 * @param relativePath - Path relative to public/ (e.g., 'mobile-detailing/icons/logo.webp')
 * @returns Full path if exists, null otherwise
 */
export const resolvePublicAsset = (relativePath: string): string => {
  return path.join(getSharedPublicPath(), relativePath);
};

