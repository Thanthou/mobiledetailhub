# Cross-Subdomain Authentication

**Last Updated:** 2025-10-25  
**Status:** ✅ Working (with localhost limitations)

## Overview

Authentication cookies are configured to work across all subdomains of the platform, allowing Single Sign-On (SSO) behavior across:
- `admin.thatsmartsite.com` (Admin dashboard)
- `*.thatsmartsite.com` (Tenant sites)

## How It Works

### Cookie Configuration

**Development:**
```javascript
{
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  // No domain attribute in dev (localhost limitation)
}
```

**Production:**
```javascript
{
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  domain: '.thatsmartsite.com' // Allows cross-subdomain access
}
```

### Auth Flow

1. User logs in on any subdomain
2. Backend sets `access_token` and `refresh_token` cookies
3. Cookies are included in all requests to backend (via `credentials: 'include'`)
4. Backend validates tokens from cookies or Authorization header

## Development Limitations

### Localhost Cookie Restrictions

**Problem:**  
Browsers do NOT share cookies across localhost subdomains, even with `domain: '.localhost'`. This is a browser security restriction.

**Impact:**
- ❌ Login on `admin.localhost:5177` won't work on `demo.tenant.localhost:5177`
- ✅ Each subdomain requires separate login in development

**Workaround:**
Log in separately on each subdomain you're testing:
1. Admin panel: `admin.localhost:5177/login`
2. Tenant dashboard: `demo.tenant.localhost:5177/login`
3. Use same credentials (admin@thatsmartsite.com)

### Better Dev Setup (Optional)

To enable cross-subdomain auth in development, use `.local` domains:

**1. Update hosts file:**

**Windows:** `C:\Windows\System32\drivers\etc\hosts`  
**Mac/Linux:** `/etc/hosts`

```
127.0.0.1 admin.thatsmartsite.local
127.0.0.1 demo.tenant.thatsmartsite.local
127.0.0.1 jps.tenant.thatsmartsite.local
```

**2. Update backend config:**

```javascript
// backend/config/auth.js
domain: env.NODE_ENV === 'production' 
  ? '.thatsmartsite.com' 
  : '.thatsmartsite.local'
```

**3. Update frontend dev servers:**

Access via:
- `http://admin.thatsmartsite.local:5176`
- `http://demo.tenant.thatsmartsite.local:5177`

Now cookies will work across all `.thatsmartsite.local` subdomains! ✅

## Production Behavior

In production, cross-subdomain authentication works seamlessly:

✅ Log in once on any subdomain  
✅ Access any other subdomain without re-login  
✅ Cookies shared across all `*.thatsmartsite.com` domains  

**Example Flow:**
1. Admin logs in at `admin.thatsmartsite.com`
2. Clicks "View Dashboard" link for tenant `jps`
3. Browser sends cookies automatically to `jps.thatsmartsite.com`
4. Backend validates cookies → User is authenticated ✅
5. No login page shown

## Security Considerations

### Why HttpOnly Cookies?

- **Prevent XSS:** JavaScript cannot access cookies
- **Automatic inclusion:** Browser sends cookies automatically
- **CSRF protection:** `sameSite: 'lax'` prevents cross-site requests

### Why sameSite: 'lax'?

- Allows cookies on top-level navigation (clicking links)
- Blocks cookies on embedded requests (iframes, AJAX from other sites)
- Good balance between security and usability

### Domain Scope

**Development:** No domain attribute (localhost restriction)  
**Production:** `.thatsmartsite.com` (leading dot shares with all subdomains)

## Troubleshooting

### "Still getting login page after signing in"

**Check:**
1. ✅ Are you on the same subdomain where you logged in?
2. ✅ Is the backend running and cookies being set?
3. ✅ Check browser DevTools → Application → Cookies
4. ✅ Verify `/api/auth/me` returns user data

**Common Causes:**
- Different subdomain in development (expected - log in again)
- Backend not running or crashed
- Cookies blocked by browser settings
- Ad blocker or privacy extension

### "Cookies not showing in DevTools"

**Check:**
1. Backend is setting cookies (check response headers)
2. CORS is properly configured (`credentials: true`)
3. Frontend is sending `credentials: 'include'`
4. Cookie path is `/` (not a specific path)

### "Works in development, not in production"

**Check:**
1. `domain` is set to `.thatsmartsite.com`
2. `secure: true` in production (HTTPS only)
3. DNS is configured correctly for subdomains
4. SSL certificates cover wildcard (`*.thatsmartsite.com`)

## Implementation Files

**Backend:**
- `backend/config/auth.js` - Cookie configuration
- `backend/controllers/authController.js` - Sets cookies on login
- `backend/middleware/auth.js` - Reads cookies from requests
- `backend/bootstrap/setupSecurity.js` - CORS configuration

**Frontend:**
- `frontend/src/shared/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/shared/ui/layout/ProtectedRoute.tsx` - Route protection
- All fetch calls use `credentials: 'include'`

## Future Enhancements

Potential improvements:
- [ ] Token refresh on subdomain switch (detect stale token)
- [ ] Remember last subdomain in localStorage
- [ ] Better dev experience with `.local` domains by default
- [ ] Session management UI (view all logged-in devices)
- [ ] Single logout across all subdomains

## Related Documentation

- [Authentication Flow](./AUTH_PROTECTION.md)
- [Tenant Dashboard Routing](./TENANT_DASHBOARD_ROUTING.md)
- [Cookie Security Best Practices](../../docs/backend/COOKIE_SECURITY.md)

