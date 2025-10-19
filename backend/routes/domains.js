/**
 * Domain Management Routes
 * Handles custom domain operations for tenants
 * 
 * Routes:
 * - GET /api/domains/:domain - Lookup tenant by domain
 * - PUT /api/domains/:tenantId - Set custom domain
 * - DELETE /api/domains/:tenantId - Remove domain
 * - GET /api/domains/:tenantId/status - Get domain status
 * - POST /api/domains/:tenantId/verify - Verify domain
 * - GET /api/domains/:domain/available - Check domain availability
 */

import express from 'express';
import * as domainController from '../controllers/domainController.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('domainRoutes');
const router = express.Router();

// Log all domain route requests
router.use((req, res, next) => {
  logger.info({
    event: 'domain_route_request',
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  }, 'Domain route requested');
  next();
});

/**
 * GET /api/domains/:domain
 * Lookup tenant by custom domain
 * 
 * @example
 * GET /api/domains/mycustomdomain.com
 * Response: { success: true, data: { id, slug, business_name, custom_domain, ... } }
 */
router.get('/:domain', domainController.getDomainTenant);

/**
 * GET /api/domains/:domain/available
 * Check if a domain is available for use
 * 
 * @example
 * GET /api/domains/mycustomdomain.com/available?excludeTenantId=123
 * Response: { success: true, data: { domain: "mycustomdomain.com", available: true } }
 */
router.get('/:domain/available', domainController.checkDomainAvailability);

/**
 * PUT /api/domains/:tenantId
 * Set or update custom domain for a tenant
 * 
 * @example
 * PUT /api/domains/123
 * Body: { "customDomain": "mycustomdomain.com" }
 * Response: { success: true, data: { id, slug, custom_domain, domain_verified, ... } }
 */
router.put('/:tenantId', domainController.setCustomDomain);

/**
 * DELETE /api/domains/:tenantId
 * Remove custom domain from a tenant
 * 
 * @example
 * DELETE /api/domains/123
 * Response: { success: true, data: { id, slug, custom_domain: null, ... } }
 */
router.delete('/:tenantId', domainController.removeCustomDomain);

/**
 * GET /api/domains/:tenantId/status
 * Get domain verification and SSL status for a tenant
 * 
 * @example
 * GET /api/domains/123/status
 * Response: { success: true, data: { custom_domain, domain_verified, ssl_enabled, domain_added_at } }
 */
router.get('/:tenantId/status', domainController.getDomainStatus);

/**
 * POST /api/domains/:tenantId/verify
 * Verify domain ownership (placeholder for DNS verification)
 * 
 * @example
 * POST /api/domains/123/verify
 * Response: { success: true, data: { id, custom_domain, domain_verified: true, message: "..." } }
 */
router.post('/:tenantId/verify', domainController.verifyDomain);

// Error handling middleware for domain routes
router.use((error, req, res, next) => {
  logger.error({
    event: 'domain_route_error',
    method: req.method,
    path: req.path,
    error: error.message,
    stack: error.stack
  }, 'Domain route error occurred');

  res.status(500).json({
    success: false,
    error: 'Internal server error in domain routes'
  });
});

export default router;
