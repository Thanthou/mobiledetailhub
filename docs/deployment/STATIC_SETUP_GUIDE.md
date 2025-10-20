# 🧭 Static Development Setup Guide

## Overview

This guide covers the **static port setup** for That Smart Site's multi-app development environment. All ports are now **fixed and predictable**, eliminating dynamic port discovery and race conditions.

---

## 📋 Port Configuration

| Service      | Port | URL                              | Description                       |
| ------------ | ---- | -------------------------------- | --------------------------------- |
| **Main Site**    | 5175 | `http://localhost:5175`          | Marketing/landing site            |
| **Admin App**    | 5177 | `http://admin.localhost:5177`    | Tenant dashboard                  |
| **Tenant App**   | 5179 | `http://tenant.localhost:5179`   | Live tenant website               |
| **Backend API**  | 3001 | `http://localhost:3001`          | Express backend                   |

---

## 🛠️ Setup Instructions

### Step 1: Environment Variables

Create or update `.env` file in the project root:

```bash
NODE_ENV=development
DOMAIN=localhost

BACKEND_PORT=3001
MAIN_PORT=5175
ADMIN_PORT=5177
TENANT_PORT=5179

FRONTEND_URL_MAIN=http://localhost:5175
FRONTEND_URL_ADMIN=http://admin.localhost:5177
FRONTEND_URL_TENANT=http://tenant.localhost:5179
API_URL=http://localhost:3001
```

### Step 2: Hosts File Configuration

To simulate subdomains locally, edit your system's `hosts` file:

#### Windows

1. Open `C:\Windows\System32\drivers\etc\hosts` **as Administrator**
2. Add these lines:

```
127.0.0.1 localhost
127.0.0.1 admin.localhost
127.0.0.1 tenant.localhost
127.0.0.1 demo.localhost
127.0.0.1 mobile-detailing.localhost
```

3. Save the file

#### macOS / Linux

1. Edit the file: `sudo nano /etc/hosts`
2. Add the same lines as above
3. Save with `Ctrl+O`, exit with `Ctrl+X`
4. Flush DNS cache:
   - **macOS**: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - **Linux**: `sudo systemctl restart systemd-resolved`

---

## 🚀 Running the Development Environment

### Start All Services

```bash
npm run dev:all
```

This starts all four processes in parallel:
- Main site (port 5175)
- Admin app (port 5177)
- Tenant app (port 5179)
- Backend (port 3001)

### Start Individual Services

```bash
npm run dev:main      # Main site only
npm run dev:admin     # Admin app only
npm run dev:tenant    # Tenant app only
npm run dev:backend   # Backend only
```

### Verify Setup

```bash
npm run verify:static
```

This script checks if all services are responding correctly.

---

## 🧪 Testing Subdomain Routing

Once services are running, test these URLs:

### Main Site
- `http://localhost:5175` → Marketing homepage
- `http://localhost:5175/features` → Features page
- `http://localhost:5175/pricing` → Pricing page

### Admin Dashboard
- `http://admin.localhost:5177` → Admin dashboard
- `http://admin.localhost:5177/dashboard` → Dashboard view
- `http://admin.localhost:5177/settings` → Settings

### Tenant Sites
- `http://tenant.localhost:5179` → Generic tenant preview
- `http://demo.localhost:5179` → Demo tenant site
- `http://mobile-detailing.localhost:5179` → Specific tenant site

### Backend API
- `http://localhost:3001/api/health` → Health check (simple)
- `http://localhost:3001/api/health/detailed` → Detailed health status

---

## 🔧 Troubleshooting

### Port Already in Use

If a port is already in use:

1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :5175
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5175 | xargs kill -9
   ```

2. Or use the cleanup script:
   ```bash
   npm run predev:all
   ```

### Subdomain Not Resolving

If `admin.localhost` doesn't work:

1. **Verify hosts file** was edited correctly
2. **Flush DNS cache** (see instructions above)
3. **Restart browser** (some browsers cache DNS aggressively)
4. **Try different browser** (Chrome/Firefox handle `.localhost` differently)

### CORS Errors

If you see CORS errors:

1. Verify backend is running on port 3001
2. Check `.env` has correct `API_URL=http://localhost:3001`
3. Clear browser cache and hard refresh (`Ctrl+Shift+R`)

### Backend Not Starting

If backend fails to start:

1. Check database connection in `.env`
2. Verify `DATABASE_URL` is set correctly
3. Check backend logs: `cd backend && npm run dev`

---

## 📁 File Structure

The static setup modified these files:

```
.
├── .env                              # Environment variables
├── .port-registry.json               # Static port registry
├── package.json                      # Updated dev scripts
├── backend/
│   ├── server.js                     # Static port configuration
│   └── middleware/
│       └── subdomainMiddleware.js    # .localhost subdomain handling
├── frontend/
│   ├── vite.config.main.ts           # Port 5175
│   ├── vite.config.admin.ts          # Port 5177
│   ├── vite.config.tenant.ts         # Port 5179
│   └── vite.config.shared.ts         # Static backend port
└── scripts/
    └── verify-static.js              # Verification script
```

---

## 🎯 Benefits of Static Setup

| Before (Dynamic)                     | After (Static)                      |
| ------------------------------------ | ----------------------------------- |
| Ports change on every restart        | Fixed, predictable ports            |
| Port registry sync issues            | No registry needed                  |
| Race conditions with port finder     | Instant startup                     |
| Complex hub proxy logic              | Direct app access                   |
| Hard to debug port conflicts         | Easy to identify and resolve        |

---

## 🔐 Production Differences

In production:

- Subdomains use real DNS (e.g., `slug.thatsmartsite.com`)
- HTTPS/TLS termination at load balancer
- Single backend serves all apps via routing
- No hosts file modifications needed

---

## 📚 Additional Resources

- [Backend Middleware Documentation](../backend/MIDDLEWARE.md)
- [Frontend Architecture](../frontend/ARCHITECTURE.md)
- [Multi-Tenant Schema Guide](../backend/MULTI_TENANT.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## ✅ Quick Checklist

- [ ] `.env` file configured with static ports
- [ ] `hosts` file updated with subdomain entries
- [ ] DNS cache flushed
- [ ] All dependencies installed (`npm run install:all`)
- [ ] Database running and accessible
- [ ] All services start with `npm run dev:all`
- [ ] Verification script passes (`npm run verify:static`)
- [ ] Browser can access all URLs listed above

---

**Last Updated:** October 20, 2025  
**Author:** Engineering Team  
**Version:** 1.0.0

