import Stripe from 'stripe';
import { createModuleLogger } from '../config/logger.js';
const logger = createModuleLogger('stripeService');


import { env } from '../config/env.js';

// Initialize Stripe with secret key
const stripe = Stripe(env.STRIPE_SECRET_KEY);

/**
 * Stripe Service
 * Handles all Stripe-related operations for payments and subscriptions
 */
class StripeService {
  
  /**
   * Create a payment intent for tenant signup
   * @param {Object} params - Payment parameters
   * @param {number} params.amount - Amount in cents
   * @param {string} params.currency - Currency code (default: 'usd')
   * @param {string} params.customerEmail - Customer email
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} Payment intent object
   */
  static async createPaymentIntent({ amount, currency = 'usd', customerEmail, metadata = {} }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        confirmation_method: 'automatic',
        metadata: {
          ...metadata,
          customer_email: customerEmail,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      logger.error('Stripe Payment Intent Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a Stripe customer
   * @param {Object} params - Customer parameters
   * @param {string} params.email - Customer email
   * @param {string} params.name - Customer name
   * @param {string} params.phone - Customer phone
   * @returns {Promise<Object>} Customer object
   */
  static async createCustomer({ email, name, phone }) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        phone,
      });

      return {
        success: true,
        customerId: customer.id,
        customer,
      };
    } catch (error) {
      logger.error('Stripe Customer Creation Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent object
   */
  static async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      logger.error('Stripe Payment Intent Retrieval Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a subscription for recurring billing
   * @param {Object} params - Subscription parameters
   * @param {string} params.customerId - Stripe customer ID
   * @param {string} params.priceId - Stripe price ID
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} Subscription object
   */
  static async createSubscription({ customerId, priceId, metadata = {} }) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscription,
      };
    } catch (error) {
      logger.error('Stripe Subscription Creation Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify webhook signature
   * @param {string} payload - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Event object if valid
   */
  static verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
      return { success: true, event };
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get test card numbers for development
   * @returns {Object} Test card information
   */
  static getTestCards() {
    return {
      success: {
        visa: '4242424242424242',
        visaDebit: '4000056655665556',
        mastercard: '5555555555554444',
        amex: '378282246310005',
        discover: '6011111111111117',
      },
      decline: {
        generic: '4000000000000002',
        insufficientFunds: '4000000000009995',
        lostCard: '4000000000009987',
        stolenCard: '4000000000009979',
      },
      authentication: {
        requiresAuth: '4000002500003155',
        authFails: '4000008400001629',
      }
    };
  }
}

export default StripeService;
