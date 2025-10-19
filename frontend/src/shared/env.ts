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
 * 
 * Note: For runtime configuration (API URLs, feature flags), prefer using
 * the ConfigContext and useConfig hooks instead of this static config.
 */
export const config = {
  // Environment
  isDevelopment: env.DEV,
  isProduction: env.PROD,
  mode: env.MODE,
  
  // API Configuration (fallback values - use runtime config when available)
  apiBaseUrl: env.VITE_API_BASE_URL || '/api', // Use relative path for Vite proxy
  apiUrl: env.PROD ? (env.VITE_API_URL_LIVE || '') : '', // Force empty in dev to use Vite proxy
  apiUrls: {
    local: env.VITE_API_URL_LOCAL || env.VITE_BACKEND_URL || 'http://localhost:3001',
    live: env.VITE_API_URL_LIVE || '',
  },
  
  // Third-party Services (fallback values - use runtime config when available)
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  
  // Feature Flags (fallback values - use runtime config when available)
  serviceWorkerEnabled: env.VITE_ENABLE_SW === '1' && env.PROD,
} as const;

/**
 * Runtime configuration utilities
 * These functions help integrate with the ConfigContext
 */

/**
 * Get the appropriate API base URL for the current environment
 * Prefers runtime config over build-time config
 */
export function getApiBaseUrl(runtimeConfig?: { apiBaseUrl?: string }): string {
  return runtimeConfig?.apiBaseUrl || config.apiBaseUrl;
}

/**
 * Get the appropriate API URL for the current environment
 * Prefers runtime config over build-time config
 */
export function getApiUrl(runtimeConfig?: { apiUrl?: string }): string {
  return runtimeConfig?.apiUrl || config.apiUrl;
}

/**
 * Get Google Maps API key
 * Prefers runtime config over build-time config
 */
export function getGoogleMapsApiKey(runtimeConfig?: { googleMapsApiKey?: string }): string | undefined {
  return runtimeConfig?.googleMapsApiKey || config.googleMapsApiKey;
}

/**
 * Get Stripe publishable key
 * Prefers runtime config over build-time config
 */
export function getStripePublishableKey(runtimeConfig?: { stripePublishableKey?: string }): string {
  return runtimeConfig?.stripePublishableKey || config.stripePublishableKey;
}

/**
 * Check if service worker should be enabled
 * Prefers runtime config over build-time config
 */
export function isServiceWorkerEnabled(runtimeConfig?: { features?: { serviceWorker?: boolean } }): boolean {
  return runtimeConfig?.features?.serviceWorker ?? config.serviceWorkerEnabled;
}