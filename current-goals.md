# 🚀 That Smart Site — Core Development Roadmap

## 🧩️ 1. Onboarding & Provisioning (**current priority**)
❌ Signup form → Stripe checkout → provisioning job → subdomain + SSL → welcome email → first-login dashboard  
❌ Add fallback “default content” logic — every new site boots with industry defaults (no empty pages)  
❌ Implement Stripe webhook for tenant activation  
❌ Include post-provision confirmation screen + “View my site” button  
❌ Validate full run: business info → pay → live `[slug].thatsmartsite.com` → dashboard login  

**Acceptance:** I can paste a business’s info, pay, and get a live site + dashboard.

---

## 🌐 2. SEO Foundation
❌ Implement per-tenant `robots.txt`  
❌ Auto-generate `sitemap.xml` per tenant  
❌ Add canonical + noindex for previews  
❌ Create centralized JSON-LD helpers (LocalBusiness, Service, FAQ)  
❌ SEO audit: Lighthouse SEO ≥ 90  

**Acceptance:** Tenant pages emit valid canonical + JSON-LD, `/robots.txt` + `/sitemap.xml` resolve.

---

## 🎗️ 3. Multi-Tenant Routing & Config Loader
✅ Detect subdomain/custom domain (basic router scaffold exists)  
❌ Load `{industry, theme, city/service pages}` from DB  
❌ Fallback to `/data/<industry>.json` when DB empty  
❌ Swap entire branding/config when switching subdomains  
❌ Verify preview vs live domain logic  

**Acceptance:** Switching subdomains fully swaps branding, services, and locations without code changes.

---

## 🗕️ 4. Booking System (Tier 2/3 Feature)
❌ Define schema: Services → Time Slots → Bookings (tables exist but flow unimplemented)  
❌ Generate time slots from business hours  
❌ Create booking from public site  
❌ Send confirmation emails (tenant + client)  
❌ Record booking in `booking.bookings`  

**Acceptance:** From public site, a client can select service → time → book → record saved.

---

## ⭐ 5. Reviews Ingestion & Display v1
✅ Database schema ready (`reputation.reviews`)  
❌ Mock nightly job or API pull  
❌ Dashboard moderation toggle (“Approved”)  
❌ Display reviews on homepage + /reviews  
❌ Include structured Review schema markup  

**Acceptance:** Reviews render on site with SEO data and can be toggled visible via dashboard.

---

## 🧯 6. Tenant Dashboard — Minimal CMS
✅ Skeleton dashboard in progress  
❌ “Business Profile” section (editable fields)  
❌ “Services & Tiers” management  
❌ “Service Areas & Hours” modules  
❌ “Theme” customization (logo/colors)  
❌ “Reviews Moderation” tab  
❌ Mark default vs customized fields; include “Reset to Default”  

**Acceptance:** Tenant can replace default text/images through dashboard.

---

## ⚙️ 7. Quality Gates & Ops
✅ Feature-boundary lint rule (`check-import-boundaries.ts`)  
✅ Strict TypeScript config  
❌ Add unit test coverage for hooks/utils  
❌ Create seed script: one demo tenant per industry  
❌ Scheduled Lighthouse/health check → write to `system.health_monitoring`  
❌ Ensure CI blocks rule violations  

**Acceptance:** Local build can spin demo tenant; CI + nightly checks pass cleanly.

---

## 🎯 8. Launch Readiness Checklist
❌ Verify default emails (welcome, booking, review invite)  
❌ Add SEO meta defaults (title, description, OG)  
❌ Add Lighthouse + SSL verification script  
❌ Final test with demo tenant → real subdomain → Stripe live mode  

**Acceptance:** Demo tenant behaves like a real tenant with fully working SEO, booking, and dashboard.

------------------------------------------------------------------------------------------

# 💰 Pricing Tiers (from `service_tiers` & `subscriptions`)

### 🟩 **Starter — $15/month**

**Get online fast and look professional.**
Perfect for new or solo operators who just need a clean, trusted web presence without the tech hassle.

✅ Instant: Professional website instantly launched with your own subdomain
✅ Effortless: Automatic setup — no configuration or hosting required
✅ Findable: Built-in SEO so customers find you on Google
✅ Credible: Automatic Google review syncing to showcase your reputation
✅ Insightful: Personal dashboard with business metrics and performance overview
✅ Analytical: Google Analytics for traffic tracking
✅ High-Performing: Real-time Website Health check for speed, mobile readiness, and best practices
💡 *You focus on your business — we make sure your site stays healthy and discoverable.*

---

### 🟨 **Metro — $25/month**

**Turn your website into a sales assistant.**
Ideal for growing businesses ready to attract more leads and respond faster.

✅ Everything in Starter
✅ Custom domain & SSL for a polished, branded web address
✅ Expanded service areas to reach more local customers
✅ Analytics dashboard with customer activity insights
✅ **Instant Quote Text Alerts** — get a text the second someone requests a quote, so you can follow up immediately
💡 *Never miss another lead — respond faster, book more jobs, and build your reputation.*

---

### 🟦 **Pro — $35/month**

**Automate your marketing and customer follow-ups.**
Built for established businesses that want to grow, scale, and impress.

✅ Everything in Metro
✅ Online booking and quote requests directly from your website
✅ Client dashboard for appointments, payments, and service history
✅ Multi-location SEO pages to dominate nearby cities
✅ **Smart Completion Texts** — automatically thank clients, send a receipt image, and prompt for a Google review
✅ Advanced business analytics with AI insights to improve conversions
💡 *Let your website handle follow-ups, reviews, and marketing while you focus on service quality.*

---

### ⚙️ **Add-ons (Optional)**

• + $3 per extra location page — expand to nearby areas
• + $10 Booking Module — add scheduling to Starter or Metro
• + $10 AI Business Insights — personalized recommendations to grow revenue
• + $5 Smart Text Automations — unlock quote + completion texts in lower tiers
💡 *Customize your plan to match your business goals and stage of growth.*


------------------------------------------------------------------------------------------

💡 Roadmap Notes

AI Integration:

Tier 1 → Data collection

Tier 2 → Light feedback

Tier 3 → Autonomous business coaching
Each uses the same analytics + Lighthouse pipelines, just surfaced differently.

Google Analytics:

Enabled for all tiers (even Starter), with dashboard visibility unlocked from Metro upward.

Website Health / Lighthouse:

All tiers get automated scans; higher tiers get frequency + AI explanations.

Social & Google Auto-Posting:

Build on Reviews API first (Google, Facebook), then expand to posting automation.


---

# 🧱 Next Backlog Candidates
❌ Generate `get_public_configs()` endpoint from `system` schema  
❌ Finish tier gating via `has_plan_access(business_id, plan)`  
❌ Add industry seed data for Lawn Care / Maid / Grooming  
❌ Implement health-monitor dashboard view using `system.tenant_health_summary`  
❌ Add “AI Business Manager” insights (Phase 3)

