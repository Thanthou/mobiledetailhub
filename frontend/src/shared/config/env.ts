/**
 * Centralized Frontend Environment Configuration
 * 
 * Single source of truth for all environment variables used in the frontend.
 * Provides type safety and defaults for missing values.
 * 
 * Usage:
 *   import { env } from '@shared/config/env';
 *   const backendUrl = env.BACKEND_URL;
 */

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = import.meta.env.DEV === true;

/**
 * Check if we're in production mode
 */
export const isProduction = import.meta.env.PROD === true;

/**
 * Get current mode (development, production, etc)
 */
export const mode = import.meta.env.MODE || 'development';

/**
 * Centralized environment configuration
 */
export const env = {
  // Backend API
  BACKEND_URL: getEnv('VITE_BACKEND_URL', 'http://localhost:3001'),
  
  // Build info
  MODE: mode,
  DEV: isDevelopment,
  PROD: isProduction,
  
  // Tenant App URLs
  TENANT_APP_PORT: getEnv('VITE_TENANT_APP_PORT', '5177'),
  TENANT_BASE_DOMAIN_DEV: getEnv('VITE_TENANT_BASE_DOMAIN_DEV', 'tenant.localhost'),
  TENANT_BASE_DOMAIN_PROD: getEnv('VITE_TENANT_BASE_DOMAIN_PROD', 'thatsmartsite.com'),
  
  // Add other env vars as needed
  // STRIPE_KEY: getEnv('VITE_STRIPE_PUBLISHABLE_KEY'),
  // GOOGLE_MAPS_KEY: getEnv('VITE_GOOGLE_MAPS_API_KEY'),
} as const;

/**
 * Type-safe access to environment variables
 */
export type Env = typeof env;

