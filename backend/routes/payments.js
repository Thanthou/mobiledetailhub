import express from 'express'
import { pool } from '../database/pool.js'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '../services/emailService.js'
const router = express.Router()

router.post('/create-intent', async (req, res, next) => {
  try {
    // Debug
    console.log('=== PAYMENT INTENT DEBUG ===')
    console.log('Request body:', req.body)

    const { amount, customerEmail, businessName, planType, metadata } = req.body || {}
    if (!amount || !customerEmail || !businessName || !planType) {
      throw new Error('Missing required fields: amount, customerEmail, businessName, planType')
    }

    // Use real Stripe test mode
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
    
    if (result.success) {
      res.json({ 
        success: true, 
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        received: { amount, customerEmail, businessName, planType, metadata } 
      });
    } else {
      throw new Error(result.error || 'Failed to create payment intent');
    }
  } catch (err) {
    next(err)
  }
})

router.post('/confirm', async (req, res, next) => {
  try {
    console.log('=== PAYMENT CONFIRM DEBUG ===')
    console.log('Request body:', req.body)
    console.log('Request headers:', req.headers)
    console.log('Request method:', req.method)
    console.log('Request URL:', req.url)

    const { paymentIntentId, tenantData } = req.body || {}
    if (!paymentIntentId || !tenantData) {
      throw new Error('Missing required fields: paymentIntentId, tenantData')
    }

    if (!pool) {
      const error = new Error('Database connection not available');
      error.statusCode = 500;
      throw error;
    }

                // Verify payment intent with Stripe
                const { default: StripeService } = await import('../services/stripeService.js');
                const paymentResult = await StripeService.retrievePaymentIntent(paymentIntentId);
                
                console.log('Payment intent status:', paymentResult.paymentIntent?.status);
                console.log('Payment intent charges:', paymentResult.paymentIntent?.charges?.data?.length);
                
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
      
      console.log('✅ Tenant created successfully:', { userId: user.id, tenantId: tenant.id, slug });
      
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
          console.log('✅ Welcome email sent successfully');
        } else {
          console.warn('⚠️ Failed to send welcome email:', emailResult.error);
        }
      } catch (emailError) {
        console.warn('⚠️ Email sending error:', emailError.message);
        // Don't fail the entire transaction if email fails
      }
      
      res.json({
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
    console.error('Payment confirmation error:', err);
    next(err)
  }
})

export default router