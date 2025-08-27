const { verifyAccessToken, isTokenBlacklisted } = require('../utils/tokenManager');
const logger = require('../utils/logger');

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Verify the token
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Access token expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        message: 'Please refresh your token'
      });
    }
    if (error.message === 'Invalid access token') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    logger.error('Authentication error:', { error: error.message });
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Admin Middleware - Enhanced to check both isAdmin and role claims
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    logger.warn('Admin access attempt without user context');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check both isAdmin boolean and role string for comprehensive admin validation
  const isAdminUser = req.user.isAdmin === true || req.user.role === 'admin';
  
  if (!isAdminUser) {
    logger.warn('Admin access denied', { 
      userId: req.user.userId, 
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      role: req.user.role,
      ip: req.ip
    });
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  logger.debug('Admin access granted', { 
    userId: req.user.userId, 
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    role: req.user.role
  });
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
