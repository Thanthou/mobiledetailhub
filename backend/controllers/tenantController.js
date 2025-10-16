const tenantService = require('../services/tenantService');

/**
 * Tenant Controller
 * Handles HTTP requests and responses for tenant operations
 */

/**
 * Create new tenant account
 */
async function createTenant(req, res) {
  const tenantData = req.body;
  
  try {
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
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Get tenant by slug
 */
async function getTenantBySlug(req, res) {
  const { slug } = req.params;
  
  try {
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
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Get tenants by industry
 */
async function getTenantsByIndustry(req, res) {
  const { industry, status = 'approved' } = req.query;
  
  try {
    const tenants = await tenantService.getTenantsByIndustry(industry, status);
    
    res.json({
      success: true,
      data: tenants
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

/**
 * Get list of available industries
 */
async function getIndustries(req, res) {
  try {
    const industries = await tenantService.getIndustries();
    
    res.json({
      success: true,
      data: industries
    });
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
}

module.exports = {
  createTenant,
  getTenantBySlug,
  getTenantsByIndustry,
  getIndustries
};
