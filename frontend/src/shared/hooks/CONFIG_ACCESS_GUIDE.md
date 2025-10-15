# Configuration Access Guide

This guide explains how to access tenant and industry configuration data in the application.

## Overview

The application has **two main configuration sources**:

1. **Tenant Config** - Business-specific data from the database (API)
2. **Industry Config** - Industry-specific defaults from `/data/{industry}/` (modular files or site.json)

## Quick Reference

```tsx
// ✅ RECOMMENDED: Use DataContext for most components
import { useData } from '@/shared/hooks';

function MyComponent() {
  const { 
    businessName,    // tenant data
    phone,           // tenant data
    industry,        // tenant data
    siteConfig,      // industry config (merged)
    isLoading 
  } = useData();
  
  return <div>{businessName}</div>;
}
```

```tsx
// For industry config only (advanced use)
import { useIndustryConfig } from '@/shared/hooks';

function IndustrySpecificComponent() {
  const { siteConfig, isLoading } = useIndustryConfig('mobile-detailing');
  return <div>{siteConfig?.hero.h1}</div>;
}
```

---

## Configuration Hooks

### 1. `useData()` - Primary Hook ✅

**Use this for 95% of cases.** Provides both tenant + industry config.

```tsx
import { useData } from '@/shared/hooks';

function MyComponent() {
  const data = useData();
  
  // Tenant data (from API /api/tenants/{slug})
  data.businessName;     // "JP's Mobile Detailing"
  data.phone;            // "(928) 555-1234"
  data.email;            // "info@jpsdetailing.com"
  data.owner;            // "John Smith"
  data.location;         // "Bullhead City, AZ"
  data.industry;         // "mobile-detailing"
  data.serviceAreas;     // [{ city, state, zip, primary }]
  data.socialMedia;      // { facebook, instagram, youtube, tiktok }
  
  // Industry config (from /data/{industry}/ - modular or site.json)
  data.siteConfig?.hero.h1;        // "Professional Mobile Detailing"
  data.siteConfig?.hero.sub;       // "We come to you!"
  data.siteConfig?.seo.title;      // SEO title
  
  // Status
  data.isLoading;        // true during fetch
  data.isTenant;         // true (always for tenant pages)
}
```

**When to use:**
- ✅ Any component that needs business info
- ✅ Components that need both tenant + industry data
- ✅ Page-level components
- ✅ Navigation, footer, header components

---

### 2. `useIndustryConfig()` - Industry Defaults

Load industry-specific site config independently.

```tsx
import { useIndustryConfig } from '@/shared/hooks';

function IndustryPreview() {
  const { siteConfig, isLoading, error } = useIndustryConfig('mobile-detailing');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading config</div>;
  
  return (
    <div>
      <h1>{siteConfig?.hero.h1}</h1>
      <p>{siteConfig?.hero.subTitle}</p>
    </div>
  );
}
```

**When to use:**
- Industry comparison pages
- Admin previews of industry templates
- Components that don't need tenant-specific data
- Non-tenant context (platform pages)

**Returns:**
```tsx
{
  siteConfig: MainSiteConfig | null;
  isLoading: boolean;
  error: Error | null;
  industry: string | null;
}
```

---

### 3. `useTenantConfigLoader()` - Advanced Tenant Config

Lower-level hook with more granular control. Uses the new `TenantConfig` type structure.

```tsx
import { useTenantConfigLoader } from '@/shared/hooks';

function AdminPanel() {
  const { data: config, isLoading } = useTenantConfigLoader({ 
    slug: 'jps-detailing' 
  });
  
  // Structured config
  config?.id;                           // tenant ID
  config?.slug;                         // URL slug
  config?.vertical;                     // industry type
  config?.branding.businessName;        // business name
  config?.branding.logo.url;            // logo URL
  config?.contact.phones.main;          // main phone
  config?.contact.emails.primary;       // primary email
  config?.contact.socials.facebook;     // social links
  config?.contact.baseLocation.city;    // primary city
}
```

**When to use:**
- Admin dashboards needing structured data
- API integrations
- Type-safe access to nested config
- When you need the full `TenantConfig` type

---

## Migration Patterns

### Migrating from Direct API Calls

**Before:**
```tsx
// ❌ Don't do this
const [businessData, setBusinessData] = useState(null);

useEffect(() => {
  fetch(`/api/tenants/${slug}`)
    .then(res => res.json())
    .then(data => setBusinessData(data));
}, [slug]);
```

**After:**
```tsx
// ✅ Use centralized hook
import { useData } from '@/shared/hooks';

const { businessName, phone, isLoading } = useData();
```

---

### Migrating from Direct Imports

**Before:**
```tsx
// ❌ Don't do this - some industries don't have site.json
import siteData from '@/data/mobile-detailing/site.json';

function Hero() {
  return <h1>{siteData.hero.h1}</h1>;
}
```

**After:**
```tsx
// ✅ Use centralized hook - works with both modular and site.json
import { useData } from '@/shared/hooks';

function Hero() {
  const { siteConfig } = useData();
  return <h1>{siteConfig?.hero.h1}</h1>;
}
```

**Note:** Mobile-detailing uses modular config files (assets.json, content-defaults.json, etc.) instead of a monolithic site.json. The hooks handle this automatically.

---

## Best Practices

### ✅ DO

1. **Use `useData()` as default** - Covers 95% of use cases
2. **Check `isLoading`** - Always handle loading states
3. **Use optional chaining** - `siteConfig?.hero.h1` prevents errors
4. **Prefetch on hover** - Use `prefetchIndustryConfig` for performance

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { prefetchIndustryConfig } from '@/shared/hooks';

function IndustryLink({ industry }: { industry: string }) {
  const queryClient = useQueryClient();
  
  return (
    <Link 
      to={`/${industry}`}
      onMouseEnter={() => prefetchIndustryConfig(queryClient, industry)}
    >
      {industry}
    </Link>
  );
}
```

### ❌ DON'T

1. **Don't fetch directly** - Always use the hooks
2. **Don't import JSON directly** - Use hooks for caching
3. **Don't duplicate config logic** - Centralize in hooks
4. **Don't ignore loading states** - Handle gracefully

---

## Caching Strategy

All hooks use React Query for intelligent caching:

| Hook | Stale Time | Cache Time | Purpose |
|------|-----------|------------|---------|
| `useData()` | 10 min | 10 min | Fast access, rare updates |
| `useIndustryConfig()` | 10 min | 30 min | Configs rarely change |
| `useTenantConfigLoader()` | 5 min | 10 min | More frequent updates |

**What this means:**
- Data is cached across component remounts
- Automatic background refetching when stale
- No duplicate requests for same data
- Offline-first with cache fallback

---

## Type Definitions

### TenantConfig (Structured)
```typescript
interface TenantConfig {
  id: string | number;
  slug: string;
  vertical: 'mobile-detailing' | 'pet-grooming' | ...;
  status: 'pending' | 'approved' | 'active' | ...;
  branding: {
    businessName: string;
    logo: { url: string; ... };
  };
  contact: {
    phones: { main: string; ... };
    emails: { primary: string; ... };
    socials: { facebook: string; ... };
    baseLocation: { city: string; state: string };
  };
}
```

### Business (Flat - from DataContext)
```typescript
interface Business {
  id: number;
  slug: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  industry: string;
  service_areas: ServiceArea[];
  facebook_url?: string;
  instagram_url?: string;
  // ... more flat fields
}
```

### MainSiteConfig (Industry)
```typescript
interface MainSiteConfig {
  slug: string;
  hero: {
    h1: string;
    subTitle: string;
    Images: Array<{ url: string; alt: string; ... }>;
  };
  seo: {
    Title: string;
    subTitle: string;
    // ... more SEO fields
  };
  // ... more sections
}
```

---

## Examples

### Example 1: Header Component

```tsx
import { useData } from '@/shared/hooks';

function Header() {
  const { businessName, phone, siteConfig, isLoading } = useData();
  
  if (isLoading) {
    return <HeaderSkeleton />;
  }
  
  return (
    <header>
      <Logo src={siteConfig?.logo.url} alt={businessName} />
      <nav>{/* ... */}</nav>
      <PhoneLink phone={phone} />
    </header>
  );
}
```

### Example 2: Hero Component

```tsx
import { useData } from '@/shared/hooks';

function Hero() {
  const { siteConfig } = useData();
  
  return (
    <section>
      <h1>{siteConfig?.hero.h1}</h1>
      <p>{siteConfig?.hero.subTitle}</p>
      <ImageCarousel images={siteConfig?.hero.Images} />
    </section>
  );
}
```

### Example 3: Contact Form

```tsx
import { useData } from '@/shared/hooks';

function ContactForm() {
  const { businessName, email, phone } = useData();
  
  return (
    <form>
      <p>Contact {businessName}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      {/* form fields */}
    </form>
  );
}
```

---

## Troubleshooting

### "useData must be used within a DataProvider"

**Solution:** Wrap your app with `DataProvider`:

```tsx
// src/main.tsx or App.tsx
import { DataProvider } from '@/shared/hooks';

function App() {
  return (
    <DataProvider>
      <YourApp />
    </DataProvider>
  );
}
```

### "Failed to load industry config"

**Cause:** Industry slug doesn't match folder name in `/data/`

**Solution:** Check that industry value matches folder:
- ✅ `'mobile-detailing'` → `/data/mobile-detailing/` (modular files)
- ✅ `'pet-grooming'` → `/data/pet-grooming/site.json`
- ❌ `'mobileDetailing'` → won't work

### Loading state never resolves

**Cause:** API endpoint or data file not found

**Solution:** Check network tab for 404s, verify:
1. API `/api/tenants/{slug}` returns data
2. Industry config exists:
   - For mobile-detailing: `/data/mobile-detailing/index.ts` + modular files
   - For other industries: `/data/{industry}/site.json`

---

## Summary

| Need | Use This | Example |
|------|----------|---------|
| Tenant + Industry data | `useData()` | `const { businessName, siteConfig } = useData();` |
| Industry config only | `useIndustryConfig()` | `const { siteConfig } = useIndustryConfig('mobile-detailing');` |
| Structured tenant config | `useTenantConfigLoader()` | `const { data: config } = useTenantConfigLoader();` |

**Default choice: `useData()`** — It's cached, simple, and covers most use cases.

