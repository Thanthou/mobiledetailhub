# JWT Security Enhancement: JTI & KID Support

## Overview

Enhanced JWT security implementation with JWT ID (`jti`) and Key ID (`kid`) support for improved token management, blacklist accuracy, and future key rotation capabilities.

## New Features

### 1. JWT ID (JTI) Support
- **Purpose**: Unique identifier for each JWT token
- **Benefits**: 
  - More accurate token blacklisting
  - Efficient token revocation by ID
  - Better audit trails and security monitoring
- **Implementation**: Automatically generated using `crypto.randomUUID()`

### 2. Key ID (KID) Support
- **Purpose**: Identifies which key was used to sign the token
- **Benefits**:
  - Enables future key rotation without breaking existing tokens
  - Supports multiple signing keys for different environments
  - Better security key management
- **Implementation**: Configurable via `JWT_KID` environment variable

### 3. Enhanced Blacklist Management
- **Dual Storage**: Tokens stored by both full token and JTI
- **Efficient Lookups**: Faster blacklist checking using JTI
- **Accurate Revocation**: Can revoke tokens by JTI without needing the full token

## Environment Variables

### Required
```bash
# Existing JWT secret
JWT_SECRET=your_jwt_secret_key_here
```

### New Optional
```bash
# Key ID for token rotation (defaults to 'primary')
JWT_KID=primary
```

## Token Structure

### Before Enhancement
```json
{
  "userId": 123,
  "email": "user@example.com",
  "isAdmin": false,
  "iat": 1640995200,
  "exp": 1640996100,
  "iss": "mdh-backend",
  "aud": "mdh-users"
}
```

### After Enhancement
```json
{
  "userId": 123,
  "email": "user@example.com",
  "isAdmin": false,
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "iat": 1640995200,
  "exp": 1640996100,
  "iss": "mdh-backend",
  "aud": "mdh-users"
}
```

### JWT Header
```json
{
  "alg": "HS256",
  "typ": "JWT",
  "kid": "primary"
}
```

## API Changes

### Token Generation
All token generation functions now automatically include:
- `jti`: Unique JWT ID in payload
- `kid`: Key ID in header
- Enhanced blacklist tracking

### New Functions

#### `blacklistTokenByJTI(jti, expiresIn)`
- Blacklist a token by its JWT ID
- More efficient than full token blacklisting
- Useful for bulk revocation scenarios

#### Enhanced `isTokenBlacklisted(token)`
- Checks both full token and JTI blacklists
- More comprehensive blacklist verification
- Improved performance for JTI-based lookups

## Security Benefits

### 1. Improved Token Revocation
- **Before**: Required full token for blacklisting
- **After**: Can revoke by JTI, enabling bulk operations

### 2. Future Key Rotation
- **Before**: Key rotation would invalidate all tokens
- **After**: Can maintain multiple keys with different KIDs

### 3. Better Audit Trails
- **Before**: Limited token tracking capabilities
- **After**: Unique JTI enables detailed token lifecycle tracking

### 4. Enhanced Blacklist Performance
- **Before**: Only full token lookups
- **After**: Dual lookup system (token + JTI) for better performance

## Implementation Details

### Token Generation Flow
1. Generate unique JTI using `crypto.randomUUID()`
2. Add JTI to token payload
3. Set KID in JWT header from environment variable
4. Sign token with enhanced payload and header

### Blacklist Management
1. Store token in both full token and JTI maps
2. Check blacklist using both methods for accuracy
3. Clean up expired entries from both maps
4. Support JTI-based revocation for efficiency

### Key Rotation Preparation
1. Set `JWT_KID` environment variable
2. Future implementation can support multiple keys
3. Tokens include KID for key identification
4. Gradual key rotation without service interruption

## Migration Notes

### Backward Compatibility
- ✅ Existing tokens continue to work
- ✅ No breaking changes to API endpoints
- ✅ Gradual enhancement without service disruption

### Database Considerations
- No database schema changes required
- JTI stored in token payload (not database)
- Blacklist remains in-memory (consider Redis for production)

## Production Recommendations

### 1. Key Rotation Strategy
```bash
# Primary key
JWT_KID=primary

# Future rotation
JWT_KID=secondary
```

### 2. Blacklist Storage
- Consider Redis for production blacklist storage
- Implement JTI-based blacklist for better performance
- Set appropriate TTL for blacklist entries

### 3. Monitoring
- Log JTI for security auditing
- Monitor token generation patterns
- Track blacklist operations

## Testing

### Verify JTI Generation
```javascript
const { generateAccessToken } = require('./utils/tokenManager');
const token = generateAccessToken({ userId: 123, email: 'test@example.com' });
const decoded = jwt.decode(token);
console.log('JTI:', decoded.jti); // Should be a UUID
```

### Verify KID Header
```javascript
const token = generateAccessToken({ userId: 123, email: 'test@example.com' });
const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
console.log('KID:', header.kid); // Should be 'primary' or custom value
```

### Test Blacklist by JTI
```javascript
const { blacklistTokenByJTI, isTokenBlacklisted } = require('./utils/tokenManager');
const jti = 'test-jti-123';
blacklistTokenByJTI(jti, 900);
// Token with this JTI should be considered blacklisted
```

## Security Considerations

### 1. JTI Uniqueness
- Uses `crypto.randomUUID()` for cryptographically secure randomness
- Collision probability is negligible
- Consider timestamp-based JTI for additional uniqueness

### 2. KID Management
- Store KID securely in environment variables
- Plan for key rotation scenarios
- Document key lifecycle management

### 3. Blacklist Security
- Current in-memory implementation for development
- Consider Redis with proper authentication for production
- Implement proper cleanup to prevent memory leaks

## Future Enhancements

### 1. Key Rotation Support
- Multiple key management system
- Gradual key rotation without service interruption
- Key versioning and rollback capabilities

### 2. Advanced Blacklist Features
- Redis-based blacklist storage
- Distributed blacklist across multiple servers
- Blacklist analytics and reporting

### 3. Token Analytics
- JTI-based token usage tracking
- Security event correlation
- Anomaly detection using JTI patterns

## Conclusion

This enhancement significantly improves JWT security by adding JTI and KID support, enabling more accurate token management, efficient blacklisting, and preparation for future key rotation scenarios. The implementation maintains backward compatibility while providing a foundation for advanced security features.
