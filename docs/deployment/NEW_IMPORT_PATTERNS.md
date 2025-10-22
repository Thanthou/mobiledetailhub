# New Import Patterns (2-App Architecture)

**Quick Reference Guide**

---

## ✅ Correct Import Patterns

### From Main App

```typescript
// ✅ Import from own app
import { Hero } from '@/main/components/hero';
import { Gallery } from '@main/components/gallery';
import { BookingPage } from '@/main/pages/BookingPage';

// ✅ Import from shared
import { Button, Modal } from '@shared/ui';
import { useAuth } from '@shared/hooks';
import { formatCurrency } from '@shared/utils';

// ✅ Import data
import siteConfig from '@data/mobile-detailing/site.json';
```

### From Admin App

```typescript
// ✅ Import from own app
import { Dashboard } from '@/admin-app/components/dashboard';
import { TenantTable } from '@admin-app/components/tables';

// ✅ Import from shared
import { Button, DataTable } from '@shared/ui';
import { useAuth } from '@shared/hooks';
import { formatDate } from '@shared/utils';
```

### From Shared

```typescript
// ✅ Import from shared only
import { OtherSharedUtil } from '@shared/utils';
import { Button } from '@shared/ui';

// ❌ NEVER import from apps
// import { Hero } from '@/main/components/hero';  // WRONG!
// import { Dashboard } from '@/admin-app/components';  // WRONG!
```

---

## ❌ Common Mistakes

```typescript
// ❌ Don't import between apps
import { Hero } from '@/admin-app/components/hero';  // admin → main (FORBIDDEN)
import { Dashboard } from '@/main/components/dashboard';  // main → admin (FORBIDDEN)

// ❌ Don't use old app names
import { Hero } from '@/main-site/components/hero';  // main-site deleted!
import { Gallery } from '@/tenant-app/components/gallery';  // tenant-app deleted!

// ❌ Shared can't import from apps
// In a file under src/shared/
import { Hero } from '@/main/components/hero';  // WRONG!
```

---

## 🔄 Migration Quick Fixes

### Old → New

```typescript
// OLD (3-app structure)
import { Hero } from '@/main-site/components/hero';
import { Gallery } from '@/tenant-app/components/gallery';
import { Dashboard } from '@/admin-app/components/dashboard';

// NEW (2-app structure)
import { Hero } from '@/main/components/hero';
import { Gallery } from '@/main/components/gallery';
import { Dashboard } from '@/admin-app/components/dashboard';
```

---

## 🎯 Path Aliases Reference

| Alias | Resolves To | Usage |
|-------|-------------|-------|
| `@/main` | `apps/main/src/` | Main app components |
| `@main` | `apps/main/src/` | Alternate syntax |
| `@/admin-app` | `apps/admin-app/src/` | Admin app components |
| `@admin-app` | `apps/admin-app/src/` | Alternate syntax |
| `@shared` | `src/shared/` | Shared components/utils |
| `@data` | `src/data/` | Static data files |

---

## 🧭 Import Decision Tree

```
Where is the file you're importing?
│
├─ In apps/main/ → Use @/main or @main
├─ In apps/admin-app/ → Use @/admin-app or @admin-app
├─ In src/shared/ → Use @shared
└─ In src/data/ → Use @data
```

---

## 📋 Checklist for Code Review

When reviewing imports, verify:

- [ ] No cross-app imports (main ↔ admin-app)
- [ ] Shared layer doesn't import from apps
- [ ] No references to old app names (main-site, tenant-app)
- [ ] All imports use proper aliases
- [ ] Relative imports only within same directory tree

---

**Reference:** See `.cursorrules` for complete architectural rules.

