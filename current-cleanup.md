Here’s a **high-impact, sequential code-review plan** tailored to your current codebase, priorities from `.cursorrules`, and what Cursor detected across the frontend + backend + database layers.
This isn’t nit-picking — it’s focused on *architecture, maintainability, and multi-tenant scalability.*

---

## 🧱 1. Architecture & Folder Hygiene

### Problem 1 – Feature Bleed-Through

Some hooks and utils still reference cross-feature logic (e.g., booking logic calling services helpers).
**Solution:**
Create or extend `/shared/` sub-domains:

```
shared/
  ├─ analytics/
  ├─ seo/
  ├─ tenancy/
  ├─ ui/
```

Move any code used by multiple features here and update imports to `@/shared/...` to respect your Cursor rules on boundaries.

---

### Problem 2 – Mixed Responsibilities in “features”

A few feature folders (esp. onboarding & reviews) still mix UI + data logic.
**Solution:**
Split long components:

```
PaymentSection.tsx → components/PaymentSection.tsx
                     hooks/usePaymentFlow.ts
```

Keep presentational pieces pure, and side-effects inside hooks as mandated in `.cursorrules`.

---

### Problem 3 – Missing Barrel Consistency

Some features have `index.ts` exports, others don’t.
**Solution:**
Every feature root (`features/<domain>/`) should have:

```ts
export * from './components'
export * from './hooks'
export * from './api'
```

→ Simplifies imports & improves Cursor auto-completion.

---

## ⚙️ 2. Backend Service Layer

### Problem 4 – Thin but Scattered Controllers

Your Express routes contain both business logic and response formatting.
**Solution:**
Adopt:

```
/controllers/
/services/
/routes/
```

Pattern:

* routes → validation + controller call
* controllers → parameter parsing + service orchestration
* services → pure logic (DB, email, Stripe, etc.)

This matches your rule: “no business logic in presentational components / keep side-effects isolated”, applied to backend too.

---

### Problem 5 – No Central Error Handling

Try/catch duplicated in routes.
**Solution:**
Add global Express error middleware:

```ts
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});
```

Simplifies flow and keeps logs consistent.

---

### Problem 6 – Email/Stripe Logic Tightly Coupled

The onboarding route performs DB + Stripe + SendGrid in-line.
**Solution:**
Split into services:

```ts
services/paymentsService.ts
services/emailService.ts
services/tenantProvisionService.ts
```

and call sequentially inside the controller; improves testability and isolates failures.

---

## 🧩 3. Database & Tenancy Model Refactors

### Problem 7 – Tenant Duplication Logic

Multiple modules manually filter by tenant_id.
**Solution:**
Create a `withTenant(context, query)` helper or SQL view enforcing `WHERE tenant_id=$1`.
Wrap queries with this helper to stay DRY.

---

### Problem 8 – Schema Consistency

`website.content` table mixes JSON/text blobs; risk of untyped inserts.
**Solution:**
Add JSON schema validation via Zod in backend before inserts, mirroring your frontend zod forms.
Keeps data contracts strict and matches `.cursorrules` rule “Zod-validate external data at the boundary”.

---

### Problem 9 – Migrations Naming & Audit

Migrations don’t always follow `YYYYMMDD_description.sql`.
**Solution:**
Rename or enforce via script. Adds auditability for Render deploys.

---

## 🧠 4. Frontend Consistency & Performance

### Problem 10 – API Calls in Components

Some legacy pages still call `fetch` directly.
**Solution:**
Move them into `features/<domain>/api/...` clients. Cursor rules explicitly forbid fetch in components.

---

### Problem 11 – Zustand Stores Doing Async Work

At least one store initializes async data (shouldn’t).
**Solution:**
Move async logic to hooks (e.g., `useTenantData`) and update store only via setter.

---

### Problem 12 – Image Optimization Pipeline

Images loaded without consistent `srcset` or `toWebp` utilities.
**Solution:**
Use your shared `imageUtils` everywhere; ensure lazy-loading + width/height attributes per SEO convention.

---

### Problem 13 – React Query Key Naming

Query keys inconsistent (`['tenants',slug]` vs `['tenant',slug]`).
**Solution:**
Prefix all with feature domain: `['tenant','detail',slug]`.
Avoid collisions when features grow.

---

## 🔐 5. Auth & Security Improvements

### Problem 14 – JWT Secrets Hardcoded or Scattered

Tokens handled in multiple files.
**Solution:**
Centralize to `/backend/utils/jwt.ts` and import secret from env.
Add `verifyTenantToken()` to wrap both onboarding & preview logic.

---

### Problem 15 – Password Policy / Reset UX

Auth schema supports reset tokens but no cron to purge expired ones.
**Solution:**
Add nightly job (Render cron or node-cron) to delete expired tokens.

---

## 🧩 6. Developer Experience (DevEx)

### Problem 16 – No Unified Logger

Console scattered (`console.log`, `console.error`).
**Solution:**
Add pino or winston wrapper:

```ts
import logger from '@/shared/utils/logger'
logger.info('Tenant created', { id })
```

Enables structured logs in Render.

---

### Problem 17 – Testing Coverage Gaps

No test directories for new shared modules (SEO, onboarding).
**Solution:**
Create minimal `__tests__/seo/` verifying `generateSitemap`, `robotsHandler`, and `jsonld` output.

---

### Problem 18 – Env Management

Different env vars across frontend/backend with inconsistent names.
**Solution:**
Add `/shared/env.ts` with shape-validated env (zod) imported both sides.

---

## 📦 7. SEO & Analytics (Polish)

### Problem 19 – Sitemap Runtime Query

Still using DB fetch per request; could be cached.
**Solution:**
Cache generated sitemap XML for 24 h per tenant in memory or Redis.
Reduces DB hits & boosts TTFB.

---

### Problem 20 – Analytics Hooks Missing for Bookings & Form Submit

GA4 detection only global.
**Solution:**
Add hook in `/shared/hooks/useAnalytics.ts`:

```ts
logEvent('booking_completed', { tenant, value })
```

Aligns with SEO report recommendation for GA4 events.

---

## ✅ Summary of Impact

| Priority | Category                                       | ROI  |
| -------- | ---------------------------------------------- | ---- |
| 1        | Proxy/feature isolation + DRY backend services | ⭐⭐⭐⭐ |
| 2        | Database tenant helpers & schema validation    | ⭐⭐⭐⭐ |
| 3        | Unified logging + error middleware             | ⭐⭐⭐  |
| 4        | Image/SEO polish + analytics                   | ⭐⭐   |
| 5        | Minor DX/test/env improvements                 | ⭐    |

---

Would you like me to produce a **follow-up “refactor roadmap” markdown** (Week 1–4 schedule) that you can drop directly into `current-goals.md` so Cursor tracks these improvements automatically?
