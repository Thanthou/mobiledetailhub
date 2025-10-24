# Environment Fail-Fast Guard Documentation

**Status:** ✅ **COMPLETE** (as of 2025-10-24)  
**Priority:** Critical Security Feature  
**Location:** `backend/config/env.async.js`

---

## Overview

The fail-fast environment guard ensures that the backend **refuses to start in production** if critical security credentials are missing. This prevents silent failures and potential security vulnerabilities from misconfigured deployments.

---

## Implementation

### Location
`backend/config/env.async.js` (lines 78-98)

### What It Guards

The system checks for these critical secrets in **production only**:

1. **JWT_SECRET** - Access token signing key
2. **JWT_REFRESH_SECRET** - Refresh token signing key
3. **DB_HOST** - Database host
4. **DB_NAME** - Database name
5. **DB_USER** - Database username
6. **DB_PASSWORD** - Database password

### Behavior

| Environment | Missing Secrets | Behavior |
|------------|----------------|----------|
| **Production** | Any critical secret | ❌ **Throws error** - Server refuses to start |
| **Production** | All secrets present | ✅ Continues startup with confirmation log |
| **Development** | Any secrets | ⚠️  Warns but continues (never crashes dev) |

---

## Code Reference

```78:98:backend/config/env.async.js
// SECURITY: In production, critical secrets MUST be present
if (env.NODE_ENV === 'production') {
  const missingSecrets = [];
  
  if (!env.JWT_SECRET) {
    missingSecrets.push('JWT_SECRET');
  }
  if (!env.JWT_REFRESH_SECRET) {
    missingSecrets.push('JWT_REFRESH_SECRET');
  }
  if (!env.DB_HOST || !env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD) {
    missingSecrets.push('DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
  }
  
  if (missingSecrets.length > 0) {
    const errorMsg = `❌ CRITICAL: Missing required secrets in production: ${missingSecrets.join(', ')}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  console.log('✅ Production environment validated: All critical secrets present');
}
```

---

## Verification

Run the verification script to confirm the guard is active:

```bash
node backend/tests/verify-env-guard.js
```

**Expected output:**
```
✅ All security checks are properly configured!
✅ Environment fail-fast guard: ACTIVE
✅ JWT TTL optimization: COMPLETE

The system will refuse to start in production if:
  • JWT_SECRET is missing
  • JWT_REFRESH_SECRET is missing
  • Any database credentials are missing
```

---

## Testing

### Manual Production Simulation

To test the production guard locally (⚠️ **for testing only**):

```bash
# This will fail immediately with error message
NODE_ENV=production JWT_SECRET= node backend/server.js
```

Expected result: Server crashes with clear error message about missing JWT_SECRET.

### Automated Tests

Located in: `backend/tests/envFailFast.test.js`

Run with:
```bash
cd backend
npm test -- envFailFast.test.js
```

---

## Related Security Features

| Feature | Status | Location |
|---------|--------|----------|
| JWT TTL Optimization | ✅ Complete | `backend/config/auth.js` |
| Access Token Lifetime | ✅ 15 minutes | `AUTH_CONFIG.ACCESS_EXPIRES_IN` |
| Refresh Token Lifetime | ✅ 30 days | `AUTH_CONFIG.REFRESH_EXPIRES_IN` |
| Token Blacklisting | ✅ Complete | `backend/services/authService.js` |
| CSRF Protection | ✅ Complete | `backend/middleware/csrfProtection.js` |

---

## Deployment Checklist

Before deploying to production, ensure:

- [ ] `JWT_SECRET` is set to a secure random string (≥32 characters)
- [ ] `JWT_REFRESH_SECRET` is set to a different secure random string
- [ ] All database credentials are configured correctly
- [ ] `NODE_ENV=production` is set
- [ ] Secrets are stored securely (environment variables, secret manager)
- [ ] Secrets are **never** committed to git

---

## Security Best Practices

### Generating Secure Secrets

```bash
# Generate JWT_SECRET (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT_REFRESH_SECRET (different from above)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Secret Rotation Schedule

| Secret | Rotation Frequency | Priority |
|--------|-------------------|----------|
| JWT_SECRET | Monthly | High |
| JWT_REFRESH_SECRET | Monthly | High |
| DB_PASSWORD | Quarterly | Medium |

---

## Troubleshooting

### Server Won't Start in Production

**Error:** `❌ CRITICAL: Missing required secrets in production: JWT_SECRET`

**Solution:** 
1. Check your `.env` file or hosting platform environment variables
2. Ensure secrets are not accidentally commented out
3. Verify deployment pipeline includes secret injection

### False Positives in Development

If you see warnings in development, this is expected behavior. The guard only **blocks startup** in production.

---

## Maintenance Notes

- ✅ Tested: 2025-10-24
- ✅ Production-ready
- 🔄 Next review: Monthly (check for new critical env vars)

---

## References

- [Zod Schema Definition](../../backend/config/env.async.js)
- [Auth Configuration](../../backend/config/auth.js)
- [Bootstrap System](../../backend/bootstrap/)
