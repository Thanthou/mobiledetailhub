/**
 * @fileoverview API routes for payments
 * @version 1.0.0
 * @author That Smart Site
 */

import express from 'express'
import { getPool } from '../database/pool.js'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '../services/emailService.js'
import { createModuleLogger } from '../config/logger.js'
import { sendSuccess, sendError, sendValidationError } from '../utils/responseFormatter.js'
import { validateBody } from '../middleware/zodValidation.js'
import { paymentSchemas } from '../schemas/validation/index.js'

const router = express.Router()
const logger = createModuleLogger('payments');


import { asyncHandler } from '../middleware/errorHandler.js';
router.post('/create-intent', validateBody(paymentSchemas.createIntent), async (req, res, next) => {
  try {
    // Debug
    logger.info('=== PAYMENT INTENT DEBUG ===')
    logger.info('Request body:', JSON.stringify(req.body, null, 2))

    const { amount, customerEmail, businessName, planType, metadata } = req.body || {}
    
    logger.info('Destructured values:', { amount, customerEmail, businessName, planType, metadata })
    
    if (!amount || !customerEmail || !businessName || !planType) {
      const error = `Missing required fields: amount=${amount}, customerEmail=${customerEmail}, businessName=${businessName}, planType=${planType}`
      logger.error(error)
      throw new Error(error)
    }

    // Use real Stripe test mode
    logger.info('Calling Stripe createPaymentIntent...')
    const { default: StripeService } = await import('../services/stripeService.js');
    const result = await StripeService.createPaymentIntent({
      amount,
      customerEmail,
      metadata: {
        businessName,
        planType,
        ...metadata
      }
    });
    
    logger.info('Stripe result:', { success: result.success, hasClientSecret: !!result.clientSecret, error: result.error })
    
    if (result.success) {
      logger.info('✅ Payment intent created successfully')
      // Return format expected by frontend
      return res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      });
    } else {
      logger.error('❌ Stripe createPaymentIntent failed:', result.error)
      throw new Error(result.error || 'Failed to create payment intent');
    }
  } catch (err) {
    logger.error('❌ Payment intent route error:', err.message)
    next(err)
  }
})

router.post('/confirm', validateBody(paymentSchemas.confirm), async (req, res, next) => {
  try {
    logger.info('=== PAYMENT CONFIRM DEBUG ===')
    logger.info('Request body:', req.body)
    logger.info('Request headers:', req.headers)
    logger.info('Request method:', req.method)
    logger.info('Request URL:', req.url)

    const { paymentIntentId, tenantData } = req.body || {}
    if (!paymentIntentId || !tenantData) {
      throw new Error('Missing required fields: paymentIntentId, tenantData')
    }

    const pool = await getPool();

                // Verify payment intent with Stripe
                const { default: StripeService } = await import('../services/stripeService.js');
                const paymentResult = await StripeService.retrievePaymentIntent(paymentIntentId);
                
                logger.info('Payment intent status:', paymentResult.paymentIntent?.status);
                logger.info('Payment intent charges:', paymentResult.paymentIntent?.charges?.data?.length);
                
                if (!paymentResult.success || paymentResult.paymentIntent.status !== 'succeeded') {
                  throw new Error(`Payment not confirmed or failed. Status: ${paymentResult.paymentIntent?.status}`);
                }

    // Generate tenant slug
    const baseSlug = tenantData.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'business';
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (true) {
      const existingTenant = await pool.query('SELECT id FROM tenants.business WHERE slug = $1', [slug]);
      if (existingTenant.rows.length === 0) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
                  // Create user record WITHOUT password (they'll set it via email)
                  const userResult = await client.query(`
                    INSERT INTO auth.users (email, name, phone, password_hash, is_admin, account_status)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id, email, name
                  `, [
                    tenantData.personalEmail,
                    `${tenantData.firstName} ${tenantData.lastName}`,
                    tenantData.personalPhone || null,
                    null, // No password - they'll set it via email
                    false,
                    'active' // Account status active - they can login once they set password
                  ]);
      
      const user = userResult.rows[0];
      
      // Create tenant record
      const tenantResult = await client.query(`
        INSERT INTO tenants.business (
          user_id, business_name, business_email, business_phone,
          first_name, last_name, personal_email, personal_phone,
          industry, application_status, application_date,
          service_areas, notes, slug
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, slug, business_name
      `, [
        user.id,
        tenantData.businessName,
        tenantData.businessEmail,
        tenantData.businessPhone,
        tenantData.firstName,
        tenantData.lastName,
        tenantData.personalEmail,
        tenantData.personalPhone || null,
        tenantData.industry,
        'approved', // Auto-approve for now
        new Date(),
        JSON.stringify([{
          zip: tenantData.businessAddress?.zip || '',
          city: tenantData.businessAddress?.city || '',
          state: tenantData.businessAddress?.state || '',
          minimum: 0,
          primary: true,
          multiplier: 1
        }]),
        `Payment: ${paymentIntentId}\nPlan: ${tenantData.selectedPlan}\nAddress: ${JSON.stringify(tenantData.businessAddress)}`,
        slug
      ]);
      
      const tenant = tenantResult.rows[0];
      
      await client.query('COMMIT');
      
      logger.info('✅ Tenant created successfully:', { userId: user.id, tenantId: tenant.id, slug });
      
      // Send welcome email
      try {
        const emailData = {
          firstName: tenantData.firstName,
          businessName: tenantData.businessName,
          personalEmail: tenantData.personalEmail,
          businessEmail: tenantData.businessEmail,
          websiteUrl: `http://${tenant.slug}.thatsmartsite.com`,
          dashboardUrl: `/${tenant.slug}/dashboard`,
          tempPassword: 'Please set your password via email' // Updated message since no temp password
        };
        
        const emailResult = await sendWelcomeEmail(emailData);
        if (emailResult.success) {
          logger.info('✅ Welcome email sent successfully');
        } else {
          console.warn('⚠️ Failed to send welcome email:', emailResult.error);
        }
      } catch (emailError) {
        console.warn('⚠️ Email sending error:', emailError.message);
        // Don't fail the entire transaction if email fails
      }
      
      // Return format expected by frontend
      return res.json({
        success: true,
        data: {
          slug: tenant.slug,
          websiteUrl: `http://${tenant.slug}.thatsmartsite.com`,
          dashboardUrl: `/${tenant.slug}/dashboard`,
          tenantId: tenant.id,
          userId: user.id,
          paymentIntentId
        }
      });
      
    } catch (transactionError) {
      await client.query('ROLLBACK');
      throw transactionError;
    } finally {
      client.release();
    }
    
  } catch (err) {
    logger.error('Payment confirmation error:', err);
    next(err)
  }
})

export default router