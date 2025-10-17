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
 * Update tenant business data by slug
 */
async function updateTenantBySlug(req, res) {
  const { slug } = req.params;
  const updateData = req.body;
  
  try {
    const updatedTenant = await tenantService.updateTenantBySlug(slug, updateData);
    
    res.json({
      success: true,
      data: updatedTenant,
      message: 'Business profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    
    if (error.message === 'Tenant not found or not approved') {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found or not approved'
      });
    }
    
    if (error.message === 'No valid fields to update') {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update business profile',
      message: error.message
    });
  }
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
  getIndustries,
  updateTenantBySlug
};
