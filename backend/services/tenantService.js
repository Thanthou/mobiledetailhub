import bcrypt from 'bcryptjs';
import { pool } from '../database/pool.js';

/**
 * Tenant Service
 * Handles all business logic related to tenant management
 */

/**
 * Generate slug from business name
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
 * Ensure slug is unique by appending counter if needed
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
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if user already exists
 */
async function checkUserExists(email) {
  const result = await pool.query(
    'SELECT id FROM auth.users WHERE email = $1',
    [email]
  );
  return result.rowCount > 0;
}

/**
 * Create service areas from business address
 */
function createServiceAreas(businessAddress) {
  if (!businessAddress?.city || !businessAddress?.state) {
    return [];
  }

  return [{
    city: businessAddress.city,
    state: businessAddress.state,
    zip: businessAddress.zip ? parseInt(businessAddress.zip) : null,
    primary: true,
    minimum: 0,
    multiplier: 1.0
  }];
}

/**
 * Create default website content using industry-specific defaults
 */
function createDefaultContent(businessName, industry, businessAddress, defaults) {
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

  return {
    heroTitle,
    heroSubtitle,
    reviewsTitle,
    reviewsSubtitle,
    faqTitle,
    faqSubtitle,
    faqItems,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoOgImage,
    seoTwitterImage,
    seoCanonicalPath,
    seoRobots
  };
}

/**
 * Create a new tenant account
 */
async function createTenant(tenantData) {
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
    industry = 'mobile-detailing',
    defaults
  } = tenantData;

  // Validate required fields
  if (!firstName || !lastName || !personalEmail || !businessName || !businessPhone) {
    const error = new Error('Missing required fields');
    error.statusCode = 400;
    throw error;
  }

  // Validate email formats
  if (!validateEmail(personalEmail)) {
    const error = new Error('Invalid email format');
    error.statusCode = 400;
    throw error;
  }

  if (businessEmail && !validateEmail(businessEmail)) {
    const error = new Error('Invalid business email format');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  if (await checkUserExists(personalEmail)) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Generate unique slug
  const baseSlug = generateSlug(businessName);
  const slug = await ensureUniqueSlug(baseSlug);

  // Generate temporary password
  const tempPassword = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create service areas
  const serviceAreas = createServiceAreas(businessAddress);

  // Create default content
  const content = createDefaultContent(businessName, industry, businessAddress, defaults);

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

    // Create default website content
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
        content.heroTitle,
        content.heroSubtitle,
        content.reviewsTitle,
        content.reviewsSubtitle,
        content.faqTitle,
        content.faqSubtitle,
        JSON.stringify(content.faqItems),
        content.seoTitle,
        content.seoDescription,
        content.seoKeywords,
        content.seoOgImage,
        content.seoTwitterImage,
        content.seoCanonicalPath,
        content.seoRobots
      ]
    );

    await client.query('COMMIT');

    return {
      tenantId,
      slug: tenantSlug,
      userId,
      websiteUrl: `/${tenantSlug}`,
      dashboardUrl: `/${tenantSlug}/dashboard`
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get tenant by slug
 */
async function getTenantBySlug(slug) {
  const query = `
    SELECT 
      b.id, b.slug, b.business_name, b.owner, b.first_name, b.last_name, b.user_id,
      b.application_status, b.business_start_date, b.business_phone, b.personal_phone,
      b.business_email, b.personal_email, b.twilio_phone, b.sms_phone, b.website,
      b.gbp_url, b.facebook_url, b.facebook_enabled, b.instagram_url, b.instagram_enabled, 
      b.tiktok_url, b.tiktok_enabled, b.youtube_url, b.youtube_enabled,
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
    return null;
  }
  
  const tenant = result.rows[0];
  
  // Ensure boolean fields are properly mapped
  tenant.facebook_enabled = Boolean(tenant.facebook_enabled);
  tenant.instagram_enabled = Boolean(tenant.instagram_enabled);
  tenant.tiktok_enabled = Boolean(tenant.tiktok_enabled);
  tenant.youtube_enabled = Boolean(tenant.youtube_enabled);
  
  // Parse service_areas JSON if it's a string
  if (typeof tenant.service_areas === 'string') {
    try {
      tenant.service_areas = JSON.parse(tenant.service_areas);
    } catch (parseError) {
      console.error('Error parsing service_areas:', parseError);
      tenant.service_areas = [];
    }
  }
  
  return tenant;
}

/**
 * Get tenants by industry
 */
async function getTenantsByIndustry(industry, status = 'approved') {
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
  
  return tenants;
}

/**
 * Update tenant business data by slug
 */
async function updateTenantBySlug(slug, updateData) {
  console.log('updateTenantBySlug called with:', { slug, updateData });
  
  // Build dynamic update query
  const updateFields = [];
  const values = [];
  let paramCount = 0;

  // Map frontend field names to database column names
  // Based on actual database schema from tenants.business table
  const fieldMapping = {
    business_name: 'business_name',
    first_name: 'first_name', 
    last_name: 'last_name',
    business_email: 'business_email',
    personal_email: 'personal_email',
    business_phone: 'business_phone',
    personal_phone: 'personal_phone',
    twilio_phone: 'twilio_phone',
    business_start_date: 'business_start_date',
    // website: 'website', // REMOVED: This is a generated column that cannot be updated
    // website_url: 'website', // REMOVED: This is a generated column that cannot be updated
    gbp_url: 'gbp_url',
    facebook_url: 'facebook_url',
    facebook_enabled: 'facebook_enabled',
    instagram_url: 'instagram_url',
    instagram_enabled: 'instagram_enabled',
    tiktok_url: 'tiktok_url',
    tiktok_enabled: 'tiktok_enabled',
    youtube_url: 'youtube_url',
    youtube_enabled: 'youtube_enabled'
    // Note: google_maps_url column doesn't exist in database
  };

  // Build update fields dynamically
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined && fieldMapping[key]) {
      paramCount++;
      
      // Handle regular fields
      updateFields.push(`${fieldMapping[key]} = $${paramCount}`);
      values.push(updateData[key]);
      
      console.log(`Adding field: ${key} -> ${fieldMapping[key]} = ${updateData[key]}`);
    } else if (updateData[key] !== undefined) {
      console.log(`Skipping field: ${key} (not in fieldMapping)`);
    }
  });

  console.log('Update fields:', updateFields);
  console.log('Values:', values);

  if (updateFields.length === 0) {
    throw new Error('No valid fields to update');
  }

  // Add updated_at timestamp (no parameter needed)
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

  // Add slug parameter
  paramCount++;
  values.push(slug);

  const query = `
    UPDATE tenants.business 
    SET ${updateFields.join(', ')}
    WHERE slug = $${paramCount} AND application_status = 'approved'
    RETURNING 
      id, slug, business_name, owner, first_name, last_name, user_id,
      application_status, business_start_date, business_phone, personal_phone,
      business_email, personal_email, twilio_phone, sms_phone, website,
      gbp_url, facebook_url, instagram_url, youtube_url, tiktok_url,
      source, notes, service_areas, application_date, approved_date,
      last_activity, created_at, updated_at, industry
  `;

  console.log('Executing query:', query);
  console.log('With values:', values);

  let result;
  try {
    result = await pool.query(query, values);
    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      throw new Error('Tenant not found or not approved');
    }
  } catch (dbError) {
    console.error('Database error:', dbError);
    throw new Error(`Database error: ${dbError.message}`);
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

  return tenant;
}

/**
 * Get list of available industries
 */
async function getIndustries() {
  const query = `
    SELECT DISTINCT industry, COUNT(*) as count
    FROM tenants.business 
    WHERE application_status = 'approved' AND industry IS NOT NULL
    GROUP BY industry
    ORDER BY count DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

export {
  createTenant,
  getTenantBySlug,
  getTenantsByIndustry,
  getIndustries,
  updateTenantBySlug
};
