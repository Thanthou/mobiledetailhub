import * as tenantService from '../services/tenantService.js';

/**
 * Tenant Controller
 * Handles HTTP requests and responses for tenant operations
 */

/**
 * Create new tenant account
 */
async function createTenant(req, res) {
  const tenantData = req.body;
  
  const result = await tenantService.createTenant(tenantData);
  
  // Log tenant creation for now (TODO: Send welcome email)
  console.log('\n=== NEW TENANT SIGNUP ===');
  console.log(`Business: ${tenantData.businessName}`);
  console.log(`Owner: ${tenantData.firstName} ${tenantData.lastName}`);
  console.log(`Email: ${tenantData.personalEmail}`);
  console.log(`Slug: ${result.slug}`);
  console.log(`Website URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}${result.websiteUrl}`);
  console.log(`Dashboard URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}${result.dashboardUrl}`);
  console.log(`Plan: ${tenantData.selectedPlan} ($${tenantData.planPrice}/month)`);
  console.log('========================\n');

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: result
  });
}

/**
 * Get tenant by slug
 */
async function getTenantBySlug(req, res) {
  const { slug } = req.params;
  
  const tenant = await tenantService.getTenantBySlug(slug);
  
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found or not approved'
    });
  }
  
  res.json({
    success: true,
    data: tenant
  });
}

/**
 * Get tenants by industry
 */
async function getTenantsByIndustry(req, res) {
  const { industry, status = 'approved' } = req.query;
  
  const tenants = await tenantService.getTenantsByIndustry(industry, status);
  
  res.json({
    success: true,
    data: tenants
  });
}

/**
 * Get list of available industries
 */
async function getIndustries(req, res) {
  const industries = await tenantService.getIndustries();
  
  res.json({
    success: true,
    data: industries
  });
}

export {
  createTenant,
  getTenantBySlug,
  getTenantsByIndustry,
  getIndustries
};
