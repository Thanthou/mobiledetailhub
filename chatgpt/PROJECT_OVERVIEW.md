# Project Overview

## Mission
Ship conversion-optimized, industry-specific website templates as a multi-tenant SaaS platform for local service businesses. Enable fast preview → easy onboarding → automated provisioning workflow.

## Business Model
**Target Market**: Local service businesses (mobile detailing, lawn care, maid services, pet grooming, etc.)

**Value Proposition**: 
- Industry-specific templates optimized for conversions (not generic page builders)
- Lightning-fast sites with perfect Lighthouse scores
- Automatic review aggregation from Google Business Profile
- Built-in booking/scheduling system
- Zero maintenance for tenant - fully managed hosting

**Pricing Tiers**: 
- **Starter**: $15/month - Basic subdomain, core features
- **Pro**: $25/month - Enhanced features
- **Premium**: $35/month - Full feature set
- **Add-ons**: Additional services available (custom integrations, premium support, etc.)

## Target Industries (Current)
1. **Mobile Detailing** - Vehicle detailing services
2. **Lawn Care** - Residential/commercial lawn maintenance
3. **Maid Service** - Home cleaning services
4. **Pet Grooming** - Pet care and grooming

Each vertical has custom:
- Hero sections with industry-specific imagery
- Service catalogs tailored to that industry
- Booking flows optimized for that use case
- SEO content and schemas

## User Personas

### Primary: Business Owner
- Small local service business (1-10 employees)
- Needs professional web presence but lacks time/expertise
- Values leads/bookings over website customization
- Mobile-first audience

### Secondary: End Customer
- Homeowner seeking local services
- Mobile-heavy traffic
- Values: reviews, pricing transparency, easy booking

### Internal: Sales Team
- Sends preview links to prospects during sales calls
- Needs fast, impressive demos
- Closes deals based on conversion potential

## Tenancy Model

### Subdomain-based Multi-tenancy
- **Starter**: `[tenant-slug].thatsmartsite.com`
- **Pro/Custom**: Custom domain via CNAME → tenant subdomain
- **Preview Mode**: Signed JWT token links, `noindex` meta, canonical to future live URL

### Tenant Isolation
- Database: Row-level isolation via `tenant_id` in auth.businesses table
- Assets: Tenant-scoped uploads in `backend/uploads/`
- Routing: Frontend detects tenant from subdomain/domain and loads appropriate data

## Key User Flows

### 1. Sales → Preview
```
Sales call → Generate preview JWT → Send link → Prospect views live demo site → Impressed by speed/polish
```

### 2. Onboarding → Activation
```
Sign up form → Business info collection → Stripe payment → Tenant provisioning (DB rows, subdomain, SSL) → Welcome email with dashboard link
```

### 3. Tenant Content Management
```
Dashboard login → Update services/pricing → Upload photos → Scrape Google reviews → Changes reflected live on public site
```

### 4. End User Booking
```
Find site via Google → Browse services → View reviews/gallery → Book appointment → Confirmation email → Added to tenant's schedule
```

## Technical Architecture

### Stack
**Frontend**:
- React 18 + TypeScript (strict mode)
- Vite (fast builds, HMR)
- React Router v6
- Tailwind CSS + shadcn/ui components
- Zustand (state management)
- React Query (server state)
- Zod (runtime validation)

**Backend**:
- Node.js + Express
- PostgreSQL (multi-tenant with row-level isolation)
- JWT authentication
- Stripe integration (payments/subscriptions)
- Google Business Profile scraper (reviews)

**Infrastructure**:
- **Current**: Render (backend) + Vercel (frontend)
- **Future**: Migrating everything to Render for unified hosting
- **Database**: PostgreSQL hosted on Render
- **DNS/SSL**: Managed via hosting provider

### Code Organization: Feature-First

**Principle**: Organize by business domain, not technical layer.

```
frontend/src/features/
  ├── booking/          # Appointment scheduling feature
  │   ├── components/   # Pure presentational components
  │   ├── hooks/        # Data fetching, side effects (React Query)
  │   ├── api/          # HTTP clients, DTO mapping, Zod validation
  │   ├── state/        # Zustand stores (minimal, UI state only)
  │   ├── types/        # TypeScript interfaces/types
  │   ├── pages/        # Route components
  │   └── utils/        # Pure helper functions
  ├── reviews/          # Review display and scraping
  ├── gallery/          # Image management
  ├── services/         # Service catalog
  ├── locations/        # Service area management
  └── ...
```

**Import Boundaries**:
- ✅ Features can import from `@/shared/**` (common utilities, types, UI components)
- ✅ Features can import from within themselves `@/features/<same-feature>/**`
- ❌ Features CANNOT import from other features directly
- If cross-feature sharing is needed → extract to `@/shared/`

**Why Feature-First?**
- Scales better than layer-first (no giant `components/` folder)
- Clear ownership and boundaries
- Easier to find related code
- Prevents spaghetti imports

### Key Technical Decisions

**Why Zustand over Redux?**
- Simpler API, less boilerplate
- Perfect for feature-local state
- React Query handles server state, so minimal store needs

**Why Vite over Create React App?**
- 10-50x faster HMR
- Native ESM, better tree-shaking
- Modern tooling (esbuild, rollup)

**Why not Next.js?**
- Multi-tenancy via subdomain (not path-based) works better with SPA
- Client-side tenant detection and data fetching
- Don't need SSR for most pages (performance is fine with static builds + CDN)

**Why PostgreSQL Row-Level Security approach?**
- All tenant data isolated via `tenant_id` foreign keys
- Single database, simpler ops than DB-per-tenant
- Queries filtered by authenticated tenant ID

## Core Features

### 1. Review Management ⭐
- **Google Business Scraper**: Automatically pulls reviews from Google Business Profile
- **Display**: Beautiful review cards on homepage, dedicated reviews page
- **Filtering**: By rating, date, source
- **Schema.org**: Review structured data for SEO

### 2. Booking/Scheduling 📅
- **Service Selection**: Multi-step booking flow
- **Calendar**: Available time slots based on business hours
- **Confirmation**: Email notifications to tenant and customer
- **Management**: Tenant dashboard to view/manage bookings

### 3. Gallery 📸
- **Upload**: Tenant uploads work samples
- **Optimization**: Automatic image compression/resizing
- **Display**: Masonry grid layout, lightbox viewer
- **SEO**: Image sitemaps, alt text

### 4. Service Catalog 🛠️
- **Industry Templates**: Pre-built service lists per vertical
- **Customization**: Tenant edits names, prices, descriptions
- **Display**: Cards, tables, comparison views

### 5. Location/Service Areas 📍
- **Zip Code Entry**: Tenant defines coverage areas
- **Mapping**: Integrate with maps for visualization
- **SEO**: Location-based landing pages, local schema

### 6. Custom Domains 🌐
- **CNAME Setup**: Tenant points custom domain to our subdomain
- **SSL**: Automatic certificate provisioning
- **Redirect**: Handle www/non-www consistently

## Current State
**Status**: Pre-launch / MVP Development

**Live Tenants**: 0 (1 friend ready to purchase once live)

**Phase**: Building out tenant onboarding and content management flows

## Known Challenges
None identified yet - still in early development phase. Will track technical debt and blockers as they emerge.

## Roadmap / Next Priorities

### 1. Tenant Onboarding System (CURRENT PRIORITY)
**Goal**: Complete end-to-end flow from signup to live site

**Key Implementation Detail - Content Fallback System**:
- When tenant is provisioned, database fields initialize to `''` (empty string)
- Frontend pages implement smart content loading:
  ```
  IF database field === '' OR null:
    → Load from /data/*.json (industry boilerplate template)
  ELSE:
    → Load from database (tenant's custom content)
  ```
- This allows:
  - ✅ Instant site activation with professional defaults
  - ✅ Tenant can gradually customize (services, about text, hours, etc.)
  - ✅ Pages always have content, never broken/empty
  - ✅ Clear distinction between "using default" vs "customized"

**Onboarding Steps to Build**:
1. Signup form (business info collection)
2. Stripe payment integration
3. Database provisioning (tenant record + default values)
4. Subdomain activation
5. Email welcome + dashboard credentials
6. Dashboard content editor for key fields

### 2. Content Management Dashboard
- Tenant portal to edit services, pricing, gallery, hours, about text
- Preview changes before publishing
- Track which fields are using defaults vs customized

### 3. Launch Checklist
- [ ] Onboarding flow complete
- [ ] Payment processing tested
- [ ] Review scraper working reliably
- [ ] Booking system tested end-to-end
- [ ] Performance optimization (Lighthouse 90+)
- [ ] Error monitoring setup
- [ ] Customer support plan

### Future (Post-Launch)
- Analytics dashboard for tenants
- SEO reporting/suggestions
- Multi-location support for franchises
- Appointment reminders (SMS/email)
- Review response management
- Expand to new industries

## Non-Goals
- ❌ Path-based multi-tenancy for live sites (subdomain-only)
- ❌ Per-page SEO customization (centralized rules, tenant can't edit meta tags)
- ❌ Advanced site builder / drag-drop editor (opinionated templates only)
- ❌ E-commerce / complex checkout (booking only, not product sales)
- ❌ Multi-language support (English-only for now)

## Quality Standards

### Performance
- Lighthouse score: 90+ on all metrics (LCP, CLS, FID, TTFB)
- Core Web Vitals: Pass all thresholds
- Bundle size: Monitor chunk sizes, lazy load routes

### Code Quality
- TypeScript strict mode, no `any` without justification
- ESLint: Fix all warnings unless documented exception
- Feature boundary checks: Automated linting for imports
- Component size: Split if >200 lines or >3 responsibilities

### Testing
- Unit tests: Vitest + Testing Library for critical paths
- Integration tests: Key user flows (booking, onboarding)
- Manual testing: Cross-browser, mobile devices

### Monitoring
- Error tracking: Capture and alert on production errors
- Uptime monitoring: Health checks, alerting
- Performance: Real user monitoring (RUM)

## Development Workflow

### Local Setup
[TODO: Document steps]
- Clone repo
- Install dependencies (frontend + backend)
- Setup PostgreSQL database
- Configure environment variables
- Run migrations
- Start dev servers

### Deployment
- **Frontend**: Push to main → Vercel auto-deploys
- **Backend**: Push to main → Render auto-deploys
- **Database**: Migrations run manually on Render PostgreSQL

### Branch Strategy
[TODO: Define - trunk-based? feature branches? PR requirements?]

## Key Files to Understand

### Backend Entry Points
- `backend/server.js` - Express app setup, route registration
- `backend/routes/tenants.js` - Tenant CRUD operations
- `backend/routes/auth.js` - Authentication (JWT)
- `backend/routes/reviews.js` - Review scraping and display
- `backend/routes/schedule.js` - Booking system
- `backend/database/pool.js` - PostgreSQL connection

### Frontend Entry Points  
- `frontend/src/main.tsx` - React app initialization
- `frontend/src/routes/index.tsx` - Route definitions
- `frontend/src/features/*/` - Feature domains (see above)

### Configuration
- `frontend/vite.config.ts` - Build configuration, path aliases
- `frontend/tailwind.config.js` - Design system tokens
- `backend/config/env.js` - Environment variable validation
- `.cursorrules` - Project-specific coding standards for AI

## Glossary
- **Tenant**: A business customer using our platform (e.g. "Joe's Lawn Care")
- **Preview**: Demo site shown to prospects before they sign up
- **Slug**: URL-safe identifier for tenant (e.g. "joes-lawn-care")
- **Feature**: Business domain module in codebase (e.g. `features/booking/`)
- **Vertical**: Industry category (e.g. "mobile-detailing", "lawn-care")
- **Service Area**: Geographic region tenant operates in (zip codes, cities)

