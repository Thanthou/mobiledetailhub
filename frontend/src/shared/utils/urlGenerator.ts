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
      baseDomain: 'lvh.me',
      port: window.location.port || '5175'
    };
  }
  
  // Production configuration
  return {
    isDevelopment: false,
    baseDomain: 'thatsmartsite.com',
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
