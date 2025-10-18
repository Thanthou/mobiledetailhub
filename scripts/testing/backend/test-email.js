/**
 * Test Email Service
 * 
 * Script to test the email service functionality
 * Usage: node scripts/test-email.js <email-address>
 */

require('dotenv').config();
const { env } = require('../config/env');
const emailService = require('../services/emailService');

async function testEmailService() {
  const testEmail = process.argv[2];
  
  if (!testEmail) {
    console.log('❌ Please provide an email address');
    console.log('Usage: node scripts/test-email.js <email-address>');
    process.exit(1);
  }

  console.log('🧪 Testing Email Service...');
  console.log('📧 SendGrid API Key:', env.SENDGRID_API_KEY ? '✅ Configured' : '❌ Not configured');
  console.log('📧 From Email:', env.FROM_EMAIL);
  console.log('📧 Test Email:', testEmail);
  console.log('');

  try {
    // Test 1: Send test email
    console.log('📤 Sending test email...');
    const testResult = await emailService.sendTestEmail(testEmail);
    
    if (testResult.success) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.log('❌ Test email failed:', testResult.error);
    }

    console.log('');

    // Test 2: Send welcome email template
    console.log('📤 Sending welcome email template...');
    const welcomeResult = await emailService.sendWelcomeEmail({
      personalEmail: testEmail,
      businessEmail: 'business@example.com', // Test with different business email
      firstName: 'Test',
      businessName: 'Test Business',
      websiteUrl: 'https://thatsmartsite.com/test-business',
      dashboardUrl: 'https://thatsmartsite.com/test-business/dashboard',
      tempPassword: 'temp123456'
    });

    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('📧 Emails sent to:', welcomeResult.emailsSent.join(', '));
      console.log('📧 Message IDs:', welcomeResult.messageIds.join(', '));
    } else {
      console.log('❌ Welcome email failed:', welcomeResult.error);
    }

  } catch (error) {
    console.error('❌ Error testing email service:', error.message);
  }

  console.log('');
  console.log('🏁 Email service test complete!');
}

// Run the test
testEmailService().catch(console.error);
