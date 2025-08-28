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
    let findAffiliateQuery = 'SELECT email, business_name, slug FROM affiliates WHERE id = $1';
    let affiliateResult = await client.query(findAffiliateQuery, [id]);
    
    // If not found in affiliates table, try to find by user ID
    if (affiliateResult.rowCount === 0) {
      logger.debug(`Affiliate ID ${id} not found in affiliates table, checking users table...`);
      const findUserQuery = 'SELECT email, name FROM users WHERE id = $1 AND role = $2';
      const userResult = await client.query(findUserQuery, [id, 'affiliate']);
      
      if (userResult.rowCount === 0) {
        await client.query('ROLLBACK');
        const error = new Error('Affiliate not found in either affiliates or users table');
        error.statusCode = 404;
        throw error;
      }
      
      // User exists but no affiliate record - just delete the user
      const user = userResult.rows[0];
      const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
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
    
    // Delete associated service areas
    const deleteServiceAreasQuery = 'DELETE FROM affiliate_service_areas WHERE affiliate_id = $1';
    const serviceAreasResult = await client.query(deleteServiceAreasQuery, [id]);
    logger.info(`Deleted ${serviceAreasResult.rowCount} service areas for affiliate ${id}`);
    
    // Delete the affiliate record
    const deleteAffiliateQuery = 'DELETE FROM affiliates WHERE id = $1';
    await client.query(deleteAffiliateQuery, [id]);
    logger.info(`Deleted affiliate record ${id}`);
    
    // Delete the corresponding user record
    const deleteUserQuery = 'DELETE FROM users WHERE email = $1 AND role = $2';
    const userResult = await client.query(deleteUserQuery, [affiliate.email, 'affiliate']);
    logger.info(`Deleted ${userResult.rowCount} user record(s) for email: ${user.email}`);
    
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
      const countCheck = await pool.query('SELECT COUNT(*) FROM affiliates');
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
      
      const query = `
        SELECT 
          a.id, a.owner as name, a.email, 'affiliate' as role, a.created_at,
          a.business_name, a.application_status, a.slug
        FROM affiliates a
        WHERE a.application_status = 'approved'
        ORDER BY a.created_at DESC
      `;
      
      const result = await pool.query(query);
      
      logger.debug(`[ADMIN] Affiliates query returned ${result.rowCount} approved affiliates`);
      logger.debug(`[ADMIN] Affiliate names:`, { names: result.rows.map(r => r.business_name) });
      
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
  
  let query = 'SELECT id, name, email, role, created_at FROM users';
  let params = [];
  
  if (status && status !== 'all-users') {
    // Map frontend status to database fields
    const statusMap = {
      'admin': 'role = $1',
      'customers': 'role = $1'
    };
    
    // Map frontend status to actual database role values
    const roleMap = {
      'admin': 'admin',
      'customers': 'customer'
    };
    
    if (statusMap[status]) {
      query += ` WHERE ${statusMap[status]}`;
      params.push(roleMap[status]);
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
        a.id, a.slug, a.business_name, a.owner, a.phone, a.email, 
        a.has_insurance, a.source, a.notes, a.application_date, a.created_at,
        addr.city, addr.state_code, addr.postal_code
      FROM affiliates a
      LEFT JOIN addresses addr ON a.base_address_id = addr.id
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
  const slugCheckQuery = 'SELECT id FROM affiliates WHERE slug = $1 AND id != $2';
  const slugCheck = await pool.query(slugCheckQuery, [approved_slug, id]);
  
  if (slugCheck.rowCount > 0) {
    const error = new Error('Slug is already taken by another affiliate');
    error.statusCode = 400;
    throw error;
  }
  
  // Check if application is still pending before updating
  const statusCheckQuery = 'SELECT application_status FROM affiliates WHERE id = $1';
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
  const currentStateQuery = 'SELECT * FROM affiliates WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  // Update affiliate status to approved
  const updateQuery = `
    UPDATE affiliates 
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
    INSERT INTO users (email, password_hash, name, phone, role, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `;
  
  // Generate a temporary password (affiliate will reset this)
  const tempPassword = Math.random().toString(36).substring(2, 15);
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  const userResult = await pool.query(userQuery, [
    affiliate.email,
    hashedPassword,
    affiliate.owner,
    affiliate.phone,
    'affiliate'
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
  
  // User account is already linked to affiliate via the role field
  // No need for additional junction table
  
  res.json({
    success: true,
    message: 'Application approved successfully',
    affiliate: {
      ...affiliate,
      user_id: userId,
      temp_password: tempPassword
    },
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
  const statusCheckQuery = 'SELECT application_status FROM affiliates WHERE id = $1';
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
  const currentStateQuery = 'SELECT * FROM affiliates WHERE id = $1';
  const currentStateResult = await pool.query(currentStateQuery, [id]);
  const beforeState = currentStateResult.rows[0];
  
  const updateQuery = `
    UPDATE affiliates 
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

module.exports = router;
