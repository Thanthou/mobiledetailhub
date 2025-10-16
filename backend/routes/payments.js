const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../database/pool');
const { asyncHandler } = require('../middleware/errorHandler');
const { sensitiveAuthLimiter } = require('../middleware/rateLimiter');
const StripeService = require('../services/stripeService');
const emailService = require('../services/emailService');
const { env } = require('../config/env');

/**
 * POST /api/payments/create-intent
 * Create a payment intent for tenant signup
 */
router.post('/create-intent', sensitiveAuthLimiter, asyncHandler(async (req, res) => {
  const {
    amount,
    currency = 'usd',
    customerEmail,
    businessName,
    planType,
    metadata = {}
  } = req.body;

  // Validate required fields
  if (!amount || !customerEmail || !businessName || !planType) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: amount, customerEmail, businessName, planType'
    });
  }

  // Validate amount (minimum $1)
  if (amount < 100) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be at least $1.00'
    });
  }

  try {
    const paymentIntent = await StripeService.createPaymentIntent({
      amount,
      currency,
      customerEmail,
      metadata: {
        ...metadata,
        business_name: businessName,
        plan_type: planType,
        source: 'tenant_signup'
      }
    });

    if (!paymentIntent.success) {
      return res.status(400).json({
        success: false,
        error: paymentIntent.error
      });
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
}));

/**
 * POST /api/payments/confirm
 * Confirm payment and activate tenant
 */
router.post('/confirm', sensitiveAuthLimiter, asyncHandler(async (req, res) => {
  const {
    paymentIntentId,
    tenantData
  } = req.body;

  if (!paymentIntentId || !tenantData) {
    return res.status(400).json({
      success: false,
      error: 'Missing paymentIntentId or tenantData'
    });
  }

  try {
    // Verify payment intent status
    const paymentResult = await StripeService.retrievePaymentIntent(paymentIntentId);
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment intent'
      });
    }

    const paymentIntent = paymentResult.paymentIntent;

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`
      });
    }

    // Create Stripe customer
    const customerResult = await StripeService.createCustomer({
      email: tenantData.personalEmail,
      name: `${tenantData.firstName} ${tenantData.lastName}`,
      phone: tenantData.personalPhone
    });

    if (!customerResult.success) {
      console.error('Failed to create Stripe customer:', customerResult.error);
      // Continue with tenant creation even if customer creation fails
    }

    // Start database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Hash the temporary password
      const passwordHash = tenantData.passwordHash || tenantData.tempPassword;
      const hashedPassword = await bcrypt.hash(passwordHash, 12);

      // Create user account
      const userResult = await client.query(
        `INSERT INTO auth.users (email, password_hash, name, phone, stripe_customer_id, is_admin, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [
          tenantData.personalEmail,
          hashedPassword,
          `${tenantData.firstName} ${tenantData.lastName}`,
          tenantData.personalPhone,
          customerResult.customerId || null,
          false
        ]
      );

      const userId = userResult.rows[0].id;

      // Generate unique slug
      const baseSlug = tenantData.businessName
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

      // Create service areas
      const serviceAreas = tenantData.businessAddress?.city && tenantData.businessAddress?.state ? [
        {
          city: tenantData.businessAddress.city,
          state: tenantData.businessAddress.state,
          zip: tenantData.businessAddress.zip ? parseInt(tenantData.businessAddress.zip) : null,
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

      // Note: website column is generated automatically from slug

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
          customerResult.customerId || null,
          JSON.stringify({
            payment_intent_id: paymentIntentId,
            payment_method: paymentIntent.payment_method,
            amount_paid: paymentIntent.amount
          })
        ]
      );

      // Create default website content using industry defaults
      if (tenantData.defaults) {
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

      await client.query('COMMIT');

      console.log('\n=== NEW PAID TENANT CREATED ===');
      console.log(`Business: ${tenantData.businessName}`);
      console.log(`Owner: ${tenantData.firstName} ${tenantData.lastName}`);
      console.log(`Email: ${tenantData.personalEmail}`);
      console.log(`Slug: ${tenantSlug}`);
      console.log(`Website URL: http://${tenantSlug}.thatsmartsite.com`);
      console.log(`Dashboard URL: http://${tenantSlug}.thatsmartsite.com/dashboard`);
      console.log(`Plan: ${tenantData.selectedPlan} ($${tenantData.planPrice}/month)`);
      console.log(`Payment: ${paymentIntentId} - $${paymentIntent.amount / 100}`);
      console.log('================================\n');

      // Send welcome email to the new tenant
      const welcomeEmailData = {
        personalEmail: tenantData.personalEmail,
        businessEmail: tenantData.businessEmail || tenantData.personalEmail, // Fallback to personal if no business email
        firstName: tenantData.firstName,
        businessName: tenantData.businessName,
        websiteUrl: `http://${tenantSlug}.thatsmartsite.com`,
        dashboardUrl: `http://${tenantSlug}.thatsmartsite.com/dashboard`,
        tempPassword: tenantData.tempPassword
      };

      const emailResult = await emailService.sendWelcomeEmail(welcomeEmailData);
      if (emailResult.success) {
        console.log('✅ Welcome email sent successfully to:', emailResult.emailsSent.join(', '));
      } else {
        console.log('⚠️ Failed to send welcome email:', emailResult.error);
      }

      res.json({
        success: true,
        message: 'Payment confirmed and tenant created successfully',
        data: {
          tenantId,
          slug: tenantSlug,
          userId,
          websiteUrl: `http://${tenantSlug}.thatsmartsite.com`,
          dashboardUrl: `http://${tenantSlug}.thatsmartsite.com/dashboard`,
          paymentIntentId
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment and create tenant'
    });
  }
}));

/**
 * POST /api/payments/webhook
 * Stripe webhook for payment confirmations and other events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;

  // Verify webhook signature
  const webhookResult = StripeService.verifyWebhookSignature(payload, sig);
  
  if (!webhookResult.success) {
    console.error('Webhook signature verification failed:', webhookResult.error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = webhookResult.event;

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}));

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('\n=== STRIPE WEBHOOK: Payment Succeeded ===');
  console.log(`Payment Intent ID: ${paymentIntent.id}`);
  console.log(`Amount: $${paymentIntent.amount / 100}`);
  console.log(`Customer Email: ${paymentIntent.receipt_email || 'N/A'}`);
  console.log(`Metadata:`, paymentIntent.metadata);
  console.log('==========================================\n');

  // Check if tenant already exists (avoid duplicate processing)
  const client = await pool.connect();
  try {
    const existingTenant = await client.query(
      'SELECT id FROM tenants.business WHERE notes LIKE $1',
      [`%${paymentIntent.id}%`]
    );

    if (existingTenant.rowCount > 0) {
      console.log(`Tenant already exists for payment ${paymentIntent.id}, skipping webhook processing`);
      return;
    }

    // If tenant doesn't exist, this might be a delayed webhook
    // Log it for manual review
    console.log(`⚠️  Payment succeeded but no tenant found for ${paymentIntent.id}`);
    console.log('This might need manual review or the payment was processed differently');
    
  } finally {
    client.release();
  }
}

/**
 * Handle failed payment intent
 */
function handlePaymentIntentFailed(paymentIntent) {
  console.log('\n=== STRIPE WEBHOOK: Payment Failed ===');
  console.log(`Payment Intent ID: ${paymentIntent.id}`);
  console.log(`Last Payment Error:`, paymentIntent.last_payment_error);
  console.log('======================================\n');

  // Log failed payments for analysis
  // In production, you might want to send alerts or update a failed payments table
}

/**
 * Handle canceled payment intent
 */
function handlePaymentIntentCanceled(paymentIntent) {
  console.log('\n=== STRIPE WEBHOOK: Payment Canceled ===');
  console.log(`Payment Intent ID: ${paymentIntent.id}`);
  console.log(`Cancellation Reason:`, paymentIntent.cancellation_reason);
  console.log('========================================\n');
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  console.log('\n=== STRIPE WEBHOOK: Subscription Created ===');
  console.log(`Subscription ID: ${subscription.id}`);
  console.log(`Customer ID: ${subscription.customer}`);
  console.log(`Status: ${subscription.status}`);
  console.log('============================================\n');

  // Update tenant subscription status
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE tenants.subscriptions SET stripe_subscription_id = $1, status = $2, updated_at = NOW() WHERE stripe_customer_id = $3',
      [subscription.id, subscription.status, subscription.customer]
    );
    console.log(`Updated subscription for customer ${subscription.customer}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  } finally {
    client.release();
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('\n=== STRIPE WEBHOOK: Subscription Updated ===');
  console.log(`Subscription ID: ${subscription.id}`);
  console.log(`Status: ${subscription.status}`);
  console.log('============================================\n');

  // Update tenant subscription status
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE tenants.subscriptions SET status = $1, updated_at = NOW() WHERE stripe_subscription_id = $2',
      [subscription.status, subscription.id]
    );
    console.log(`Updated subscription status for ${subscription.id}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  } finally {
    client.release();
  }
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('\n=== STRIPE WEBHOOK: Subscription Deleted ===');
  console.log(`Subscription ID: ${subscription.id}`);
  console.log(`Customer ID: ${subscription.customer}`);
  console.log('============================================\n');

  // Update tenant subscription status to canceled
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE tenants.subscriptions SET status = $1, updated_at = NOW() WHERE stripe_subscription_id = $2',
      ['canceled', subscription.id]
    );
    console.log(`Marked subscription as canceled for ${subscription.id}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  } finally {
    client.release();
  }
}

/**
 * GET /api/payments/test-cards
 * Get test card numbers for development
 */
router.get('/test-cards', (req, res) => {
  res.json({
    success: true,
    testCards: StripeService.getTestCards()
  });
});

/**
 * POST /api/payments/test-email
 * Send a test email (for development)
 */
router.post('/test-email', asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email address is required'
    });
  }

  const result = await emailService.sendTestEmail(email);
  
  res.json({
    success: result.success,
    message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
    error: result.error
  });
}));

/**
 * POST /api/payments/test-webhook
 * Test webhook endpoint for development
 */
router.post('/test-webhook', asyncHandler(async (req, res) => {
  const { eventType = 'payment_intent.succeeded', paymentIntentId } = req.body;

  console.log(`\n🧪 Testing webhook with event: ${eventType}`);
  
  // Create a mock event for testing
  const mockEvent = {
    id: `evt_test_${Date.now()}`,
    type: eventType,
    data: {
      object: {
        id: paymentIntentId || 'pi_test_' + Date.now(),
        amount: 1500,
        currency: 'usd',
        status: 'succeeded',
        receipt_email: 'test@example.com',
        metadata: {
          business_name: 'Test Business',
          plan_type: 'starter',
          source: 'webhook_test'
        }
      }
    }
  };

  try {
    // Process the mock event
    switch (mockEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(mockEvent.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(mockEvent.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(mockEvent.data.object);
        break;
      default:
        console.log(`Test event type: ${mockEvent.type}`);
    }

    res.json({
      success: true,
      message: `Test webhook processed: ${eventType}`,
      eventId: mockEvent.id
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Test webhook failed'
    });
  }
}));

module.exports = router;
