/**
 * Subdomain Test Routes
 * For testing subdomain middleware functionality
 */

import express from 'express';
import { createModuleLogger } from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

const logger = createModuleLogger('subdomainTest');
const router = express.Router();

/**
 * GET /api/subdomain/info
 * Returns subdomain information for debugging
 */
router.get('/info', (req, res) => {
  const info = {
    hostname: req.hostname,
    tenant: req.tenant ? {
      id: req.tenant.id,
      slug: req.tenant.slug,
      businessName: req.tenant.business_name,
      industry: req.tenant.industry,
      isActive: req.tenant.is_active
    } : null,
    tenantSlug: req.tenantSlug,
    isMainSite: req.isMainSite,
    isTenantSite: req.isTenantSite,
    isAdminSite: req.isAdminSite,
    routing: res.locals.routing,
    tenantContext: res.locals.tenant,
    timestamp: new Date().toISOString()
  };

  logger.info({
    event: 'subdomain_info_request',
    info
  }, 'Subdomain info requested');

  sendSuccess(res, 'Subdomain information retrieved successfully', info);
});

/**
 * GET /api/subdomain/test
 * Test route that responds differently based on subdomain
 */
router.get('/test', (req, res) => {
  let response = {
    status: 'success',
    message: '',
    data: {
      hostname: req.hostname,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  };

  if (req.isAdminSite) {
    response.message = 'Admin subdomain detected - admin.thatsmartsite.com';
    response.data.type = 'admin';
    response.data.accessLevel = 'admin';
  } else if (req.isTenantSite && req.tenant) {
    response.message = `Tenant subdomain detected - ${req.tenantSlug}.thatsmartsite.com`;
    response.data.type = 'tenant';
    response.data.tenant = {
      id: req.tenant.id,
      slug: req.tenant.slug,
      businessName: req.tenant.business_name,
      industry: req.tenant.industry
    };
    response.data.accessLevel = 'tenant';
  } else if (req.isMainSite) {
    response.message = 'Main site detected - thatsmartsite.com';
    response.data.type = 'main';
    response.data.accessLevel = 'public';
  } else {
    response.message = 'Unknown subdomain type';
    response.data.type = 'unknown';
    response.data.accessLevel = 'unknown';
  }

  logger.info({
    event: 'subdomain_test_request',
    response: response.data
  }, 'Subdomain test requested');

  sendSuccess(res, response.message, response.data);
});

/**
 * GET /api/subdomain/tenant-content/:slug
 * Get tenant content for a specific slug
 */
router.get('/tenant-content/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Import tenant service
    const { getTenantBySlug, getTenantWebsiteContent } = await import('../services/tenantService.js');
    
    const tenant = await getTenantBySlug(slug);
    
    if (!tenant) {
      return res.status(404).json({
        status: 'error',
        message: 'Tenant not found',
        slug
      });
    }
    
    const content = await getTenantWebsiteContent(slug);
    
    sendSuccess(res, 'Tenant content retrieved successfully', {
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        businessName: tenant.business_name,
        industry: tenant.industry,
        isActive: tenant.is_active,
        subscriptionStatus: tenant.subscription_status,
        planName: tenant.plan_name
      },
      content: content || {},
      contentTypes: content ? Object.keys(content) : []
    });
    
  } catch (error) {
    logger.error({
      event: 'tenant_content_error',
      error: error.message,
      stack: error.stack,
      slug: req.params.slug
    }, 'Error retrieving tenant content');
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

export default router;
