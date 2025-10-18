import bcrypt from 'bcryptjs';
import { createModuleLogger } from '../config/logger.js';
const logger = createModuleLogger('tenantProvisionService');


import { pool } from '../database/pool.js';
import StripeService from './stripeService.js';
import { sendWelcomeEmail as sendWelcomeEmailService } from './emailService.js';
import { createPasswordSetupToken } from './passwordSetupService.js';

/**
 * Tenant Provision Service
 * Orchestrates the complete tenant provisioning process including payment, database, and email operations
 */

/**
 * Provision a new tenant with payment confirmation
 * This is the main orchestration method that coordinates all services
 */
async function provisionTenantWithPayment(paymentIntentId, tenantData) {
  if (!paymentIntentId || !tenantData) {
    const error = new Error('Missing paymentIntentId or tenantData');
    error.statusCode = 400;
    throw error;
  }

  // Step 1: Verify payment intent
  const paymentResult = await StripeService.retrievePaymentIntent(paymentIntentId);
  
  if (!paymentResult.success) {
    const error = new Error('Invalid payment intent');
    error.statusCode = 400;
    throw error;
  }

  const paymentIntent = paymentResult.paymentIntent;

  if (paymentIntent.status !== 'succeeded') {
    const error = new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    error.statusCode = 400;
    throw error;
  }

  // Step 2: Create Stripe customer
  const customerResult = await StripeService.createCustomer({
    email: tenantData.personalEmail,
    name: `${tenantData.firstName} ${tenantData.lastName}`,
    phone: tenantData.personalPhone
  });

  if (!customerResult.success) {
    logger.error('Failed to create Stripe customer:', customerResult.error);
    // Continue with tenant creation even if customer creation fails
  }

  // Step 3: Provision tenant in database
  const provisionResult = await provisionTenantDatabase(tenantData, paymentIntent, customerResult.customerId);

  // Step 4: Send welcome email
  try {
    await sendWelcomeEmail(provisionResult, tenantData);
  } catch (emailError) {
    logger.error('Failed to send welcome email:', emailError);
    // Don't fail the entire process if email fails
  }

  return {
    success: true,
    tenantId: provisionResult.tenantId,
    slug: provisionResult.slug,
    userId: provisionResult.userId,
    websiteUrl: `http://${provisionResult.slug}.thatsmartsite.com`,
    dashboardUrl: `http://${provisionResult.slug}.thatsmartsite.com/dashboard`,
    paymentIntentId
  };
}

/**
 * Provision tenant in database with all related records
 */
async function provisionTenantDatabase(tenantData, paymentIntent, stripeCustomerId) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create user account without password (will be set via email token)
    const userResult = await client.query(
      `INSERT INTO auth.users (email, password_hash, name, phone, stripe_customer_id, is_admin, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [
        tenantData.personalEmail,
        '', // Empty password - user will set via email token
        `${tenantData.firstName} ${tenantData.lastName}`,
        tenantData.personalPhone,
        stripeCustomerId || null,
        false
      ]
    );

    const userId = userResult.rows[0].id;

    // Generate unique slug
    const slug = await generateUniqueSlug(tenantData.businessName, client);

    // Create service areas
    const serviceAreas = createServiceAreas(tenantData.businessAddress);

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
        tenantData.businessName,
        tenantData.firstName,
        tenantData.lastName,
        userId,
        tenantData.businessPhone,
        tenantData.personalPhone,
        tenantData.businessEmail || tenantData.personalEmail,
        tenantData.personalEmail,
        tenantData.industry || 'mobile-detailing',
        'approved', // Auto-approve paid tenants
        `Plan: ${tenantData.selectedPlan} ($${tenantData.planPrice}/month)\nPayment: ${paymentIntent.id}\nAddress: ${tenantData.businessAddress?.address || ''}, ${tenantData.businessAddress?.city || ''}, ${tenantData.businessAddress?.state || ''} ${tenantData.businessAddress?.zip || ''}`,
        JSON.stringify(serviceAreas)
      ]
    );

    const tenantId = tenantResult.rows[0].id;
    const tenantSlug = tenantResult.rows[0].slug;

    // Create subscription record
    await client.query(
      `INSERT INTO tenants.subscriptions (
        business_id, plan_type, plan_price_cents, billing_cycle,
        starts_at, status, stripe_subscription_id, stripe_customer_id,
        metadata, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, NOW(), NOW())`,
      [
        tenantId,
        tenantData.selectedPlan,
        tenantData.planPrice,
        'monthly',
        'active',
        null, // No subscription for one-time payments
        stripeCustomerId || null,
        JSON.stringify({
          payment_intent_id: paymentIntent.id,
          payment_method: paymentIntent.payment_method,
          amount_paid: paymentIntent.amount
        })
      ]
    );

    // Create default website content
    if (tenantData.defaults) {
      await createDefaultWebsiteContent(tenantId, tenantData, client);
    }

    await client.query('COMMIT');

    logger.info('\n=== NEW PAID TENANT CREATED ===');
    logger.info(`Business: ${tenantData.businessName}`);
    logger.info(`Owner: ${tenantData.firstName} ${tenantData.lastName}`);
    logger.info(`Email: ${tenantData.personalEmail}`);
    logger.info(`Slug: ${tenantSlug}`);
    logger.info(`Website URL: http://${tenantSlug}.thatsmartsite.com`);
    logger.info(`Dashboard URL: http://${tenantSlug}.thatsmartsite.com/dashboard`);
    logger.info(`Plan: ${tenantData.selectedPlan} ($${tenantData.planPrice}/month)`);
    logger.info(`Payment: ${paymentIntent.id} - $${paymentIntent.amount / 100}`);
    logger.info('================================\n');

    return {
      tenantId,
      slug: tenantSlug,
      userId
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Generate unique slug for tenant
 */
async function generateUniqueSlug(businessName, client) {
  const baseSlug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingSlug = await client.query(
      'SELECT id FROM tenants.business WHERE slug = $1',
      [slug]
    );
    
    if (existingSlug.rowCount === 0) {
      break;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
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
 * Create default website content using industry defaults
 */
async function createDefaultWebsiteContent(tenantId, tenantData, client) {
  const heroTitle = tenantData.defaults.content?.hero?.h1 || `Welcome to ${tenantData.businessName}`;
  const heroSubtitle = tenantData.defaults.content?.hero?.subTitle || `Professional ${tenantData.industry?.replace('-', ' ')} services`;
  const reviewsTitle = tenantData.defaults.content?.reviews?.title || 'What Our Customers Say';
  const reviewsSubtitle = tenantData.defaults.content?.reviews?.subtitle || '';
  const faqTitle = tenantData.defaults.content?.faq?.title || 'Frequently Asked Questions';
  const faqSubtitle = tenantData.defaults.content?.faq?.subtitle || '';
  const faqItems = tenantData.defaults.faqItems || [];
  
  const seoTitle = tenantData.defaults.seo?.title || `${tenantData.businessName} | Professional ${tenantData.industry?.replace('-', ' ')}`;
  const seoDescription = tenantData.defaults.seo?.description || `Professional ${tenantData.industry?.replace('-', ' ')} services`;
  const seoKeywords = tenantData.defaults.seo?.keywords || '';
  const seoOgImage = tenantData.defaults.seo?.ogImage || '';
  const seoTwitterImage = tenantData.defaults.seo?.twitterImage || '';
  const seoCanonicalPath = tenantData.defaults.seo?.canonicalPath || '/';
  const seoRobots = tenantData.defaults.seo?.robots || 'index,follow';
  
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
}

/**
 * Send welcome email to new tenant
 */
async function sendWelcomeEmail(provisionResult, tenantData) {
  try {
    // Create password setup token
    logger.info('🔑 Creating password setup token...');
    const passwordSetupResult = await createPasswordSetupToken(
      provisionResult.userId,
      tenantData.personalEmail,
      '127.0.0.1', // IP address for token creation
      'TenantProvisionService' // User agent for token creation
    );

    const welcomeEmailData = {
      personalEmail: tenantData.personalEmail,
      businessEmail: tenantData.businessEmail || tenantData.personalEmail,
      firstName: tenantData.firstName,
      businessName: tenantData.businessName,
      websiteUrl: `http://${provisionResult.slug}.thatsmartsite.com`,
      dashboardUrl: `${env.FRONTEND_URL || 'http://localhost:5173'}/${provisionResult.slug}/dashboard`,
      planType: tenantData.selectedPlan || 'Starter',
      passwordLink: passwordSetupResult.setupUrl,
      logoUrl: `${env.FRONTEND_URL || 'http://localhost:5173'}/shared/icons/logo.png`
    };

    logger.info('📧 Starting welcome email process...');
    logger.info('📧 Welcome email data:', JSON.stringify(welcomeEmailData, null, 2));
    
    const emailResult = await sendWelcomeEmailService(welcomeEmailData);
    logger.info('📧 Email service result:', JSON.stringify(emailResult, null, 2));
    
    if (emailResult.success) {
      logger.info('✅ Welcome email sent successfully to:', emailResult.emailsSent.join(', '));
      logger.info('🔑 Password setup URL:', passwordSetupResult.setupUrl);
    } else {
      logger.info('⚠️ Failed to send welcome email:', emailResult.error);
    }

    return {
      ...emailResult,
      passwordSetupUrl: passwordSetupResult.setupUrl
    };
  } catch (error) {
    logger.error('❌ Error in sendWelcomeEmail:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export {
  provisionTenantWithPayment,
  provisionTenantDatabase,
  generateUniqueSlug,
  createServiceAreas,
  createDefaultWebsiteContent,
  sendWelcomeEmail
};
