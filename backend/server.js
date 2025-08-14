const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Removed for now
const { loadBusinessConfig, getSlugFromDomain } = require('../shared/utils/businessLoader.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - MUST be first, before any other middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:4173',
    'https://jps.mobiledetailhub.com',
    'https://abc.mobiledetailhub.com',
    'https://mobiledetailhub.com',
    'https://jps-detailing.vercel.app',
    'https://jps-detailing-git-main.vercel.app',
    'https://jps-detailing-git-develop.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('=== CORS DEBUG ===');
  console.log('Request origin:', req.get('origin'));
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('==================');
  next();
});

// Security middleware
app.use(helmet());

// Rate limiting - more permissive for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10000 // limit each IP to 10000 requests per windowMs (increased for development)
// });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to load business config based on domain
// Only apply to routes that don't need business context
app.use((req, res, next) => {
  // Skip business config loading for routes that don't need it
  if (req.path === '/api/health' || req.path === '/api/businesses' || req.path.startsWith('/api/business-config/')) {
    return next();
  }
  
  try {
    const hostname = req.get('host') || req.hostname;
    const businessSlug = getSlugFromDomain(hostname, req);
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Hostname:', hostname);
    console.log('Detected business slug:', businessSlug);
    req.businessConfig = loadBusinessConfig(businessSlug);
    console.log('Loaded business config:', req.businessConfig);
    req.business = req.businessConfig.business;
    console.log('Set req.business:', req.business);
    console.log('=======================');
    next();
  } catch (error) {
    console.error('Failed to load business config:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Business configuration error' 
    });
  }
});

// SMS function disabled for now
const sendSMS = async (phone, message) => {
  console.log('SMS functionality disabled - would send:', message);
  return { success: false, message: 'SMS disabled' };
};

// Email transporter setup
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // For other email services or custom SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Multi-Business Backend is running' });
});

// Get available businesses
app.get('/api/businesses', (req, res) => {
  try {
    const { listBusinesses, loadBusinessConfig } = require('../shared/utils/businessLoader.js');
    const businessSlugs = listBusinesses();
    console.log('Available business slugs:', businessSlugs);
    
    const businesses = businessSlugs.map(slug => {
      try {
        console.log(`Loading config for business: ${slug}`);
        const config = loadBusinessConfig(slug);
        console.log(`Successfully loaded config for ${slug}:`, config.business.name);
        return {
          slug: slug,
          name: config.business.name,
          domain: config.domain
        };
      } catch (error) {
        console.error(`Error loading config for ${slug}:`, error);
        return {
          slug: slug,
          name: `${slug} (config error)`,
          domain: `${slug}.mobiledetailhub.com`
        };
      }
    });

    console.log('Final businesses list:', businesses);
    res.json(businesses);
  } catch (error) {
    console.error('Error listing businesses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to list businesses' 
    });
  }
});

// Get business configuration by slug
app.get('/api/business-config/:slug', (req, res) => {
  try {
    const { loadBusinessConfig } = require('../shared/utils/businessLoader.js');
    const { slug } = req.params;
    
    console.log(`Loading business config for slug: ${slug}`);
    const config = loadBusinessConfig(slug);
    
    res.json(config);
  } catch (error) {
    console.error(`Error loading business config for ${req.params.slug}:`, error);
    res.status(404).json({ 
      success: false, 
      message: `Business configuration not found for slug: ${req.params.slug}` 
    });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, service } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Email content
    const emailContent = `
      New Contact Form Submission from ${req.business.name || 'Business'} Website
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Service: ${service || 'General inquiry'}
      
      Message:
      ${message}
      
      Submitted at: ${new Date().toLocaleString()}
    `;

    // Send email to multiple recipients
    const transporter = createTransporter();
    
    // Load MDH config to get the parent company email
    let mdhEmail = 'service@mobiledetailhub.com'; // Fallback default
    try {
      const { loadBusinessConfig } = require('../shared/utils/businessLoader.js');
      const mdhConfig = loadBusinessConfig('mdh');
      mdhEmail = mdhConfig.business.email || mdhEmail;
      console.log('MDH email loaded from config for contact form:', mdhEmail);
    } catch (error) {
      console.warn('Failed to load MDH config for contact form, using fallback email:', mdhEmail);
    }
    
    // Get current business email from the current business config
    const currentBusinessEmail = req.business.email; // This is from the current business (e.g., JP's)
    
    // Always send to: 1) Current business email, 2) MDH email
    const allEmails = [];
    
    // 1. Add current business email first
    if (currentBusinessEmail) {
      allEmails.push(currentBusinessEmail);
      console.log('Added current business email for contact form:', currentBusinessEmail);
    }
    
    // 2. Add MDH email (if different from current business email)
    if (mdhEmail && mdhEmail !== currentBusinessEmail) {
      allEmails.push(mdhEmail);
      console.log('Added MDH email for contact form:', mdhEmail);
    }
    
    console.log('Final email list for contact form:', allEmails);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: allEmails.join(', '), // Send to all email addresses
      subject: `New Contact Form Submission - ${req.business.name || 'Business'} - ${name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    });

    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error sending your message. Please try again.' 
    });
  }
});

// Quote request submission
app.post('/api/quote', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      vehicle, 
      service, 
      additionalInfo,
      preferredDate 
    } = req.body;

    // Basic validation
    if (!name || !email || !vehicle || !service) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, vehicle, and service are required' 
      });
    }

    // Email content
    const emailContent = `
      New Quote Request from ${req.business.name || 'Business'} Website
      
      Customer Information:
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      
      Vehicle Details:
      Vehicle: ${vehicle}
      
      Service Requested:
      Service: ${service}
      Preferred Date: ${preferredDate || 'Not specified'}
      
      Additional Information:
      ${additionalInfo || 'None provided'}
      
      Submitted at: ${new Date().toLocaleString()}
    `;

    // Send email to multiple recipients
    const transporter = createTransporter();
    
    // Load MDH config to get the parent company email
    let mdhEmail = 'service@mobiledetailhub.com'; // Fallback default
    try {
      const { loadBusinessConfig } = require('../shared/utils/businessLoader.js');
      const mdhConfig = loadBusinessConfig('mdh');
      mdhEmail = mdhConfig.business.email || mdhEmail;
      console.log('MDH email loaded from config:', mdhEmail);
    } catch (error) {
      console.warn('Failed to load MDH config, using fallback email:', mdhEmail);
    }
    
    // Get current business email from the current business config
    const currentBusinessEmail = req.business.email; // This is from the current business (e.g., JP's)
    
    // Debug logging to see what's loaded
    console.log('=== DEBUG: Business Config Loading ===');
    console.log('req.business:', req.business);
    console.log('req.businessConfig:', req.businessConfig);
    console.log('Current business email from req.business.email:', currentBusinessEmail);
    console.log('Current business name from req.business.name:', req.business.name);
    console.log('=====================================');
    
    // Always send to: 1) Current business email, 2) MDH email
    const allEmails = [];
    
    // 1. Add current business email first
    if (currentBusinessEmail) {
      allEmails.push(currentBusinessEmail);
      console.log('Added current business email:', currentBusinessEmail);
    }
    
    // 2. Add MDH email (if different from current business email)
    if (mdhEmail && mdhEmail !== currentBusinessEmail) {
      allEmails.push(mdhEmail);
      console.log('Added MDH email:', mdhEmail);
    }
    
    console.log('Final email list:', allEmails);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: allEmails.join(', '), // Send to all email addresses
      subject: `New Quote Request - ${req.business.name || 'Business'} - ${name} - ${service}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    });

    // Send SMS notification
    try {
      const smsMessage = `New Quote from ${req.business.name || 'Business'}: ${name}\nService: ${service}\nVehicle: ${vehicle}\nPhone: ${phone}\nEmail: ${email}`;
      await sendSMS(req.business.smsPhone, smsMessage);
      console.log('SMS sent successfully');
    } catch (smsError) {
      console.error('SMS failed:', smsError.message);
      // Don't fail the request if SMS fails
    }

    res.json({ 
      success: true, 
      message: 'Thank you for your quote request! We will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error submitting your quote request. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚗 Multi-Business Backend server running on port ${PORT}`);
    console.log(`📧 Ready to serve multiple business domains`);
    console.log(`📁 Available businesses: ${require('../shared/utils/businessLoader.js').listBusinesses().join(', ')}`);
  });
}

// Export for Vercel serverless functions
module.exports = app; 