/**
 * Tenant Resolver Middleware (Legacy Compatibility Layer)
 * 
 * This middleware is kept for backward compatibility.
 * New code should use createTenantResolutionMiddleware from tenantResolution.js
 * 
 * Detects tenant slug from subdomain and attaches it to the request object.
 * Handles both main domain and subdomain routing for multi-tenant architecture.
 */

import { logger } from '../config/logger.js';
import { resolveTenant, RESERVED_SUBDOMAINS } from '../utils/tenantResolution.js';

/**
 * Basic tenant resolver - slug only (synchronous)
 * @deprecated Use createTenantResolutionMiddleware from tenantResolution.js
 */
export function tenantResolver(req, res, next) {
  const host = req.hostname.toLowerCase();
  
  // Parse the hostname to extract subdomain
  // thatsmartsite.com → main-site
  // testing-mobile-detail.thatsmartsite.com → testing-mobile-detail
  const parts = host.split('.');
  const domain = parts.slice(-2).join('.'); // thatsmartsite.com
  const subdomain = parts.length > 2 ? parts[0] : null;
  
  // Determine tenant slug
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    req.tenantSlug = subdomain;
  } else {
    req.tenantSlug = 'main-site'; // Default to main site for admin dashboard
  }

  // Add tenant info to request for logging/debugging
  req.tenantInfo = {
    hostname: host,
    subdomain,
    domain,
    tenantSlug: req.tenantSlug,
    isMainSite: req.tenantSlug === 'main-site'
  };

  next();
}

/**
 * Enhanced tenant resolver with database lookup
 * Uses unified tenant resolution utility
 * 
 * @param {object} pool - Database pool instance
 * @param {object} options - Resolution options
 * @returns {function} Express middleware
 */
export function tenantResolverWithDB(pool, options = {}) {
  return async (req, res, next) => {
    if (!pool) {
      logger.warn('tenantResolverWithDB called but pool is not available');
      req.tenantId = null;
      req.tenantSlug = null;
      req.tenant = null;
      req.isMainSite = true;
      req.isAdminSite = false;
      req.isTenantSite = false;
      return next();
    }

    try {
      // Use unified resolver
      const resolution = await resolveTenant(req, pool, {
        baseDomain: options.baseDomain || 'thatsmartsite.com',
        allowExplicitParams: options.allowExplicitParams !== false,
        skipDatabase: false
      });

      // Attach results to request
      req.tenantSlug = resolution.slug;
      req.tenantId = resolution.tenantId;
      req.tenant = resolution.tenant;
      req.isMainSite = resolution.isMainSite;
      req.isAdminSite = resolution.isAdminSite;
      req.isTenantSite = resolution.isTenantSite;
      req.isCustomDomain = resolution.isCustomDomain;
      
      // Backward compatibility: tenantInfo object
      req.tenantInfo = {
        hostname: req.hostname,
        subdomain: resolution.method === 'subdomain' ? resolution.slug : null,
        domain: req.hostname.split('.').slice(-2).join('.'),
        tenantSlug: resolution.slug,
        isMainSite: resolution.isMainSite,
        resolutionMethod: resolution.method,
        businessName: resolution.tenant?.business_name,
        customDomain: resolution.tenant?.website_domain
      };
      
      next();
      
    } catch (error) {
      logger.error('Database error in tenantResolverWithDB', {
        error: error.message,
        hostname: req.hostname
      });
      
      // Safe defaults
      req.tenantId = null;
      req.tenantSlug = null;
      req.tenant = null;
      req.isMainSite = true;
      req.isAdminSite = false;
      req.isTenantSite = false;
      
      next();
    }
  };
}
