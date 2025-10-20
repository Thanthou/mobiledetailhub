# Environment Setup & Management Guide

**Complete guide to environment configuration** for That Smart Site.

---

## 📋 Quick Start

1. Copy `.env.example` to `.env` in project root
2. Update database credentials
3. Add API keys (Stripe, Google, PageSpeed)
4. Run `npm run dev:all` - ports auto-assign

---

## 🏗️ Architecture Overview

### Runtime Boundaries
- **Frontend (Vite)**: Browser environment, variables prefixed with `VITE_`
- **Backend (Express)**: Node.js environment, direct access to `process.env`

### Validation
- **Frontend**: `frontend/src/shared/env.ts` (Zod validation)
- **Backend**: `backend/config/environment.js` (Zod validation)

### Principle
Same semantic names across environments, with appropriate prefixes.

---

## 🎨 Frontend Environment Variables

### Required `VITE_` Prefix
All frontend variables MUST be prefixed with `VITE_` to be exposed to the browser.

### Validated Exports (in `frontend/src/shared/env.ts`)
```typescript
- isDevelopment, isProduction, mode
- apiUrl, apiBaseUrl
- apiUrls.local, apiUrls.live
- Third-party keys (VITE_STRIPE_PUBLISHABLE_KEY, etc.)
```

### Canonical Frontend Variables

```bash
# API Configuration
VITE_API_URL=                    # Explicit API root override
VITE_API_URL_LOCAL=http://localhost:3001    # Local dev API
VITE_API_URL_LIVE=https://api.thatsmartsite.com  # Production API

# Third-Party Services
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_CLIENT_ID=...
```

### Best Practices
- ✅ **Development**: Use relative URLs (empty `VITE_API_URL`) to leverage Vite proxy
- ✅ **Production**: Set `VITE_API_URL_LIVE` explicitly
- ❌ **Don't**: Hardcode host:ports in code - use `config.apiUrl`

---

## ⚙️ Backend Environment Variables

### Core Configuration

```bash
# Node Environment
NODE_ENV=development  # development | production | test

# Server (Dynamic Port Assignment)
# PORT will auto-detect (3001, 3002, 3003...)
# Only set if you want to force a specific port
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ThatSmartSite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ThatSmartSite
DB_USER=postgres
DB_PASSWORD=your_password

# JWT & Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_SECRET=your-super-secret-session-key-min-32-chars
```

### Third-Party Services

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/oauth/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PageSpeed Insights
GOOGLE_PAGESPEED_API_KEY=your-api-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🚀 Dynamic Port System

### How It Works

The system automatically detects available ports to avoid conflicts:

**Frontend Ports**: `5175`, `5176`, `5177`... (Vite dev servers)  
**Backend Ports**: `3001`, `3002`, `3003`... (Express servers)

### Port Detection Scripts
- `scripts/devtools/cli/find-free-backend-port.js` - Finds available backend port
- `scripts/devtools/cli/start-*.js` - Auto-assigns ports for each app

### Force Specific Port (Optional)

```bash
# In .env - only if you need a specific port
PORT=3001
FRONTEND_URL=http://localhost:5175
```

### Google OAuth with Dynamic Ports

The backend automatically updates `GOOGLE_REDIRECT_URI` on startup:

```bash
# Your .env can have a placeholder or omit it:
# GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/oauth/callback

# Backend will update it to the actual port on startup
```

---

## 📝 Environment Template

### `.env.example` (copy to `.env`)

```bash
#──────────────────────────────────────────────
# That Smart Site - Environment Configuration
#──────────────────────────────────────────────

# Node Environment
NODE_ENV=development

#──────────────────────────────────────────────
# Database Configuration
#──────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/ThatSmartSite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ThatSmartSite
DB_USER=postgres
DB_PASSWORD=password

#──────────────────────────────────────────────
# Backend Server (Dynamic Ports)
#──────────────────────────────────────────────
# PORT=3001  # Optional: force specific port

#──────────────────────────────────────────────
# Frontend (Dynamic Ports)
#──────────────────────────────────────────────
# FRONTEND_URL=http://localhost:5175  # Optional: force specific port

#──────────────────────────────────────────────
# Security & Auth
#──────────────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
SESSION_SECRET=your-super-secret-session-key-min-32-chars-change-in-production

#──────────────────────────────────────────────
# Google OAuth
#──────────────────────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_REDIRECT_URI=  # Auto-generated on backend startup

#──────────────────────────────────────────────
# Stripe
#──────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

#──────────────────────────────────────────────
# Google PageSpeed Insights
#──────────────────────────────────────────────
GOOGLE_PAGESPEED_API_KEY=your_pagespeed_api_key

#──────────────────────────────────────────────
# Email (Optional)
#──────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

#──────────────────────────────────────────────
# Frontend API Configuration
#──────────────────────────────────────────────
# Development: Leave empty to use Vite proxy
VITE_API_URL=

# Production: Set your live API URL
VITE_API_URL_LIVE=https://api.thatsmartsite.com

# Frontend Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🔄 Updating Environment Variables

### For Local Development

1. **Update `.env` file** with new values
2. **Restart servers**: `npm run dev:all`
3. Frontend will hot-reload, backend will restart

### For Production (Render.com)

1. Go to Render Dashboard → Your Service → Environment
2. Click "Add Environment Variable"
3. Add/update the variable
4. Service will auto-redeploy

### For Database Updates

```bash
# 1. Update .env with new DATABASE_URL
# 2. Run migration
cd backend
npm run migrate

# 3. Verify connection
npm run db:test-connection
```

---

## ⚠️ Common Issues & Solutions

### Issue: Frontend can't reach backend

**Symptoms**: API calls fail, CORS errors

**Solutions**:
1. Check backend is running (`http://localhost:3001/api/health`)
2. Verify `VITE_API_URL` in dev is empty (use proxy)
3. Check Vite proxy config in `vite.config.ts`

### Issue: Google OAuth redirect mismatch

**Symptoms**: "redirect_uri_mismatch" error

**Solutions**:
1. Check Google Console → OAuth 2.0 Client IDs
2. Add `http://localhost:3001/api/google/oauth/callback`
3. Backend auto-updates on startup, check logs

### Issue: Database connection failed

**Symptoms**: "ECONNREFUSED" or "password authentication failed"

**Solutions**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` credentials
3. Ensure database exists: `createdb ThatSmartSite`
4. Test: `psql $DATABASE_URL`

### Issue: Port already in use

**Symptoms**: "EADDRINUSE" error

**Solutions**:
1. System auto-detects next available port
2. If needed, force specific port in `.env`
3. Or kill existing process:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3001 | xargs kill -9
   ```

---

## 🧪 Testing Configuration

### Verify Frontend Config

```bash
cd frontend
npm run dev:main

# Check browser console:
console.log(config.apiUrl)
console.log(config.isDevelopment)
```

### Verify Backend Config

```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### Test Full Stack

```bash
# Start everything
npm run dev:all

# Verify:
# - Frontend: http://localhost:5175 (or assigned port)
# - Backend health: http://localhost:3001/api/health
# - Backend detailed: http://localhost:3001/api/health/detailed
```

---

## 📚 Related Documentation

- **Production Deployment**: `docs/deployment/PRODUCTION_DEPLOYMENT_GUIDE.md`
- **Render Configuration**: `docs/deployment/RENDER_DEPLOYMENT.md`
- **Database Migrations**: `docs/backend/migrations/MIGRATION_OVERVIEW.md`
- **Frontend Config**: `docs/frontend/build/VITE_CONFIG_UNIFICATION.md`

---

**Last Updated**: October 19, 2025  
**Maintained By**: Development Team

