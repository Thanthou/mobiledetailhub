/**
 * Domain Controller
 * Handles HTTP requests for custom domain management
 * 
 * Endpoints:
 * - GET /api/domains/:domain - Lookup tenant by domain
 * - PUT /api/domains/:tenantId - Set custom domain
 * - DELETE /api/domains/:tenantId - Remove domain
 * - GET /api/domains/:tenantId/status - Get domain status
 * - POST /api/domains/:tenantId/verify - Verify domain
 */

import * as domainService from '../services/domainService.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('domainController');

/**
 * GET /api/domains/:domain
 * Look up a tenant by its custom domain
 */
export async function getDomainTenant(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain) {
      return res.status(400).json({ 
        success: false,
        error: 'Domain parameter is required' 
      });
    }

    const tenant = await domainService.getTenantByDomain(domain);
    
    if (!tenant) {
      return res.status(404).json({ 
        success: false,
        error: 'Domain not found' 
      });
    }

    // Return only safe tenant data (exclude sensitive fields)
    const safeTenant = {
      id: tenant.id,
      slug: tenant.slug,
      business_name: tenant.business_name,
      custom_domain: tenant.custom_domain,
      domain_verified: tenant.domain_verified,
      ssl_enabled: tenant.ssl_enabled,
      domain_added_at: tenant.domain_added_at
    };

    logger.info({
      event: 'domain_tenant_lookup',
      domain,
      tenantId: tenant.id
    }, 'Tenant found by domain');

    res.json({
      success: true,
      data: safeTenant
    });
  } catch (error) {
    logger.error({
      event: 'domain_tenant_lookup_error',
      domain: req.params.domain,
      error: error.message
    }, 'Failed to lookup tenant by domain');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to lookup tenant by domain' 
    });
  }
}

/**
 * PUT /api/domains/:tenantId
 * Assign or update a custom domain for tenant
 */
export async function setCustomDomain(req, res) {
  try {
    const { tenantId } = req.params;
    const { customDomain } = req.body;

    if (!customDomain) {
      return res.status(400).json({ 
        success: false,
        error: 'customDomain is required' 
      });
    }

    // Check if domain is already in use
    const isAvailable = await domainService.isDomainAvailable(customDomain, tenantId);
    if (!isAvailable) {
      return res.status(409).json({ 
        success: false,
        error: 'Domain is already in use by another tenant' 
      });
    }

    const tenant = await domainService.setTenantDomain(tenantId, customDomain);

    logger.info({
      event: 'custom_domain_set',
      tenantId,
      customDomain
    }, 'Custom domain set for tenant');

    res.json({
      success: true,
      data: {
        id: tenant.id,
        slug: tenant.slug,
        business_name: tenant.business_name,
        custom_domain: tenant.custom_domain,
        domain_verified: tenant.domain_verified,
        ssl_enabled: tenant.ssl_enabled,
        domain_added_at: tenant.domain_added_at
      }
    });
  } catch (error) {
    logger.error({
      event: 'custom_domain_set_error',
      tenantId: req.params.tenantId,
      customDomain: req.body.customDomain,
      error: error.message
    }, 'Failed to set custom domain');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to set custom domain' 
    });
  }
}

/**
 * DELETE /api/domains/:tenantId
 * Remove a custom domain from a tenant
 */
export async function removeCustomDomain(req, res) {
  try {
    const { tenantId } = req.params;
    
    const tenant = await domainService.removeTenantDomain(tenantId);

    logger.info({
      event: 'custom_domain_removed',
      tenantId
    }, 'Custom domain removed from tenant');

    res.json({
      success: true,
      data: {
        id: tenant.id,
        slug: tenant.slug,
        business_name: tenant.business_name,
        custom_domain: tenant.custom_domain,
        domain_verified: tenant.domain_verified,
        ssl_enabled: tenant.ssl_enabled
      }
    });
  } catch (error) {
    logger.error({
      event: 'custom_domain_removal_error',
      tenantId: req.params.tenantId,
      error: error.message
    }, 'Failed to remove custom domain');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove custom domain' 
    });
  }
}

/**
 * GET /api/domains/:tenantId/status
 * Get verification/SSL status for a tenant domain
 */
export async function getDomainStatus(req, res) {
  try {
    const { tenantId } = req.params;
    
    const status = await domainService.getDomainStatus(tenantId);
    
    if (!status) {
      return res.status(404).json({ 
        success: false,
        error: 'Tenant not found' 
      });
    }

    logger.info({
      event: 'domain_status_requested',
      tenantId,
      hasCustomDomain: !!status.custom_domain
    }, 'Domain status requested');

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error({
      event: 'domain_status_error',
      tenantId: req.params.tenantId,
      error: error.message
    }, 'Failed to get domain status');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to get domain status' 
    });
  }
}

/**
 * POST /api/domains/:tenantId/verify
 * Verify domain ownership (placeholder for future DNS verification)
 */
export async function verifyDomain(req, res) {
  try {
    const { tenantId } = req.params;
    
    // For now, just mark as verified (in production, you'd verify DNS records)
    const tenant = await domainService.updateDomainVerification(tenantId, true);

    logger.info({
      event: 'domain_verification_requested',
      tenantId
    }, 'Domain verification requested');

    res.json({
      success: true,
      data: {
        id: tenant.id,
        custom_domain: tenant.custom_domain,
        domain_verified: tenant.domain_verified,
        message: 'Domain verification completed (placeholder)'
      }
    });
  } catch (error) {
    logger.error({
      event: 'domain_verification_error',
      tenantId: req.params.tenantId,
      error: error.message
    }, 'Failed to verify domain');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify domain' 
    });
  }
}

/**
 * GET /api/domains/:domain/available
 * Check if a domain is available for use
 */
export async function checkDomainAvailability(req, res) {
  try {
    const { domain } = req.params;
    const { excludeTenantId } = req.query;
    
    if (!domain) {
      return res.status(400).json({ 
        success: false,
        error: 'Domain parameter is required' 
      });
    }

    const isAvailable = await domainService.isDomainAvailable(domain, excludeTenantId);

    logger.info({
      event: 'domain_availability_checked',
      domain,
      isAvailable,
      excludeTenantId
    }, 'Domain availability checked');

    res.json({
      success: true,
      data: {
        domain,
        available: isAvailable
      }
    });
  } catch (error) {
    logger.error({
      event: 'domain_availability_error',
      domain: req.params.domain,
      error: error.message
    }, 'Failed to check domain availability');
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to check domain availability' 
    });
  }
}
