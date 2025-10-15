const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../database/pool');
const { asyncHandler } = require('../middleware/errorHandler');
// TODO: Add authentication to protected routes
// const { authenticateToken } = require('../middleware/auth');
const { apiLimiter, sensitiveAuthLimiter } = require('../middleware/rateLimiter');

/**
 * Helper function to generate slug from business name
 */
function generateSlug(businessName) {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 50); // Limit to 50 characters
}

/**
 * Helper function to ensure slug is unique
 */
async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const result = await pool.query(
      'SELECT id FROM tenants.business WHERE slug = $1',
      [slug]
    );
    
    if (result.rowCount === 0) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * POST /api/tenants/signup
 * Create new tenant account with user and business record
 */
router.post('/signup', sensitiveAuthLimiter, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    personalPhone,
    personalEmail,
    businessName,
    businessPhone,
    businessEmail,
    businessAddress,
    selectedPlan,
    planPrice,
    industry = 'mobile-detailing', // Default industry
    defaults, // Industry-specific defaults from frontend
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !personalEmail || !businessName || !businessPhone) {
    const error = new Error('Missing required fields');
    error.statusCode = 400;
    throw error;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(personalEmail)) {
    const error = new Error('Invalid email format');
    error.statusCode = 400;
    throw error;
  }

  if (businessEmail && !emailRegex.test(businessEmail)) {
    const error = new Error('Invalid business email format');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT id FROM auth.users WHERE email = $1',
    [personalEmail]
  );
  
  if (existingUser.rowCount > 0) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Generate unique slug from business name
  const baseSlug = generateSlug(businessName);
  const slug = await ensureUniqueSlug(baseSlug);

  // Generate temporary password (user will set their own via email link)
  const tempPassword = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Start transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create user account
    const userResult = await client.query(
      `INSERT INTO auth.users (email, password_hash, name, phone, is_admin, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [personalEmail, hashedPassword, `${firstName} ${lastName}`, personalPhone, false]
    );

    const userId = userResult.rows[0].id;

    // Create default service area from business address
    const serviceAreas = businessAddress?.city && businessAddress?.state ? [
      {
        city: businessAddress.city,
        state: businessAddress.state,
        zip: businessAddress.zip ? parseInt(businessAddress.zip) : null,
        primary: true,
        minimum: 0,
        multiplier: 1.0
      }
    ] : [];

    // Create tenant business record
    const tenantResult = await client.query(
      `INSERT INTO tenants.business (
        slug, business_name, first_name, last_name, user_id,
        business_phone, personal_phone, business_email, personal_email,
        industry, application_status, application_date, created_at, updated_at,
        notes, service_areas
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW(), $12, $13)
      RETURNING id, slug`,
      [
        slug,
        businessName,
        firstName,
        lastName,
        userId,
        businessPhone,
        personalPhone,
        businessEmail || personalEmail,
        personalEmail,
        industry,
        'approved', // Auto-approve for now
        `Plan: ${selectedPlan} ($${planPrice}/month)\nAddress: ${businessAddress?.address || ''}, ${businessAddress?.city || ''}, ${businessAddress?.state || ''} ${businessAddress?.zip || ''}`,
        JSON.stringify(serviceAreas)
      ]
    );

    const tenantId = tenantResult.rows[0].id;
    const tenantSlug = tenantResult.rows[0].slug;

    // Create default website content record using industry-specific defaults
    const heroTitle = defaults?.content?.hero?.h1 || `Welcome to ${businessName}`;
    const heroSubtitle = defaults?.content?.hero?.subTitle || `Professional ${industry.replace('-', ' ')} services in ${businessAddress?.city || 'your area'}`;
    const reviewsTitle = defaults?.content?.reviews?.title || 'What Our Customers Say';
    const reviewsSubtitle = defaults?.content?.reviews?.subtitle || '';
    const faqTitle = defaults?.content?.faq?.title || 'Frequently Asked Questions';
    const faqSubtitle = defaults?.content?.faq?.subtitle || '';
    const faqItems = defaults?.faqItems || [];
    
    // SEO defaults
    const seoTitle = defaults?.seo?.title || `${businessName} | Professional ${industry.replace('-', ' ')}`;
    const seoDescription = defaults?.seo?.description || `Professional ${industry.replace('-', ' ')} services in ${businessAddress?.city || 'your area'}`;
    const seoKeywords = defaults?.seo?.keywords || '';
    const seoOgImage = defaults?.seo?.ogImage || '';
    const seoTwitterImage = defaults?.seo?.twitterImage || '';
    const seoCanonicalPath = defaults?.seo?.canonicalPath || '/';
    const seoRobots = defaults?.seo?.robots || 'index,follow';
    
    await client.query(
      `INSERT INTO website.content (
        business_id, hero_title, hero_subtitle,
        reviews_title, reviews_subtitle,
        faq_title, faq_subtitle, faq_items,
        seo_title, seo_description, seo_keywords,
        seo_og_image, seo_twitter_image, seo_canonical_path, seo_robots,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())`,
      [
        tenantId,
        heroTitle,
        heroSubtitle,
        reviewsTitle,
        reviewsSubtitle,
        faqTitle,
        faqSubtitle,
        JSON.stringify(faqItems),
        seoTitle,
        seoDescription,
        seoKeywords,
        seoOgImage,
        seoTwitterImage,
        seoCanonicalPath,
        seoRobots
      ]
    );

    await client.query('COMMIT');

    // TODO: Send welcome email to tenant
    // For now, just log the information
    console.log('\n=== NEW TENANT SIGNUP ===');
    console.log(`Business: ${businessName}`);
    console.log(`Owner: ${firstName} ${lastName}`);
    console.log(`Email: ${personalEmail}`);
    console.log(`Slug: ${tenantSlug}`);
    console.log(`Website URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenantSlug}`);
    console.log(`Dashboard URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/${tenantSlug}/dashboard`);
    console.log(`Plan: ${selectedPlan} ($${planPrice}/month)`);
    console.log('========================\n');

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        tenantId,
        slug: tenantSlug,
        userId,
        websiteUrl: `/${tenantSlug}`,
        dashboardUrl: `/${tenantSlug}/dashboard`
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

/**
 * GET /api/tenants/:slug
 * Fetch tenant data by slug with industry information
 */
router.get('/:slug', apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = `
      SELECT 
        b.id, b.slug, b.business_name, b.owner, b.first_name, b.last_name, b.user_id,
        b.application_status, b.business_start_date, b.business_phone, b.personal_phone,
        b.business_email, b.personal_email, b.twilio_phone, b.sms_phone, b.website,
        b.gbp_url, b.facebook_url, b.instagram_url, b.youtube_url, b.tiktok_url,
        b.source, b.notes, b.service_areas, b.application_date, b.approved_date,
        b.last_activity, b.created_at, b.updated_at, b.industry,
        c.hero_title, c.hero_subtitle, c.reviews_title, c.reviews_subtitle,
        c.faq_title, c.faq_subtitle, c.faq_items,
        c.seo_title, c.seo_description, c.seo_keywords, c.seo_og_image,
        c.seo_twitter_image, c.seo_canonical_path, c.seo_robots
      FROM tenants.business b
      LEFT JOIN website.content c ON b.id = c.business_id
      WHERE b.slug = $1 AND b.application_status = 'approved'
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found or not approved'
      });
    }
    
    const tenant = result.rows[0];
    
    // Parse service_areas JSON if it's a string
    if (typeof tenant.service_areas === 'string') {
      try {
        tenant.service_areas = JSON.parse(tenant.service_areas);
      } catch (parseError) {
        console.error('Error parsing service_areas:', parseError);
        tenant.service_areas = [];
      }
    }
    
    res.json({
      success: true,
      data: tenant
    });
    
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/tenants
 * Fetch tenants by industry (optional filter)
 */
router.get('/', apiLimiter, async (req, res) => {
  try {
    const { industry, status = 'approved' } = req.query;
    
    let query = `
      SELECT 
        id, slug, business_name, owner, first_name, last_name, user_id,
        application_status, business_start_date, business_phone, personal_phone,
        business_email, personal_email, twilio_phone, sms_phone, website,
        gbp_url, facebook_url, instagram_url, youtube_url, tiktok_url,
        source, notes, service_areas, application_date, approved_date,
        last_activity, created_at, updated_at, industry
      FROM tenants.business 
      WHERE application_status = $1
    `;
    
    const params = [status];
    
    if (industry) {
      query += ` AND industry = $2`;
      params.push(industry);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await pool.query(query, params);
    
    // Parse service_areas JSON for each tenant
    const tenants = result.rows.map(tenant => {
      if (typeof tenant.service_areas === 'string') {
        try {
          tenant.service_areas = JSON.parse(tenant.service_areas);
        } catch (parseError) {
          console.error('Error parsing service_areas:', parseError);
          tenant.service_areas = [];
        }
      }
      return tenant;
    });
    
    res.json({
      success: true,
      data: tenants
    });
    
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/tenants/industries/list
 * Get list of available industries
 */
router.get('/industries/list', apiLimiter, async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT industry, COUNT(*) as count
      FROM tenants.business 
      WHERE application_status = 'approved' AND industry IS NOT NULL
      GROUP BY industry
      ORDER BY count DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;