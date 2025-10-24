/**
 * URL Builder Utility
 * 
 * Constructs frontend URLs based on environment and port configuration.
 * Reads ports from .port-registry.json (single source of truth)
 */

import { env } from '../config/env.async.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read port registry (single source of truth for all ports)
let portRegistry;
try {
  const registryPath = join(__dirname, '../../.port-registry.json');
  portRegistry = JSON.parse(readFileSync(registryPath, 'utf8'));
} catch (error) {
  console.warn('Warning: Could not read .port-registry.json, using defaults');
  portRegistry = {
    main: { port: 5175 },
    admin: { port: 5176 },
    tenant: { port: 5177 },
    backend: { port: 3001 },
  };
}

/**
 * Build frontend URL based on environment
 */
function buildFrontendUrl(app = 'main') {
  const isDev = env.NODE_ENV === 'development';
  const port = portRegistry[app]?.port;
  
  if (isDev) {
    // Development: http://localhost:PORT (from port-registry)
    return `http://localhost:${port}`;
  }
  
  // Production: https://subdomain.domain.com or https://domain.com
  const domain = env.BASE_DOMAIN || 'thatsmartsite.com';
  
  if (app === 'main') {
    return `https://${domain}`;
  }
  
  return `https://${app}.${domain}`;
}

/**
 * Get all frontend URLs
 */
export function getFrontendUrls() {
  return {
    main: buildFrontendUrl('main'),
    admin: buildFrontendUrl('admin'),
    tenant: buildFrontendUrl('tenant'),
  };
}

/**
 * Get specific frontend URL
 */
export function getFrontendUrl(app = 'main') {
  return buildFrontendUrl(app);
}

/**
 * Get backend URL
 */
export function getBackendUrl() {
  const isDev = env.NODE_ENV === 'development';
  
  if (isDev) {
    return `http://localhost:${portRegistry.backend?.port || 3001}`;
  }
  
  const domain = env.BASE_DOMAIN || 'thatsmartsite.com';
  return `https://api.${domain}`;
}

/**
 * Get ports configuration from registry
 */
export function getPorts() {
  return Object.entries(portRegistry).reduce((acc, [key, value]) => {
    acc[key] = value.port;
    return acc;
  }, {});
}

/**
 * Get port registry
 */
export function getPortRegistry() {
  return { ...portRegistry };
}

/**
 * Generate allowed origins for CORS based on port registry
 */
export function getAllowedOrigins() {
  const isDev = env.NODE_ENV === 'development';
  
  if (isDev) {
    // Development: localhost with all frontend ports
    return [
      `http://localhost:${portRegistry.main?.port || 5175}`,
      `http://localhost:${portRegistry.admin?.port || 5176}`,
      `http://localhost:${portRegistry.tenant?.port || 5177}`,
    ];
  }
  
  // Production: subdomains
  const domain = env.BASE_DOMAIN || 'thatsmartsite.com';
  return [
    `https://${domain}`,
    `https://admin.${domain}`,
    `https://tenant.${domain}`,
  ];
}

export default {
  getFrontendUrls,
  getFrontendUrl,
  getBackendUrl,
  getPorts,
  getPortRegistry,
  getAllowedOrigins,
};

