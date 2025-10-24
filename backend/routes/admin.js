import express from 'express';
import { getPool } from '../database/pool.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery } from '../middleware/zodValidation.js';
import { adminSchemas } from '../schemas/apiSchemas.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createModuleLogger } from '../config/logger.js';
import { criticalAdminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const logger = createModuleLogger('adminRoutes');

/**
 * @fileoverview Admin API routes for tenant management, user administration, and platform operations
 * @version 1.0.0
 * @author That Smart Site
 */

/**
 * DELETE /api/admin/tenants/:id
 * Delete tenant and all associated data using service layer
 * @param {string} id - Tenant ID
 * @param {boolean} [force=false] - Query param: Force deletion despite validation issues
 * @param {boolean} [dryRun=false] - Query param: Only analyze what would be deleted
 * @returns {Object} Success response with deleted tenant info (or dry-run analysis)
 */
router.delete('/tenants/:id', criticalAdminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  
  const { id } = req.params;
  const { force = false, dryRun = false } = req.query;
  
  const isDryRun = dryRun === 'true' || dryRun === true;
  const isForce = force === 'true' || force === true;
  
  logger.info('[ADMIN] DELETE /tenants/:id called', { 
    id, 
    force: isForce,
    dryRun: isDryRun,
    actor: req.user?.email || 'unknown'
  });
  
  try {
    // Import the tenant deletion service
    const { deleteTenant } = await import('../services/tenantDeletionService.js');
    
    // Use the service layer for tenant deletion (or dry-run)
    const result = await deleteTenant(parseInt(id), req.user, { 
      force: isForce,
      dryRun: isDryRun
    });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        issues: result.issues,
        tenant: result.tenant
      });
    }
    
    // For dry-run, return 200 OK with analysis
    if (isDryRun) {
      return res.json({
        ...result,
        message: 'Dry-run analysis completed. No data was deleted.'
      });
    }
    
    res.json(result);
    
  } catch (error) {
    logger.error('Admin tenant deletion failed:', {
      module: 'adminRoutes',
      tenantId: id,
      error: error?.message || 'Unknown error',
      stack: error?.stack
    });
    res.status(500).json({
      success: false,
      error: 'Failed to delete tenant',
      message: error?.message || 'Unknown error occurred'
    });
  }
}));

/**
 * DELETE /api/admin/tenants/:id/soft
 * Soft delete tenant (mark as deleted but keep data)
 * @param {string} id - Tenant ID
 * @returns {Object} Success response with soft deleted tenant info
 */
router.delete('/tenants/:id/soft', criticalAdminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info('[ADMIN] SOFT DELETE /tenants/:id called', { 
    id,
    actor: req.user.email 
  });
  
  try {
    // Import the tenant deletion service
    const { softDeleteTenant } = await import('../services/tenantDeletionService.js');
    
    // Use the service layer for soft deletion
    const result = await softDeleteTenant(parseInt(id), req.user);
    
    res.json(result);
    
  } catch (error) {
    logger.error('Admin soft tenant deletion failed:', {
      module: 'adminRoutes',
      tenantId: id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Failed to soft delete tenant',
      message: error.message
    });
  }
}));

/**
 * DELETE /api/admin/tenants/:id/legacy
 * @deprecated This route has been removed. Use DELETE /api/admin/tenants/:id instead.
 * @returns {410} Gone - This endpoint is no longer available
 */
router.delete('/tenants/:id/legacy', authenticateToken, requireAdmin, (req, res) => {
  logger.warn('[ADMIN] Attempted to use deprecated legacy deletion route', {
    id: req.params.id,
    actor: req.user.email,
    ip: req.ip
  });
  
  res.status(410).json({
    success: false,
    error: 'This endpoint has been permanently removed',
    message: 'The legacy deletion route is no longer supported. Please use DELETE /api/admin/tenants/:id instead.',
    documentation: {
      newEndpoint: '/api/admin/tenants/:id',
      supportedParams: {
        force: 'boolean - Force deletion despite validation issues',
        dryRun: 'boolean - Analyze what would be deleted without actually deleting'
      },
      examples: {
        normalDeletion: 'DELETE /api/admin/tenants/123',
        forceDeletion: 'DELETE /api/admin/tenants/123?force=true',
        dryRun: 'DELETE /api/admin/tenants/123?dryRun=true'
      }
    },
    migration: {
      reason: 'The legacy route contained inline cascade logic that could diverge from database constraints. The new service-based approach uses database CASCADE DELETE constraints and is safer, more maintainable, and better audited.',
      benefits: [
        'Database-enforced cascades prevent orphaned records',
        'Centralized business logic in tenantDeletionService',
        'Better validation and dry-run capabilities',
        'Improved audit logging',
        'Transaction safety with verification'
      ]
    }
  });
});

/**
 * GET /api/admin/users
 * Get all users with their roles and tenant information
 * @param {string} [status] - Filter by user status (admin, tenant, customer, all-users)
 * @param {string} [slug] - Filter tenants by slug
 * @returns {Object} Success response with users array and count
 */
router.get('/users', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const pool = await getPool();
    
    const { status } = req.query;
    
    // Audit log the users query
    logger.info({
      action: 'QUERY_USERS',
      resource: 'users',
      status: status || 'all-users',
      query: status === 'tenants' ? 'tenants_table' : 'users_table',
      userId: req.user?.userId || 'anonymous',
      email: req.user?.email || 'anonymous'
    }, 'Admin action: Query users');
  
  if (status === 'tenants') {
    // For tenants, query the tenants table directly
    try {
      let query = `
        SELECT 
          t.id,
          t.business_name as name,
          t.business_email as email,
          t.owner,
          t.slug,
          t.application_status,
          t.business_phone as phone,
          t.created_at,
          'tenant' as role,
          t.service_areas
        FROM tenants.business t
        WHERE t.application_status = 'approved'
      `;
      
      const params = [];
      let paramIndex = 1;
      
      // Add slug filter if provided
      if (req.query.slug) {
        query += ` AND t.slug = $${paramIndex}`;
        params.push(req.query.slug);
        paramIndex++;
        logger.debug(`[ADMIN] Adding slug filter: ${req.query.slug}`);
      }
      
      query += ' ORDER BY t.created_at DESC';
      
      const result = await pool.query(query, params);
      
      logger.debug(`[ADMIN] Tenants query returned ${result.rowCount} approved tenants`);
      
      res.json({
        success: true,
        users: result.rows,
        count: result.rowCount,
        message: `Found ${result.rowCount} approved tenants in database`
      });
      return;
    } catch (tenantErr) {
      logger.error('Error in tenants query:', { error: tenantErr.message });
      throw tenantErr;
    }
  }
  
  // Get all users with their roles (admin, tenant, customer)
  let query = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.is_admin, 
      u.created_at,
      t.id as tenant_id,
      t.business_name,
      t.slug,
      CASE 
        WHEN u.is_admin = true THEN 'admin'
        WHEN t.id IS NOT NULL AND t.application_status = 'approved' THEN 'tenant'
        ELSE 'customer'
      END as role
    FROM auth.users u
    LEFT JOIN tenants.business t ON u.id = t.user_id
  `;
  const params = [];
  let paramIndex = 1;
  
  if (status && status !== 'all-users') {
    // Filter by specific role
    if (status === 'admin') {
      query += ` WHERE u.is_admin = $${paramIndex}`;
      params.push(true);
      paramIndex++;
    } else if (status === 'tenant') {
      query += ` WHERE t.id IS NOT NULL AND t.application_status = 'approved'`;
    } else if (status === 'customer') {
      query += ` WHERE u.is_admin = $${paramIndex} AND t.id IS NULL`;
      params.push(false);
      paramIndex++;
    }
  }
  
  query += ' ORDER BY u.created_at DESC';
  
  const result = await pool.query(query, params);
  
  // Transform the results to include role information
  const usersWithRoles = result.rows.map(row => ({
    ...row,
    role: row.role || (row.is_admin ? 'admin' : row.tenant_id ? 'tenant' : 'customer')
  }));
  
    res.json({
      success: true,
      users: usersWithRoles,
      count: result.rowCount,
      message: `Found ${result.rowCount} users in database`
    });
  } catch (error) {
    logger.error('Error in admin users endpoint:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.userId,
      email: req.user?.email
    });
    throw error;
  }
}));

/**
 * GET /api/admin/pending-applications
 * Get all pending tenant applications
 * @returns {Object} Success response with applications array and count
 */
router.get('/pending-applications', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  const pool = await getPool();
  
  // Audit log the pending applications query
  logger.info({
    action: 'QUERY_PENDING_APPLICATIONS',
    resource: 'tenants',
    status: 'pending',
    query_type: 'pending_applications',
    userId: req.user.userId,
    email: req.user.email
  }, 'Admin action: Query pending applications');
  
        const query = `
      SELECT 
        a.id, a.slug, a.business_name, a.owner, a.business_phone as phone, a.business_email as email, 
        a.has_insurance, a.source, a.notes, a.application_date, a.created_at,
        a.service_areas
      FROM tenants.business a
      WHERE a.application_status = 'pending' 
      ORDER BY a.application_date DESC
    `;
  
  const result = await pool.query(query);
  
  res.json({
    success: true,
    applications: result.rows,
    count: result.rowCount,
    message: `Found ${result.rowCount} pending applications`
  });
}));

/**
 * POST /api/admin/approve-application/:id
 * Approve a pending tenant application
 * @param {string} id - Application ID
 * @param {string} approved_slug - Approved business slug
 * @param {string} [admin_notes] - Optional admin notes
 * @returns {Object} Success response with tenant info and temp password
 */
router.post('/approve-application/:id', 
  validateParams(adminSchemas.approveApplication.pick({ id: true })),
  validateBody(adminSchemas.approveApplication.omit({ id: true })),
  authenticateToken, 
  requireAdmin, 
  asyncHandler(async (req, res) => {

  const pool = await getPool();
  const { id } = req.params;
  const { approved_slug, admin_notes } = req.body;
  

  
  // Check if slug is already taken
  const slugCheckQuery = 'SELECT id FROM tenants.business WHERE slug = $1 AND id != $2';
  const slugCheck = await pool.query(slugCheckQuery, [approved_slug, id]);
  
  if (slugCheck.rowCount > 0) {
    const error = new Error('Slug is already taken by another tenant');
    error.statusCode = 400;
    throw error;
  }
  
  // Check if application is still pending before updating
  const statusCheckQuery = 'SELECT application_status FROM tenants.business WHERE id = $1';
  const statusCheck = await pool.query(statusCheckQuery, [id]);
  
  if (statusCheck.rowCount === 0) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (statusCheck.rows[0].application_status !== 'pending') {
    const error = new Error('Application has already been processed');
    error.statusCode = 400;
    throw error;
  }
  
  // Get the current state for audit logging
  const currentStateQuery = 'SELECT * FROM tenants.business WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  // Update tenant status to approved
  const updateQuery = `
    UPDATE tenants.business 
    SET 
      application_status = 'approved',
      slug = $1,
      approved_date = NOW(),
      notes = CASE 
        WHEN notes IS NULL THEN $2
        ELSE notes || E'\n\nAdmin Approval Notes: ' || $2
      END
    WHERE id = $3 AND application_status = 'pending'
    RETURNING *
  `;
  
  const result = await pool.query(updateQuery, [approved_slug, admin_notes, id]);
  
  if (result.rowCount === 0) {
    const error = new Error('Application was modified by another admin. Please refresh and try again.');
    error.statusCode = 409;
    throw error;
  }
  
  const tenant = result.rows[0];
  
  // Create user account for approved tenant
  const userQuery = `
    INSERT INTO auth.users (email, password_hash, name, phone, is_admin, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `;
  
  // Generate a temporary password (tenant will reset this)
  const tempPassword = Math.random().toString(36).substring(2, 15);
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  const userResult = await pool.query(userQuery, [
    tenant.business_email,
    hashedPassword,
    tenant.owner,
    tenant.business_phone,
    false  // is_admin = false for tenants
  ]);
  
  const userId = userResult.rows[0].id;
  
  // Audit log the tenant approval
  const afterState = {
    ...tenant,
    user_id: userId
  };
  
  logger.audit('APPROVE_TENANT', 'tenants', beforeState, afterState, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  // User account is created for tenant access
  // No need for additional junction table
  
        // Process service areas if provided
      let serviceAreaResult = null;

      // Use existing service areas from the tenant record
      let serviceAreasToProcess = tenant.service_areas || [];
      if (!serviceAreasToProcess || !Array.isArray(serviceAreasToProcess) || serviceAreasToProcess.length === 0) {
        logger.warn(`No service areas found for tenant ${tenant.id}`);
        serviceAreasToProcess = [];
      }

      if (serviceAreasToProcess && Array.isArray(serviceAreasToProcess) && serviceAreasToProcess.length > 0) {
        try {
          // CLEAN APPROACH: Direct database inserts with proper service area structure
          logger.info(`Processing ${serviceAreasToProcess.length} service areas for tenant ${tenant.id}`);
          
          let processed = 0;
          const cleanServiceAreas = [];
          
          for (const area of serviceAreasToProcess) {
            const { city, state, zip } = area;
            
            if (!city || !state) {
              logger.warn(`Skipping service area with missing city or state: ${JSON.stringify(area)}`);
              continue;
            }

            // Create clean service area without slug (Option 1: Clean Separation)
            const serviceArea = {
              city: city,
              state: state.toUpperCase(),
              zip: zip ? parseInt(zip) : null,
              primary: true, // Base location is always primary
              minimum: 0, // Default minimum
              multiplier: 1.0 // Default multiplier
            };
            
            cleanServiceAreas.push(serviceArea);
            processed++;
            logger.debug(`Prepared service area: ${city}, ${state} (clean structure, no slug)`);
          }
          
          // Update tenant with clean service areas (no slugs)
          await pool.query(
            'UPDATE tenants.business SET service_areas = $1 WHERE id = $2',
            [JSON.stringify(cleanServiceAreas), tenant.id]
          );
          
          serviceAreaResult = { processed, errors: [], total: serviceAreasToProcess.length, serviceAreas: cleanServiceAreas };
          logger.info(`✅ Successfully processed ${processed} service areas for tenant ${tenant.id} with clean structure`);
          
        } catch (serviceAreaError) {
          logger.error(`Failed to process service areas for tenant ${tenant.id}:`, serviceAreaError);
          // Don't fail the approval if service area processing fails
          serviceAreaResult = { error: serviceAreaError.message };
        }
      }
  
  res.json({
    success: true,
    message: 'Application approved successfully',
    tenant: {
      ...tenant,
      user_id: userId,
      temp_password: tempPassword
    },
    service_areas: serviceAreaResult,
    note: 'User account created with temporary password. Tenant should reset password on first login.'
  });
}));

// Reject tenant application endpoint
router.post('/reject-application/:id', 
  validateParams(adminSchemas.rejectApplication.pick({ id: true })),
  validateBody(adminSchemas.rejectApplication.omit({ id: true })),
  authenticateToken, 
  requireAdmin, 
  asyncHandler(async (req, res) => {

  const pool = await getPool();
  const { id } = req.params;
  const { rejection_reason, admin_notes } = req.body;
  
  // Check if application is still pending before updating
  const statusCheckQuery = 'SELECT application_status FROM tenants.business WHERE id = $1';
  const statusCheck = await pool.query(statusCheckQuery, [id]);
  
  if (statusCheck.rowCount === 0) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (statusCheck.rows[0].application_status !== 'pending') {
    const error = new Error('Application has already been processed');
    error.statusCode = 400;
    throw error;
  }
  
  // Get the current state for audit logging
  const currentStateQuery = 'SELECT * FROM tenants.business WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  const updateQuery = `
    UPDATE tenants.business 
    SET 
      application_status = 'rejected',
      notes = CASE 
        WHEN notes IS NULL THEN $1
        ELSE notes || E'\n\nRejection Reason: ' || $1 || E'\nAdmin Notes: ' || $2
      END
    WHERE id = $3 AND application_status = 'pending'
    RETURNING *
  `;
  
  const result = await pool.query(updateQuery, [rejection_reason, admin_notes, id]);
  
  if (result.rowCount === 0) {
    const error = new Error('Application was modified by another admin. Please refresh and try again.');
    error.statusCode = 409;
    throw error;
  }
  
  const afterState = result.rows[0];
  
  // Audit log the tenant rejection
  logger.audit('REJECT_TENANT', 'tenants', beforeState, afterState, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  res.json({
    success: true,
    message: 'Application rejected successfully',
    tenant: result.rows[0]
  });
}));

// Get platform service areas (all cities/states where approved tenants serve)
router.get('/service-areas', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const pool = await getPool();

  try {
    const { getPlatformServiceAreas } = await import('../utils/serviceAreaProcessor.js');
    const serviceAreas = await getPlatformServiceAreas();
    
    res.json({
      success: true,
      service_areas: serviceAreas,
      count: serviceAreas.length
    });
  } catch (error) {
    logger.error('Error fetching platform service areas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service areas'
    });
  }
}));

// Seed reviews endpoint
router.post('/seed-reviews', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  logger.debug('Seed reviews endpoint called', { 
    userId: req.user?.userId,
    email: req.user?.email,
    ip: req.ip
  });
  
  const pool = await getPool();

  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    const error = new Error('Reviews array is required and must not be empty');
    error.statusCode = 400;
    throw error;
  }

  // Validate each review
  for (const review of reviews) {
    if (!review.name || !review.title || !review.content || !review.stars || !review.type) {
      const error = new Error('Each review must have name, title, content, stars, and type');
      error.statusCode = 400;
      throw error;
    }

    if (review.stars < 1 || review.stars > 5) {
      const error = new Error('Stars must be between 1 and 5');
      error.statusCode = 400;
      throw error;
    }

    if (review.type === 'tenant' && !review.businessSlug) {
      const error = new Error('Tenant reviews must have a businessSlug');
      error.statusCode = 400;
      throw error;
    }
  }

  const client = await pool.connect();
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  const result = { reviewIds: [] };

  try {
    await client.query('BEGIN');

    for (const review of reviews) {
      try {
        let tenantId = null;

        // Get tenant_id if this is a tenant review
        if (review.type === 'tenant') {
          const tenantQuery = 'SELECT id FROM tenants.business WHERE slug = $1';
          const tenantResult = await client.query(tenantQuery, [review.businessSlug]);
          
          if (tenantResult.rowCount === 0) {
            errors.push(`Business slug '${review.businessSlug}' not found`);
            errorCount++;
            continue;
          }
          
          // Double-check that we have a valid result before accessing it
          if (tenantResult.rows && tenantResult.rows.length > 0) {
            tenantId = tenantResult.rows[0].id;
          } else {
            errors.push(`Business slug '${review.businessSlug}' query returned no results`);
            errorCount++;
            continue;
          }
        }

        // Generate automatic fields
        const generateEmail = (name) => {
          const cleanName = name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '.');
          return `${cleanName}@email.com`;
        };

        // Import avatar utilities
        const { getAvatarUrl, findCustomAvatar } = await import('../utils/avatarUtils.js');

        // Helper function to determine service category from review content
        // TODO: Move to shared utils if needed elsewhere
        const _getServiceCategory = (content) => {
          const lowerContent = content.toLowerCase();
          if (lowerContent.includes('ceramic') || lowerContent.includes('coating')) {return 'ceramic';}
          if (lowerContent.includes('paint correction') || lowerContent.includes('paint')) {return 'paint_correction';}
          if (lowerContent.includes('boat') || lowerContent.includes('marine')) {return 'boat';}
          if (lowerContent.includes('rv') || lowerContent.includes('recreational')) {return 'rv';}
          if (lowerContent.includes('ppf') || lowerContent.includes('film')) {return 'ppf';}
          return 'auto';
        };

        // Helper function to generate service dates for reviews
        // TODO: Move to shared utils if needed elsewhere
        const _generateServiceDate = (daysAgo, weeksAgo) => {
          const now = new Date();
          let reviewDate;
          
          if (daysAgo > 0) {
            // Use days ago (0-6 days)
            reviewDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
          } else if (weeksAgo > 0) {
            // Use weeks ago (1+ weeks)
            reviewDate = new Date(now.getTime() - (weeksAgo * 7 * 24 * 60 * 60 * 1000));
          } else {
            // Default to random date within last 6 months
            const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
            const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
            reviewDate = new Date(randomTime);
          }
          
          return reviewDate.toISOString().split('T')[0];
        };

        const shouldBeFeatured = (stars, content) => {
          return stars === 5 && content.length > 100;
        };

        const email = generateEmail(review.name);
        const avatarUrl = getAvatarUrl(review.name, null, review.source); // reviewId will be null for new reviews
        
        // Use service category from form selection
        let serviceCategory = null;
        if (review.serviceCategory && review.serviceCategory !== 'none') {
          serviceCategory = review.serviceCategory;
        }
        
        const isFeatured = shouldBeFeatured(review.stars, review.content);
        
        // Calculate service_date based on days/weeks ago or specific date
        const now = new Date();
        let serviceDate;
        if (review.specificDate) {
          // Use specific date if provided
          serviceDate = new Date(review.specificDate).toISOString();
        } else if (review.daysAgo > 0) {
          serviceDate = new Date(now.getTime() - (review.daysAgo * 24 * 60 * 60 * 1000)).toISOString();
        } else if (review.weeksAgo > 0) {
          serviceDate = new Date(now.getTime() - (review.weeksAgo * 7 * 24 * 60 * 60 * 1000)).toISOString();
        } else {
          serviceDate = new Date().toISOString();
        }

        // Insert review
        const insertQuery = `
          INSERT INTO reputation.reviews (
            review_type,
            tenant_id,
            business_slug,
            rating,
            title,
            content,
            reviewer_name,
            reviewer_email,
            reviewer_avatar_url,
            reviewer_url,
            review_source,
            status,
            is_verified,
            service_category,
            service_date,
            is_featured,
            published_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING id
        `;

        const values = [
          review.type,
          tenantId,
          review.businessSlug,
          review.stars,
          review.title,
          review.content,
          review.name,
          email,
          avatarUrl,
          review.reviewerUrl || null,
          review.source || 'website',
          'approved',
          true,
          serviceCategory,
          serviceDate,
          isFeatured,
          serviceDate // Use serviceDate for published_at as well
        ];
        

        logger.debug('Executing review insert query', { 
          reviewTitle: review.title,
          businessSlug: review.businessSlug
        });
        const insertResult = await client.query(insertQuery, values);
        
        // Check if the insert was successful
        if (!insertResult.rows || insertResult.rows.length === 0) {
          errors.push(`Failed to insert review "${review.title}" - no result returned`);
          errorCount++;
          continue;
        }
        
        const reviewId = insertResult.rows[0].id;
        successCount++;
        
        // Store review ID for avatar upload
        result.reviewIds.push(reviewId);
        
        // Check if there's a custom avatar for this review and update the database
        const customAvatar = findCustomAvatar(review.name, reviewId);
        if (customAvatar) {
          await client.query(
            'UPDATE reputation.reviews SET reviewer_avatar_url = $1 WHERE id = $2',
            [customAvatar, reviewId]
          );
          logger.debug('Updated review with custom avatar', { 
            reviewId, 
            customAvatar 
          });
        }

      } catch (reviewError) {
        errors.push(`Error adding review "${review.title}": ${reviewError.message}`);
        errorCount++;
      }
    }

    await client.query('COMMIT');

    // Audit log the review seeding
    logger.audit('SEED_REVIEWS', 'reviews', { 
      totalSubmitted: reviews.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 5) // Log first 5 errors
    }, null, {
      userId: req.user.userId,
      email: req.user.email
    });

    res.json({
      success: true,
      message: `Successfully seeded ${successCount} reviews`,
      count: successCount,
      errors: errorCount,
      errorDetails: errors,
      reviewIds: result.reviewIds
    });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

export default router;
