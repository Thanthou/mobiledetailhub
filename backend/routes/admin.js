const express = require('express');
const router = express.Router();
const { pool } = require('../database/pool');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateBody, validateParams, sanitize } = require('../middleware/validation');
const { adminSchemas, sanitizationSchemas } = require('../utils/validationSchemas');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { adminLimiter, criticalAdminLimiter } = require('../middleware/rateLimiter');

// Delete affiliate and associated data
router.delete('/affiliates/:id', criticalAdminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  logger.info('[ADMIN] DELETE /affiliates/:id called with id:', { id: req.params.id });
  

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
    
    // First, try to find the affiliate by ID
    let findAffiliateQuery = 'SELECT business_email as email, business_name, slug FROM affiliates.business WHERE id = $1';
    let affiliateResult = await client.query(findAffiliateQuery, [id]);
    
    // If not found in affiliates table, try to find by user ID
    if (affiliateResult.rowCount === 0) {
      logger.debug(`Affiliate ID ${id} not found in affiliates table, checking users table...`);
      const findUserQuery = 'SELECT email, name FROM auth.users WHERE id = $1';
      const userResult = await client.query(findUserQuery, [id]);
      
      if (userResult.rowCount === 0) {
        await client.query('ROLLBACK');
        const error = new Error('Affiliate not found in either affiliates or users table');
        error.statusCode = 404;
        throw error;
      }
      
      // User exists but no affiliate record - just delete the user
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
    
    // Affiliate found - proceed with full deletion
    const affiliate = affiliateResult.rows[0];
    
    // Log the affiliate data before deletion for audit
    const affiliateBeforeState = {
      id: parseInt(id),
      business_name: affiliate.business_name,
      slug: affiliate.slug,
      email: affiliate.email
    };
    
         // Service areas are stored in affiliates.service_areas JSONB column, no cleanup needed
    
    // Delete the affiliate record
    const deleteAffiliateQuery = 'DELETE FROM affiliates.business WHERE id = $1';
    await client.query(deleteAffiliateQuery, [id]);
    logger.info(`Deleted affiliate record ${id}`);
    
    // Delete the corresponding user record
    const deleteUserQuery = 'DELETE FROM auth.users WHERE email = $1';
    const userResult = await client.query(deleteUserQuery, [affiliate.business_email]);
    logger.info(`Deleted ${userResult.rowCount} user record(s) for email: ${affiliate.email}`);
    
    // Audit log the affiliate deletion
    logger.audit('DELETE_AFFILIATE', 'affiliates', affiliateBeforeState, null, {
      userId: req.user.userId,
      email: req.user.email
    });
    
    // Commit the transaction
    await client.query('COMMIT');
    
    logger.info(`Successfully deleted affiliate: ${affiliate.business_name} (${affiliate.slug})`);
    
    res.json({
      success: true,
      message: `Affiliate "${affiliate.business_name}" has been deleted successfully`,
      deletedAffiliate: {
        id: parseInt(id),
        business_name: affiliate.business_name,
        slug: affiliate.slug,
        email: affiliate.email
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
    query: status === 'affiliates' ? 'affiliates_table' : 'users_table'
  }, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  if (status === 'affiliates') {
    // For affiliates, query the affiliates table directly
    try {
      // Check if there are any affiliates
      const countCheck = await pool.query('SELECT COUNT(*) FROM affiliates.business');
      const affiliateCount = parseInt(countCheck.rows[0].count);
      
      if (affiliateCount === 0) {
        res.json({
          success: true,
          users: [],
          count: 0,
          message: 'No affiliates found'
        });
        return;
      }
      
      let query = `
        SELECT 
          a.id, a.owner as name, a.business_email as email, a.created_at,
          a.business_name, a.application_status, a.slug, a.business_phone as phone, a.service_areas
        FROM affiliates.business a
        WHERE a.application_status = 'approved'
      `;
      
      let params = [];
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
      
      logger.debug(`[ADMIN] Affiliates query returned ${result.rowCount} approved affiliates`);
      logger.debug(`[ADMIN] Affiliate names:`, { names: result.rows.map(r => r.business_name) });
      logger.debug(`[ADMIN] Query executed:`, { query, params, rowCount: result.rowCount });
      
      res.json({
        success: true,
        users: result.rows,
        count: result.rowCount,
        message: `Found ${result.rowCount} approved affiliates in database`
      });
      return;
    } catch (affiliateErr) {
      logger.error('Error in affiliates query:', { error: affiliateErr.message });
      throw affiliateErr;
    }
  }
  
  let query = 'SELECT id, name, email, is_admin, created_at FROM auth.users';
  let params = [];
  
  if (status && status !== 'all-users') {
    // Map frontend status to database fields
    const statusMap = {
      'admin': 'is_admin = $1',
      'customers': 'is_admin = $1'
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
  
  query += ' ORDER BY created_at DESC';
  
  const result = await pool.query(query, params);
  
  res.json({
    success: true,
    users: result.rows,
    count: result.rowCount,
    message: `Found ${result.rowCount} users in database`
  });
}));

// Pending affiliate applications endpoint
router.get('/pending-applications', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {

  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }
  
  // Audit log the pending applications query
  logger.adminAction('QUERY_PENDING_APPLICATIONS', 'affiliates', { 
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
      FROM affiliates.business a
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

// Approve affiliate application endpoint
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
  const slugCheckQuery = 'SELECT id FROM affiliates.business WHERE slug = $1 AND id != $2';
  const slugCheck = await pool.query(slugCheckQuery, [approved_slug, id]);
  
  if (slugCheck.rowCount > 0) {
    const error = new Error('Slug is already taken by another affiliate');
    error.statusCode = 400;
    throw error;
  }
  
  // Check if application is still pending before updating
  const statusCheckQuery = 'SELECT application_status FROM affiliates.business WHERE id = $1';
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
  const currentStateQuery = 'SELECT * FROM affiliates.business WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  // Update affiliate status to approved
  const updateQuery = `
    UPDATE affiliates.business 
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
  
  const affiliate = result.rows[0];
  
  // Create user account for approved affiliate
  const userQuery = `
    INSERT INTO auth.users (email, password_hash, name, phone, is_admin, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `;
  
  // Generate a temporary password (affiliate will reset this)
  const tempPassword = Math.random().toString(36).substring(2, 15);
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  const userResult = await pool.query(userQuery, [
    affiliate.business_email,
    hashedPassword,
    affiliate.owner,
    affiliate.business_phone,
    false  // is_admin = false for affiliates
  ]);
  
  const userId = userResult.rows[0].id;
  
  // Audit log the affiliate approval
  const afterState = {
    ...affiliate,
    user_id: userId
  };
  
  logger.audit('APPROVE_AFFILIATE', 'affiliates', beforeState, afterState, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  // User account is created for affiliate access
  // No need for additional junction table
  
        // Process service areas if provided
      let serviceAreaResult = null;

      // Use existing service areas from the affiliate record
      let serviceAreasToProcess = affiliate.service_areas || [];
      if (!serviceAreasToProcess || !Array.isArray(serviceAreasToProcess) || serviceAreasToProcess.length === 0) {
        logger.warn(`No service areas found for affiliate ${affiliate.id}`);
        serviceAreasToProcess = [];
      }

      if (serviceAreasToProcess && Array.isArray(serviceAreasToProcess) && serviceAreasToProcess.length > 0) {
        try {
          // CLEAN APPROACH: Direct database inserts with proper service area structure
          logger.info(`Processing ${serviceAreasToProcess.length} service areas for affiliate ${affiliate.id}`);
          
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
          
          // Update affiliate with clean service areas (no slugs)
          await pool.query(
            'UPDATE affiliates.business SET service_areas = $1 WHERE id = $2',
            [JSON.stringify(cleanServiceAreas), affiliate.id]
          );
          
          serviceAreaResult = { processed, errors: [], total: serviceAreasToProcess.length, serviceAreas: cleanServiceAreas };
          logger.info(`✅ Successfully processed ${processed} service areas for affiliate ${affiliate.id} with clean structure`);
          
        } catch (serviceAreaError) {
          logger.error(`Failed to process service areas for affiliate ${affiliate.id}:`, serviceAreaError);
          // Don't fail the approval if service area processing fails
          serviceAreaResult = { error: serviceAreaError.message };
        }
      }
  
  res.json({
    success: true,
    message: 'Application approved successfully',
    affiliate: {
      ...affiliate,
      user_id: userId,
      temp_password: tempPassword
    },
    service_areas: serviceAreaResult,
    note: 'User account created with temporary password. Affiliate should reset password on first login.'
  });
}));

// Reject affiliate application endpoint
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
  const statusCheckQuery = 'SELECT application_status FROM affiliates.business WHERE id = $1';
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
  const currentStateQuery = 'SELECT * FROM affiliates.business WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  const updateQuery = `
    UPDATE affiliates.business 
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
  
  // Audit log the affiliate rejection
  logger.audit('REJECT_AFFILIATE', 'affiliates', beforeState, afterState, {
    userId: req.user.userId,
    email: req.user.email
  });
  
  res.json({
    success: true,
    message: 'Application rejected successfully',
    affiliate: result.rows[0]
  });
}));

// Get MDH service areas (all cities/states where approved affiliates serve)
router.get('/mdh-service-areas', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  if (!pool) {
    const error = new Error('Database connection not available');
    error.statusCode = 500;
    throw error;
  }

  try {
    const { getMDHServiceAreas } = require('../utils/serviceAreaProcessor');
    const serviceAreas = await getMDHServiceAreas();
    
    res.json({
      success: true,
      service_areas: serviceAreas,
      count: serviceAreas.length
    });
  } catch (error) {
    logger.error('Error fetching MDH service areas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service areas'
    });
  }
}));

// Seed reviews endpoint
router.post('/seed-reviews', adminLimiter, authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  console.log('=== SEED REVIEWS ENDPOINT CALLED ===');
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  
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

    if (review.type === 'affiliate' && !review.businessSlug) {
      const error = new Error('Affiliate reviews must have a businessSlug');
      error.statusCode = 400;
      throw error;
    }
  }

  const client = await pool.connect();
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  let result = { reviewIds: [] };

  try {
    await client.query('BEGIN');

    for (const review of reviews) {
      try {
        let affiliateId = null;

        // Get affiliate_id if this is an affiliate review
        if (review.type === 'affiliate') {
          const affiliateQuery = 'SELECT id FROM affiliates.business WHERE slug = $1';
          const affiliateResult = await client.query(affiliateQuery, [review.businessSlug]);
          
          if (affiliateResult.rowCount === 0) {
            errors.push(`Business slug '${review.businessSlug}' not found`);
            errorCount++;
            continue;
          }
          
          // Double-check that we have a valid result before accessing it
          if (affiliateResult.rows && affiliateResult.rows.length > 0) {
            affiliateId = affiliateResult.rows[0].id;
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

        const getServiceCategory = (content) => {
          const lowerContent = content.toLowerCase();
          if (lowerContent.includes('ceramic') || lowerContent.includes('coating')) return 'ceramic';
          if (lowerContent.includes('paint correction') || lowerContent.includes('paint')) return 'paint_correction';
          if (lowerContent.includes('boat') || lowerContent.includes('marine')) return 'boat';
          if (lowerContent.includes('rv') || lowerContent.includes('recreational')) return 'rv';
          if (lowerContent.includes('ppf') || lowerContent.includes('film')) return 'ppf';
          return 'auto';
        };

        const generateServiceDate = (daysAgo, weeksAgo) => {
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
            affiliate_id,
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
          affiliateId,
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
        

        console.log('Executing query:', insertQuery);
        console.log('With values:', values);
        const insertResult = await client.query(insertQuery, values);
        console.log('Query result:', insertResult);
        
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
          console.log(`Updated review ${reviewId} with custom avatar: ${customAvatar}`);
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
