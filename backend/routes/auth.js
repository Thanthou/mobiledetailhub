const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

// User Registration
router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Create user with admin status if applicable
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, phone, is_admin, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, email, name, phone, is_admin, role, created_at',
      [email, hashedPassword, name, phone, isAdmin, isAdmin ? 'admin' : 'user']
    );

    // Generate JWT token with admin info
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email, isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    if (isAdmin) {
      // Admin user created
    }

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        phone: result.rows[0].phone,
        is_admin: isAdmin
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    let isAdmin = user.is_admin || false;
    
    // Auto-promote to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
      await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
      isAdmin = true;
    }

    // Generate JWT token with admin info
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        is_admin: isAdmin
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User (Protected Route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, phone, is_admin, created_at FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    // Check if user should be admin based on environment variable
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    let isAdmin = user.is_admin || false;
    
    // Auto-promote to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && !user.is_admin) {
      await pool.query('UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE id = $1', [user.id]);
      isAdmin = true;
    }
    
    res.json({
      ...user,
      is_admin: isAdmin
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (Client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin promotion endpoint (for development)
router.post('/promote-admin', async (req, res) => {
  try {
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (ADMIN_EMAILS.length === 0) {
      return res.status(400).json({ error: 'No ADMIN_EMAILS configured' });
    }
    
    // Update all users whose emails are in ADMIN_EMAILS to be admins
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE, role = \'admin\' WHERE email = ANY($1) RETURNING id, email, name',
      [ADMIN_EMAILS]
    );
    
    res.json({
      success: true,
      message: `Promoted ${result.rowCount} users to admin`,
      promoted: result.rows
    });
  } catch (err) {
    console.error('Admin promotion error:', err);
    res.status(500).json({ error: 'Failed to promote users to admin' });
  }
});

module.exports = router;
