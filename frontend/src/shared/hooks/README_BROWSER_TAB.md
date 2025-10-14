# Browser Tab Management - Standard Practice

## 🚨 IMPORTANT: Every Page Component Must Use This

**All page-level components MUST use either `useBrowserTab()` or `useSEO()` to ensure proper browser tab title and favicon.**

## Why This Matters

Without these hooks, pages will show:
- ❌ Generic "Vite + React" title
- ❌ Default Vite favicon
- ❌ Unprofessional appearance
- ❌ Poor SEO

With these hooks, pages will show:
- ✅ Business name or custom title
- ✅ Tenant-specific logo/favicon
- ✅ Professional branding
- ✅ Better SEO

---

## Standard Solutions

### Option 1: `useBrowserTab()` (Simple - Title + Favicon Only)

Use for pages that don't need meta tags (dashboards, internal tools, etc.)

```tsx
import { useBrowserTab } from '@/shared/hooks';

const MyPage: React.FC = () => {
  // Default: Uses business name + tenant logo
  useBrowserTab();
  
  // Or custom title
  useBrowserTab({ 
    title: 'Dashboard - Business Name' 
  });
  
  // Or platform page (no tenant)
  useBrowserTab({ 
    title: 'Admin Dashboard',
    useBusinessName: false 
  });
  
  return <div>...</div>;
};
```

### Option 2: `useSEO()` (Complete - Title + Favicon + Meta Tags)

Use for public-facing pages that need SEO (home, services, locations, etc.)

```tsx
import { useSEO } from '@/shared/hooks';

const MyPage: React.FC = () => {
  // Default: Uses site config + tenant data for everything
  useSEO();
  
  // Or with custom values
  useSEO({
    title: 'Services - Business Name',
    description: 'Custom meta description',
    keywords: ['keyword1', 'keyword2']
  });
  
  return <div>...</div>;
};
```

---

## How It Works

### Automatic Fallback Chain

Both hooks use this priority:

1. **Custom values** (if provided)
2. **Tenant data** (business name, logo from DataContext)
3. **Industry defaults** (vertical-specific assets)
4. **Platform defaults** ("That Smart Site" + platform logo)

### Smart Updates

- Updates automatically when tenant data loads
- Prevents flashing of incorrect values
- Works in preview mode
- Works for multi-tenant pages

---

## Examples by Page Type

### ✅ Tenant Home Page
```tsx
// Uses tenant business name + logo automatically
useSEO(); 
```

### ✅ Tenant Dashboard
```tsx
useBrowserTab({
  title: `${businessName} - Dashboard`
});
```

### ✅ Platform Pages (Onboarding, Admin)
```tsx
useBrowserTab({
  title: 'Tenant Onboarding - That Smart Site',
  useBusinessName: false
});
```

### ✅ Preview Generator
```tsx
useBrowserTab({
  title: 'Preview Generator - That Smart Site',
  useBusinessName: false
});
```

### ✅ Service Pages
```tsx
useSEO({
  title: `${serviceName} - ${businessName}`,
  description: 'Custom description for this service'
});
```

---

## Checklist for New Pages

When creating a new page component:

- [ ] Import `useBrowserTab` or `useSEO` from `@/shared/hooks`
- [ ] Call the hook at the top of your component
- [ ] Choose appropriate options:
  - Use `useBusinessName: false` for platform pages
  - Provide custom `title` for specific pages
  - Use `useSEO()` for public pages needing meta tags
- [ ] Test in browser - check tab title and favicon
- [ ] Test with different tenants to ensure branding updates

---

## Common Mistakes to Avoid

### ❌ DON'T: Manually set document.title
```tsx
// BAD - bypasses our fallback system
useEffect(() => {
  document.title = 'My Page';
}, []);
```

### ✅ DO: Use the hook
```tsx
// GOOD - handles all edge cases
useBrowserTab({ title: 'My Page' });
```

### ❌ DON'T: Skip the hook entirely
```tsx
// BAD - will show "Vite + React"
const MyPage = () => {
  return <div>...</div>;
};
```

### ✅ DO: Always use it
```tsx
// GOOD - professional branding
const MyPage = () => {
  useBrowserTab();
  return <div>...</div>;
};
```

---

## Current Implementation Status

### ✅ Implemented
- ✅ `HomePage` - uses `useSEO()`
- ✅ `LocationPage` - uses `useSEO()`
- ✅ `PreviewPage` - uses `useBrowserTab()`
- ✅ `TenantApplicationPage` - uses `useBrowserTab()`
- ✅ `PreviewGeneratorPage` - uses `useBrowserTab()`
- ✅ `TenantDashboard` - uses `useBrowserTab()`
- ✅ `AdminDashboard` - uses `useBrowserTab()`

### Need to Check
- Review all page components in `/features/**/pages/`
- Review all page components in `/app/pages/`
- Add to any new pages being created

---

## Questions?

See the hook implementations:
- `frontend/src/shared/hooks/useBrowserTab.ts`
- `frontend/src/shared/hooks/useSEO.ts`

Or ask in the dev chat!

