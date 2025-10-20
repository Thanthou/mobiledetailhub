# Preview System Flow Diagram

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER FLOW DIAGRAM                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User lands on Main Site
┌──────────────────────────────────────────┐
│  http://localhost:5175                   │
│  ┌────────────────────────────────────┐  │
│  │   That Smart Site Homepage         │  │
│  │   - Features                       │  │
│  │   - Pricing                        │  │
│  │   - Dev Dashboard                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   Available Industries             │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐    │  │
│  │  │ 🚗   │  │ 🏠   │  │ 🌱   │    │  │
│  │  │Mobile│  │ Maid │  │ Lawn │    │  │
│  │  └──────┘  └──────┘  └──────┘    │  │
│  │      ↓ User clicks                │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

                     ↓
            Navigation to Preview URL

┌──────────────────────────────────────────┐
│  Redirect to Tenant App                  │
│  http://tenant.localhost:5177/           │
│        mobile-detailing-preview          │
└──────────────────────────────────────────┘

                     ↓
          React Router Match in TenantApp

┌──────────────────────────────────────────┐
│  TenantApp.tsx Routes                    │
│  ┌────────────────────────────────────┐  │
│  │ <Route path="/mobile-detailing-   │  │
│  │        preview"                    │  │
│  │        element={<PreviewPage />} />│  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

                     ↓
            PreviewPage Component Loads

┌──────────────────────────────────────────┐
│  PreviewPage.tsx                         │
│  ┌────────────────────────────────────┐  │
│  │ 1. usePreviewParams()              │  │
│  │    - Parses URL                    │  │
│  │    - Extracts industry slug        │  │
│  │    - Returns: "mobile-detailing"   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

                     ↓
              Fetch Mock Data

┌──────────────────────────────────────────┐
│  previewMockData.ts                      │
│  ┌────────────────────────────────────┐  │
│  │ getPreviewData('mobile-detailing') │  │
│  │                                    │  │
│  │ Returns:                           │  │
│  │ - businessName: "Elite Auto..."    │  │
│  │ - services: [...]                  │  │
│  │ - reviews: [...]                   │  │
│  │ - faqs: [...]                      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

                     ↓
            Render Complete Preview

┌──────────────────────────────────────────┐
│  Preview Page Rendered                   │
│  ┌────────────────────────────────────┐  │
│  │ 👁️ Preview Banner                 │  │
│  │ [Back to Main Site] ←             │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ 🎨 Hero Section                   │  │
│  │   Elite Auto Detailing             │  │
│  │   Professional Mobile Detailing    │  │
│  │   [Book Now] [Call]               │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ 💼 Services Grid                  │  │
│  │  ┌─────────┐  ┌─────────┐        │  │
│  │  │Basic $89│  │Full $249│        │  │
│  │  └─────────┘  └─────────┘        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ⭐ Customer Reviews               │  │
│  │  "Absolutely incredible service!"  │  │
│  │  ★★★★★ - Michael Chen            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ❓ FAQs                           │  │
│  │  Q: How long does it take?        │  │
│  │  A: 4-6 hours for full detail     │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

                     ↓
          User Clicks "Back to Main Site"

┌──────────────────────────────────────────┐
│  Returns to Main Site                    │
│  http://localhost:5175                   │
└──────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
thatsmartsite/
│
├── backend/
│   ├── routes/
│   │   └── previews.js ..................... ✅ API endpoints
│   ├── utils/
│   │   └── previewToken.js ................. ✅ JWT utilities
│   └── server.js ........................... ✅ Route registration
│
├── frontend/
│   └── apps/
│       ├── main-site/
│       │   └── src/
│       │       └── components/
│       │           └── DevDashboard.tsx ..... ✅ Industry links
│       │
│       └── tenant-app/
│           └── src/
│               ├── components/
│               │   └── PreviewPage.tsx ...... ✅ Preview renderer
│               ├── hooks/
│               │   └── usePreviewParams.ts .. ✅ URL parser
│               ├── data/
│               │   └── previewMockData.ts ... ✅ Industry data
│               └── TenantApp.tsx ............ ✅ Route config
│
├── docs/
│   └── frontend/
│       ├── PREVIEW_SYSTEM_SETUP.md .......... 📚 Full guide
│       └── PREVIEW_FLOW_DIAGRAM.md .......... 📚 This file
│
├── scripts/
│   ├── devtools/
│   │   └── verify-preview-system.js ......... 🧪 Verification
│   └── setup/
│       └── setup-hosts-windows.md ........... 📝 Hosts setup
│
└── PREVIEW_SYSTEM_READY.md .................. 🎉 Summary
```

---

## 🔌 API Endpoints (Backend)

```
POST /api/previews
├── Purpose: Generate JWT preview token
├── Body: { businessName, phone, city, state, industry }
└── Response: { success, url, token, expiresIn }

GET /api/previews/verify?t=<token>
├── Purpose: Verify and decode preview token
├── Query: t=<jwt-token>
└── Response: { success, payload }
```

---

## 🎯 Route Mapping

### Main Site Routes (`localhost:5175`)
```
/                    → HomePage (DevDashboard)
/pricing             → PricingPage
/onboard             → TenantOnboardingPage
/login               → LoginPage
/admin               → AdminRedirect
```

### Tenant App Routes (`tenant.localhost:5177`)
```
/                              → TenantPage (home)
/mobile-detailing-preview      → PreviewPage (mobile detailing)
/maid-service-preview          → PreviewPage (maid service)
/lawncare-preview              → PreviewPage (lawn care)
/pet-grooming-preview          → PreviewPage (pet grooming)
/barber-preview                → PreviewPage (barber shop)
/preview?t=<token>             → PreviewPage (JWT-based)
/dashboard                     → DashboardPage (protected)
/booking                       → BookingApp
```

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    DATA FLOW                            │
└─────────────────────────────────────────────────────────┘

URL: /mobile-detailing-preview
         │
         ↓
usePreviewParams()
         │
         ├─> Parse pathname
         │   └─> Extract "mobile-detailing"
         │
         ↓
getPreviewData("mobile-detailing")
         │
         ├─> Look up in INDUSTRY_PREVIEW_DATA
         │   └─> Return PreviewData object
         │
         ↓
PreviewPage Component
         │
         ├─> Render Hero (businessName, tagline)
         ├─> Render Services (services array)
         ├─> Render Reviews (reviews array)
         └─> Render FAQs (faqs array)
         │
         ↓
   Final HTML/CSS rendered in browser
```

---

## 🎨 Component Hierarchy

```
PreviewPage
  ├── Preview Banner
  │   ├── "Preview Mode" indicator
  │   └── "Back to Main Site" link
  │
  ├── Hero Section
  │   ├── Business name (h1)
  │   ├── Tagline (h2)
  │   ├── Description (p)
  │   └── CTA Buttons
  │       ├── "Book Now"
  │       └── "Call {phone}"
  │
  ├── Services Section
  │   └── Services Grid
  │       ├── Service Card 1
  │       ├── Service Card 2
  │       ├── Service Card 3
  │       └── Service Card 4
  │
  ├── Reviews Section
  │   └── Reviews Grid
  │       ├── Review Card 1
  │       │   ├── Star Rating
  │       │   ├── Review Text
  │       │   └── Customer Name + Date
  │       ├── Review Card 2
  │       └── Review Card 3
  │
  ├── FAQ Section
  │   └── FAQ List
  │       ├── FAQ Item 1
  │       │   ├── Question
  │       │   └── Answer
  │       ├── FAQ Item 2
  │       └── FAQ Item 3
  │
  ├── CTA Section
  │   ├── "Ready to Get Started?"
  │   └── Contact Buttons
  │
  └── Footer
      ├── Copyright
      └── "Powered by That Smart Site"
```

---

## 🌈 Styling System

```
Color Palette:
├── Primary: Blue (#2563eb)
├── Secondary: Purple (#7c3aed)
├── Accent: Blue-200 (#bfdbfe)
├── Text: Gray-900 (#111827)
└── Background: Gray-50 (#f9fafb)

Gradients:
├── Hero: from-blue-900 via-blue-800 to-purple-900
├── CTA: from-blue-900 via-blue-800 to-purple-900
└── Cards: from-gray-50 to-blue-50

Typography:
├── Headings: Font-Bold, Large sizes
├── Body: Font-Normal, Gray-700
└── Links: Blue-600, Hover effects

Spacing:
├── Sections: py-16 (64px)
├── Cards: p-6 (24px)
└── Gaps: gap-4 to gap-6
```

---

## 🔄 State Management

```
PreviewPage (Component)
  │
  └─> usePreviewParams() (Hook)
        │
        ├─> location.pathname (React Router)
        ├─> location.search (React Router)
        │
        └─> Returns: PreviewParams
              ├─> mode: 'slug' | 'token' | null
              ├─> slug?: string
              ├─> token?: string
              └─> industry?: string
```

**No global state needed!** Everything is URL-driven and computed on render.

---

## ⚡ Performance

- **Zero API calls** - All data is static
- **Fast initial load** - No async operations
- **Small bundle size** - Mock data is tree-shakeable
- **Instant navigation** - Client-side routing
- **No loading states** - Data is always ready

---

## 🔐 Security

- ✅ Preview banner prevents confusion
- ✅ `X-Robots-Tag: noindex` blocks search engines
- ✅ JWT tokens expire after 7 days
- ✅ Token verification checks issuer/audience
- ✅ No sensitive data in previews
- ✅ Tenant isolation for bound tokens

---

## 🌐 Environment Handling

```
Development:
├── Main: localhost:5175
├── Tenant: tenant.localhost:5177
└── Backend: localhost:3001

Production:
├── Main: thatsmartsite.com
├── Tenant: tenant.thatsmartsite.com
└── Backend: api.thatsmartsite.com

URLs automatically adapt via environment variables!
```

---

## 📈 Scalability

**Current:** 5 industries  
**Future:** Unlimited industries

**To add industry #6:**
1. Add data to `previewMockData.ts` (5 min)
2. Add route to `TenantApp.tsx` (1 min)
3. Add link to `DevDashboard.tsx` (2 min)

**Total:** ~10 minutes per industry! 🚀

---

## ✨ Features Checklist

- ✅ URL-based previews (`/industry-preview`)
- ✅ JWT token-based previews (`/preview?t=...`)
- ✅ Preview banner with "Back" link
- ✅ Beautiful gradient design
- ✅ Responsive layout (mobile/tablet/desktop)
- ✅ 5-star review display
- ✅ Service pricing cards
- ✅ FAQ sections
- ✅ Call-to-action buttons
- ✅ Footer with branding
- ✅ SEO meta tags (noindex)
- ✅ Fast loading (no DB)
- ✅ Type-safe (TypeScript)
- ✅ Linter-clean code
- ✅ Production-ready
- ✅ Well-documented

---

**Diagram Version:** 1.0  
**Last Updated:** October 20, 2024  
**Status:** ✅ Complete Implementation

