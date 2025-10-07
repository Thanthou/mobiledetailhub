const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { pool } = require('../database/pool');
const { authenticateToken } = require('../middleware/auth');
const { validateFileMagic } = require('../utils/uploadValidator');
const { generateAvatarFilename, ensureUploadsDir } = require('../utils/avatarUtils');
const googleBusinessScraper = require('../services/googleBusinessScraper');
const logger = require('../utils/logger');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    // Generate a temporary filename since we'll rename it later
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const filename = `temp_avatar_${timestamp}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * POST /api/tenant-reviews/upload-avatar
 * Upload avatar for a review (public endpoint)
 */
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { customerName, reviewId } = req.body;
    
    if (!customerName || !reviewId) {
      // Delete the uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'customerName and reviewId are required'
      });
    }

    // Magic number validation for avatar uploads
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const magicValidation = await validateFileMagic(req.file, allowedImageTypes);
    if (!magicValidation.success) {
      // Delete the uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(magicValidation.statusCode).json({
        success: false,
        message: magicValidation.errors[0]?.message || 'File validation failed'
      });
    }

    // Generate proper filename and rename the file
    const extension = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
    const properFilename = generateAvatarFilename(customerName, parseInt(reviewId), extension);
    const properPath = path.join('uploads/avatars', properFilename);
    
    try {
      // Rename the file to the proper name
      fs.renameSync(req.file.path, properPath);
      
      const avatarUrl = `/uploads/avatars/${properFilename}`;

      // Update the review record with the avatar filename
      logger.debug('Updating review with avatar filename', {
        reviewId: parseInt(reviewId),
        filename: properFilename
      });
      
      const updateResult = await pool.query(
        'UPDATE reputation.reviews SET avatar_filename = $1 WHERE id = $2',
        [properFilename, parseInt(reviewId)]
      );
      
      logger.debug('Avatar filename update result', {
        reviewId: parseInt(reviewId),
        rowsAffected: updateResult.rowCount,
        filename: properFilename
      });

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatarUrl: avatarUrl,
        filename: properFilename
      });
    } catch (renameError) {
      // If rename fails, delete the original file and return error
      fs.unlinkSync(req.file.path);
      res.status(500).json({
        success: false,
        message: 'Error renaming uploaded file',
        error: renameError.message
      });
    }

  } catch (error) {
    logger.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tenant-reviews
 * Create a new review from tenant dashboard
 * Note: No authentication required - reviews are public submissions
 */
router.post('/', async (req, res) => {
  try {
    const {
      tenant_slug,
      customer_name,
      rating,
      comment,
      reviewer_url,
      vehicle_type,
      paint_correction,
      ceramic_coating,
      paint_protection_film,
      source,
      avatar_filename
    } = req.body;

    // Validate required fields
    if (!tenant_slug || !customer_name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tenant_slug, customer_name, rating, comment'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate vehicle type if provided
    const validVehicleTypes = ['car', 'truck', 'suv', 'boat', 'rv', 'motorcycle'];
    if (vehicle_type && !validVehicleTypes.includes(vehicle_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid vehicle type. Must be one of: ${validVehicleTypes.join(', ')}`
      });
    }

    // Validate source
    const validSources = ['website', 'google', 'yelp', 'facebook'];
    if (source && !validSources.includes(source)) {
      return res.status(400).json({
        success: false,
        message: `Invalid source. Must be one of: ${validSources.join(', ')}`
      });
    }

    // Verify tenant exists (optional - adjust based on your tenant table structure)
    // const tenantCheck = await pool.query(
    //   'SELECT slug FROM tenants.business WHERE slug = $1',
    //   [tenant_slug]
    // );
    // if (tenantCheck.rows.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Tenant not found'
    //   });
    // }

    const query = `
      INSERT INTO reputation.reviews (
        tenant_slug, customer_name, rating, comment, reviewer_url,
        vehicle_type, paint_correction, ceramic_coating, paint_protection_film,
        source, avatar_filename
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      tenant_slug,
      customer_name,
      rating,
      comment,
      reviewer_url || null,
      vehicle_type || null,
      paint_correction || false,
      ceramic_coating || false,
      paint_protection_film || false,
      source || 'website',
      avatar_filename || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Review published successfully'
    });

  } catch (error) {
    logger.error('Error creating tenant review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/tenant-reviews/check-gbp-url/:tenantSlug
 * Check what Google Business Profile URL is stored in database
 */
router.get('/check-gbp-url/:tenantSlug', async (req, res) => {
  try {
    const { tenantSlug } = req.params;
    
    const result = await pool.query(
      'SELECT gbp_url, business_name FROM tenants.business WHERE slug = $1',
      [tenantSlug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    
    const business = result.rows[0];
    
    res.json({
      success: true,
      data: {
        tenantSlug,
        businessName: business.business_name,
        gbpUrl: business.gbp_url,
        urlType: business.gbp_url ? 
          (business.gbp_url.includes('business.google.com') ? 'Direct Business Profile' :
           business.gbp_url.includes('maps.google.com') ? 'Google Maps' :
           business.gbp_url.includes('google.com/search') ? 'Google Search Results' :
           business.gbp_url.includes('share.google') ? 'Google Share Link' :
           'Unknown Format') : 'No URL Set'
      }
    });
    
  } catch (error) {
    logger.error('Error checking GBP URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check GBP URL',
      error: error.message
    });
  }
});

/**
 * GET /api/tenant-reviews/test-scraping
 * Test endpoint to debug scraping issues
 */
router.get('/test-scraping', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL parameter is required'
      });
    }

    logger.info(`Test scraping URL: ${url}`);

    // Test basic page access
    const testResult = await googleBusinessScraper.scrapeBusinessProfile(url);

    res.json({
      success: true,
      data: testResult,
      message: 'Test scraping completed'
    });

  } catch (error) {
    logger.error('Test scraping error:', error);
    res.status(500).json({
      success: false,
      message: 'Test scraping failed',
      error: error.message
    });
  }
});

/**
 * GET /api/tenant-reviews/:tenant_slug
 * Get reviews for a specific tenant (all reviews are published immediately)
 */
router.get('/:tenant_slug', async (req, res) => {
  try {
    const { tenant_slug } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const query = `
      SELECT 
        id, customer_name, rating, comment, reviewer_url,
        vehicle_type, paint_correction, ceramic_coating, paint_protection_film,
        source, avatar_filename, created_at
      FROM reputation.reviews
      WHERE tenant_slug = $1
      ORDER BY rating DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [tenant_slug, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM reputation.reviews WHERE tenant_slug = $1',
      [tenant_slug]
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    logger.error('Error fetching tenant reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/tenant-reviews/:id
 * Delete a review (tenant can remove reviews at will)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM reputation.reviews 
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/tenant-reviews/scrape-google-business
 * Scrape Google Business Profile for rating and review count
 */
router.post('/scrape-google-business', async (req, res) => {
  try {
    const { gbpUrl, tenantSlug } = req.body;

    if (!gbpUrl) {
      return res.status(400).json({
        success: false,
        message: 'Google Business Profile URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(gbpUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    logger.info(`Starting Google Business Profile scraping for: ${gbpUrl}`);

    // Scrape the Google Business Profile
    const scrapeResult = await googleBusinessScraper.scrapeBusinessProfile(gbpUrl);

    logger.info('Scrape result:', JSON.stringify(scrapeResult, null, 2));

    if (!scrapeResult.success) {
      logger.error('Scraping failed:', scrapeResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to scrape Google Business Profile',
        error: scrapeResult.error,
        debug: process.env.NODE_ENV === 'development' ? scrapeResult : undefined
      });
    }

    const { averageRating, totalReviews, businessName } = scrapeResult.data;

    // If we have both rating and review count, optionally update the business record
    if (tenantSlug && (averageRating || totalReviews)) {
      try {
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;

        if (averageRating) {
          updateFields.push(`average_rating = $${++paramCount}`);
          updateValues.push(averageRating);
        }

        if (totalReviews) {
          updateFields.push(`total_review_count = $${++paramCount}`);
          updateValues.push(totalReviews);
        }

        if (updateFields.length > 0) {
          updateValues.push(tenantSlug); // Add tenant_slug as last parameter
          
          const updateQuery = `
            UPDATE tenants.business 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE slug = $${++paramCount}
          `;

          await pool.query(updateQuery, updateValues);
          logger.info(`Updated business record for tenant: ${tenantSlug}`);
        }
      } catch (dbError) {
        logger.warn('Failed to update business record:', dbError);
        // Don't fail the entire request if DB update fails
      }
    }

    res.json({
      success: true,
      data: {
        averageRating,
        totalReviews,
        businessName,
        gbpUrl
      },
      message: 'Successfully scraped Google Business Profile'
    });

  } catch (error) {
    logger.error('Error in scrape-google-business endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to scrape Google Business Profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
