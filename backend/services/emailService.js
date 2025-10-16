/**
 * Email Service
 * 
 * Handles sending emails using SendGrid
 * Provides templates for common email types
 */

const sgMail = require('@sendgrid/mail');
const { env } = require('../config/env');
const logger = require('../utils/logger');

// Initialize SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

/**
 * Email Templates
 */
const emailTemplates = {
  welcome: {
    subject: 'Welcome to ThatSmartSite! Your website is ready 🎉',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ThatSmartSite</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
          .credentials { background: #e2e8f0; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ThatSmartSite!</h1>
            <p>Your professional website is ready to go live</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.firstName}!</h2>
            
            <p>Congratulations! Your website for <strong>${data.businessName}</strong> has been successfully created and is now live at:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${data.websiteUrl}" class="button">View Your Website</a>
            </div>
            
            <h3>🔐 Your Login Credentials</h3>
            <div class="credentials">
              <p><strong>Dashboard URL:</strong> <a href="${data.dashboardUrl}">${data.dashboardUrl}</a></p>
              <p><strong>Email:</strong> ${data.personalEmail}</p>
              <p><strong>Temporary Password:</strong> ${data.tempPassword}</p>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
            </div>
            
            <h3>🚀 What's Next?</h3>
            <ul>
              <li><strong>Customize your site</strong> - Add your photos, services, and business information</li>
              <li><strong>Set up your schedule</strong> - Configure your availability and booking system</li>
              <li><strong>Add your locations</strong> - Define your service areas</li>
              <li><strong>Review your content</strong> - Make sure everything looks perfect</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
            </div>
            
            <h3>💬 Need Help?</h3>
            <p>Our team is here to help you get started! If you have any questions:</p>
            <ul>
              <li>📧 Email us at <a href="mailto:hello@thatsmartsite.com">hello@thatsmartsite.com</a></li>
              <li>📞 Call us at <a href="tel:(555) 123-4567">(555) 123-4567</a></li>
            </ul>
            
            <div class="footer">
              <p>Thank you for choosing ThatSmartSite!</p>
              <p>Best regards,<br>The ThatSmartSite Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data) => `
Welcome to ThatSmartSite!

Hi ${data.firstName}!

Congratulations! Your website for ${data.businessName} has been successfully created and is now live.

Your Website: ${data.websiteUrl}
Dashboard: ${data.dashboardUrl}

Your Login Credentials:
- Email: ${data.personalEmail}
- Temporary Password: ${data.tempPassword}

⚠️ Important: Please change your password after your first login for security.

What's Next?
- Customize your site - Add your photos, services, and business information
- Set up your schedule - Configure your availability and booking system
- Add your locations - Define your service areas
- Review your content - Make sure everything looks perfect

Need Help?
- Email us at hello@thatsmartsite.com
- Call us at (555) 123-4567

Thank you for choosing ThatSmartSite!

Best regards,
The ThatSmartSite Team
    `
  }
};

/**
 * Send welcome email to new tenant
 * 
 * @param {Object} data - Tenant data
 * @param {string} data.personalEmail - Personal email
 * @param {string} data.businessEmail - Business email (optional)
 * @param {string} data.firstName - Tenant first name
 * @param {string} data.businessName - Business name
 * @param {string} data.websiteUrl - Website URL
 * @param {string} data.dashboardUrl - Dashboard URL
 * @param {string} data.tempPassword - Temporary password
 * @returns {Promise<Object>} Send result
 */
async function sendWelcomeEmail(data) {
  if (!env.SENDGRID_API_KEY) {
    logger.warn('SendGrid API key not configured, skipping welcome email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.welcome;
    
    // Determine which emails to send to
    const emailsToSend = [];
    
    // Always send to personal email
    emailsToSend.push(data.personalEmail);
    
    // Send to business email if it exists and is different from personal
    if (data.businessEmail && 
        data.businessEmail.trim() && 
        data.businessEmail.toLowerCase() !== data.personalEmail.toLowerCase()) {
      emailsToSend.push(data.businessEmail);
    }

    logger.info('Sending welcome email', { 
      personalEmail: data.personalEmail,
      businessEmail: data.businessEmail,
      emailsToSend,
      businessName: data.businessName,
      websiteUrl: data.websiteUrl 
    });

    // Send to all email addresses
    const promises = emailsToSend.map((email) => {
      const msg = {
        to: email,
        from: {
          email: env.FROM_EMAIL,
          name: 'ThatSmartSite Team'
        },
        subject: template.subject,
        text: template.text(data),
        html: template.html(data)
      };

      return sgMail.send(msg);
    });

    const results = await Promise.all(promises);
    
    const messageIds = results.map(result => result[0].headers['x-message-id']);
    
    logger.info('Welcome emails sent successfully', { 
      emailsSent: emailsToSend,
      messageIds 
    });

    return { 
      success: true, 
      emailsSent: emailsToSend,
      messageIds 
    };

  } catch (error) {
    logger.error('Failed to send welcome email', { 
      error: error.message,
      personalEmail: data.personalEmail,
      businessEmail: data.businessEmail
    });
    
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Send test email (for development)
 * 
 * @param {string} to - Recipient email
 * @returns {Promise<Object>} Send result
 */
async function sendTestEmail(to) {
  if (!env.SENDGRID_API_KEY) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const msg = {
      to,
      from: {
        email: env.FROM_EMAIL,
        name: 'ThatSmartSite Team'
      },
      subject: 'ThatSmartSite - Test Email',
      text: 'This is a test email from ThatSmartSite. If you received this, your email service is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">ThatSmartSite - Test Email</h2>
          <p>This is a test email from ThatSmartSite. If you received this, your email service is working correctly!</p>
          <p>Best regards,<br>The ThatSmartSite Team</p>
        </div>
      `
    };

    await sgMail.send(msg);
    return { success: true };

  } catch (error) {
    logger.error('Failed to send test email', { error: error.message });
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendTestEmail,
  emailTemplates
};
