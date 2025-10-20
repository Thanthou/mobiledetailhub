/**
 * Tenant Context Contract
 * 
 * Provides consistent tenant context transformation between frontend and backend.
 * Ensures the same data structure is used across all layers.
 */

/**
 * Transform database business row to standardized tenant info
 * @param {Object} businessRow - Database row from tenants.business table
 * @param {string} domain - Domain for the tenant (e.g., 'tenant.thatsmartsite.com')
 * @returns {Object} Standardized tenant info
 */
function transformBusinessToTenantInfo(businessRow, domain = null) {
  // Parse service areas if it's a JSON string
  let serviceAreas = [];
  if (businessRow.service_areas) {
    try {
      serviceAreas = typeof businessRow.service_areas === 'string' 
        ? JSON.parse(businessRow.service_areas) 
        : businessRow.service_areas;
    } catch (error) {
      console.warn('Error parsing service_areas:', error);
      serviceAreas = [];
    }
  }

  // Construct domain if not provided
  const tenantDomain = domain || `${businessRow.slug}.thatsmartsite.com`;

  return {
    id: businessRow.id.toString(),
    slug: businessRow.slug,
    schema: 'tenants', // Standard schema name
    domain: tenantDomain,
    businessName: businessRow.business_name,
    owner: businessRow.owner,
    businessEmail: businessRow.business_email,
    personalEmail: businessRow.personal_email,
    businessPhone: businessRow.business_phone,
    personalPhone: businessRow.personal_phone,
    industry: businessRow.industry,
    applicationStatus: businessRow.application_status,
    businessStartDate: businessRow.business_start_date,
    website: businessRow.website,
    
    socialMedia: {
      facebook: businessRow.facebook_url,
      instagram: businessRow.instagram_url,
      tiktok: businessRow.tiktok_url,
      youtube: businessRow.youtube_url,
      googleBusiness: businessRow.gbp_url,
    },
    
    serviceAreas: serviceAreas,
    
    createdAt: businessRow.created_at,
    updatedAt: businessRow.updated_at,
    lastActivity: businessRow.last_activity,
  };
}

/**
 * Validate tenant context
 * @param {Object} tenantInfo - Tenant info object
 * @returns {Object} Validation result
 */
function validateTenantContext(tenantInfo) {
  if (!tenantInfo) {
    return {
      isValid: false,
      error: {
        code: 'NO_TENANT_CONTEXT',
        message: 'No tenant context available',
        statusCode: 404,
      },
    };
  }

  // Required fields validation
  const requiredFields = ['id', 'slug', 'businessName', 'applicationStatus'];
  for (const field of requiredFields) {
    if (!tenantInfo[field]) {
      return {
        isValid: false,
        error: {
          code: 'INVALID_TENANT_CONTEXT',
          message: `Missing required field: ${field}`,
          statusCode: 400,
        },
      };
    }
  }

  // Application status validation
  if (tenantInfo.applicationStatus !== 'approved') {
    return {
      isValid: false,
      error: {
        code: 'TENANT_NOT_APPROVED',
        message: 'Tenant is not approved',
        statusCode: 403,
      },
    };
  }

  return {
    isValid: true,
    tenant: tenantInfo,
  };
}

/**
 * Create standardized tenant context for middleware
 * @param {Object} businessRow - Database row
 * @param {Object} user - User context (optional)
 * @param {string} requestId - Request ID for correlation
 * @returns {Object} Complete tenant context
 */
function createTenantContext(businessRow, user = null, requestId = null) {
  const tenantInfo = transformBusinessToTenantInfo(businessRow);
  
  return {
    tenant: tenantInfo,
    user: user ? {
      id: user.userId?.toString() || user.id?.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
      roles: user.roles || [],
    } : null,
    requestId: requestId,
    correlationId: requestId,
  };
}

/**
 * Middleware helper to attach tenant context to request
 * @param {Object} req - Express request object
 * @param {Object} businessRow - Database row
 * @param {Object} user - User context (optional)
 */
function attachTenantContext(req, businessRow, user = null) {
  const tenantInfo = transformBusinessToTenantInfo(businessRow);
  
  // Attach to request object
  req.tenant = tenantInfo;
  req.tenantContext = createTenantContext(businessRow, user, req.id);
  
  // For backward compatibility, also set the old format
  req.tenant = businessRow;
}

/**
 * Generate tenant API response
 * @param {Object} tenantInfo - Tenant info
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized API response
 */
function generateTenantApiResponse(tenantInfo, meta = {}) {
  return {
    success: true,
    data: tenantInfo,
    meta: {
      requestId: meta.requestId || null,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      ...meta,
    },
  };
}

/**
 * Generate tenant error response
 * @param {Object} error - Error object
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized error response
 */
function generateTenantErrorResponse(error, meta = {}) {
  return {
    success: false,
    error: {
      code: error.code || 'TENANT_ERROR',
      message: error.message || 'An error occurred with tenant context',
      details: error.details || null,
    },
    meta: {
      requestId: meta.requestId || null,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      ...meta,
    },
  };
}

export {
  transformBusinessToTenantInfo,
  validateTenantContext,
  createTenantContext,
  attachTenantContext,
  generateTenantApiResponse,
  generateTenantErrorResponse,
};
