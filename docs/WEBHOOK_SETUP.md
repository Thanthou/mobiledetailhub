# Stripe Webhook Setup Guide

## Overview

This document explains how to set up Stripe webhooks for the That Smart Site platform to handle payment confirmations and subscription events automatically.

## Webhook Endpoint

**URL:** `https://yourdomain.com/api/payments/webhook`

## Required Events

Configure these events in your Stripe webhook settings:

### Payment Events
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment was canceled

### Subscription Events (for future use)
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription canceled

## Environment Variables

Add to your `.env` file:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Webhook Handler Features

### Payment Intent Succeeded
- Logs successful payment details
- Checks for duplicate processing
- Alerts if tenant creation might be missing

### Payment Intent Failed
- Logs failed payment details and error reasons
- Useful for analyzing payment failure patterns

### Subscription Management
- Automatically updates tenant subscription status
- Handles subscription lifecycle events
- Maintains data consistency between Stripe and database

## Testing

### Development Testing
Use the test endpoint to simulate webhook events:

```bash
# Test payment succeeded
curl -X POST http://localhost:3001/api/payments/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventType": "payment_intent.succeeded"}'

# Test payment failed
curl -X POST http://localhost:3001/api/payments/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"eventType": "payment_intent.payment_failed"}'
```

### Automated Testing
Run the webhook test script:

```bash
cd backend
node scripts/test-webhook.js
```

## Production Setup

### 1. Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select the required events (listed above)
5. Copy the webhook signing secret

### 2. Set Environment Variable
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
```

### 3. Test with Real Events
1. Create a test payment in Stripe Dashboard
2. Check your server logs for webhook processing
3. Verify tenant creation works correctly

## Security

- Webhook signature verification ensures events are from Stripe
- Raw request body parsing prevents signature tampering
- Duplicate event detection prevents double processing

## Monitoring

### Logs to Watch
- `=== STRIPE WEBHOOK: Payment Succeeded ===`
- `=== STRIPE WEBHOOK: Payment Failed ===`
- `⚠️ Payment succeeded but no tenant found`

### Error Handling
- Invalid signatures return 400 status
- Processing errors return 500 status
- All events are logged for debugging

## Troubleshooting

### Common Issues

**Webhook not receiving events:**
- Check webhook URL is accessible
- Verify SSL certificate is valid
- Ensure firewall allows Stripe IPs

**Signature verification fails:**
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check that raw request body is being used
- Ensure webhook secret hasn't been regenerated

**Events not processing:**
- Check server logs for error messages
- Verify database connection is working
- Test with the test endpoint first

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## Future Enhancements

- Email notifications for failed payments
- Retry logic for failed webhook processing
- Webhook event replay for missed events
- Dashboard for monitoring webhook health
