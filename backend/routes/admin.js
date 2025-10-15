const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
// TODO: Re-enable validation middleware when schemas are implemented
// const { validateBody, validateParams, sanitize } = require('../middleware/validation');
// const { adminSchemas, sanitizationSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { adminLimiter, criticalAdminLimiter } = require('../middleware/rateLimiter');

// Delete tenant and associated data
router.delete('/tenants/:id', criticalAdminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  logger.info('[ADMIN] DELETE /tenants/:id called with id:', { id: req.params.id });
  

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  const { id } = req.params;
  
  // Start a transaction to ensure data consistency
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // First, try to find the tenant by ID
    const findTenantQuery = 'SELECT business_email as email, business_name, slug FROM tenants.business WHERE id = $1';
    const tenantResult = await client.query(findTenantQuery, [id]);
    
    // If not found in tenants table, try to find by user ID
    if (tenantResult.rowCount === 0) {
      logger.debug(`Tenant ID ${id} not found in tenants table, checking users table...`);
      const findUserQuery = 'SELECT email, name FROM auth.users WHERE id = $1';
      const userResult = await client.query(findUserQuery, [id]);
      
      if (userResult.rowCount === 0) {
        await client.query('ROLLBACK');
        const error = new Error('Tenant not found in either tenants or users table');
        error.statusCode = 404;
        throw error;
      }
      
      // User exists but no tenant record - just delete the user
      const user = userResult.rows[0];
      const deleteUserQuery = 'DELETE FROM auth.users WHERE id = $1';
      await client.query(deleteUserQuery, [id]);
      
      // Audit log the user deletion
      logger.audit('DELETE_USER', 'users', { id: parseInt(id), name: user.name, email: user.email }, null, {
        userId: req.user.userId,
        email: req.user.email
      });
      
      logger.info(`Deleted user record ${id} (${user.name})`);
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: `User "${user.name}" has been deleted successfully`,
        deletedUser: {
          id: parseInt(id),
          name: user.name,
          email: user.email
        }
      });
      return;
    }
    
    // Tenant found - proceed with full deletion
    const tenant = tenantResult.rows[0];
    
    // Log the tenant data before deletion for audit
    const tenantBeforeState = {
      id: parseInt(id),
      business_name: tenant.business_name,
      slug: tenant.slug,
      email: tenant.email
    };
    
    logger.info(`Starting comprehensive deletion for tenant: ${tenant.business_name} (ID: ${id})`);
    
    // Delete in order to respect foreign key constraints
    // 1. Delete reviews for this tenant
    await client.query('DELETE FROM reputation.reviews WHERE tenant_slug = $1', [tenant.slug]);
    logger.info(`Deleted reviews for tenant: ${tenant.slug}`);
    
    // 2. Delete tenant images
    await client.query('DELETE FROM tenants.tenant_images WHERE tenant_slug = $1', [tenant.slug]);
    logger.info(`Deleted tenant images for: ${tenant.slug}`);
    
    // 3. Delete website content
    await client.query('DELETE FROM website.content WHERE business_id = $1', [id]);
    logger.info(`Deleted website content for business ID: ${id}`);
    
    // 4. Delete health monitoring records
    await client.query('DELETE FROM system.health_monitoring WHERE business_id = $1 OR tenant_slug = $2', [id, tenant.slug]);
    logger.info(`Deleted health monitoring records for: ${tenant.slug}`);
    
    // 5. Delete subscriptions
    await client.query('DELETE FROM tenants.subscriptions WHERE business_id = $1', [id]);
    logger.info(`Deleted subscriptions for business ID: ${id}`);
    
    // 6. Delete service tiers (which reference services)
    const serviceTiersResult = await client.query(
      'DELETE FROM tenants.service_tiers WHERE service_id IN (SELECT id FROM tenants.services WHERE business_id = $1)',
      [id]
    );
    logger.info(`Deleted ${serviceTiersResult.rowCount} service tiers for business ID: ${id}`);
    
    // 7. Delete services
    await client.query('DELETE FROM tenants.services WHERE business_id = $1', [id]);
    logger.info(`Deleted services for business ID: ${id}`);
    
    // 8. Delete booking-related records
    await client.query('DELETE FROM booking.bookings WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted bookings for affiliate ID: ${id}`);
    
    await client.query('DELETE FROM booking.quotes WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted quotes for affiliate ID: ${id}`);
    
    await client.query('DELETE FROM booking.availability WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted availability records for affiliate ID: ${id}`);
    
    // 9. Delete schedule-related records
    await client.query('DELETE FROM schedule.time_blocks WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted time blocks for affiliate ID: ${id}`);
    
    await client.query('DELETE FROM schedule.blocked_days WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted blocked days for affiliate ID: ${id}`);
    
    await client.query('DELETE FROM schedule.appointments WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted appointments for affiliate ID: ${id}`);
    
    await client.query('DELETE FROM schedule.schedule_settings WHERE affiliate_id = $1', [id]);
    logger.info(`Deleted schedule settings for affiliate ID: ${id}`);
    
    // 10. Delete customer-related records (if any customers are linked to this tenant's bookings)
    // Note: We don't delete customers themselves as they may have interacted with other tenants
    // But we do delete communications and vehicles linked to this tenant's customers
    const customerIds = await client.query(
      'SELECT DISTINCT customer_id FROM booking.bookings WHERE affiliate_id = $1 AND customer_id IS NOT NULL',
      [id]
    );
    if (customerIds.rowCount > 0) {
      const ids = customerIds.rows.map(r => r.customer_id);
      // Only delete communications/vehicles if customers are exclusive to this tenant
      logger.info(`Found ${ids.length} customers associated with tenant`);
    }
    
    // 11. Get user_id before deleting tenant record
    const userIdResult = await client.query('SELECT user_id FROM tenants.business WHERE id = $1', [id]);
    const userId = userIdResult.rowCount > 0 ? userIdResult.rows[0].user_id : null;
    
    // 12. Delete the tenant record itself
    const deleteTenantQuery = 'DELETE FROM tenants.business WHERE id = $1';
    await client.query(deleteTenantQuery, [id]);
    logger.info(`Deleted tenant record ${id}`);
    
    // 13. Finally, delete the corresponding user record (if exists)
    if (userId) {
      await client.query('DELETE FROM auth.users WHERE id = $1', [userId]);
      logger.info(`Deleted user record for user ID: ${userId}`);
    } else if (tenant.email) {
      // Fallback: try deleting by email
      const userDeleteResult = await client.query('DELETE FROM auth.users WHERE email = $1', [tenant.email]);
      logger.info(`Deleted ${userDeleteResult.rowCount} user record(s) for email: ${tenant.email}`);
    }
    
    // Audit log the tenant deletion
    logger.audit('DELETE_TENANT', 'tenants', tenantBeforeState, null, {
      userId: req.user.userId,
      email: req.user.email
    });
    
    // Commit the transaction
    await client.query('COMMIT');
    
    logger.info(`Successfully deleted tenant: ${tenant.business_name} (${tenant.slug})`);
    
    res.json({
      success: true,
      message: `Tenant "${tenant.business_name}" has been deleted successfully`,
      deletedTenant: {
        id: parseInt(id),
        business_name: tenant.business_name,
        slug: tenant.slug,
        email: tenant.email
      }
    });
    
  } catch (transactionError) {
    await client.query('ROLLBACK');
    throw transactionError;
  } finally {
    client.release();
  }
}));

// Users endpoint
router.get('/users', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  const { status } = req.query;
  
  // Audit log the users query
  logger.adminAction('QUERY_USERS', 'users', { 
    status: status || 'all-users',
    query: status === 'tenants' ? 'tenants_table' : 'users_table'
  }, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  if (status === 'tenants') {
    // For tenants, query the tenants table directly
    try {
      // Check if there are any tenants
      const countCheck = await pool.query('SELECT COUNT(*) FROM tenants.business');
      const tenantCount = parseInt(countCheck.rows[0].count);
      
      if (tenantCount === 0) {
        res.json({
          success: true,
          users: [],
          count: 0,
          message: 'No tenants found'
        });
        return;
      }
      
      let query = `
        SELECT 
          a.id, a.owner as name, a.business_email as email, a.created_at,
          a.business_name, a.application_status, a.slug, a.business_phone as phone, a.service_areas
        FROM tenants.business a
        WHERE a.application_status = 'approved'
      `;
      
      const params = [];
      let paramIndex = 1;
      
      // Add slug filter if provided
      if (req.query.slug) {
        query += ` AND a.slug = $${paramIndex}`;
        params.push(req.query.slug);
        paramIndex++;
        logger.debug(`[ADMIN] Adding slug filter: ${req.query.slug}`);
      }
      
      query += ' ORDER BY a.created_at DESC';
      
      const result = await pool.query(query, params);
      
      logger.debug(`[ADMIN] Tenants query returned ${result.rowCount} approved tenants`);
      logger.debug(`[ADMIN] Tenant names:`, { names: result.rows.map(r => r.business_name) });
      logger.debug(`[ADMIN] Query executed:`, { query, params, rowCount: result.rowCount });
      
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
  
  // Join with tenants.business to get tenant information
  let query = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.is_admin, 
      u.created_at,
      t.id as tenant_id,
      t.business_name,
      t.slug
    FROM auth.users u
    LEFT JOIN tenants.business t ON u.id = t.user_id AND t.application_status = 'approved'
  `;
  const params = [];
  
  if (status && status !== 'all-users') {
    // Map frontend status to database fields
    const statusMap = {
      'admin': 'u.is_admin = $1',
      'customers': 'u.is_admin = $1 AND t.id IS NULL'  // Not admin and not a tenant
    };
    
    // Map frontend status to actual database values
    const valueMap = {
      'admin': true,
      'customers': false
    };
    
    if (statusMap[status]) {
      query += ` WHERE ${statusMap[status]}`;
      params.push(valueMap[status]);
    }
  }
  
  query += ' ORDER BY u.created_at DESC';
  
  const result = await pool.query(query, params);
  
  res.json({
    success: true,
    users: result.rows,
    count: result.rowCount,
    message: `Found ${result.rowCount} users in database`
  });
}));

// Pending tenant applications endpoint
router.get('/pending-applications', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  // Audit log the pending applications query
  logger.adminAction('QUERY_PENDING_APPLICATIONS', 'tenants', { 
    status: 'pending',
    query_type: 'pending_applications'
  }, {
    userId: req.user.userId,
    email: req.user.email
  });
  
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

// Approve tenant application endpoint
router.post('/approve-application/:id', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  const { id } = req.params;
  const { approved_slug, admin_notes } = req.body;
  
  // Validate admin notes length
  if (admin_notes && admin_notes.length > 1000) {
    const error = new Error('Admin notes must be less than 1000 characters long');
    error.statusCode = 400;
    throw error;
  }
  
  // Validate slug format and length
  if (!approved_slug || approved_slug.length < 3 || approved_slug.length > 50) {
    const error = new Error('Slug must be between 3 and 50 characters long');
    error.statusCode = 400;
    throw error;
  }
  
  if (!/^[a-z0-9-]+$/.test(approved_slug)) {
    const error = new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    error.statusCode = 400;
    throw error;
  }
  
  if (approved_slug.startsWith('-') || approved_slug.endsWith('-')) {
    const error = new Error('Slug cannot start or end with a hyphen');
    error.statusCode = 400;
    throw error;
  }
  
  if (approved_slug.includes('--')) {
    const error = new Error('Slug cannot contain consecutive hyphens');
    error.statusCode = 400;
    throw error;
  }
  

  
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
  const bcrypt = require('bcryptjs');
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
router.post('/reject-application/:id', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  const { id } = req.params;
  const { rejection_reason, admin_notes } = req.body;
  
  // Validate admin notes length
  if (admin_notes && admin_notes.length > 1000) {
    const error = new Error('Admin notes must be less than 1000 characters long');
    error.statusCode = 400;
    throw error;
  }
  
  // Validate rejection reason
  if (!rejection_reason || rejection_reason.trim().length < 10) {
    const error = new Error('Rejection reason must be at least 10 characters long');
    error.statusCode = 400;
    throw error;
  }
  
  if (rejection_reason.trim().length > 500) {
    const error = new Error('Rejection reason must be less than 500 characters long');
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
router.get('/service-areas', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

  try {
    const { getPlatformServiceAreas } = require('../utils/serviceAreaProcessor');
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
router.post('/seed-reviews', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  logger.debug('Seed reviews endpoint called', { 
    userId: req.user?.userId,
    email: req.user?.email,
    ip: req.ip
  });
  
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

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
        const { getAvatarUrl, findCustomAvatar } = require('../utils/avatarUtils');

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

module.exports = router;
