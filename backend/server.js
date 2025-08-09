const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Removed for now
const config = require('../shared/config.js');
const { business } = config;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  res.json({ status: 'OK', message: 'JPS Backend is running' });
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
      New Contact Form Submission from JPS Website
      
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
    const recipients = config.emailNotifications || [process.env.NOTIFICATION_EMAIL || business.email];
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(', '), // Send to all email addresses
      subject: `New Contact Form Submission - ${name}`,
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
      New Quote Request from JPS Website
      
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
    const recipients = config.emailNotifications || [process.env.NOTIFICATION_EMAIL || business.email];
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(', '), // Send to all email addresses
      subject: `New Quote Request - ${name} - ${service}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    });

    // Send SMS notification
    try {
      const smsMessage = `New Quote: ${name}\nService: ${service}\nVehicle: ${vehicle}\nPhone: ${phone}\nEmail: ${email}`;
      await sendSMS(business.smsPhone, smsMessage);
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

app.listen(PORT, () => {
  console.log(`🚗 JPS Backend server running on port ${PORT}`);
  console.log(`📧 Email notifications: ${process.env.NOTIFICATION_EMAIL || business.email}`);
}); 