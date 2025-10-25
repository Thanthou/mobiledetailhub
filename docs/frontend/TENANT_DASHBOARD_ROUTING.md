# Tenant Dashboard Routing

**Last Updated:** 2025-10-25  
**Status:** ✅ Implemented

## Overview

The tenant dashboard is accessible via both `/admin` and `/dashboard` routes for flexibility and user convenience. Both routes are protected and require authentication with `admin` or `tenant` role.

## Route Structure

### Root-Level Routes

```
/admin           → Tenant Dashboard (protected)
/dashboard       → Tenant Dashboard (protected, legacy support)
```

### Business Slug Routes

```
:businessSlug/admin      → Tenant Dashboard (protected)
:businessSlug/dashboard  → Tenant Dashboard (protected, legacy support)
```

## Authentication

All dashboard routes use `ProtectedRoute` wrapper with:
- **Required Roles:** `['admin', 'tenant']`
- **Fallback Path:** `/` (redirects to homepage if unauthorized)

## Architecture Decisions

### 1. Dual Route Support (/admin + /dashboard)

**Rationale:**
- `/admin` is the primary, clean URL for tenant administration
- `/dashboard` maintains backwards compatibility for existing bookmarks
- Both routes point directly to `<DashboardPage />` (no redirect overhead)
- Zero performance cost, maximum flexibility

### 2. Dashboard Location

**Location:** `frontend/apps/tenant-app/src/components/tenantDashboard/`

**Why tenant-app?**
- Dashboard is part of the tenant product (subdomain.thatsmartsite.com)
- Follows 3-app architecture boundaries (main = marketing, tenant-app = product, admin-app = platform management)
- Prevents cross-app import violations

**Previously:** Incorrectly duplicated in `main` app ❌ (now deleted ✅)

### 3. Admin App vs Tenant Dashboard

**Tenant Dashboard** (`/admin` in tenant-app):
- Tenant-specific management
- Manage own website content, services, locations
- Business profile and settings
- Accessed by tenant users

**Admin Dashboard** (admin.thatsmartsite.com):
- Platform-wide management
- Approve/reject tenant applications
- System monitoring and health
- Billing and payments
- Accessed by platform administrators

## User Experience

### Tenant Access Flow

1. Tenant visits their site: `subdomain.thatsmartsite.com`
2. Site is clean, customer-facing (no visible "Login" clutter)
3. Tenant navigates to `/admin` or `/dashboard`
4. If not authenticated, redirected to `/login`
5. After login, accesses dashboard

### URL Examples

```
# Direct access
https://jps.thatsmartsite.com/admin
https://jps.thatsmartsite.com/dashboard

# Business slug access (same dashboard)
https://thatsmartsite.com/jps/admin
https://thatsmartsite.com/jps/dashboard
```

## Implementation Details

### Route Definition

```typescript
{/* Tenant Dashboard - protected route (accessible via /admin or /dashboard) */}
<Route path="/admin" element={
  <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
    <DashboardPage />
  </ProtectedRoute>
} />
<Route path="/dashboard" element={
  <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
    <DashboardPage />
  </ProtectedRoute>
} />

{/* Business-specific dashboard (accessible via /admin or /dashboard) */}
<Route path=":businessSlug/admin" element={
  <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
    <DashboardPage />
  </ProtectedRoute>
} />
<Route path=":businessSlug/dashboard" element={
  <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Dashboard Features

The tenant dashboard includes the following tabs (configurable per tenant):

- **Overview** - Metrics, recent activity, notifications (always enabled)
- **Website** - Hero, FAQ, gallery, reviews management
- **Locations** - Service areas and Google Maps integration
- **Profile** - Business information, contact details, social media
- **Schedule** - Appointments and availability (feature flag)
- **Customers** - Customer management (feature flag)
- **Services** - Service catalog and pricing (feature flag)

## Migration Notes

**Date:** 2025-10-25

**Changes:**
1. ✅ Deleted duplicate `frontend/apps/main/src/components/tenantDashboard/`
2. ✅ Added `/admin` routes alongside `/dashboard` in tenant-app
3. ✅ No unique features lost (dashboards were 100% identical)
4. ✅ No breaking changes (all existing `/dashboard` routes still work)

**Files Changed:**
- `frontend/apps/tenant-app/src/TenantApp.tsx` (added /admin routes)
- Deleted: `frontend/apps/main/src/components/tenantDashboard/` (entire folder, 136 files)

## Testing Checklist

- [x] Verify `/admin` accessible with auth ✅
- [x] Verify `/dashboard` still works (backwards compatibility) ✅
- [x] Verify `/:businessSlug/admin` works ✅
- [x] Verify `/:businessSlug/dashboard` works ✅
- [ ] Verify unauthenticated users redirected to `/login`
- [ ] Verify only `admin` and `tenant` roles can access
- [x] Verify no broken imports after deletion from main app ✅

## Known Issues Fixed

### Issue: /admin route redirects back to homepage
**Date:** 2025-10-25  
**Symptom:** Navigating to `/admin` would immediately redirect to the customer-facing homepage  
**Root Cause:** `AuthContext.tsx` only checked for `/dashboard` in pathname, not `/admin`, causing auth check to be skipped  
**Fix:** Updated line 48 in `AuthContext.tsx` to check for both `/dashboard` and `/admin` routes:
```typescript
const isDashboardRoute = window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/admin');
```

## Related Documentation

- [3-App Architecture](../../.cursorrules) - Architecture boundaries
- [Auth Protection](./AUTH_PROTECTION.md) - ProtectedRoute usage
- [Dashboard Tab Configuration](../../frontend/apps/tenant-app/src/components/tenantDashboard/config/README.md)

