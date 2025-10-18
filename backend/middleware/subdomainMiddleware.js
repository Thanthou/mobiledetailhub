/**
 * Subdomain Middleware for Multi-Tenant Routing
 * Handles slug.thatsmartsite.com → tenant-specific routing
 */

import { getTenantBySlug } from '../services/tenantService.js';
import { getPool } from '../database/pool.js';
import { createModuleLogger } from '../config/logger.js';
import { loadEnv } from '../config/env.js';

const logger = createModuleLogger('subdomainMiddleware');

/**
 * Extract subdomain from request hostname
 * @param {string} hostname - The request hostname
 * @returns {string|null} - The subdomain slug or null
 */
export async function extractSubdomain(hostname) {
  // Remove port if present (localhost:3000 → localhost)
  const cleanHost = hostname.split(':')[0];
  
  // Split by dots
  const parts = cleanHost.split('.');
  
  // For localhost development: localhost → no subdomain, but subdomain.localhost → subdomain
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return null;
  }
  
  // For localhost with subdomain: subdomain.localhost → subdomain
  if (parts.length >= 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  
  // Load environment to get BASE_DOMAIN
  const env = await loadEnv();
  const baseDomain = env.BASE_DOMAIN || 'thatsmartsite.com';
  const baseParts = baseDomain.split('.');
  
  // For production: slug.{BASE_DOMAIN} → slug (but not www)
  if (parts.length >= baseParts.length + 1) {
    const domainMatch = parts.slice(-baseParts.length).join('.') === baseDomain;
    if (domainMatch) {
      // Don't treat www as a tenant subdomain
      if (parts[0] === 'www') {
        return null;
      }
      return parts[0];
    }
  }
  
  // For staging: slug.staging.{BASE_DOMAIN} → slug
  if (parts.length >= baseParts.length + 2) {
    const stagingMatch = parts.slice(-baseParts.length - 1).join('.') === `staging.${baseDomain}`;
    if (stagingMatch) {
      return parts[0];
    }
  }
  
  return null;
}

/**
 * Subdomain middleware factory
 * @param {Object} options - Configuration options
 * @returns {Function} - Express middleware function
 */
export function createSubdomainMiddleware(options = {}) {
  const {
    // Default tenant slug for main site
    defaultTenant = null,
    // Whether to redirect invalid subdomains to main site
    redirectInvalid = true,
    // Whether to cache tenant lookups
    enableCaching = true,
    // Cache TTL in milliseconds
    cacheTTL = 5 * 60 * 1000, // 5 minutes
  } = options;

  // Simple in-memory cache for tenant lookups
  const tenantCache = new Map();

  return async (req, res, next) => {
    try {
      const hostname = req.hostname;
      const subdomain = await extractSubdomain(hostname);
      
      logger.info({
        event: 'subdomain_request',
        hostname,
        subdomain,
        path: req.path,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      }, 'Processing subdomain request');

      // No subdomain - main site
      if (!subdomain) {
        req.tenant = null;
        req.tenantSlug = null;
        req.isMainSite = true;
        req.isTenantSite = false;
        req.isAdminSite = false;
        
        logger.debug('No subdomain detected - routing to main site');
        return next();
      }

      // Check cache first
      let tenant = null;
      if (enableCaching && tenantCache.has(subdomain)) {
        const cached = tenantCache.get(subdomain);
        if (Date.now() - cached.timestamp < cacheTTL) {
          tenant = cached.data;
          logger.debug({ subdomain, cached: true }, 'Tenant found in cache');
        } else {
          tenantCache.delete(subdomain);
        }
      }

      // Fetch tenant from database if not cached
      if (!tenant) {
        try {
          tenant = await getTenantBySlug(subdomain);
          logger.info({
            event: 'tenant_lookup',
            subdomain,
            found: !!tenant,
            tenantId: tenant?.id
          }, 'Tenant lookup completed');

          // Cache the result (even if null)
          if (enableCaching) {
            tenantCache.set(subdomain, {
              data: tenant,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          logger.error({
            event: 'tenant_lookup_error',
            subdomain,
            error: error.message,
            stack: error.stack
          }, 'Failed to lookup tenant');
          
          // On database error, continue without tenant
          tenant = null;
        }
      }

      // Tenant not found
      if (!tenant) {
        logger.warn({
          event: 'tenant_not_found',
          subdomain,
          hostname
        }, 'Tenant not found for subdomain');

        if (redirectInvalid) {
          // Redirect to main site
          const mainSiteUrl = process.env.NODE_ENV === 'production' 
            ? `https://thatsmartsite.com${req.path}`
            : `http://localhost:3001${req.path}`;
          return res.redirect(301, mainSiteUrl);
        } else {
          // Return 404
          return res.status(404).json({
            error: 'Tenant not found',
            subdomain,
            message: 'This subdomain does not exist'
          });
        }
      }

      // Tenant found - set request properties and switch schema
      req.tenant = tenant;
      req.tenantSlug = subdomain;
      req.isMainSite = false;
      req.isTenantSite = true;
      req.isAdminSite = false;

      // Switch to tenant-specific schema for database operations
      try {
        const pool = await getPool();
        await pool.query('SET search_path TO tenants, public');
        
        logger.info({
          event: 'schema_switched',
          subdomain,
          tenantId: tenant.id,
          schema: 'tenants'
        }, 'Switched to tenant schema');
      } catch (schemaError) {
        logger.error({
          event: 'schema_switch_error',
          subdomain,
          error: schemaError.message
        }, 'Failed to switch schema');
      }

      logger.info({
        event: 'tenant_resolved',
        subdomain,
        tenantId: tenant.id,
        tenantName: tenant.business_name,
        path: req.path
      }, 'Tenant resolved successfully');

      next();

    } catch (error) {
      logger.error({
        event: 'subdomain_middleware_error',
        error: error.message,
        stack: error.stack,
        hostname: req.hostname,
        path: req.path
      }, 'Subdomain middleware error');

      // Continue without tenant on error
      req.tenant = null;
      req.tenantSlug = null;
      req.isMainSite = true;
      req.isTenantSite = false;
      req.isAdminSite = false;
      
      next();
    }
  };
}

/**
 * Middleware to handle admin subdomain routing
 * admin.thatsmartsite.com → admin app
 */
export function createAdminSubdomainMiddleware() {
  return async (req, res, next) => {
    const hostname = req.hostname;
    const subdomain = await extractSubdomain(hostname);
    
    if (subdomain === 'admin') {
      req.isMainSite = false;
      req.isTenantSite = false;
      req.isAdminSite = true;
      req.tenant = null;
      req.tenantSlug = null;
      
      // Switch to tenants schema for admin operations
      try {
        const pool = await getPool();
        await pool.query('SET search_path TO tenants, public');
        
        logger.info({
          event: 'admin_schema_switched',
          hostname,
          schema: 'tenants'
        }, 'Admin subdomain - switched to tenants schema');
      } catch (schemaError) {
        logger.error({
          event: 'admin_schema_switch_error',
          error: schemaError.message
        }, 'Failed to switch schema for admin');
      }
      
      logger.info({
        event: 'admin_subdomain_detected',
        hostname,
        path: req.path
      }, 'Admin subdomain detected');
    }
    
    next();
  };
}

/**
 * Middleware to add tenant context to responses
 */
export function addTenantContext(req, res, next) {
  // Add tenant info to response locals for template rendering
  if (req.tenant) {
    res.locals.tenant = {
      id: req.tenant.id,
      slug: req.tenantSlug,
      businessName: req.tenant.business_name,
      industry: req.tenant.industry,
      isActive: req.tenant.is_active
    };
  }
  
  // Add routing context
  res.locals.routing = {
    isMainSite: req.isMainSite,
    isTenantSite: req.isTenantSite,
    isAdminSite: req.isAdminSite,
    tenantSlug: req.tenantSlug
  };
  
  next();
}

/**
 * Utility function to generate tenant URLs
 */
export function generateTenantUrl(tenantSlug, path = '/') {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://thatsmartsite.com'
    : 'http://localhost:3001';
  
  if (tenantSlug === 'admin') {
    return `${baseUrl}/admin${path}`;
  }
  
  if (tenantSlug) {
    return `https://${tenantSlug}.thatsmartsite.com${path}`;
  }
  
  return `${baseUrl}${path}`;
}

// All functions are exported individually above
