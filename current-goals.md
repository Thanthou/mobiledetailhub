🚀 That Smart Site — Core Development Roadmap
🧩 1. Onboarding & Provisioning (current priority)

❌ Signup form → Stripe checkout → provisioning job → subdomain + SSL → welcome email → first-login dashboard

❌ Add fallback "default content" logic — every new site boots with industry defaults (no empty pages)

❌ Implement Stripe webhook for tenant activation

❌ Include post-provision confirmation screen and "view my site" button

❌ Validate first full run: business basics → pay → live [slug].thatsmartsite.com with defaults + dashboard login

Acceptance: I can paste a business's info, pay, and get a live site with working dashboard.

🌐 2. SEO Foundation

❌ Implement robots.txt per tenant

❌ Auto-generate sitemap.xml per tenant

❌ Add canonical + noindex for previews (meta + header)

❌ Create centralized JSON-LD helpers (LocalBusiness, Service, FAQ)

❌ SEO audit: Lighthouse SEO ≥ 90

Acceptance: All tenant pages emit valid canonical + JSON-LD, and /robots.txt + /sitemap.xml resolve correctly.

🏗️ 3. Multi-Tenant Routing & Config Loader

❌ Detect subdomain or custom domain → load {industry, theme, city/service pages} from DB

❌ Fallback to /data/<industry>.json when DB empty

❌ Swap entire tenant branding/config when switching subdomains

❌ Verify preview vs live domain logic

Acceptance: Switching subdomains fully swaps branding, services, and locations without code changes.

📅 4. Booking MVP

❌ Define schema: Services → Time Slots → Bookings

❌ Generate time slots from business hours

❌ Create booking from public site

❌ Send confirmation emails (tenant + client)

❌ Record booking in booking.bookings

Acceptance: From a tenant's public site, I can select a service, pick a slot, book, and see the record in DB.

⭐ 5. Reviews Ingestion & Display v1

❌ Nightly job to pull recent Google reviews (mock via CSV for now)

❌ Add moderation toggle in dashboard ("Approved")

❌ Display reviews on homepage and /reviews page

❌ Include structured review schema markup for SEO

Acceptance: Reviews render on site with SEO data and can be toggled visible via dashboard.

🧭 6. Tenant Dashboard — Minimal CMS

❌ Add "Business Profile" section

❌ Add "Services & Tiers" management

❌ Add "Service Areas" and "Hours" modules

❌ Add "Theme" (logo/colors) customization

❌ Add "Reviews Moderation" tab

❌ Mark default vs customized fields; include "Reset to Default"

Acceptance: A tenant can replace every default text/image through dashboard.

⚙️ 7. Quality Gates & Ops

❌ Add feature-boundary lint rule (no cross-feature imports)

❌ Add unit test coverage for hooks/utils

❌ Create seed script: one demo tenant per industry

❌ Scheduled Lighthouse/health check → writes to system.health_monitoring

❌ Ensure CI blocks rule violations

Acceptance: Local build can spin a seeded demo tenant; CI + nightly health checks pass cleanly.

🎯 8. Launch Readiness Checklist

❌ Verify default emails (welcome, booking, review invite)

❌ Add SEO meta defaults (title, description, OG)

❌ Add Lighthouse + SSL verification script

❌ Final test with demo tenant → real subdomain → Stripe live mode

Acceptance: Demo tenant behaves like a real tenant with fully working SEO, booking, and dashboard.