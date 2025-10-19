/**
 * Tenant Validation Middleware
 * 
 * Ensures consistent tenant context validation across all routes.
 * Uses the shared tenant context contract for validation.
 */

import { validateTenantContext, generateTenantApiResponse, generateTenantErrorResponse } from '../utils/tenantContextContract.js';
import { asyncHandler } from './errorHandler.js';
import { createModuleLogger } from '../config/logger.js';

const logger = createModuleLogger('tenantValidation');

/**
 * Middleware to validate tenant context exists and is valid
 */
const validateTenantExists = asyncHandler(async (req, res, next) => {
  logger.debug('Validating tenant context', {
    requestId: req.id,
    path: req.path,
    method: req.method,
    hasTenant: !!req.tenant,
    hasUser: !!req.user
  });

  if (!req.tenant) {
    logger.warn('Tenant validation failed: No tenant context', {
      requestId: req.id,
      path: req.path,
      method: req.method
    });

    return res.status(404).json(generateTenantErrorResponse({
      code: 'NO_TENANT_CONTEXT',
      message: 'No tenant context available for this request'
    }, { requestId: req.id }));
  }

  // Validate tenant context using shared contract
  const validation = validateTenantContext(req.tenant);
  
  if (!validation.isValid) {
    logger.warn('Tenant validation failed', {
      requestId: req.id,
      path: req.path,
      method: req.method,
      error: validation.error
    });

    return res.status(validation.error.statusCode).json(generateTenantErrorResponse(
      validation.error,
      { requestId: req.id }
    ));
  }

  logger.debug('Tenant validation successful', {
    requestId: req.id,
    tenantId: req.tenant.id,
    tenantSlug: req.tenant.slug,
    path: req.path
  });

  next();
});

/**
 * Middleware to validate tenant is approved
 */
const validateTenantApproved = asyncHandler(async (req, res, next) => {
  if (!req.tenant) {
    return res.status(404).json(generateTenantErrorResponse({
      code: 'NO_TENANT_CONTEXT',
      message: 'No tenant context available'
    }, { requestId: req.id }));
  }

  if (req.tenant.applicationStatus !== 'approved') {
    logger.warn('Tenant approval validation failed', {
      requestId: req.id,
      tenantId: req.tenant.id,
      tenantSlug: req.tenant.slug,
      status: req.tenant.applicationStatus,
      path: req.path
    });

    return res.status(403).json(generateTenantErrorResponse({
      code: 'TENANT_NOT_APPROVED',
      message: 'Tenant is not approved for this operation'
    }, { requestId: req.id }));
  }

  next();
});

/**
 * Middleware to validate user has access to tenant
 */
const validateTenantAccess = asyncHandler(async (req, res, next) => {
  if (!req.tenant || !req.user) {
    return res.status(401).json(generateTenantErrorResponse({
      code: 'AUTHENTICATION_REQUIRED',
      message: 'Authentication required for tenant access'
    }, { requestId: req.id }));
  }

  // Admin users have access to all tenants
  if (req.user.isAdmin) {
    logger.debug('Admin access granted to tenant', {
      requestId: req.id,
      tenantId: req.tenant.id,
      userId: req.user.userId,
      path: req.path
    });
    return next();
  }

  // Regular users can only access their own tenant
  if (req.user.userId && req.tenant.user_id && req.user.userId.toString() !== req.tenant.user_id.toString()) {
    logger.warn('Tenant access denied: User does not own tenant', {
      requestId: req.id,
      tenantId: req.tenant.id,
      userId: req.user.userId,
      tenantUserId: req.tenant.user_id,
      path: req.path
    });

    return res.status(403).json(generateTenantErrorResponse({
      code: 'TENANT_ACCESS_DENIED',
      message: 'User does not have access to this tenant'
    }, { requestId: req.id }));
  }

  next();
});

/**
 * Middleware to add tenant context to response headers
 */
const addTenantHeaders = (req, res, next) => {
  if (req.tenant) {
    res.setHeader('X-Tenant-ID', req.tenant.id);
    res.setHeader('X-Tenant-Slug', req.tenant.slug);
    res.setHeader('X-Tenant-Domain', req.tenant.domain);
  }

  if (req.user) {
    res.setHeader('X-User-ID', req.user.userId);
    res.setHeader('X-User-Email', req.user.email);
  }

  next();
};

/**
 * Middleware to log tenant context for debugging
 */
const logTenantContext = (req, res, next) => {
  if (req.tenant) {
    logger.debug('Tenant context attached', {
      requestId: req.id,
      tenantId: req.tenant.id,
      tenantSlug: req.tenant.slug,
      tenantDomain: req.tenant.domain,
      businessName: req.tenant.businessName,
      applicationStatus: req.tenant.applicationStatus,
      industry: req.tenant.industry,
      path: req.path,
      method: req.method
    });
  }

  next();
};

export {
  validateTenantExists,
  validateTenantApproved,
  validateTenantAccess,
  addTenantHeaders,
  logTenantContext
};
