const express = require('express');
const router = express.Router();
const StripeService = require('../services/stripeService');
const tenantProvisionService = require('../services/tenantProvisionService');
const { asyncHandler } = require('../middleware/errorHandler');
const { sensitiveAuthLimiter } = require('../middleware/rateLimiter');

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
    const error = new Error('Missing required fields: amount, customerEmail, businessName, planType');
    error.statusCode = 400;
    throw error;
  }

  // Validate amount (minimum $1)
  if (amount < 100) {
    const error = new Error('Amount must be at least $1.00');
    error.statusCode = 400;
    throw error;
  }

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
    const error = new Error(paymentIntent.error);
    error.statusCode = 400;
    throw error;
  }

  res.json({
    success: true,
    clientSecret: paymentIntent.clientSecret,
    paymentIntentId: paymentIntent.paymentIntentId
  });
}));

/**
 * POST /api/payments/confirm
 * Confirm payment and activate tenant
 */
router.post('/confirm', sensitiveAuthLimiter, asyncHandler(async (req, res) => {
  console.log('🔥🔥🔥 PAYMENT CONFIRMATION ENDPOINT CALLED - THIS SHOULD DEFINITELY SHOW UP! 🔥🔥🔥');
  console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('📋 Request Headers:', JSON.stringify(req.headers, null, 2));
  
  const { paymentIntentId, tenantData } = req.body;

  if (!paymentIntentId || !tenantData) {
    const error = new Error('Missing paymentIntentId or tenantData');
    error.statusCode = 400;
    throw error;
  }

  // Use the new tenant provision service to handle all the complex logic
  const result = await tenantProvisionService.provisionTenantWithPayment(paymentIntentId, tenantData);

  res.json({
    success: true,
    message: 'Payment confirmed and tenant created successfully',
    data: result
  });
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
    const error = new Error('Invalid signature');
    error.statusCode = 400;
    throw error;
  }

  const event = webhookResult.event;

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
