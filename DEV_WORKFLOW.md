# 🚀 Development Workflow - Manual Multi-App Setup

## Overview

This project has **4 separate applications** that run independently:

1. **Backend API** - Express server (port 3001)
2. **Main Frontend** - Marketing site (port 5175)
3. **Admin Frontend** - Dashboard (port 5176)
4. **Tenant Frontend** - Tenant sites (port 5177)

Each app runs in its own terminal with **no auto-restart** or **concurrently** tooling.

---

## 🎯 Quick Start

### Option 1: Start Everything (4 terminals)

```bash
# Terminal 1 - Backend API
npm run backend

# Terminal 2 - Main Frontend
npm run main

# Terminal 3 - Admin Frontend
npm run admin

# Terminal 4 - Tenant Frontend
npm run tenant
```

### Option 2: Start Only What You Need

```bash
# Just backend (if working on API only)
npm run backend

# Just admin (if working on admin UI)
npm run admin
npm run backend  # (in separate terminal)
```

---

## 🛑 Stopping Servers

Press `Ctrl+C` in each terminal to stop that specific app.

**Ports are freed immediately** - no ghost processes!

---

## 🧹 Safety Reset

If ports ever get stuck or you have orphaned processes:

```bash
npm run kill
```

This clears all processes on ports: 3001-3005, 5175-5179

---

## 🌐 App URLs

| App | URL | Port |
|-----|-----|------|
| Backend API | `http://localhost:3001` | 3001 |
| Main Frontend | `http://localhost:5175` | 5175 |
| Admin Frontend | `http://admin.localhost:5176` | 5176 |
| Tenant Frontend | `http://tenant.localhost:5177` | 5177 |

---

## ✅ Key Benefits

- ✅ **One process per app** - no confusion
- ✅ **Manual control** - start/stop what you need
- ✅ **Instant port release** - no ghost processes
- ✅ **Clear logs** - each terminal shows only its app
- ✅ **Matches production** - same architecture

---

## 🔍 Checking What's Running

### PowerShell (Windows):
```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue
netstat -ano | Select-String "3001|5175|5176|5177"
```

### Bash (Mac/Linux):
```bash
ps aux | grep node
lsof -i :3001,5175,5176,5177
```

---

## 🐛 Debugging the 404 Issue

The backend now has **detailed middleware logging** enabled.

When testing login at `http://admin.localhost:5176`:

1. Start backend: `npm run backend`
2. Start admin: `npm run admin`
3. Watch backend terminal for:
   - 🟦 Middleware execution (ENTER/EXIT)
   - 🔴 Response sends (with stack traces)
   - 🔵 Route handler steps

This will help identify where the premature 404 is coming from.

---

## 📝 Notes

- **No watchers**: Files don't auto-reload. Restart manually after changes.
- **Clean state**: Each restart is fresh - no cached issues.
- **Predictable**: What you start is what runs. No surprises.

