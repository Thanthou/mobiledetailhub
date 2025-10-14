const cookie = require('cookie');
const { verifyAccessToken, isTokenBlacklisted } = require('../utils/tokenManager');
const logger = require('../utils/logger');

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    logger.debug('Authentication middleware called', { 
      path: req.path, 
      method: req.method,
      ip: req.ip
    });
    
    // In development mode, allow requests without authentication for admin routes
    // Check both req.path and req.originalUrl since routes may be mounted
    const isAdminRoute = req.path.includes('/admin') || (req.originalUrl && req.originalUrl.includes('/admin'));
    if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') && isAdminRoute) {
      req.user = {
        userId: 1,
        email: 'admin@dev.local',
        isAdmin: true
      };
      logger.debug('Authentication bypassed (development mode for admin route)', { 
        path: req.path,
        originalUrl: req.originalUrl,
        method: req.method
      });
      return next();
    }
    
    // 1) Prefer HttpOnly cookie
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const cookieToken = cookies['access_token'];

    // 2) Fallback to Authorization header
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];

    const token = cookieToken || headerToken;
    
    if (!token) {
      logger.debug('No authentication token provided', { 
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN',
        message: 'Please provide a valid access token'
      });
    }
    
    logger.debug('Token found, verifying...', { 
      tokenSource: cookieToken ? 'cookie' : 'header',
      path: req.path
    });

    // Check if token is blacklisted
    if (await isTokenBlacklisted(token)) {
      logger.warn('Blacklisted token used', { 
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Token has been revoked',
        code: 'TOKEN_REVOKED',
        message: 'This token is no longer valid'
      });
    }

    // Verify the token
    const user = verifyAccessToken(token);
    req.user = user;
    
    logger.debug('Authentication successful', { 
      userId: user.userId, 
      email: user.email,
      path: req.path
    });
    
    next();
  } catch (error) {
    if (error.message === 'Access token expired') {
      logger.debug('Access token expired', { 
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        message: 'Please refresh your token'
      });
    }
    if (error.message === 'Invalid access token') {
      logger.warn('Invalid access token provided', { 
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
        message: 'The provided token is not valid'
      });
    }
    
    logger.error('Authentication error:', { 
      error: error.message, 
      path: req.path, 
      method: req.method,
      ip: req.ip
    });
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
      message: 'An error occurred during authentication'
    });
  }
};

// Admin Middleware - Role-aware and future-proof
const requireAdmin = (req, res, next) => {
  // In development mode, allow admin access without authentication
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    // Set mock admin user for development
    if (!req.user) {
      req.user = {
        userId: 1,
        email: 'admin@dev.local',
        isAdmin: true
      };
    }
    logger.debug('Admin access granted (development mode)', { 
      path: req.path, 
      method: req.method
    });
    return next();
  }
  
  logger.debug('Admin middleware called', { 
    path: req.path, 
    method: req.method,
    userId: req.user?.userId,
    ip: req.ip
  });
  
  if (!req.user) {
    logger.warn('Admin access attempt without user context', { 
      path: req.path, 
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'NO_USER_CONTEXT',
      message: 'User must be authenticated to access admin resources'
    });
  }
  
  // Check both isAdmin boolean and roles array for admin validation
  const roles = Array.isArray(req.user.roles) ? req.user.roles : [];
  const isAdminUser = req.user.isAdmin === true || roles.includes('admin');
  
  if (!isAdminUser) {
    logger.warn('Admin access denied', { 
      userId: req.user.userId, 
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      roles: roles,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    return res.status(403).json({ 
      error: 'Admin access required',
      code: 'INSUFFICIENT_PRIVILEGES',
      message: 'This action requires administrator privileges'
    });
  }
  
  logger.debug('Admin access granted', { 
    userId: req.user.userId, 
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    roles: roles,
    path: req.path
  });
  
  next();
};

// Role-based middleware factory for future extensibility
const requireRole = (role) => {
  return (req, res, next) => {
    logger.debug('Role middleware called', { 
      requiredRole: role,
      path: req.path, 
      method: req.method,
      userId: req.user?.userId,
      ip: req.ip
    });
    
    if (!req.user) {
      logger.warn('Role access attempt without user context', { 
        requiredRole: role,
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_USER_CONTEXT',
        message: 'User must be authenticated to access this resource'
      });
    }
    
    const roles = Array.isArray(req.user.roles) ? req.user.roles : [];
    const hasRole = roles.includes(role) || (role === 'admin' && req.user.isAdmin === true);
    
    if (!hasRole) {
      logger.warn('Role access denied', { 
        userId: req.user.userId, 
        email: req.user.email,
        requiredRole: role,
        userRoles: roles,
        isAdmin: req.user.isAdmin,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({ 
        error: `${role} access required`,
        code: 'INSUFFICIENT_PRIVILEGES',
        message: `This action requires ${role} privileges`
      });
    }
    
    logger.debug('Role access granted', { 
      userId: req.user.userId, 
      email: req.user.email,
      requiredRole: role,
      userRoles: roles,
      path: req.path
    });
    
    next();
  };
};

// Permission-based middleware factory for fine-grained access control
const requirePermission = (permission) => {
  return (req, res, next) => {
    logger.debug('Permission middleware called', { 
      requiredPermission: permission,
      path: req.path, 
      method: req.method,
      userId: req.user?.userId,
      ip: req.ip
    });
    
    if (!req.user) {
      logger.warn('Permission access attempt without user context', { 
        requiredPermission: permission,
        path: req.path, 
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_USER_CONTEXT',
        message: 'User must be authenticated to access this resource'
      });
    }
    
    const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    const hasPermission = permissions.includes(permission) || 
                         (req.user.isAdmin === true) || // Admins have all permissions
                         (Array.isArray(req.user.roles) && req.user.roles.includes('admin'));
    
    if (!hasPermission) {
      logger.warn('Permission access denied', { 
        userId: req.user.userId, 
        email: req.user.email,
        requiredPermission: permission,
        userPermissions: permissions,
        isAdmin: req.user.isAdmin,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({ 
        error: `${permission} permission required`,
        code: 'INSUFFICIENT_PRIVILEGES',
        message: `This action requires ${permission} permission`
      });
    }
    
    logger.debug('Permission access granted', { 
      userId: req.user.userId, 
      email: req.user.email,
      requiredPermission: permission,
      userPermissions: permissions,
      path: req.path
    });
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  requirePermission
};
