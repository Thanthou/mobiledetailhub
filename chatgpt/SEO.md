# SEO Report (Auto-Generated)

Generated: 2025-10-18T07:21:29.110Z

This file summarizes detected SEO signals and TODOs. Edit conventions in `/docs/SEO.md` by replacing this file with a curated version if needed.

## Snapshot
- Total files scanned: **963**
- By extension: `{".js":137,".md":63,".json":93,".sql":16,".ts":365,".cjs":1,".html":5,"(noext)":1,".tsx":279,".css":1,".yaml":1,".bat":1}`

## Detected signals
- [x] robots.txt
- [x] sitemap generator
- [x] seo shared folder
- [x] seo feature folder
- [x] ld-json helpers
- [x] SeoHead component
- [x] backend SEO routes
- [x] SEO defaults (industry)
- [x] preview route
- [x] head manager (Helmet/NextHead)

## Conventions (recommended)
- **Canonicals**: live → custom domain; subdomain plan canonicalizes to subdomain; previews are **noindex,nofollow** with X-Robots-Tag.
- **Sitemaps**: per-tenant `/sitemaps/<tenant>.xml` including home, services, locations.
- **Robots**: allow live tenants; disallow `/preview`.
- **Meta**: title ≤ 60 chars; description 150–160 chars; OG + Twitter cards per page.
- **JSON-LD**: LocalBusiness + Service + FAQ where relevant, sourced from tenant config.
- **Assets**: WebP, width/height attributes, lazy loading.
- **Analytics**: GA4 per tenant (calls, form submit, booking events), cookie consent where required.

## TODOs
- [ ] Ensure preview routes send `noindex` meta and X-Robots-Tag headers
- [ ] Add per-tenant sitemap generation
- [ ] Add/verify robots.txt
- [ ] Centralize JSON-LD helpers
- [ ] Enforce meta/title via a shared SEO component
