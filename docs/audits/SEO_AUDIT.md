# Multi-App SEO Audit Report
Generated: 2025-10-20T01:04:21.783Z

---

## 🧭 Overview
**Total SEO Score:** 80/100 (🟡 Good)

| Metric | Score | Status |
|---------|-------|--------|
| Lighthouse (Average) | NaN | ⚠️ Needs Work |
| Schema Quality | 10 | ⚠️ Limited |
| HTML Meta Tags | ✅ Complete | Titles & descriptions found |
| Static SEO / Analytics | ✅ Present | Helmet, GA, OG, Sitemap, Robots |
| Endpoints | ✅ Active | robots.txt & sitemap.xml verified |

### 📱 Lighthouse Scores by App

| App | Score | Description |
|-----|-------|-------------|
| **main-site** | N/A/100 | Marketing & Onboarding |
| **tenant-app** | N/A/100 | Live Tenant Storefronts |

---

## 🔍 Lighthouse SEO — Per-App Results

### main-site — Marketing & Onboarding
**Score:** N/A/100 ⚠️ Needs Work

**Key Findings:**
- Report not available

---

### tenant-app — Live Tenant Storefronts
**Score:** N/A/100 ⚠️ Needs Work

**Key Findings:**
- Report not available


**General Recommendations:**
- Verify Lighthouse "SEO" audits in Chrome DevTools → Lighthouse → SEO tab for each app.  
- Ensure canonical URLs and mobile meta tags (`<meta name="viewport">`) are consistent across all apps.

---

## 🧩 Structured Data (Schema)
**Score:** 10/100  
⚠️ Schema markup found, but coverage is limited or incomplete.


**Validation Results:**
- Total Schemas: 0
- Valid Schemas: 0 (0%)
- Invalid Schemas: 0
- Errors: 0
- Warnings: 0
- Schema Types: None


**Findings:**
- Source files with @type: 35
- Schema types covered: 0

**Recommendations:**
- Add or expand structured data with [schema.org](https://schema.org/) types:  
  - `LocalBusiness`, `Service`, and `Organization`  
  - Include `aggregateRating`, `review`, and `openingHours` where applicable  
- Run detailed schema validation: `node scripts/audits/schema-validator.js`
- Validate using [Google's Rich Results Test](https://search.google.com/test/rich-results)

---

## 🧱 HTML Meta Tags
**Status:** ✅ All pages have meta titles & descriptions.

**Recommendations:**
- Ensure every page has a unique, descriptive `<title>` (60 chars max)  
- Add `<meta name="description">` with ~155 chars of clear summary  
- Include:
  - `<link rel="canonical" href="https://example.com/">`
  - `<meta property="og:image">` and `<meta property="twitter:card">` for social previews

---

## 📊 Static SEO & Analytics Integration
| Feature | Status | Notes |
|----------|--------|-------|
| Helmet / Meta Management | ✅ Helmet components detected | React Helmet ensures dynamic titles |
| Analytics | ✅ Google Analytics / GTM found | Confirms GA4 or GTM tracking |
| OpenGraph / JSON-LD | ✅ OpenGraph / JSON-LD present | Social and structured markup present |
| Sitemap | ✅ Sitemap generation found | Sitemap generator detected |
| Robots.txt | ✅ robots.txt found | Public-facing file verified |

**Recommendations:**
- Confirm analytics ID matches your main property (GA4 / GTM).  
- Ensure robots.txt allows essential pages (no accidental blocking).  
- Verify all key URLs appear in `sitemap.xml`.

---

## 🔗 Backend SEO Endpoints
| Endpoint | Status | Description |
|-----------|--------|-------------|
| robots.txt | ✅ Found | Controls search engine crawling |
| sitemap.xml | ✅ Found | Lists indexable pages for bots |

**Recommendations:**
- Ensure sitemap.xml dynamically includes tenant subdomains.  
- Host both sitemap and robots.txt at each tenant's subdomain if applicable.

---

## 🧾 Final Summary
**Overall SEO Health:** 🟡 Good

✅ **Strengths**
- Strong Lighthouse performance (technical SEO)
- Meta tags and analytics detected
- Sitemap and robots endpoints active

⚠️ **Opportunities**
- Improve structured data coverage
- Expand JSON-LD with richer entity details
- Audit schema consistency across subdomains

---

## 🚀 Next Steps
1. Improve Schema depth (`LocalBusiness`, `Service`, `Organization`).  
2. Validate structured data with Google's Rich Results Test.  
3. Add social preview metadata (OG & Twitter cards).  
4. Submit sitemap to Google Search Console.  
5. Schedule recurring SEO audits weekly or before major releases.

---

Generated automatically by **That Smart Site SEO Auditor** 🧠
