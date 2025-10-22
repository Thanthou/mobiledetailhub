# Feature Maturity System

## Overview

This system allows developers to work on features that aren't yet ready for production while keeping them in the main codebase without cluttering audits.

---

## 🎯 Feature Maturity Levels

### ✅ **Stable** (`src/components/`)
- **Status:** Production-ready, fully integrated
- **Routing:** Wired into app routes
- **Tests:** Required
- **Audits:** Must pass all checks
- **Examples:** `header/`, `footer/`, `hero/`

### 🚧 **Work-in-Progress** (`src/features-wip/`)
- **Status:** Code complete but not integrated
- **Routing:** Not wired into routes yet
- **Tests:** Recommended but not required
- **Audits:** Excluded from reachability checks
- **Timeline:** Should be integrated within 1-2 months
- **Examples:** Advanced booking features, new dashboard tabs

### 🧪 **Experimental** (`src/features-experimental/`)
- **Status:** Proof-of-concept, may be discarded
- **Routing:** No routes
- **Tests:** Optional
- **Audits:** Fully excluded
- **Timeline:** Evaluate quarterly - integrate, move to WIP, or delete
- **Examples:** AI features, new technology spikes

---

## 📁 Directory Structure

```
frontend/apps/tenant-app/src/
├── components/              # ✅ Stable, production features
│   ├── booking/            # Integrated and routed
│   ├── header/
│   └── ...
│
├── features-wip/           # 🚧 Ready but not integrated
│   ├── README.md           # Explains each WIP feature
│   ├── advanced-booking/
│   │   ├── README.md       # Status, owner, integration plan
│   │   ├── components/
│   │   └── hooks/
│   └── customer-portal/
│
└── features-experimental/  # 🧪 Exploratory work
    ├── README.md
    ├── ai-chat/
    └── voice-booking/
```

---

## 🔧 Usage Guide

### Adding a New WIP Feature

1. **Create feature directory:**
   ```bash
   mkdir -p frontend/apps/tenant-app/src/features-wip/my-feature
   ```

2. **Add feature README:**
   ```markdown
   # My Feature
   
   **Status:** 🚧 Work-in-Progress
   **Owner:** @username
   **Created:** 2025-10-21
   **Target Integration:** 2025-11-15
   
   ## Description
   Brief description of what this feature does.
   
   ## Why Not Integrated Yet?
   - [ ] Waiting for backend API endpoints
   - [ ] Design review in progress
   - [ ] Performance optimization needed
   
   ## Integration Plan
   1. Complete API integration
   2. Add routes to TenantApp.tsx
   3. Add tests
   4. Move to src/components/
   ```

3. **Build your feature:**
   ```typescript
   // features-wip/my-feature/MyFeature.tsx
   // Code as if it were production-ready
   ```

4. **Use TypeScript path aliases** (no import churn later):
   ```typescript
   // Import as if it were in final location
   import { MyFeature } from '@tenant-app/features-wip/my-feature';
   ```

---

### Promoting WIP → Stable

When feature is ready for integration:

1. **Move directory:**
   ```bash
   git mv src/features-wip/my-feature src/components/my-feature
   ```

2. **Update imports** (if not using aliases):
   ```bash
   # Find and replace
   @tenant-app/features-wip/my-feature → @tenant-app/components/my-feature
   ```

3. **Add routes:**
   ```typescript
   // TenantApp.tsx
   <Route path="/my-feature" element={<MyFeature />} />
   ```

4. **Update README:**
   - Remove from features-wip/README.md
   - Add to main feature list

---

### Experimental → WIP or Delete

Quarterly review of experimental features:

- **Promote to WIP:** Show promise, worth completing
- **Keep as experimental:** Need more research
- **Delete:** Not viable or no longer needed

---

## 🔍 Audit Configuration

### Current Audit Exclusions

The flow audit excludes these paths from "unreachable" warnings:

```javascript
// scripts/audits/audit-flows-frontend.js

function shouldExcludeFromUnreachable(file) {
  // WIP features - expected to be unreachable
  if (file.includes('/features-wip/')) {
    return true;
  }
  
  // Experimental features - definitely unreachable
  if (file.includes('/features-experimental/')) {
    return true;
  }
  
  // Existing exclusions...
  if (file.endsWith('/index.ts')) return true;
  if (file.endsWith('.types.ts')) return true;
  
  return false;
}
```

---

## 📊 Feature Registry

Maintain a registry of WIP/Experimental features:

### Work-in-Progress Features

| Feature | Owner | Created | Target | Reason |
|---------|-------|---------|--------|--------|
| Advanced Booking | @dev1 | 2025-10-15 | 2025-11-30 | Waiting for Stripe setup |
| Customer Portal | @dev2 | 2025-09-20 | 2025-10-31 | Backend API pending |

### Experimental Features

| Feature | Owner | Created | Status | Next Review |
|---------|-------|---------|--------|-------------|
| AI Chat | @dev3 | 2025-08-01 | PoC complete | 2025-11-01 |
| Voice Booking | @dev4 | 2025-10-10 | Early research | 2026-01-01 |

---

## 🎨 Alternative: Feature Flags

For features that ARE integrated but should be toggled:

```typescript
// config/features.ts
export const features = {
  booking: import.meta.env.VITE_FEATURE_BOOKING !== 'false',
  advancedAnalytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
  betaPortal: false, // Hard-coded off
};

// Usage
import { features } from '@shared/config/features';

if (features.booking) {
  return <BookingApp />;
}
```

**When to use:**
- Feature is complete but needs gradual rollout
- A/B testing
- Per-tenant feature toggling
- Emergency kill switch

---

## 🚫 What NOT to Do

### ❌ Don't: Leave code in wrong place forever
```
components/booking/  ← Has 50% unused code
  // Some parts routed, some not
  // No clear boundary
  // Confusing for everyone
```

### ❌ Don't: Use long-lived feature branches
```
feature/booking (347 commits behind main)
  // Merge conflicts nightmare
  // Out of sync with architecture changes
```

### ❌ Don't: Comment out large blocks
```typescript
// TODO: Uncomment when ready
// function AdvancedBooking() {
//   ... 500 lines of commented code ...
// }
```

### ✅ Do: Use the maturity system
```
features-wip/booking/  ← Clear, organized, excluded from audits
  README.md           ← Status and plan documented
  components/         ← Production-quality code
  tests/              ← Ready to go
```

---

## 🔄 Migration Path for Existing Code

For features currently flagged as "unreachable":

1. **Audit each feature:**
   - Is it truly dead code? → Delete
   - Is it WIP? → Move to `features-wip/`
   - Is it experimental? → Move to `features-experimental/`
   - Is it used but audit missed it? → Fix imports/routing

2. **For Booking (example):**
   ```bash
   # If booking is WIP (not fully routed):
   git mv src/components/booking src/features-wip/booking
   
   # Add README
   echo "# Booking System\n\n**Status:** 🚧 WIP\n..." > src/features-wip/booking/README.md
   ```

3. **Update documentation:**
   - List all WIP features in main README
   - Add target integration dates
   - Assign owners

---

## 📚 Benefits

1. **Clear Communication:** Everyone knows feature status
2. **Audit Clarity:** No false "unreachable" warnings
3. **Easy Cleanup:** Quarterly reviews keep things tidy
4. **Low Friction:** Features stay in main branch
5. **No Import Churn:** Using aliases means minimal changes when promoting

---

## 🤔 Decision Tree

```
New Feature Idea
│
├─ Ready in < 2 weeks? ──→ Feature branch
│
├─ Proof-of-concept? ──→ features-experimental/
│
├─ Code done, waiting for integration? ──→ features-wip/
│
└─ Integrated but need toggle? ──→ Feature flag
```

---

## 📝 Checklist for WIP Features

- [ ] Feature in `features-wip/` directory
- [ ] README.md with status, owner, timeline
- [ ] Code is production-quality (just not wired up)
- [ ] TypeScript compiles with no errors
- [ ] Imports use path aliases
- [ ] Listed in features-wip/README.md
- [ ] Owner assigned
- [ ] Target integration date set
- [ ] Quarterly review scheduled

---

## 🎯 Success Metrics

- **WIP Features:** < 5 at any time
- **Age:** < 2 months average
- **Experimental:** < 10 at any time
- **Promotion Rate:** > 50% experimental → WIP → stable
- **Deletion Rate:** > 30% experimental deleted within 6 months

---

## Questions?

See: [Feature Development Workflow](./FEATURE_WORKFLOW.md)  
Or ask: #engineering channel

