# Rate Limiting Implementation

## Overview
This document describes the rate limiting implementation for the Mobile Detail Hub backend API, specifically for authentication and admin routes.

## Implementation Details

### 1. Rate Limiting Middleware (`backend/middleware/rateLimiter.js`)

The rate limiting is implemented using the `express-rate-limit` package with three different configurations:

#### Auth Rate Limiter
- **Limit**: 5 requests per 15 minutes per IP
- **Applied to**: `/api/auth/*` endpoints
- **Purpose**: Prevent brute force attacks on authentication endpoints
- **Endpoints affected**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/promote-admin`

#### Admin Rate Limiter
- **Limit**: 10 requests per 15 minutes per IP
- **Applied to**: `/api/admin/*` endpoints
- **Purpose**: Prevent abuse of admin operations
- **Endpoints affected**:
  - `DELETE /api/admin/affiliates/:id`
  - `GET /api/admin/users`
  - `GET /api/admin/pending-applications`
  - `POST /api/admin/approve-application/:id`
  - `POST /api/admin/reject-application/:id`

#### General API Rate Limiter
- **Limit**: 100 requests per 15 minutes per IP
- **Applied to**: All `/api/*` routes globally
- **Purpose**: General protection against API abuse

### 2. Configuration Options

All rate limiters include:
- **Standard Headers**: `RateLimit-*` headers in responses
- **Custom Error Messages**: Clear feedback when limits are exceeded
- **Logging**: Rate limit violations are logged with IP and endpoint details
- **IP Detection**: Uses `req.ip` for accurate IP identification

### 3. Response Headers

When rate limits are exceeded, responses include:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Remaining requests in current window
- `RateLimit-Reset`: Time when the limit resets (Unix timestamp)

### 4. Error Responses

Rate limit exceeded responses (HTTP 429):
```json
{
  "error": "Too many authentication attempts from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

## Security Benefits

1. **Brute Force Protection**: Limits authentication attempts
2. **Admin Operation Protection**: Prevents rapid admin actions
3. **DDoS Mitigation**: Reduces impact of automated attacks
4. **Resource Protection**: Prevents API abuse and resource exhaustion

## Testing

Use the provided test script to verify rate limiting functionality:

```bash
cd backend
node scripts/test_rate_limiting.js
```

The script tests:
- Auth endpoint rate limiting (5 requests limit)
- Admin endpoint rate limiting (10 requests limit)
- General API rate limiting (100 requests limit)

## Monitoring

Rate limit violations are logged with:
- IP address
- User agent
- Endpoint accessed
- Timestamp
- User ID (for admin endpoints)

## Configuration

Rate limits can be adjusted by modifying the values in `backend/middleware/rateLimiter.js`:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Adjust this value as needed
  // ... other options
});
```

## Dependencies

- `express-rate-limit`: Production-ready rate limiting package
- `winston`: Logging for rate limit violations

## Notes

- The old in-memory rate limiting in `validation.js` has been deprecated
- All rate limits are per IP address
- Rate limit windows are 15 minutes for all configurations
- Headers are included in all responses for transparency
