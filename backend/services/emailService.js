/**
 * Email Service
 * 
 * Handles sending emails using SendGrid
 * Provides templates for common email types
 */

import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { logger } from 'config/logger.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

/**
 * Load HTML email template
 */
const loadEmailTemplate = (templateName) => {
  try {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    logger.error(`Failed to load email template: ${templateName}`, { error: error.message });
    return null;
  }
};

/**
 * Email Templates
 */
const emailTemplates = {
  welcome: {
    subject: 'Welcome to That Smart Site! Set up your account 🎉',
    html: (data) => {
      const template = loadEmailTemplate('welcome');
      if (!template) {
        // Fallback to simple template if file loading fails
        return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to That Smart Site!</h1>
            <p>Hi ${data.firstName}!</p>
            <p>Your website for <strong>${data.businessName}</strong> is ready!</p>
            <p><a href="${data.passwordLink}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Set Your Password</a></p>
            <p><a href="${data.dashboardUrl}">Go to Dashboard</a></p>
          </div>
        `;
      }
      
      return template
        .replace(/\{\{firstName\}\}/g, data.firstName || '')
        .replace(/\{\{businessName\}\}/g, data.businessName || '')
        .replace(/\{\{planType\}\}/g, data.planType || 'Starter')
        .replace(/\{\{websiteUrl\}\}/g, data.websiteUrl || '')
        .replace(/\{\{dashboardUrl\}\}/g, data.dashboardUrl || '')
        .replace(/\{\{passwordLink\}\}/g, data.passwordLink || '')
        .replace(/\{\{logoUrl\}\}/g, data.logoUrl || '/shared/icons/logo.png');
    },
    text: (data) => `
Welcome to That Smart Site!

Hi ${data.firstName}!

Congratulations! Your website for ${data.businessName} has been successfully created and is now live.

Your Website: ${data.websiteUrl}
Dashboard: ${data.dashboardUrl}
Plan: ${data.planType || 'Starter'}

🔑 Password Setup Required:
Set your password: ${data.passwordLink}

What's Next?
- Set your password using the link above
- Customize your site - Add your photos, services, and business information
- Set up your schedule - Configure your availability and booking system
- Add your locations - Define your service areas
- Review your content - Make sure everything looks perfect

Need Help?
- Email us at support@thatsmartsite.com

Thank you for choosing That Smart Site!

Best regards,
The That Smart Site Team
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
 * @param {string} data.planType - Plan type
 * @param {string} data.passwordLink - Password setup link
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

export {
  sendWelcomeEmail,
  sendTestEmail,
  emailTemplates
};
