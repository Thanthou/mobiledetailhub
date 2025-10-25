import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody, validateParams, validateQuery } from '../middleware/zodValidation.js';
import { tenantSchemas } from '../schemas/validation/index.js';
// TODO: Add authentication to protected routes
// import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter, sensitiveAuthLimiter } from '../middleware/rateLimiter.js';
import * as tenantController from '../controllers/tenantController.js';

/**
 * POST /api/tenants/signup
 * Create new tenant account with user and business record
 */
router.post('/signup', 
  sensitiveAuthLimiter, 
  validateBody(tenantSchemas.signup),
  asyncHandler(tenantController.createTenant)
);

/**
 * GET /api/tenants/:slug
 * Fetch tenant data by slug with industry information
 */
router.get('/:slug', 
  apiLimiter, 
  validateParams(tenantSchemas.getBySlug),
  asyncHandler(tenantController.getTenantBySlug)
);

/**
 * PUT /api/tenants/:slug
 * Update tenant business data by slug
 */
router.put('/:slug', 
  apiLimiter, 
  validateParams(tenantSchemas.getBySlug),
  asyncHandler(tenantController.updateTenantBySlug)
);

/**
 * GET /api/tenants
 * Fetch tenants by industry (optional filter)
 */
router.get('/', 
  apiLimiter, 
  validateQuery(tenantSchemas.list),
  asyncHandler(tenantController.getTenantsByIndustry)
);

/**
 * GET /api/tenants/industries/list
 * Get list of available industries
 */
router.get('/industries/list', apiLimiter, asyncHandler(tenantController.getIndustries));

export default router;