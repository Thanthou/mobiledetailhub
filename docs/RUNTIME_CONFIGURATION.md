# Runtime Configuration System

This document describes the runtime configuration system that allows changing frontend configuration without rebuilding the application.

## Overview

The runtime configuration system provides:
- **API URL changes** without rebuilds
- **Feature flag toggles** at runtime
- **Third-party service keys** management
- **Environment-specific settings** from the backend

## Architecture

### Backend (`/api/config`)

The backend provides a configuration endpoint that returns runtime settings:

```javascript
GET /api/config
{
  "success": true,
  "config": {
    "apiBaseUrl": "/api",
    "apiUrl": "https://api.example.com",
    "googleMapsApiKey": "AIza...",
    "stripePublishableKey": "pk_live_...",
    "features": {
      "serviceWorker": true,
      "analytics": true,
      "maps": true,
      "stripe": true,
      "debugMode": false
    },
    "environment": {
      "mode": "production",
      "version": "1.0.0",
      "buildTime": "2025-01-19T10:00:00Z"
    },
    "tenant": {
      "defaultDomain": "thatsmartsite.com",
      "subdomainPattern": "*.thatsmartsite.com"
    }
  },
  "timestamp": "2025-01-19T10:00:00Z"
}
```

### Frontend Context

The frontend uses React Context to provide configuration throughout the app:

```tsx
import { ConfigProvider, useConfig, useApiBaseUrl } from '@/shared/contexts/ConfigContext';

// Wrap your app
<ConfigProvider>
  <App />
</ConfigProvider>

// Use in components
function MyComponent() {
  const apiBaseUrl = useApiBaseUrl();
  const { config, loading, error } = useConfig();
  
  // Use the configuration...
}
```

## Usage Examples

### 1. API Configuration

```tsx
import { useApiBaseUrl, useConfig } from '@/shared/contexts/ConfigContext';

function ApiService() {
  const apiBaseUrl = useApiBaseUrl();
  
  const fetchData = async () => {
    const response = await fetch(`${apiBaseUrl}/users`);
    return response.json();
  };
  
  return { fetchData };
}
```

### 2. Feature Flags

```tsx
import { useServiceWorkerEnabled, useAnalyticsEnabled } from '@/shared/contexts/ConfigContext';

function App() {
  const serviceWorkerEnabled = useServiceWorkerEnabled();
  const analyticsEnabled = useAnalyticsEnabled();
  
  useEffect(() => {
    if (serviceWorkerEnabled) {
      registerServiceWorker();
    }
    
    if (analyticsEnabled) {
      initializeAnalytics();
    }
  }, [serviceWorkerEnabled, analyticsEnabled]);
  
  return <div>App content</div>;
}
```

### 3. Third-party Services

```tsx
import { useGoogleMapsApiKey, useStripePublishableKey } from '@/shared/contexts/ConfigContext';

function PaymentForm() {
  const stripeKey = useStripePublishableKey();
  
  useEffect(() => {
    if (stripeKey) {
      const stripe = Stripe(stripeKey);
      // Initialize Stripe...
    }
  }, [stripeKey]);
  
  return <div>Payment form</div>;
}
```

### 4. Service Worker Registration

```tsx
import { registerServiceWorker } from '@/shared/utils/serviceWorker';
import { useConfig } from '@/shared/contexts/ConfigContext';

function App() {
  const { config } = useConfig();
  
  useEffect(() => {
    registerServiceWorker(config);
  }, [config]);
  
  return <div>App content</div>;
}
```

## Environment Variables

### Backend Environment Variables

```bash
# API Configuration
API_BASE_URL=/api
API_URL=https://api.example.com

# Third-party Services
GOOGLE_MAPS_API_KEY=AIza...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Feature Flags
ENABLE_SERVICE_WORKER=true
ENABLE_ANALYTICS=true
ENABLE_GOOGLE_MAPS=true
ENABLE_STRIPE=true

# App Info
APP_VERSION=1.0.0
BUILD_TIME=2025-01-19T10:00:00Z
```

### Frontend Environment Variables (Fallbacks)

```bash
# These are used as fallbacks when runtime config is unavailable
VITE_API_BASE_URL=/api
VITE_API_URL_LIVE=https://api.example.com
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ENABLE_SW=1
```

## Migration Guide

### From Build-time to Runtime Configuration

1. **Replace direct env usage:**
   ```tsx
   // Before
   const apiUrl = import.meta.env.VITE_API_URL;
   
   // After
   const apiUrl = useApiUrl();
   ```

2. **Update service worker registration:**
   ```tsx
   // Before
   if (import.meta.env.VITE_ENABLE_SW === '1') {
     registerServiceWorker();
   }
   
   // After
   const { config } = useConfig();
   registerServiceWorker(config);
   ```

3. **Wrap your app with ConfigProvider:**
   ```tsx
   // Before
   function App() {
     return <Router><Routes /></Router>;
   }
   
   // After
   function App() {
     return (
       <ConfigProvider>
         <Router><Routes /></Router>
       </ConfigProvider>
     );
   }
   ```

## Benefits

1. **No Rebuilds**: Change API URLs without rebuilding the frontend
2. **Feature Flags**: Toggle features at runtime
3. **Environment Flexibility**: Different configs for different deployments
4. **Fallback Support**: Graceful degradation when config is unavailable
5. **Type Safety**: Full TypeScript support with proper types
6. **Caching**: Config is cached for 5 minutes to reduce API calls

## Best Practices

1. **Use hooks**: Prefer `useApiBaseUrl()` over `useConfig().config.apiBaseUrl`
2. **Handle loading states**: Always handle the loading state when using config
3. **Provide fallbacks**: Always provide fallback values for critical config
4. **Cache appropriately**: The config is cached for 5 minutes, plan accordingly
5. **Test fallbacks**: Ensure your app works when runtime config is unavailable

## Troubleshooting

### Config Not Loading
- Check that the backend `/api/config` endpoint is accessible
- Verify CORS headers are properly set
- Check browser network tab for failed requests

### Fallback Not Working
- Ensure fallback config is provided to ConfigProvider
- Check that build-time env vars are properly set
- Verify the fallback config structure matches the expected format

### Type Errors
- Ensure you're using the correct types from `ConfigContext`
- Check that your runtime config matches the `RuntimeConfig` interface
- Verify imports are correct
