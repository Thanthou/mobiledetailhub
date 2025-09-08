# Role-Based Access Control (RBAC)

This document explains the role-based access control system implemented in the Mobile Detail Hub backend.

## Overview

The system supports both legacy `isAdmin` boolean checks and modern role-based access control for future extensibility.

## Available Middleware

### 1. `requireAdmin` (Legacy + Role Support)
```javascript
const { requireAdmin } = require('../middleware/auth');

// Works with both isAdmin boolean and roles array
router.get('/admin/users', requireAdmin, handler);
```

**Checks:**
- `req.user.isAdmin === true` (legacy support)
- `req.user.roles.includes('admin')` (new role system)

### 2. `requireRole(role)` (New Role-Based)
```javascript
const { requireRole } = require('../middleware/auth');

// Require specific role
router.get('/manager/dashboard', requireRole('manager'), handler);
router.get('/moderator/content', requireRole('moderator'), handler);
```

### 3. `requirePermission(permission)` (Fine-Grained Control)
```javascript
const { requirePermission } = require('../middleware/auth');

// Require specific permission
router.post('/users/delete', requirePermission('delete_users'), handler);
router.get('/analytics/revenue', requirePermission('view_analytics'), handler);
```

## User Object Structure

### Current Structure (Backward Compatible)
```javascript
{
  userId: 123,
  email: "user@example.com",
  isAdmin: true,  // Legacy boolean
  // roles and permissions are optional
}
```

### Future Structure (Role-Based)
```javascript
{
  userId: 123,
  email: "user@example.com",
  isAdmin: true,  // Still supported for backward compatibility
  roles: ["admin", "manager"],  // Array of roles
  permissions: ["delete_users", "view_analytics"]  // Array of permissions
}
```

## Migration Strategy

### Phase 1: Current (Implemented)
- ✅ `requireAdmin` supports both `isAdmin` and `roles.includes('admin')`
- ✅ Existing routes continue to work unchanged
- ✅ New role-based middleware available for future use

### Phase 2: Future (When Ready)
- Add `roles` and `permissions` fields to user database schema
- Update user creation/update endpoints to handle roles
- Gradually migrate specific endpoints to use `requireRole` or `requirePermission`

### Phase 3: Advanced (Optional)
- Implement role hierarchies (admin > manager > user)
- Add permission inheritance
- Create role management UI

## Examples

### Adding a Manager Role
```javascript
// In your route
const { requireRole } = require('../middleware/auth');

// Manager can access manager dashboard
router.get('/manager/dashboard', requireRole('manager'), handler);

// Admin can still access everything (backward compatible)
router.get('/admin/users', requireAdmin, handler);
```

### Adding Fine-Grained Permissions
```javascript
// In your route
const { requirePermission } = require('../middleware/auth');

// Only users with 'delete_users' permission can delete users
router.delete('/users/:id', requirePermission('delete_users'), handler);

// Only users with 'view_analytics' permission can see analytics
router.get('/analytics', requirePermission('view_analytics'), handler);
```

## Security Benefits

1. **Backward Compatibility**: Existing `isAdmin` checks continue to work
2. **Future-Proof**: Easy to add new roles without code changes
3. **Fine-Grained Control**: Permissions allow precise access control
4. **Audit Trail**: All access attempts are logged with role information
5. **Flexible**: Mix and match roles and permissions as needed

## Logging

All access attempts are logged with:
- User ID and email
- Required role/permission
- User's actual roles/permissions
- Request path and method
- IP address

This provides comprehensive audit trails for security monitoring.
