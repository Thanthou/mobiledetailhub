/**
 * Utility functions for generating URLs based on environment
 */

import { env } from '../config/env';

export interface EnvironmentConfig {
  isDevelopment: boolean;
  baseDomain: string;
  port?: string;
}

/**
 * Get the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const isDevelopment = env.DEV;
  
  if (isDevelopment) {
    return {
      isDevelopment: true,
      baseDomain: env.TENANT_BASE_DOMAIN_DEV,
      port: env.TENANT_APP_PORT
    };
  }
  
  // Production configuration
  return {
    isDevelopment: false,
    baseDomain: env.TENANT_BASE_DOMAIN_PROD,
    port: undefined // No port needed in production
  };
}

/**
 * Generate a tenant website URL
 */
export function generateTenantWebsiteUrl(slug: string): string {
  const config = getEnvironmentConfig();
  
  if (config.isDevelopment) {
    return `http://${slug}.${config.baseDomain}:${config.port}/`;
  }
  
  return `https://${slug}.${config.baseDomain}/`;
}

/**
 * Generate a tenant dashboard URL
 */
export function generateTenantDashboardUrl(slug: string): string {
  const config = getEnvironmentConfig();
  
  if (config.isDevelopment) {
    return `http://${slug}.${config.baseDomain}:${config.port}/dashboard`;
  }
  
  return `https://${slug}.${config.baseDomain}/dashboard`;
}

/**
 * Generate a tenant onboarding URL
 */
export function generateTenantOnboardingUrl(): string {
  const config = getEnvironmentConfig();
  
  if (config.isDevelopment) {
    return `http://localhost:${config.port}/tenant-onboarding`;
  }
  
  return `https://${config.baseDomain}/tenant-onboarding`;
}
