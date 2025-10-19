# Bootstrap System

This directory contains the unified bootstrap system for all three React applications (Admin, Main Site, Tenant). This system eliminates duplication and provides consistent behavior across all apps.

## Overview

The bootstrap system consists of:

- **AppShell**: Unified provider wrapper with consistent context management
- **SEOManager**: Centralized SEO and schema management
- **RouterConfig**: Shared router configuration utilities

## Architecture

### Before (Duplicated)
```
AdminApp
├── AdminProviders (QueryClient, AuthProvider, ErrorBoundary)
├── SchemaInjector (duplicate)
└── Routes

MainSiteApp  
├── MainSiteProviders (QueryClient, AuthProvider, DataProvider, TenantConfigProvider, WebsiteContentProvider, ErrorBoundary)
├── HelmetProvider (duplicate)
└── Routes

TenantApp
├── TenantProviders (QueryClient, AuthProvider, DataProvider, TenantConfigProvider, WebsiteContentProvider, ErrorBoundary)
├── SchemaInjector (duplicate)
└── Routes
```

### After (Unified)
```
AppShell (shared)
├── QueryClient (shared instance)
├── ErrorBoundary (shared)
├── AuthProvider (shared)
├── DataProvider (for main/tenant)
├── TenantConfigProvider (for main/tenant)
├── WebsiteContentProvider (for main/tenant)
├── HelmetProvider (when enableSEO=true)
└── SEOManager (centralized schema injection)

RouterConfig (shared)
├── Common routes (/login, catch-all)
├── App-specific route handling
└── Consistent Suspense boundaries
```

## Usage

### AppShell

The `AppShell` component provides the foundation for all apps:

```tsx
import { AppShell } from '@/shared/bootstrap';

// Admin app - minimal providers
<AppShell appType="admin">
  <AdminApp />
</AppShell>

// Main site - full providers + SEO
<AppShell appType="main" enableSEO>
  <MainSiteApp />
</AppShell>

// Tenant app - full providers + SEO
<AppShell appType="tenant" enableSEO>
  <TenantApp />
</AppShell>
```

### App Types

- **`admin`**: Minimal provider stack (QueryClient, AuthProvider, ErrorBoundary)
- **`main`**: Full provider stack for marketing site
- **`tenant`**: Full provider stack for tenant sites

### SEO Management

The `SEOManager` component handles:

- Schema injection for structured data
- Default meta tags
- Performance hints (preconnect, etc.)
- Route change tracking (for analytics)

### Router Configuration

The `RouterConfig` component provides:

- Common routes (`/login`, catch-all)
- Consistent Suspense boundaries
- App-specific route handling

## Benefits

1. **Eliminates Duplication**: Single source of truth for providers and configuration
2. **Consistent Behavior**: All apps share the same context management
3. **Easier Maintenance**: Changes to providers affect all apps consistently
4. **Better Performance**: Shared QueryClient instance and optimized provider stack
5. **Centralized SEO**: Single place for schema injection and meta management
6. **Type Safety**: Strong typing for app types and configuration options

## Migration

The migration involved:

1. Creating the unified `AppShell` component
2. Moving schema injection to `SEOManager`
3. Refactoring provider files to use `AppShell`
4. Updating main.tsx files to remove duplicate schema injection
5. Adding SEO management to apps that need it

## Future Enhancements

- Add React Query DevTools integration
- Implement analytics tracking in SEOManager
- Add performance monitoring
- Create app-specific theme providers
- Add internationalization support
