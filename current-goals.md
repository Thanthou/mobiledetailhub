Great question. Based on what you’ve got, here’s the highest-leverage order to hit next so you can open the funnel (preview → signup → live) and start learning from real tenants fast.

# What to build next (in order)

1. **Finish tenant onboarding end-to-end (CURRENT PRIORITY)**

* Signup form → Stripe checkout → provisioning job → subdomain + SSL → welcome email → first-login dashboard.
* Include the “content fallback” logic so every new site boots with industry defaults until the tenant edits (never blank pages).
* Acceptance: I can paste a business’s basics, pay, and see a live `[slug].thatsmartsite.com` with default copy, services, hours, and a dashboard login.

2. **SEO foundation (ship before first public tenant)**

* Add `robots.txt`, per-tenant `sitemap.xml` generator, canonical rules, preview `noindex` (both meta and X-Robots-Tag), and centralized JSON-LD helpers (LocalBusiness, Service, FAQ).
* Acceptance: Lighthouse “SEO” ≥ 90 and a test tenant’s pages all emit correct canonical + JSON-LD, and `/robots.txt` + `/sitemap.xml` resolve per tenant.

3. **Multi-tenant routing + config loader hardening**

* Robust subdomain (and custom domain) detection → load `{industry, theme, city/service pages}` from tenant row; fall back to `/data/<industry>.json` when DB empty.
* Acceptance: Switching subdomains fully swaps branding, services, and locations without code changes.

4. **Booking MVP wired to your schema**

* Expose bookable services/tiers, time-slot generation from business hours, create Booking, and send confirmations.
* Acceptance: From a tenant’s public site, I can select a service, pick a slot, and see a new record in `booking.bookings` + an email receipt.

5. **Reviews ingestion + display v1**

* Nightly job to pull recent Google reviews (or import CSV for now), moderation toggle in dashboard, and SEO review schema on public pages.
* Acceptance: Reviews render on homepage + /reviews with structured data and an “Approved” switch in the dashboard.

6. **Tenant dashboard: “just enough CMS”**

* Sections: Business Profile, Services & Tiers, Service Areas, Hours, Theme (logo/colors), Reviews moderation.
* Show which fields are “Default” vs “Customized”, with a one-click “Reset to default.”
* Acceptance: A tenant can replace every bit of default copy without touching code.

7. **Quality gates & ops**

* Enforce feature-boundary lint rule, add unit tests for hooks/utils, seed script for one demo tenant per industry, and a scheduled Lighthouse/health check that writes to your `system.health_monitoring` table.
* Acceptance: CI blocks cross-feature imports; nightly job records core web vitals per tenant; a seeded demo tenant spins up locally with one command.

# A crisp 2–3 week sequence

**Week 1**

* Provisioning worker + Stripe webhooks
* Subdomain/SSL automation
* Preview link flow with `noindex`

**Week 2**

* Content fallback + industry JSON templates
* SEO baseline: robots, sitemap, canonical, JSON-LD helper
* Booking MVP (select service → slot → create booking)

**Week 3**

* Reviews import job + display
* Dashboard “Profile / Services / Hours / Areas / Theme / Reviews”
* CI rules, seeds, and Lighthouse monitor

If you’d like, I can turn this into a tight checklist inside your repo (with file paths to touch) and stub the Stripe webhook + provisioning worker so you can run through a full fake-tenant today.
