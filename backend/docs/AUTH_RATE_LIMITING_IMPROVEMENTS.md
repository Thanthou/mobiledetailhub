# Auth Rate Limiting Improvements

## Overview
Authentication rate limiting has been optimized to balance security with usability, allowing refresh tokens to work properly while maintaining brute-force protection.

## Problem Solved
Previously, auth routes used a strict 5 requests/15min limit that could cause 429 errors during:
- Multiple tab usage
- Refresh token attempts during page load
- App recovery scenarios

This made the login experience feel "broken" even for legitimate users.

## Solution Implemented

### 1. Tiered Rate Limiting Strategy

#### **General Auth Endpoints** (`/api/auth/*`)
- **Limit**: 20 requests per 15 minutes (increased from 5)
- **Features**: `skipSuccessfulRequests: true`
- **Purpose**: Allow normal app usage, multiple tabs, and refresh tokens

#### **Sensitive Auth Endpoints** (login, password reset, registration)
- **Limit**: 3 requests per 5 minutes
- **Purpose**: Maintain brute-force protection for critical operations
- **Routes**: `/api/auth/login`, `/api/auth/register`, password reset

#### **Refresh Token Endpoints** (`/api/auth/refresh`)
- **Limit**: 50 requests per 15 minutes
- **Features**: `skipSuccessfulRequests: true`
- **Purpose**: Allow app recovery and smooth user experience

### 2. Implementation Details

```javascript
// General auth - balanced security vs usability
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5
  skipSuccessfulRequests: true, // Don't count successful requests
  // ... other config
});

// Sensitive auth - strict protection
const sensitiveAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Strict limit for brute-force protection
  // ... other config
});

// Refresh tokens - lenient for app recovery
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // High limit for refresh operations
  skipSuccessfulRequests: true, // Don't count successful refreshes
  // ... other config
});
```

### 3. Route-Specific Application

```javascript
// In auth routes:
router.post('/login', sensitiveAuthLimiter, ...);        // Strict protection
router.post('/register', sensitiveAuthLimiter, ...);     // Strict protection
router.post('/refresh', refreshTokenLimiter, ...);       // Lenient for recovery
router.post('/logout', authLimiter, ...);                // General limit
```

## Benefits

### ✅ **Improved User Experience**
- No more 429 errors during normal app usage
- Refresh tokens work reliably across multiple tabs
- App can recover gracefully from token expiration

### ✅ **Maintained Security**
- Brute-force protection still active for sensitive operations
- Login attempts still limited to prevent attacks
- Registration and password reset protected

### ✅ **Better App Reliability**
- Multiple tabs won't trigger rate limits
- Refresh token bursts during page load are allowed
- App recovery scenarios work smoothly

## Rate Limit Comparison

| Endpoint Type | Old Limit | New Limit | Window | Purpose |
|---------------|-----------|-----------|---------|---------|
| **General Auth** | 5/15min | 20/15min | 15 min | Normal usage + refresh |
| **Sensitive Auth** | N/A | 3/5min | 5 min | Brute-force protection |
| **Refresh Tokens** | 5/15min | 50/15min | 15 min | App recovery |
| **Admin Operations** | 50/15min | 50/15min | 15 min | Dashboard usage |

## Security Considerations

### **Brute-Force Protection Maintained**
- Login attempts: 3 per 5 minutes (very strict)
- Registration: 3 per 5 minutes (prevents spam)
- Password reset: 3 per 5 minutes (prevents abuse)

### **Refresh Token Security**
- Higher limits but still rate-limited
- `skipSuccessfulRequests` prevents abuse
- 50 requests/15min allows legitimate usage

### **General Auth Security**
- 20 requests/15min prevents excessive API calls
- `skipSuccessfulRequests` rewards good behavior
- Still protects against basic abuse

## Usage Scenarios

### **Normal User with Multiple Tabs**
```
Tab 1: Login (1 request)
Tab 2: Refresh token (1 request)
Tab 3: Refresh token (1 request)
Tab 4: Logout (1 request)
Total: 4 requests - ✅ Allowed
```

### **App Recovery Scenario**
```
Page load: 5 refresh attempts
Tab switch: 3 refresh attempts
Navigation: 2 refresh attempts
Total: 10 requests - ✅ Allowed (well under 50 limit)
```

### **Brute-Force Attack**
```
Login attempt 1: ✅ Allowed
Login attempt 2: ✅ Allowed  
Login attempt 3: ✅ Allowed
Login attempt 4: ❌ Blocked (429 error)
```

## Monitoring & Debugging

### **Log Messages**
```
Rate limit exceeded for auth endpoint: /api/auth/login
Rate limit exceeded for sensitive auth: /api/auth/register
Rate limit exceeded for refresh token: /api/auth/refresh
```

### **Rate Limit Headers**
```
RateLimit-Limit: 20
RateLimit-Remaining: 15
RateLimit-Reset: 1640995200
```

## Future Enhancements

- **Dynamic Limits**: Adjust based on user behavior
- **IP Whitelisting**: Allow trusted IPs higher limits
- **User-Based Limits**: Different limits for different user types
- **Metrics Collection**: Track rate limit effectiveness

## Troubleshooting

### **Still Getting 429 Errors?**

1. **Check endpoint type**:
   - Login/register: 3 per 5 minutes
   - Refresh tokens: 50 per 15 minutes
   - General auth: 20 per 15 minutes

2. **Verify request frequency**:
   - Multiple tabs can increase request count
   - Failed requests count against limits
   - Successful requests don't count (with `skipSuccessfulRequests`)

3. **Check server logs**:
   - Rate limit warnings show current limits
   - Request counts and remaining limits logged

### **Production Considerations**

- **Load Balancing**: Rate limits are per-IP, not global
- **CDN**: Ensure rate limiting works behind proxies
- **Monitoring**: Track rate limit hit rates
- **Adjustment**: Fine-tune limits based on usage patterns
