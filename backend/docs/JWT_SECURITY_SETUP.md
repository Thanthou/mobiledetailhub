# JWT Security Setup

## Overview

The JWT security system has been enhanced with shorter token expiration times, refresh tokens, and improved security measures to address the 24-hour token expiration security risk.

## New Features

### 1. Short-Lived Access Tokens
- **Expiration**: 15 minutes (reduced from 24 hours)
- **Security**: Minimizes exposure window if token is compromised
- **Algorithm**: HS256 with issuer and audience claims

### 2. Refresh Tokens
- **Expiration**: 7 days
- **Storage**: Secure database storage with hashing
- **Revocation**: Can be revoked individually or globally
- **Device Tracking**: Supports multi-device authentication

### 3. Enhanced Security
- **Token Blacklisting**: Immediate token revocation on logout
- **Device Management**: Track and manage multiple device sessions
- **IP Tracking**: Monitor token creation locations
- **User Agent Tracking**: Track device/browser information

## Environment Variables

### Required Variables

```bash
# Existing
JWT_SECRET=your_jwt_secret_key_here

# New - Required for refresh tokens
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
```

### Optional Variables

```bash
# Token cleanup interval (default: 1 hour)
TOKEN_CLEANUP_INTERVAL=3600000

# Maximum active sessions per user (default: 10)
MAX_USER_SESSIONS=10

# Session timeout warning (default: 1 hour before expiry)
SESSION_WARNING_TIME=3600000
```

## Database Setup

### 1. Run Migration Script

```bash
# Connect to your PostgreSQL database
psql -U your_user -d your_database

# Run the migration script
\i backend/scripts/add_refresh_tokens_table.sql
```

### 2. Verify Table Creation

```sql
-- Check if table was created
\d refresh_tokens

-- Check indexes
\di refresh_tokens*
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
- **Response**: Now includes both `accessToken` and `refreshToken`
- **Tokens**: Access token (15min), Refresh token (7 days)

#### POST `/api/auth/login`
- **Response**: Now includes both `accessToken` and `refreshToken`
- **Tokens**: Access token (15min), Refresh token (7 days)

#### POST `/api/auth/refresh`
- **Purpose**: Exchange refresh token for new token pair
- **Body**: `{ "refreshToken": "your_refresh_token" }`
- **Response**: New access and refresh tokens

#### POST `/api/auth/logout`
- **Purpose**: Logout and revoke all user tokens
- **Headers**: `Authorization: Bearer <access_token>`
- **Action**: Blacklists access token, revokes all refresh tokens

#### POST `/api/auth/logout-device`
- **Purpose**: Logout from specific device
- **Body**: `{ "deviceId": "device_identifier" }`
- **Action**: Revokes refresh token for specific device

#### GET `/api/auth/sessions`
- **Purpose**: Get user's active sessions
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: List of active device sessions

## Client Implementation

### 1. Store Both Tokens

```javascript
// After login/register
const { accessToken, refreshToken } = response.data;

// Store tokens securely
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### 2. Handle Token Expiration

```javascript
// Interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        
        // Update stored tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Automatic Token Refresh

```javascript
// Set up automatic refresh before expiration
const setupTokenRefresh = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  // Decode token to get expiration
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const expiresAt = payload.exp * 1000;
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;

  // Refresh 5 minutes before expiry
  const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
  
  setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Set up next refresh
      setupTokenRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }, refreshTime);
};
```

## Security Benefits

### 1. Reduced Exposure Window
- **Before**: 24 hours of potential unauthorized access
- **After**: 15 minutes maximum exposure window

### 2. Token Revocation
- **Immediate**: Access tokens blacklisted on logout
- **Selective**: Device-specific logout support
- **Global**: Revoke all user sessions if needed

### 3. Session Management
- **Visibility**: Users can see all active sessions
- **Control**: Logout from specific devices
- **Monitoring**: Track suspicious login locations

### 4. Enhanced Validation
- **Issuer**: Token must come from 'mdh-backend'
- **Audience**: Token must be for 'mdh-users'
- **Algorithm**: Enforced HS256 algorithm
- **Expiration**: Strict time validation

## Monitoring and Maintenance

### 1. Token Cleanup

```sql
-- Manual cleanup of expired tokens
SELECT cleanup_expired_refresh_tokens();

-- Check token statistics
SELECT * FROM get_token_stats();
```

### 2. Suspicious Activity Detection

```sql
-- Check for multiple active sessions from different IPs
SELECT 
  user_id,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(*) as total_sessions
FROM refresh_tokens 
WHERE expires_at > NOW() AND is_revoked = FALSE
GROUP BY user_id 
HAVING COUNT(DISTINCT ip_address) > 3;
```

### 3. Performance Monitoring

```sql
-- Check table size and performance
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'refresh_tokens';
```

## Production Considerations

### 1. Redis Integration
- Replace in-memory blacklist with Redis
- Better performance and persistence
- Cluster support for multiple instances

### 2. Database Optimization
- Regular cleanup of expired tokens
- Monitor table growth
- Consider partitioning for high-volume applications

### 3. Security Monitoring
- Log failed refresh attempts
- Monitor unusual IP patterns
- Alert on suspicious activity

### 4. Rate Limiting
- Limit refresh token requests
- Prevent brute force attacks
- Implement progressive delays

## Testing

### 1. Token Expiration Test

```bash
# Test access token expiration
curl -H "Authorization: Bearer <expired_token>" \
  http://localhost:3001/api/auth/me

# Expected: 401 with TOKEN_EXPIRED code
```

### 2. Refresh Token Test

```bash
# Test token refresh
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your_refresh_token"}'

# Expected: New token pair
```

### 3. Logout Test

```bash
# Test logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer <access_token>"

# Expected: Success message
```

## Migration Notes

### 1. Existing Users
- Will need to re-authenticate after implementation
- Old 24-hour tokens will be invalid
- No automatic migration of existing sessions

### 2. Client Updates
- Frontend must be updated to handle new token format
- Implement automatic refresh logic
- Update token storage and usage

### 3. Database Changes
- New table required for refresh tokens
- No changes to existing user data
- Backward compatible with existing authentication

## Troubleshooting

### Common Issues

1. **JWT_REFRESH_SECRET not set**
   - Error: "JWT_REFRESH_SECRET environment variable not configured"
   - Solution: Add JWT_REFRESH_SECRET to environment

2. **Database connection issues**
   - Error: "Database connection not available"
   - Solution: Check database connectivity and refresh_tokens table

3. **Token validation failures**
   - Error: "Invalid or expired refresh token"
   - Solution: Check token format and expiration

4. **Performance issues**
   - Symptom: Slow token operations
   - Solution: Check database indexes and cleanup expired tokens

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development DEBUG=jwt:* npm start

# Check token details
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/auth/me
```

## Summary

The JWT security improvements provide:

✅ **15-minute access token expiration** (vs 24 hours)  
✅ **7-day refresh token with database storage**  
✅ **Immediate token revocation on logout**  
✅ **Multi-device session management**  
✅ **Enhanced security validation**  
✅ **Comprehensive monitoring capabilities**  

These changes significantly reduce the security risk of compromised tokens while maintaining a smooth user experience through automatic refresh mechanisms.
