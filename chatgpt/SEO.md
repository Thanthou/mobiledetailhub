# SEO Report (Auto-Generated)

Generated: 2025-10-15T04:02:25.356Z

This file summarizes detected SEO signals and TODOs. Edit conventions in `/docs/SEO.md` by replacing this file with a curated version if needed.

## Snapshot
- Total files scanned: **840**
- By extension: `{".js":77,".md":46,".sql":39,".json":89,".ts":322,".html":1,".tsx":264,".css":1,".txt":1}`

## Detected signals
- [ ] robots.txt
- [ ] sitemap generator
- [ ] seo feature folder
- [ ] ld-json helpers
- [x] preview route
- [ ] head manager (Helmet/NextHead)

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
