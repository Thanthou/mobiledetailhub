# Development URLs Reference

**Last Updated**: October 20, 2025

---

## 🎯 Correct URLs for Development

### Backend Serving Built Files (Port 8080 or 3001)

```bash
# Main Site (ROOT domain - no subdomain!)
http://localhost:8080/           ✅ CORRECT
http://main.localhost:8080/      ❌ WRONG (main is not a subdomain)

# Admin Dashboard
http://admin.localhost:8080/     ✅ CORRECT

# Tenant Sites (testing)
http://test-tenant.localhost:8080/   ✅ CORRECT
http://mobile-detailing.localhost:8080/  ✅ CORRECT
```

---

### Vite Dev Servers (Hot Module Replacement)

```bash
# Main Site (no subdomain, just port)
http://localhost:5175/           ✅ CORRECT
http://main.localhost:5175/      ❌ WRONG

# Admin Dashboard
http://admin.localhost:5177/     ✅ CORRECT

# Tenant Sites (testing)
http://tenant.localhost:5179/    ✅ CORRECT (generic tenant testing)
```

**To start dev servers**:
```bash
cd frontend

# All at once (3 terminals)
npm run dev:main    # localhost:5175
npm run dev:admin   # admin.localhost:5177
npm run dev:tenant  # tenant.localhost:5179

# Or one at a time
npm run dev:main
```

---

## 🏗️ Architecture Explanation

### The Domain Hierarchy

```
Root Domain (thatsmartsite.com or localhost)
├── /                          ← Main site (marketing)
├── admin.thatsmartsite.com    ← Admin subdomain
└── {slug}.thatsmartsite.com   ← Tenant subdomains
    ├── mobile-detailing.thatsmartsite.com
    ├── lawn-care-pro.thatsmartsite.com
    └── ...
```

**In development (localhost)**:
```
localhost
├── /                          ← Main site
├── admin.localhost            ← Admin subdomain
└── {slug}.localhost           ← Tenant subdomains
    ├── test-tenant.localhost
    ├── mobile-detailing.localhost
    └── ...
```

---

## 🔧 How It Works

### Backend Static File Serving

```javascript
// backend/server.js

// 1. Serve at root (no subdomain)
app.use('/', express.static('frontend/dist/main'));

// 2. Serve at /admin path
app.use('/admin', express.static('frontend/dist/admin'));

// 3. Serve at /tenant path
app.use('/tenant', express.static('frontend/dist/tenant'));

// 4. Fallback router handles subdomain routing
app.get('*', (req, res) => {
  const host = req.hostname;
  
  // If admin.localhost → serve admin app
  // If {slug}.localhost → serve tenant app
  // Otherwise → serve main site
});
```

---

## 🚀 Quick Start

### Method 1: Backend Only (Built Files)

```bash
# 1. Build all apps
cd frontend
npm run build:all

# 2. Start backend
cd ../backend
npm start

# 3. Open in browser
http://localhost:8080/           # Main site ✅
http://admin.localhost:8080/     # Admin ✅
```

---

### Method 2: Vite Dev Servers (Hot Reload)

```bash
# Terminal 1: Main site
cd frontend
npm run dev:main
# Open: http://localhost:5175/

# Terminal 2: Admin
cd frontend
npm run dev:admin
# Open: http://admin.localhost:5177/

# Terminal 3: Tenant (testing)
cd frontend
npm run dev:tenant
# Open: http://tenant.localhost:5179/

# Terminal 4: Backend (needed for API)
cd backend
npm start
```

---

## 🎯 Common Mistakes

### ❌ Wrong URLs

```bash
http://main.localhost:8080/      # main is NOT a subdomain!
http://main.localhost:5175/      # main is NOT a subdomain!
```

### ✅ Correct URLs

```bash
http://localhost:8080/           # Main site = root domain
http://localhost:5175/           # Main site dev server
```

---

## 📝 Why "main" Was Confusing

**Old naming** (confusing):
- `main.localhost` → Implies "main" is a subdomain
- But "main site" means the ROOT domain, not a subdomain!

**New naming** (clear):
- `localhost` → The main/root domain
- `admin.localhost` → Admin subdomain
- `{tenant-slug}.localhost` → Tenant subdomains

---

## 🔍 Quick Test

After changes, verify all URLs work:

```bash
# Test main site (root)
curl http://localhost:8080/
# Should return main site HTML

# Test admin subdomain
curl http://admin.localhost:8080/
# Should return admin HTML

# Test that main.localhost is NOT treated as tenant
curl http://main.localhost:8080/
# Should return main site HTML (treated as reserved/invalid subdomain)
```

---

## 💡 Pro Tip

**For testing tenant sites**, don't use generic subdomains. Use actual tenant slugs:

```bash
# ❌ Generic (less realistic)
http://tenant.localhost:8080/

# ✅ Specific (matches production)
http://mobile-detailing-pro.localhost:8080/
http://lawn-care-experts.localhost:8080/
```

This way your testing matches real subdomain routing!

---

## 🎯 Summary

**Main Site** = **ROOT domain** (not a subdomain!)

| Environment | Main Site URL | Admin URL | Tenant URL |
|-------------|---------------|-----------|------------|
| **Backend (8080)** | `localhost:8080/` | `admin.localhost:8080/` | `{slug}.localhost:8080/` |
| **Vite Dev** | `localhost:5175/` | `admin.localhost:5177/` | `tenant.localhost:5179/` |
| **Production** | `thatsmartsite.com/` | `admin.thatsmartsite.com/` | `{slug}.thatsmartsite.com/` |

**No more confusion!** 🎉

