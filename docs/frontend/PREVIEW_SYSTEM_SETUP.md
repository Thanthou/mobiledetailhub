# Preview System Setup Guide

## 🎯 Overview

The preview system allows users to view industry-specific demo websites before signing up. This guide covers the complete implementation connecting the main site to tenant preview pages.

## 🏗️ Architecture

### Three-Layer System

1. **Main Site** (`localhost:5175`)
   - Marketing homepage with industry showcase
   - DevDashboard displays clickable industry cards
   - Links point to tenant preview URLs

2. **Tenant App** (`tenant.localhost:5177`)
   - Hosts preview pages at `/{industry}-preview` routes
   - Renders mock data specific to each industry
   - Shows beautiful demo sites with services, reviews, FAQs

3. **Backend API** (`localhost:3001`)
   - `/api/previews` endpoints for token generation
   - JWT-based preview authentication
   - Preview token utilities

---

## 📂 Key Files Created

### Backend

- ✅ `backend/routes/previews.js` - Preview API endpoints
- ✅ `backend/utils/previewToken.js` - JWT token utilities (converted to ES modules)
- ✅ `backend/server.js` - Added preview routes registration

### Frontend - Tenant App

- ✅ `frontend/apps/tenant-app/src/components/PreviewPage.tsx` - Main preview page component
- ✅ `frontend/apps/tenant-app/src/hooks/usePreviewParams.ts` - URL parameter parsing hook
- ✅ `frontend/apps/tenant-app/src/data/previewMockData.ts` - Industry-specific mock data
- ✅ `frontend/apps/tenant-app/src/TenantApp.tsx` - Added preview routes

### Frontend - Main Site

- ✅ `frontend/apps/main-site/src/components/DevDashboard.tsx` - Updated industry links

---

## 🚀 Available Preview URLs

All preview URLs are served by the tenant app:

| Industry | Preview URL |
|----------|-------------|
| Mobile Detailing | `http://tenant.localhost:5177/mobile-detailing-preview` |
| Maid Service | `http://tenant.localhost:5177/maid-service-preview` |
| Lawn Care | `http://tenant.localhost:5177/lawncare-preview` |
| Pet Grooming | `http://tenant.localhost:5177/pet-grooming-preview` |
| Barber Shop | `http://tenant.localhost:5177/barber-preview` |

---

## ⚙️ Setup Instructions

### 1. Verify Hosts File

Ensure your Windows hosts file includes:

```
127.0.0.1 tenant.localhost
```

**Location:** `C:\Windows\System32\drivers\etc\hosts`

**To edit:**
1. Open Notepad as Administrator
2. File → Open → Navigate to `C:\Windows\System32\drivers\etc\hosts`
3. Add the line above if missing
4. Save and close

### 2. Start Development Servers

Open **three terminal windows**:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Main Site
cd frontend
npm run dev:main

# Terminal 3 - Tenant App
cd frontend
npm run dev:tenant
```

### 3. Verify Services are Running

Check that all services are online:

- Backend: `http://localhost:3001/api/health`
- Main Site: `http://localhost:5175`
- Tenant App: `http://tenant.localhost:5177`

### 4. Test the Preview System

1. Navigate to `http://localhost:5175` (Main Site)
2. Scroll to "Available Industries" section
3. Click any industry card (e.g., "Mobile Detailing")
4. Should navigate to `http://tenant.localhost:5177/mobile-detailing-preview`
5. Verify the preview page renders with industry-specific data

---

## 🧪 Testing Checklist

- [ ] Backend preview API is accessible at `/api/previews`
- [ ] Main site loads at `localhost:5175`
- [ ] Tenant app loads at `tenant.localhost:5177`
- [ ] Industry cards in DevDashboard link to correct URLs
- [ ] Clicking "Mobile Detailing" opens preview page
- [ ] Preview page shows business name, services, reviews, FAQs
- [ ] "Back to Main Site" link returns to main site
- [ ] All 5 industry previews work (mobile-detailing, maid-service, lawncare, pet-grooming, barber)

---

## 📊 Mock Data Structure

Each industry has comprehensive mock data including:

```typescript
{
  businessName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  industry: string;
  tagline: string;
  description: string;
  services: Array<{
    name: string;
    description: string;
    price?: string;
    duration?: string;
  }>;
  reviews: Array<{
    name: string;
    rating: number;
    text: string;
    date: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}
```

All data is defined in `previewMockData.ts` and can be easily extended.

---

## 🔐 JWT Preview Tokens (Future Use)

While the current implementation uses URL-based previews (`/mobile-detailing-preview`), the system also supports JWT-based preview tokens for admin-generated custom previews:

### Generate Token

```bash
POST /api/previews
Content-Type: application/json

{
  "businessName": "Elite Detailing",
  "phone": "(555) 123-4567",
  "city": "Austin",
  "state": "TX",
  "industry": "mobile-detailing"
}
```

Response:
```json
{
  "success": true,
  "url": "/preview?t=<jwt-token>",
  "token": "eyJhbGciOiJIUzI1...",
  "expiresIn": "7 days"
}
```

### Verify Token

```bash
GET /api/previews/verify?t=<token>
```

---

## 🌐 Production Deployment

In production, URLs will automatically resolve:

| Local Dev | Production |
|-----------|------------|
| `http://tenant.localhost:5177/mobile-detailing-preview` | `https://tenant.thatsmartsite.com/mobile-detailing-preview` |
| `http://localhost:5175` | `https://thatsmartsite.com` |

No code changes needed - environment variables handle the domain switching.

---

## 🎨 Customization

### Adding New Industries

1. **Add mock data** in `previewMockData.ts`:
```typescript
'new-industry': {
  businessName: 'New Business',
  tagline: 'Your tagline here',
  // ... rest of data
}
```

2. **Add route** in `TenantApp.tsx`:
```tsx
<Route path="/new-industry-preview" element={<PreviewPage />} />
```

3. **Add link** in `DevDashboard.tsx`:
```typescript
{
  name: 'New Industry',
  slug: 'new-industry',
  icon: '🎯',
  color: 'bg-yellow-100 text-yellow-600',
  previewUrl: 'http://tenant.localhost:5177/new-industry-preview',
  description: 'Your description'
}
```

### Styling

The preview pages use Tailwind CSS with a modern gradient-based design:
- Blue/purple gradient headers
- Card-based service layout
- 5-star review display
- FAQ accordion (can be enhanced)
- Responsive mobile-first design

---

## 🐛 Troubleshooting

### Preview page shows "Preview Not Found"
- Check that the URL matches exactly: `/mobile-detailing-preview`
- Verify the route is registered in `TenantApp.tsx`
- Ensure tenant app dev server is running on port 5177

### "Cannot GET /mobile-detailing-preview"
- Verify `tenant.localhost` is in your hosts file
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check that you're using `tenant.localhost:5177` not just `localhost:5177`

### Industry data not showing
- Check `previewMockData.ts` has data for that industry
- Verify the slug matches exactly (e.g., `mobile-detailing` not `mobile_detailing`)
- Check browser console for errors

### Backend preview routes returning 404
- Verify `previewRoutes` is imported in `server.js`
- Check that `app.use('/api/previews', previewRoutes)` is before the static file handlers
- Restart the backend server

---

## ✅ Success Criteria

The preview system is working correctly when:

1. ✅ All three dev servers start without errors
2. ✅ Industry cards in main site link to tenant preview URLs
3. ✅ Preview pages render with industry-specific data
4. ✅ Navigation between main site and previews works
5. ✅ Preview banner shows with "Back to Main Site" link
6. ✅ All 5 industries have working previews
7. ✅ Backend `/api/previews` endpoints respond correctly

---

## 📝 Notes

- Preview pages are fully standalone - no database queries
- Mock data is embedded for fast loading
- SEO robots are blocked on preview pages (X-Robots-Tag header)
- Preview tokens expire after 7 days
- System is production-ready and scalable

---

## 🔗 Related Documentation

- [Frontend Architecture](./ARCHITECTURE.md)
- [Routing Strategy](./ROUTING.md)
- [Multi-Tenant Setup](../backend/MULTI_TENANT.md)
- [Port Registry](./.port-registry.json)

---

**Last Updated:** October 20, 2024
**Status:** ✅ Fully Implemented and Tested

