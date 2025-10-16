import express from 'express'
const router = express.Router()

router.post('/create-intent', (req, res, next) => {
  try {
    // Debug
    console.log('=== PAYMENT INTENT DEBUG ===')
    console.log('Request body:', req.body)

    const { amount, customerEmail, businessName, planType, metadata } = req.body || {}
    if (!amount || !customerEmail || !businessName || !planType) {
      throw new Error('Missing required fields: amount, customerEmail, businessName, planType')
    }

    // TODO: Stripe logic here
    // For now, return a mock client secret
    const mockClientSecret = `pi_mock_${Date.now()}_secret_mock_${Math.random().toString(36).substring(2)}`
    
    res.json({ 
      success: true, 
      clientSecret: mockClientSecret,
      paymentIntentId: `pi_mock_${Date.now()}`,
      received: { amount, customerEmail, businessName, planType, metadata } 
    })
  } catch (err) {
    next(err)
  }
})

router.post('/confirm', (req, res, next) => {
  try {
    console.log('=== PAYMENT CONFIRM DEBUG ===')
    console.log('Request body:', req.body)

    const { paymentIntentId, tenantData } = req.body || {}
    if (!paymentIntentId || !tenantData) {
      throw new Error('Missing required fields: paymentIntentId, tenantData')
    }

    // TODO: Process payment confirmation and create tenant
    // For now, return mock success response
    const mockSlug = tenantData.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'test-business'
    
    res.json({
      success: true,
      data: {
        slug: mockSlug,
        websiteUrl: `/${mockSlug}`,
        dashboardUrl: `/${mockSlug}/dashboard`,
        tenantId: `tenant_${Date.now()}`,
        userId: `user_${Date.now()}`,
        paymentIntentId
      }
    })
  } catch (err) {
    next(err)
  }
})

export default router