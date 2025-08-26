const express = require('express');
const router = express.Router();

// Simple test endpoint without any middleware
router.get('/ping', (req, res) => {
  res.json({ message: 'Admin routes are working!', timestamp: new Date().toISOString() });
});

// Test endpoint for debugging (remove in production)
router.get('/test-users', async (req, res) => {
  try {
    // Simple response without database for now
    res.json({
      success: true,
      users: [],
      count: 0,
      message: 'Test endpoint - no authentication required'
    });
  } catch (err) {
    console.error('Error in test-users:', err);
    res.status(500).json({ error: 'Test endpoint error' });
  }
});

// Test DELETE endpoint for debugging
router.delete('/test-delete', (req, res) => {
  console.log('[ADMIN] DELETE /test-delete called');
  res.json({ message: 'DELETE method is working!', timestamp: new Date().toISOString() });
});

// Delete affiliate and associated data
router.delete('/affiliates/:id', async (req, res) => {
  console.log('[ADMIN] DELETE /affiliates/:id called with id:', req.params.id);
  try {
    const pool = require('../database/connection');
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
        console.log(`Affiliate ID ${id} not found in affiliates table, checking users table...`);
        const findUserQuery = 'SELECT email, name FROM users WHERE id = $1 AND role = $2';
        const userResult = await client.query(findUserQuery, [id, 'affiliate']);
        
        if (userResult.rowCount === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ 
            success: false, 
            error: 'Affiliate not found in either affiliates or users table' 
          });
        }
        
        // User exists but no affiliate record - just delete the user
        const user = userResult.rows[0];
        const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
        await client.query(deleteUserQuery, [id]);
        console.log(`Deleted user record ${id} (${user.name})`);
        
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
      
      // Delete associated service areas
      const deleteServiceAreasQuery = 'DELETE FROM affiliate_service_areas WHERE affiliate_id = $1';
      const serviceAreasResult = await client.query(deleteServiceAreasQuery, [id]);
      console.log(`Deleted ${serviceAreasResult.rowCount} service areas for affiliate ${id}`);
      
      // Delete the affiliate record
      const deleteAffiliateQuery = 'DELETE FROM affiliates WHERE id = $1';
      await client.query(deleteAffiliateQuery, [id]);
      console.log(`Deleted affiliate record ${id}`);
      
      // Delete the corresponding user record
      const deleteUserQuery = 'DELETE FROM users WHERE email = $1 AND role = $2';
      const userResult = await client.query(deleteUserQuery, [affiliate.email, 'affiliate']);
      console.log(`Deleted ${userResult.rowCount} user record(s) for email: ${affiliate.email}`);
      
      // Commit the transaction
      await client.query('COMMIT');
      
      console.log(`Successfully deleted affiliate: ${affiliate.business_name} (${affiliate.slug})`);
      
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
    
  } catch (err) {
    console.error('Error deleting affiliate:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete affiliate',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Users endpoint (temporarily without authentication for testing)
router.get('/users', async (req, res) => {
  try {
    const pool = require('../database/connection');
    const { status } = req.query;
    
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
          ORDER BY a.created_at DESC
        `;
        
        const result = await pool.query(query);
        
        res.json({
          success: true,
          users: result.rows,
          count: result.rowCount,
          message: `Found ${result.rowCount} affiliates in database`
        });
        return;
             } catch (affiliateErr) {
         console.error('Error in affiliates query:', affiliateErr);
         throw affiliateErr;
       }
    }
    
    let query = 'SELECT id, name, email, role, created_at FROM users';
    let params = [];
    
    if (status && status !== 'all-users') {
      // Map frontend status to database fields
      const statusMap = {
        'admin': 'role = $1',
        'clients': 'role = $1'
      };
      
      // Map frontend status to actual database role values
      const roleMap = {
        'admin': 'admin',
        'clients': 'customer'
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
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Pending affiliate applications endpoint
router.get('/pending-applications', async (req, res) => {
  try {
    const pool = require('../database/connection');
    
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
  } catch (err) {
    console.error('Error fetching pending applications:', err);
    res.status(500).json({ error: 'Failed to fetch pending applications' });
  }
});

// Approve affiliate application endpoint
router.post('/approve-application/:id', async (req, res) => {
  try {
    const pool = require('../database/connection');
    const { id } = req.params;
    const { approved_slug, admin_notes } = req.body;
    
    // Validate admin notes length
    if (admin_notes && admin_notes.length > 1000) {
      return res.status(400).json({ 
        error: 'Admin notes must be less than 1000 characters long' 
      });
    }
    
    // Validate slug format and length
    if (!approved_slug || approved_slug.length < 3 || approved_slug.length > 50) {
      return res.status(400).json({ 
        error: 'Slug must be between 3 and 50 characters long' 
      });
    }
    
    if (!/^[a-z0-9-]+$/.test(approved_slug)) {
      return res.status(400).json({ 
        error: 'Slug must contain only lowercase letters, numbers, and hyphens' 
      });
    }
    
    if (approved_slug.startsWith('-') || approved_slug.endsWith('-')) {
      return res.status(400).json({ 
        error: 'Slug cannot start or end with a hyphen' 
      });
    }
    
    if (approved_slug.includes('--')) {
      return res.status(400).json({ 
        error: 'Slug cannot contain consecutive hyphens' 
      });
    }
    
    // Check if slug is already taken
    const slugCheckQuery = 'SELECT id FROM affiliates WHERE slug = $1 AND id != $2';
    const slugCheck = await pool.query(slugCheckQuery, [approved_slug, id]);
    
    if (slugCheck.rowCount > 0) {
      return res.status(400).json({ 
        error: 'Slug is already taken by another affiliate' 
      });
    }
    
    // Check if application is still pending before updating
    const statusCheckQuery = 'SELECT application_status FROM affiliates WHERE id = $1';
    const statusCheck = await pool.query(statusCheckQuery, [id]);
    
    if (statusCheck.rowCount === 0) {
      return res.status(404).json({ 
        error: 'Application not found' 
      });
    }
    
    if (statusCheck.rows[0].application_status !== 'pending') {
      return res.status(400).json({ 
        error: 'Application has already been processed' 
      });
    }
    
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
      return res.status(409).json({ 
        error: 'Application was modified by another admin. Please refresh and try again.' 
      });
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
    
    // Link user account to affiliate using the junction table
    await pool.query(
      'INSERT INTO affiliate_users (affiliate_id, user_id, role) VALUES ($1, $2, $3)',
      [id, userId, 'owner']
    );
    
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
    
  } catch (err) {
    console.error('Error approving application:', err);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

// Reject affiliate application endpoint
router.post('/reject-application/:id', async (req, res) => {
  try {
    const pool = require('../database/connection');
    const { id } = req.params;
    const { rejection_reason, admin_notes } = req.body;
    
    // Validate admin notes length
    if (admin_notes && admin_notes.length > 1000) {
      return res.status(400).json({ 
        error: 'Admin notes must be less than 1000 characters long' 
      });
    }
    
    // Validate rejection reason
    if (!rejection_reason || rejection_reason.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Rejection reason must be at least 10 characters long' 
      });
    }
    
    if (rejection_reason.trim().length > 500) {
      return res.status(400).json({ 
        error: 'Rejection reason must be less than 500 characters long' 
      });
    }
    
    // Check if application is still pending before updating
    const statusCheckQuery = 'SELECT application_status FROM affiliates WHERE id = $1';
    const statusCheck = await pool.query(statusCheckQuery, [id]);
    
    if (statusCheck.rowCount === 0) {
      return res.status(404).json({ 
        error: 'Application not found' 
      });
    }
    
    if (statusCheck.rows[0].application_status !== 'pending') {
      return res.status(400).json({ 
        error: 'Application has already been processed' 
      });
    }
    
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
      return res.status(409).json({ 
        error: 'Application was modified by another admin. Please refresh and try again.' 
      });
    }
    
    res.json({
      success: true,
      message: 'Application rejected successfully',
      affiliate: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error rejecting application:', err);
    res.status(500).json({ error: 'Failed to reject application' });
  }
});

module.exports = router;
