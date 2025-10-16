const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBody, validateParams, validateQuery } = require('../middleware/zodValidation');
const { tenantSchemas } = require('../schemas/apiSchemas');
// TODO: Add authentication to protected routes
// const { authenticateToken } = require('../middleware/auth');
const { apiLimiter, sensitiveAuthLimiter } = require('../middleware/rateLimiter');
const tenantController = require('../controllers/tenantController');

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

module.exports = router;