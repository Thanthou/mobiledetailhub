#!/usr/bin/env node

/**
 * Stripe Webhook Testing Script
 * 
 * This script tests the webhook endpoints to ensure they're working correctly.
 * Run with: node scripts/test-webhook.js
 */

require('dotenv').config();
const { env } = require('../config/env');

async function testWebhook() {
  const webhookUrl = `${env.API_URL || 'http://localhost:3001'}/api/payments/test-webhook`;
  
  console.log('🧪 Testing Stripe Webhook Endpoints...\n');

  const testCases = [
    {
      name: 'Payment Succeeded',
      eventType: 'payment_intent.succeeded',
      paymentIntentId: 'pi_test_success_' + Date.now()
    },
    {
      name: 'Payment Failed',
      eventType: 'payment_intent.payment_failed',
      paymentIntentId: 'pi_test_failed_' + Date.now()
    },
    {
      name: 'Payment Canceled',
      eventType: 'payment_intent.canceled',
      paymentIntentId: 'pi_test_canceled_' + Date.now()
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📡 Testing: ${testCase.name}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: testCase.eventType,
          paymentIntentId: testCase.paymentIntentId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${testCase.name}: PASSED`);
        console.log(`   Event ID: ${result.eventId}`);
      } else {
        console.log(`❌ ${testCase.name}: FAILED`);
        console.log(`   Error: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name}: ERROR`);
      console.log(`   ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🎯 Webhook Testing Complete!');
  console.log('\nTo test with real Stripe webhooks:');
  console.log('1. Set up a Stripe webhook endpoint pointing to:');
  console.log(`   ${env.API_URL || 'http://localhost:3001'}/api/payments/webhook`);
  console.log('2. Configure these events:');
  console.log('   - payment_intent.succeeded');
  console.log('   - payment_intent.payment_failed');
  console.log('   - payment_intent.canceled');
  console.log('   - customer.subscription.created');
  console.log('   - customer.subscription.updated');
  console.log('   - customer.subscription.deleted');
  console.log('3. Set STRIPE_WEBHOOK_SECRET in your .env file');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testWebhook().catch(console.error);
}

module.exports = { testWebhook };
