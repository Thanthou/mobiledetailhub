/**
 * Unified Tenant Resolution Utility
 * 
 * Provides a single, consistent way to resolve tenant information from:
 * 1. Custom domains (mydetailing.com → tenant)
 * 2. Subdomains (slug.thatsmartsite.com → tenant)
 * 3. Explicit parameters (query/header fallback for testing/API)
 * 
 * This consolidates multiple resolution strategies into one place.
 */

import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('tenantResolution');

// Reserved subdomains that should NOT be treated as tenant slugs
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'main', 'main-site', 'tenant', 'staging', 'dev',
  'cdn', 'assets', 'static', 'img', 'images', 'media',
  'mail', 'email', 'ftp', 'blog', 'support', 'help',
  'docs', 'status', 'monitoring', 'metrics', 'logs'
];

/**
 * Extract subdomain from hostname
 * @param {string} hostname - Request hostname
 * @param {string} baseDomain - Base domain (e.g., 'thatsmartsite.com')
 * @returns {string|null} - Subdomain or null
 */
export function extractSubdomain(hostname, baseDomain = 'thatsmartsite.com') {
  // Remove port if present
  const cleanHost = hostname.toLowerCase().split(':')[0];
  
  // Split by dots
  const parts = cleanHost.split('.');
  
  // localhost or 127.0.0.1 → no subdomain
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return null;
  }
  
  // subdomain.localhost → subdomain (for development)
  if (parts.length >= 2 && parts[1] === 'localhost') {
    const subdomain = parts[0];
    return RESERVED_SUBDOMAINS.includes(subdomain) ? null : subdomain;
  }
  
  // subdomain.baseDomain → subdomain (for production)
  const baseParts = baseDomain.split('.');
  if (parts.length >= baseParts.length + 1) {
    const domainMatch = parts.slice(-baseParts.length).join('.') === baseDomain;
    if (domainMatch) {
      const subdomain = parts[0];
      return RESERVED_SUBDOMAINS.includes(subdomain) ? null : subdomain;
    }
  }
  
  // slug.staging.baseDomain → slug (for staging environments)
  if (parts.length >= baseParts.length + 2) {
    const stagingMatch = parts.slice(-baseParts.length - 1).join('.') === `staging.${baseDomain}`;
    if (stagingMatch) {
      const subdomain = parts[0];
      return RESERVED_SUBDOMAINS.includes(subdomain) ? null : subdomain;
    }
  }
  
  return null;
}

/**
 * Resolve tenant from request using multiple strategies
 * Priority order:
 * 1. Custom domain match (mydetailing.com)
 * 2. Subdomain match (slug.thatsmartsite.com)
 * 3. Explicit query parameter (?tenant=slug)
 * 4. Explicit header (X-Tenant-Slug: slug)
 * 
 * @param {Object} req - Express request object
 * @param {Object} pool - Database pool instance
 * @param {Object} options - Resolution options
 * @returns {Promise<Object>} - Resolution result
 */
export async function resolveTenant(req, pool, options = {}) {
  const {
    baseDomain = 'thatsmartsite.com',
    allowExplicitParams = true, // Allow ?tenant= and X-Tenant-Slug
    skipDatabase = false, // Skip database lookup (slug only)
  } = options;

  const hostname = req.hostname.toLowerCase();
  const result = {
    slug: null,
    tenantId: null,
    tenant: null,
    method: null, // How tenant was resolved
    isCustomDomain: false,
    isMainSite: false,
    isAdminSite: false,
    isTenantSite: false
  };

  // 1️⃣ Check for explicit parameters (testing/API use)
  if (allowExplicitParams) {
    const explicitSlug = req.query.tenant || req.get('X-Tenant-Slug');
    if (explicitSlug) {
      result.slug = explicitSlug;
      result.method = req.query.tenant ? 'query_param' : 'header';
      logger.debug('Tenant resolved via explicit parameter', {
        slug: result.slug,
        method: result.method
      });
      
      // Early return if skipDatabase
      if (skipDatabase) {
        result.isTenantSite = true;
        return result;
      }
      
      // Fetch from database
      if (pool) {
        const tenantResult = await pool.query(
          'SELECT * FROM tenants.business WHERE slug = $1 AND application_status = $2',
          [result.slug, 'approved']
        );
        
        if (tenantResult.rows.length > 0) {
          result.tenant = tenantResult.rows[0];
          result.tenantId = result.tenant.id;
          result.isTenantSite = true;
          return result;
        }
      }
      
      // Slug provided but tenant not found
      logger.warn('Explicit tenant slug not found', { slug: result.slug });
      result.slug = null;
      result.method = null;
    }
  }

  // 2️⃣ Check for custom domain match (highest priority for normal requests)
  if (!skipDatabase && pool) {
    try {
      const domainResult = await pool.query(
        'SELECT * FROM tenants.business WHERE website_domain = $1 AND application_status = $2',
        [hostname, 'approved']
      );
      
      if (domainResult.rows.length > 0) {
        result.tenant = domainResult.rows[0];
        result.tenantId = result.tenant.id;
        result.slug = result.tenant.slug;
        result.method = 'custom_domain';
        result.isCustomDomain = true;
        result.isTenantSite = true;
        
        logger.info('Tenant resolved via custom domain', {
          hostname,
          slug: result.slug,
          tenantId: result.tenantId
        });
        
        return result;
      }
    } catch (error) {
      logger.error('Error checking custom domain', {
        hostname,
        error: error.message
      });
    }
  }

  // 3️⃣ Extract subdomain
  const subdomain = extractSubdomain(hostname, baseDomain);
  
  // Check if it's admin
  if (subdomain === 'admin') {
    result.slug = null;
    result.method = 'admin_subdomain';
    result.isAdminSite = true;
    return result;
  }

  // No subdomain → main site
  if (!subdomain) {
    result.slug = null;
    result.method = 'no_subdomain';
    result.isMainSite = true;
    return result;
  }

  // Subdomain found
  result.slug = subdomain;
  result.method = 'subdomain';

  // 4️⃣ Database lookup for subdomain
  if (!skipDatabase && pool) {
    try {
      const subdomainResult = await pool.query(
        'SELECT * FROM tenants.business WHERE slug = $1 AND application_status = $2',
        [subdomain, 'approved']
      );
      
      if (subdomainResult.rows.length > 0) {
        result.tenant = subdomainResult.rows[0];
        result.tenantId = result.tenant.id;
        result.isTenantSite = true;
        
        logger.info('Tenant resolved via subdomain', {
          subdomain,
          slug: result.slug,
          tenantId: result.tenantId
        });
        
        return result;
      }
      
      // Subdomain found but no tenant in DB
      logger.warn('Subdomain has no matching tenant', {
        subdomain,
        hostname
      });
      
    } catch (error) {
      logger.error('Error looking up tenant by subdomain', {
        subdomain,
        error: error.message
      });
    }
  }

  // Subdomain exists but tenant not found (or skipDatabase=true)
  if (result.slug) {
    result.isTenantSite = true;
  }

  return result;
}

/**
 * Create Express middleware for unified tenant resolution
 * @param {Object} pool - Database pool instance
 * @param {Object} options - Resolution options
 * @returns {Function} Express middleware
 */
export function createTenantResolutionMiddleware(pool, options = {}) {
  return async (req, res, next) => {
    try {
      const resolution = await resolveTenant(req, pool, options);
      
      // Attach to request
      req.tenantResolution = resolution;
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
        resolutionMethod: resolution.method
      };
      
      logger.debug('Tenant resolution complete', {
        hostname: req.hostname,
        slug: resolution.slug,
        tenantId: resolution.tenantId,
        method: resolution.method,
        isMainSite: resolution.isMainSite,
        isAdminSite: resolution.isAdminSite,
        isTenantSite: resolution.isTenantSite
      });
      
      next();
      
    } catch (error) {
      logger.error('Tenant resolution failed', {
        hostname: req.hostname,
        error: error.message,
        stack: error.stack
      });
      
      // Set safe defaults on error
      req.tenantSlug = null;
      req.tenantId = null;
      req.tenant = null;
      req.isMainSite = true;
      req.isAdminSite = false;
      req.isTenantSite = false;
      req.isCustomDomain = false;
      
      next();
    }
  };
}

/**
 * Simple validator: ensure tenant was resolved
 * Use this in routes that REQUIRE a tenant
 */
export function requireTenant(req, res, next) {
  if (!req.tenantId || !req.tenant) {
    logger.warn('Route requires tenant but none was resolved', {
      hostname: req.hostname,
      path: req.path,
      method: req.method
    });
    
    return res.status(400).json({
      success: false,
      error: 'Tenant required',
      message: 'This endpoint requires a valid tenant context'
    });
  }
  
  next();
}

export {
  RESERVED_SUBDOMAINS
};

