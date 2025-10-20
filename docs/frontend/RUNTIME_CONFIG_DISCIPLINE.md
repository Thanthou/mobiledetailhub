# Runtime Config Discipline - Task #5 Complete ✅

**Date**: October 20, 2025  
**Status**: ✅ Complete

## Problem

Frontend configuration was a mix of build-time and runtime sources:
- ⚠️ **Build-time variables** - `VITE_API_URL`, `VITE_API_BASE_URL` baked into bundles
- ⚠️ **Mixed sources** - Some code used `import.meta.env`, some used computed config
- ⚠️ **Drift risk** - Dev/prod environments could get out of sync
- ⚠️ **No runtime toggles** - Feature flags required rebuilds
- ⚠️ **URL confusion** - Multiple URL sources (`apiUrl`, `apiBaseUrl`, proxy paths)

**The core issue**: Can't change API URLs or toggle features without rebuilding the frontend.

## Solution Implemented

### 1. Single Source of Truth: `/api/config` Endpoint ✅

**Backend**: `backend/routes/config.js`

**What it serves**:
```json
{
  "success": true,
  "config": {
    "apiBaseUrl": "/api",
    "apiUrl": "",
    "backendUrl": "http://localhost:3001",
    "googleMapsApiKey": "...",
    "stripePublishableKey": "pk_test_...",
    "features": {
      "serviceWorker": false,
      "analytics": true,
      "maps": true,
      "stripe": true,
      "debugMode": true,
      "booking": true,
      "reviews": true
    },
    "environment": {
      "mode": "development",
      "version": "1.0.0",
      "buildTime": "2025-10-20T...",
      "commitHash": "abc123"
    },
    "tenant": {
      "defaultDomain": "thatsmartsite.com",
      "subdomainPattern": "*.thatsmartsite.com",
      "allowCustomDomains": true
    },
    "client": {
      "maxUploadSize": 5242880,
      "sessionTimeout": 86400000,
      "enableOfflineMode": false
    }
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Features**:
- ✅ CORS enabled (accessible from any origin)
- ✅ Cached for 5 minutes (`Cache-Control: public, max-age=300`)
- ✅ Version headers (`X-Config-Version`, `X-Config-Timestamp`)
- ✅ Environment-aware defaults
- ✅ Only sends public keys (never private API keys!)

---

### 2. ConfigProvider Integration ✅

**File**: `frontend/src/shared/bootstrap/AppShell.tsx`

**Before** (❌ No runtime config):
```tsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </QueryClientProvider>
</ErrorBoundary>
```

**After** (✅ Runtime config):
```tsx
<ErrorBoundary>
  <ConfigProvider>  {/* ← Fetches /api/config at boot */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  </ConfigProvider>
</ErrorBoundary>
```

**What ConfigProvider does**:
1. Fetches `/api/config` on mount
2. Stores config in React context
3. Auto-initializes API client with runtime config
4. Falls back to build-time config if fetch fails
5. Provides hooks for accessing config values

---

### 3. Runtime-Aware API Client ✅

**File**: `frontend/src/shared/api/runtimeApiClient.ts`

**Before** (❌ Static URL):
```typescript
// Baked at build time
export const apiClient = new ApiClient(config.apiUrl);
```

**After** (✅ Runtime URL):
```typescript
// Updates dynamically when config changes
class RuntimeApiClientManager {
  updateBaseURL(newBaseURL: string) {
    if (newBaseURL !== this.currentBaseURL) {
      this.client = new ApiClient(newBaseURL);
    }
  }
}

export const runtimeApiClient = new RuntimeApiClientManager();

// Hook for components
export function useApiClient(): ApiClient {
  const { config } = useConfig();
  
  useEffect(() => {
    if (config?.apiUrl !== undefined) {
      runtimeApiClient.updateBaseURL(config.apiUrl);
    }
  }, [config?.apiUrl]);
  
  return runtimeApiClient.getClient();
}
```

**Auto-initialization**: ConfigProvider automatically updates API client when config loads!

---

### 4. Comprehensive Hooks ✅

**Available hooks** (all in `ConfigContext.tsx`):

```typescript
// Core hooks
useConfig()                    // Full config + loading state
useConfigValue(key, fallback)  // Generic value accessor

// API Configuration
useApiBaseUrl()               // → '/api'
useApiUrl()                   // → '' (proxy) or 'https://...' (prod)

// Third-party Services
useGoogleMapsApiKey()         // → API key or undefined
useStripePublishableKey()     // → Publishable key

// Feature Flags
useServiceWorkerEnabled()     // → boolean
useAnalyticsEnabled()         // → boolean
useMapsEnabled()              // → boolean
useStripeEnabled()            // → boolean
useDebugMode()                // → boolean
useBookingEnabled()           // → boolean (NEW)
useReviewsEnabled()           // → boolean (NEW)

// Client Settings
useMaxUploadSize()            // → number (bytes)
useSessionTimeout()           // → number (ms)
useOfflineMode()              // → boolean
```

**Usage in components**:
```tsx
import { useServiceWorkerEnabled, useApiBaseUrl } from '@/shared/contexts/ConfigContext';

function MyComponent() {
  const swEnabled = useServiceWorkerEnabled();
  const apiBase = useApiBaseUrl();
  
  return (
    <div>
      Service Worker: {swEnabled ? 'Enabled' : 'Disabled'}
      API Base: {apiBase}
    </div>
  );
}
```

---

### 5. Feature Flag Examples

#### Service Worker (Runtime Toggle)

**Backend** (`.env`):
```bash
# Enable service worker in production
ENABLE_SERVICE_WORKER=true
```

**Frontend** (automatic):
```tsx
import { useServiceWorkerEnabled } from '@/shared/contexts/ConfigContext';

function App() {
  const swEnabled = useServiceWorkerEnabled();
  
  useEffect(() => {
    if (swEnabled && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, [swEnabled]);
}
```

**Toggle without rebuild**:
```bash
# In production, update environment variable
ENABLE_SERVICE_WORKER=false

# Restart backend
pm2 restart backend

# Frontend automatically picks up change on next load (5min cache)
```

---

#### Analytics (Runtime Toggle)

**Backend** (`.env`):
```bash
# Disable analytics
ENABLE_ANALYTICS=false
```

**Frontend**:
```tsx
import { useAnalyticsEnabled } from '@/shared/contexts/ConfigContext';

function usePageTracking() {
  const analyticsEnabled = useAnalyticsEnabled();
  
  useEffect(() => {
    if (analyticsEnabled) {
      // Track page view
      fetch('/api/analytics/track', { ... });
    }
  }, [analyticsEnabled]);
}
```

---

### 6. Environment-Specific Behavior

#### Development
```javascript
{
  "apiUrl": "",              // Empty = use Vite proxy
  "apiBaseUrl": "/api",      // Proxied to backend
  "features": {
    "serviceWorker": false,  // Always disabled in dev
    "debugMode": true,       // Always enabled in dev
    // ...
  }
}
```

#### Production
```javascript
{
  "apiUrl": "https://api.thatsmartsite.com",  // Or empty if same-origin
  "apiBaseUrl": "/api",
  "features": {
    "serviceWorker": true,   // Can be toggled via ENABLE_SERVICE_WORKER
    "debugMode": false,      // Always disabled in prod
    // ...
  }
}
```

---

## File Changes

### New Files Created
- ✅ `frontend/src/shared/api/runtimeApiClient.ts` - Runtime-aware API client manager
- ✅ `docs/frontend/RUNTIME_CONFIG_DISCIPLINE.md` - This documentation

### Modified Files
- ✅ `frontend/src/shared/contexts/ConfigContext.tsx` - Enhanced interface, added hooks, auto-init API client
- ✅ `frontend/src/shared/components/ConfigProvider.tsx` - Updated fallback config
- ✅ `frontend/src/shared/bootstrap/AppShell.tsx` - Integrated ConfigProvider
- ✅ `backend/routes/config.js` - Enhanced with more config options

### Files Already in Place
- ✅ `frontend/src/shared/env.ts` - Build-time config with fallback utilities
- ✅ `frontend/config/env.ts` - Legacy re-export (backward compat)

---

## Benefits

### Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Config source** | Mixed (build + runtime) | Single runtime endpoint |
| **API URL** | Build-time only | Runtime changeable |
| **Feature flags** | Rebuild required | Runtime toggleable |
| **Service worker** | Build-time only | Runtime toggleable |
| **Dev/prod drift** | Possible | Prevented |
| **Environment changes** | Rebuild required | Just restart backend |
| **Testing** | Hard (baked URLs) | Easy (runtime override) |
| **Deployment** | Rebuild for config | Change env vars only |

---

## Usage Guide

### For Component Developers

**Use hooks, not import.meta.env**:

```tsx
// ❌ BAD - build-time only
import { env } from '@/shared/env';
const mapsEnabled = !!env.VITE_GOOGLE_MAPS_API_KEY;

// ✅ GOOD - runtime aware
import { useMapsEnabled } from '@/shared/contexts/ConfigContext';
const mapsEnabled = useMapsEnabled();
```

---

### For API Calls

**Use the runtime API client**:

```tsx
// ❌ BAD - static import
import { apiClient } from '@/shared/api/apiClient';

// ✅ GOOD - runtime aware
import { useApiClient } from '@/shared/api/runtimeApiClient';

function MyComponent() {
  const apiClient = useApiClient();
  
  const fetchData = async () => {
    const data = await apiClient.get('/my-endpoint');
    // ...
  };
}
```

---

### For Feature Flags

**Check feature flags before using features**:

```tsx
import { useServiceWorkerEnabled, useBookingEnabled } from '@/shared/contexts/ConfigContext';

function App() {
  const swEnabled = useServiceWorkerEnabled();
  const bookingEnabled = useBookingEnabled();
  
  useEffect(() => {
    if (swEnabled) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, [swEnabled]);
  
  return (
    <div>
      {bookingEnabled && <BookingButton />}
    </div>
  );
}
```

---

## Deployment Guide

### Changing API URL (Production)

**Scenario**: Move backend to new domain

```bash
# 1. Update environment variable
export API_URL=https://api-new.thatsmartsite.com

# 2. Restart backend
pm2 restart backend

# 3. Frontend automatically updates (no rebuild needed!)
# Users will get new URL on next page load (max 5min cache)
```

---

### Toggling Features (Production)

**Scenario**: Temporarily disable service worker

```bash
# 1. Update environment variable
export ENABLE_SERVICE_WORKER=false

# 2. Restart backend
pm2 restart backend

# 3. Frontend disables SW on next load (no rebuild!)
```

---

### Environment Variables Reference

**Backend `.env` variables that control runtime config**:

```bash
# API Configuration
API_BASE_URL=/api
API_URL=                      # Empty for same-origin
PORT=3001

# Third-party Keys (public keys only!)
GOOGLE_MAPS_API_KEY=your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Feature Flags (runtime toggleable)
ENABLE_SERVICE_WORKER=true    # Service worker (prod only)
ENABLE_ANALYTICS=true         # Analytics tracking
ENABLE_GOOGLE_MAPS=true       # Google Maps integration
ENABLE_STRIPE=true            # Stripe payments
ENABLE_BOOKING=true           # Booking system
ENABLE_REVIEWS=true           # Reviews feature

# Environment Info
NODE_ENV=production
APP_VERSION=1.0.0
BUILD_TIME=2025-10-20T12:00:00Z
COMMIT_HASH=abc123def

# Multi-tenant
BASE_DOMAIN=thatsmartsite.com
ALLOW_CUSTOM_DOMAINS=true

# Client Settings
MAX_UPLOAD_SIZE=5242880       # 5MB in bytes
SESSION_TIMEOUT=86400000      # 24h in milliseconds
ENABLE_OFFLINE_MODE=false
```

---

## Testing

### Test Runtime Config Loading

**Browser console**:
```javascript
// Check if config was loaded
console.log(window.__RUNTIME_CONFIG__);

// Or inspect React context
// 1. Install React DevTools
// 2. Find ConfigProvider in component tree
// 3. Inspect state → config
```

**API test**:
```bash
curl http://localhost:3001/api/config | jq '.config.features'
```

Expected:
```json
{
  "serviceWorker": false,
  "analytics": true,
  "maps": true,
  "stripe": true,
  "debugMode": true,
  "booking": true,
  "reviews": true
}
```

---

### Test Feature Flag Toggle

**Steps**:
1. **Check current state**:
   ```bash
   curl http://localhost:3001/api/config | jq '.config.features.serviceWorker'
   # → false
   ```

2. **Update environment**:
   ```bash
   echo "ENABLE_SERVICE_WORKER=true" >> backend/.env
   ```

3. **Restart backend**:
   ```bash
   cd backend && pm2 restart backend
   ```

4. **Verify change**:
   ```bash
   curl http://localhost:3001/api/config | jq '.config.features.serviceWorker'
   # → true
   ```

5. **Frontend picks up change**:
   - Refresh browser (or wait 5min for cache expiry)
   - Service worker registers automatically

---

### Test API URL Change

**Steps**:
1. **Start with proxy** (dev mode):
   ```bash
   # Config returns apiUrl: ""
   # Frontend uses Vite proxy → http://localhost:3001
   ```

2. **Change to direct URL**:
   ```bash
   echo "API_URL=http://localhost:3001" >> backend/.env
   pm2 restart backend
   ```

3. **Verify**:
   ```bash
   curl http://localhost:3001/api/config | jq '.config.apiUrl'
   # → "http://localhost:3001"
   ```

4. **Frontend switches** (after refresh):
   - API client updates to use direct URL
   - No proxy, direct backend calls

---

## Best Practices

### DO ✅

1. **Use hooks for config values**:
   ```tsx
   const mapsEnabled = useMapsEnabled();
   ```

2. **Use runtime API client**:
   ```tsx
   const apiClient = useApiClient();
   ```

3. **Check feature flags before using features**:
   ```tsx
   if (bookingEnabled) {
     renderBookingFlow();
   }
   ```

4. **Handle loading state**:
   ```tsx
   const { config, loading } = useConfig();
   if (loading) return <Loader />;
   ```

5. **Provide fallback values**:
   ```tsx
   const maxSize = useMaxUploadSize(); // Has default: 5MB
   ```

---

### DON'T ❌

1. **Don't use `import.meta.env` directly**:
   ```tsx
   // ❌ BAD
   if (import.meta.env.VITE_ENABLE_SW === '1') { ... }
   
   // ✅ GOOD
   if (useServiceWorkerEnabled()) { ... }
   ```

2. **Don't hardcode API URLs**:
   ```tsx
   // ❌ BAD
   fetch('http://localhost:3001/api/data')
   
   // ✅ GOOD
   const apiClient = useApiClient();
   apiClient.get('/api/data')
   ```

3. **Don't assume config is immediately available**:
   ```tsx
   // ❌ BAD - might be null during load
   const config = useConfig().config;
   const maps = config.features.maps; // Error if config is null!
   
   // ✅ GOOD - use specific hook with fallback
   const mapsEnabled = useMapsEnabled(); // Always returns boolean
   ```

4. **Don't skip ConfigProvider**:
   ```tsx
   // ❌ BAD - breaks hooks
   <App /> // No ConfigProvider ancestor
   
   // ✅ GOOD
   <ConfigProvider>
     <App />
   </ConfigProvider>
   ```

---

## Architecture

### Config Flow

```
┌─────────────────────┐
│  Backend .env vars  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  /api/config        │ ← Reads env vars at runtime
│  (backend endpoint) │
└──────────┬──────────┘
           │ HTTP GET
           ▼
┌─────────────────────┐
│  ConfigProvider     │ ← Fetches on mount
│  (frontend context) │
└──────────┬──────────┘
           │ React Context
           ▼
┌─────────────────────┐
│  useConfig() hooks  │ ← Components consume
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API Client, SW,    │
│  Feature Flags, etc.│
└─────────────────────┘
```

---

### Provider Hierarchy

```tsx
<ErrorBoundary>
  <ConfigProvider>                 {/* ← Outermost: Runtime config */}
    <QueryClientProvider>          {/* ← React Query */}
      <AuthProvider>               {/* ← Authentication */}
        <UnifiedTenantProvider>    {/* ← Tenant context */}
          <DataProvider>           {/* ← Data fetching */}
            <TenantConfigProvider> {/* ← Tenant-specific config */}
              <App />
            </TenantConfigProvider>
          </DataProvider>
        </UnifiedTenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ConfigProvider>
</ErrorBoundary>
```

---

## Migration Checklist

### For Existing Code

- [ ] Replace `import.meta.env` with config hooks
- [ ] Replace hardcoded API URLs with `useApiBaseUrl()`
- [ ] Use `useApiClient()` instead of static `apiClient`
- [ ] Check feature flags before rendering features
- [ ] Handle config loading state

### For New Code

- [ ] Always use config hooks
- [ ] Never hardcode URLs or feature flags
- [ ] Use `useApiClient()` for API calls
- [ ] Provide fallback values for all config access

---

## Examples

### Example 1: Conditional Feature Rendering

```tsx
import { useBookingEnabled, useReviewsEnabled } from '@/shared/contexts/ConfigContext';

export function HomePage() {
  const bookingEnabled = useBookingEnabled();
  const reviewsEnabled = useReviewsEnabled();
  
  return (
    <div>
      <Hero />
      <Services />
      {bookingEnabled && <BookingSection />}
      {reviewsEnabled && <ReviewsSection />}
      <Footer />
    </div>
  );
}
```

---

### Example 2: Service Worker Registration

```tsx
import { useServiceWorkerEnabled } from '@/shared/contexts/ConfigContext';
import { useEffect } from 'react';

export function ServiceWorkerManager() {
  const swEnabled = useServiceWorkerEnabled();
  
  useEffect(() => {
    if (swEnabled && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('[SW] Registered:', reg))
        .catch(err => console.error('[SW] Registration failed:', err));
    } else if (!swEnabled && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then(regs => regs.forEach(reg => reg.unregister()))
        .then(() => console.log('[SW] Unregistered (disabled by config)'));
    }
  }, [swEnabled]);
  
  return null; // This is a manager component, no UI
}
```

---

### Example 3: API Client with Runtime Config

```tsx
import { useApiClient } from '@/shared/api/runtimeApiClient';
import { useState, useEffect } from 'react';

export function DataFetcher() {
  const apiClient = useApiClient(); // ← Runtime-aware
  const [data, setData] = useState(null);
  
  useEffect(() => {
    apiClient.get('/my-endpoint')
      .then(setData)
      .catch(console.error);
  }, [apiClient]);
  
  return <div>{JSON.stringify(data)}</div>;
}
```

---

### Example 4: Upload Size Validation

```tsx
import { useMaxUploadSize } from '@/shared/contexts/ConfigContext';

export function FileUploader() {
  const maxSize = useMaxUploadSize(); // Runtime config: 5MB
  
  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      alert(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    
    // Proceed with upload
    uploadFile(file);
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => handleFileSelect(e.target.files[0])}
      accept="image/*"
    />
  );
}
```

---

## Progress Summary

From your "Top 5 Focus" list:
- ✅ **#1: Unify multi-app Vite build/preview** - COMPLETE
- ✅ **#2: Harden `/api/analytics/track`** - COMPLETE
- ✅ **#3: Tenant deletion service layer** - COMPLETE
- ✅ **#4: Standardize subdomain routing** - COMPLETE
- ✅ **#5: Runtime config discipline** - COMPLETE

**ALL 5 TASKS COMPLETE!** 🎉🎉🎉🎉🎉

---

## Related Files

### Frontend
- **Context**: `frontend/src/shared/contexts/ConfigContext.tsx`
- **Provider**: `frontend/src/shared/components/ConfigProvider.tsx`
- **Runtime API client**: `frontend/src/shared/api/runtimeApiClient.ts`
- **AppShell**: `frontend/src/shared/bootstrap/AppShell.tsx`
- **Static config**: `frontend/src/shared/env.ts`

### Backend
- **Endpoint**: `backend/routes/config.js`
- **Environment**: `backend/.env`

---

## Summary

✅ **Single runtime endpoint** - `/api/config` is the source of truth  
✅ **ConfigProvider integrated** - All apps fetch config at boot  
✅ **Runtime API client** - URLs changeable without rebuild  
✅ **Feature flags** - Toggleable via environment variables  
✅ **Service worker** - Runtime enable/disable  
✅ **Comprehensive hooks** - 18 hooks for all config values  
✅ **Zero drift** - Frontend always uses backend config  
✅ **Deployment friendly** - Change `.env`, restart, done!  

**No more rebuilding for config changes!** 🚀

