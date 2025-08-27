# JWT Refresh Token System

## Overview
This document describes the complete JWT refresh token implementation for the Mobile Detail Hub backend API, providing secure authentication with short-lived access tokens and longer-lived refresh tokens.

## System Architecture

### Token Types
1. **Access Token**: Short-lived (15 minutes) for API requests
2. **Refresh Token**: Longer-lived (7 days) for obtaining new access tokens

### Security Features
- **Token Rotation**: Refresh tokens are rotated on each use
- **Device Tracking**: Each device gets a unique identifier
- **IP & User Agent Logging**: Security audit trail
- **Token Revocation**: Immediate logout capability
- **Rate Limiting**: Protection against brute force attacks

## Database Schema

### refresh_tokens Table
```sql
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    
    CONSTRAINT fk_refresh_tokens_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT idx_refresh_tokens_user_id 
        UNIQUE (user_id, device_id),
    CONSTRAINT idx_refresh_tokens_token_hash 
        UNIQUE (token_hash)
);
```

### Indexes
- `refresh_tokens_pkey`: Primary key on id
- `idx_refresh_tokens_token_hash`: Unique index on token hash
- `idx_refresh_tokens_user_id`: Unique index on user_id + device_id
- `idx_refresh_tokens_user_id_expires`: Composite index for performance
- `idx_refresh_tokens_revoked_expires`: Index for cleanup operations

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
- **Purpose**: User registration
- **Rate Limit**: 5 requests per 15 minutes
- **Response**: User data + access token + refresh token

#### POST /api/auth/login
- **Purpose**: User authentication
- **Rate Limit**: 5 requests per 15 minutes
- **Response**: User data + access token + refresh token

#### POST /api/auth/refresh
- **Purpose**: Obtain new access token using refresh token
- **Rate Limit**: 5 requests per 15 minutes
- **Request Body**: `{ "refreshToken": "..." }`
- **Response**: New access token + new refresh token

#### POST /api/auth/logout
- **Purpose**: Full logout (revokes all user tokens)
- **Authentication**: Required (Bearer token)
- **Response**: Success message

#### POST /api/auth/logout-device
- **Purpose**: Logout from specific device
- **Authentication**: Required (Bearer token)
- **Request Body**: `{ "deviceId": "..." }`
- **Response**: Success message

#### GET /api/auth/me
- **Purpose**: Get current user information
- **Authentication**: Required (Bearer token)
- **Response**: User profile data

#### GET /api/auth/sessions
- **Purpose**: List active user sessions
- **Authentication**: Required (Bearer token)
- **Response**: Array of active sessions

## Implementation Details

### Token Generation
```javascript
// Generate token pair
const tokens = generateTokenPair({
  userId: user.id,
  email: user.email,
  isAdmin: user.is_admin
});

// Store refresh token
const deviceId = generateDeviceId(req.get('User-Agent'), req.ip);
const tokenHash = crypto.createHash('sha256')
  .update(tokens.refreshToken)
  .digest('hex');

await storeRefreshToken(
  user.id,
  tokenHash,
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  req.ip,
  req.get('User-Agent'),
  deviceId
);
```

### Token Validation
```javascript
// Validate access token
const user = verifyAccessToken(token);
if (isTokenBlacklisted(token)) {
  throw new Error('Token has been revoked');
}

// Validate refresh token
const tokenRecord = await validateRefreshToken(tokenHash);
if (!tokenRecord || tokenRecord.is_revoked) {
  throw new Error('Invalid or expired refresh token');
}
```

### Device Management
```javascript
// Generate unique device ID
const generateDeviceId = (userAgent, ipAddress) => {
  const combined = `${userAgent || 'unknown'}-${ipAddress || 'unknown'}`;
  return crypto.createHash('sha256')
    .update(combined)
    .digest('hex')
    .substring(0, 16);
};
```

## Security Features

### Rate Limiting
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Admin endpoints**: 10 requests per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

### Token Security
- **Access tokens**: 15-minute expiration
- **Refresh tokens**: 7-day expiration with rotation
- **Token hashing**: SHA256 hashing for storage
- **Blacklisting**: Immediate revocation capability

### Audit Trail
- **IP address logging**: Track token creation location
- **User agent logging**: Identify client applications
- **Device tracking**: Multi-device session management
- **Timestamp logging**: Creation and revocation times

## Testing

### Schema Verification
```bash
cd backend
node scripts/verify_refresh_tokens_schema.js
```

### Complete System Test
```bash
cd backend
node scripts/test_jwt_refresh_system.js
```

### Rate Limiting Test
```bash
cd backend
node scripts/test_rate_limiting.js
```

## Environment Variables

### Required
```bash
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

### Optional
```bash
NODE_ENV=development|staging|production
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Maintenance

### Cleanup Function
```sql
-- Manual cleanup
SELECT cleanup_expired_refresh_tokens();

-- Scheduled cleanup (if using pg_cron)
SELECT cron.schedule('cleanup-expired-tokens', '0 2 * * *', 
  'SELECT cleanup_expired_refresh_tokens();');
```

### Token Statistics
```javascript
const stats = await getTokenStats();
console.log('Active tokens:', stats.active_tokens);
console.log('Expired tokens:', stats.expired_tokens);
console.log('Revoked tokens:', stats.revoked_tokens);
```

## Error Handling

### Common Error Responses
```json
// Token expired
{
  "error": "Token expired",
  "code": "TOKEN_EXPIRED",
  "message": "Please refresh your token"
}

// Rate limit exceeded
{
  "error": "Too many authentication attempts from this IP, please try again later.",
  "retryAfter": "15 minutes"
}

// Invalid refresh token
{
  "error": "Invalid or expired refresh token"
}
```

## Best Practices

### Client Implementation
1. **Store refresh tokens securely**: Use secure storage (not localStorage)
2. **Handle token expiration**: Implement automatic refresh logic
3. **Device management**: Allow users to view and revoke sessions
4. **Error handling**: Graceful fallback for authentication failures

### Security Considerations
1. **HTTPS only**: Never transmit tokens over HTTP
2. **Token rotation**: Refresh tokens change on each use
3. **Session monitoring**: Track and log suspicious activity
4. **Regular cleanup**: Remove expired and revoked tokens

## Troubleshooting

### Common Issues
1. **Token not found**: Check if refresh token was revoked
2. **Rate limit exceeded**: Wait for cooldown period
3. **Database connection**: Verify database connectivity
4. **Environment variables**: Check JWT secret configuration

### Debug Mode
```javascript
// Enable detailed logging
logger.level = 'debug';

// Check token details
const decoded = decodeToken(token);
console.log('Token payload:', decoded);
console.log('Expiration:', getTokenExpiration(token));
```

## Migration

### Running the Migration
```bash
cd backend
node scripts/run_refresh_tokens_migration.js
```

### Verification
```bash
cd backend
node scripts/verify_refresh_tokens_schema.js
```

### Rollback (if needed)
```sql
-- Drop the table (WARNING: This will delete all refresh tokens)
DROP TABLE IF EXISTS refresh_tokens CASCADE;

-- Drop the function
DROP FUNCTION IF EXISTS cleanup_expired_refresh_tokens();
```

## Performance

### Database Optimization
- **Indexes**: Optimized for common query patterns
- **Cleanup**: Automated removal of expired tokens
- **Connection pooling**: Efficient database connections

### Caching Considerations
- **Token validation**: Consider Redis for high-traffic scenarios
- **User sessions**: Cache active session data
- **Rate limiting**: Distributed rate limiting for load balancers

## Monitoring

### Key Metrics
- **Active sessions**: Number of valid refresh tokens
- **Token refresh rate**: Frequency of token renewals
- **Logout patterns**: User session management behavior
- **Security events**: Failed authentication attempts

### Logging
```javascript
logger.info('User authenticated:', { userId, deviceId, ipAddress });
logger.warn('Rate limit exceeded:', { ip, endpoint });
logger.error('Token validation failed:', { error: error.message });
```
