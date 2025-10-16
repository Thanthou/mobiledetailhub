/**
 * Centralized Environment Configuration
 * 
 * This module validates and exports all environment variables used in the application.
 * Always import from this module instead of using import.meta.env directly.
 * 
 * @example
 * ```ts
 * import { env, config } from '@/shared/env';
 * 
 * // Use env for raw values
 * if (env.DEV) { ... }
 * 
 * // Use config for computed/derived values
 * const apiUrl = config.apiBaseUrl;
 * ```
 */

import { z } from "zod";

const EnvSchema = z.object({
  // Vite built-in variables
  MODE: z.enum(["development", "production", "test"]),
  DEV: z.boolean(),
  PROD: z.boolean(),
  
  // API Configuration
  VITE_API_URL: z.string().optional(),
  VITE_API_URL_LOCAL: z.string().optional(),
  VITE_API_URL_LIVE: z.string().optional(),
  VITE_API_BASE_URL: z.string().optional(),
  
  // Third-party API Keys
  VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // Feature Flags
  VITE_ENABLE_SW: z.string().optional(), // Service worker flag ('1' or '0')
});

/**
 * Validated environment variables
 * Raw access to env vars - prefer using `config` for derived values
 */
export const env = EnvSchema.parse(import.meta.env);

/**
 * Computed configuration derived from environment variables
 * This provides cleaner access patterns and type-safe defaults
 */
export const config = {
  // Environment
  isDevelopment: env.DEV,
  isProduction: env.PROD,
  mode: env.MODE,
  
  // API Configuration
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://192.168.4.21:3001', // Use network IP for mobile compatibility
  apiUrl: env.VITE_API_URL || (env.PROD ? env.VITE_API_URL_LIVE || '' : ''),
  apiUrls: {
    local: env.VITE_API_URL_LOCAL || 'http://localhost:3001',
    live: env.VITE_API_URL_LIVE || '',
  },
  
  // Third-party Services
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  
  // Feature Flags
  serviceWorkerEnabled: env.VITE_ENABLE_SW === '1' && env.PROD,
} as const;