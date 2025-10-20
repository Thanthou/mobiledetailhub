# 🚀 Static Setup - Quick Start Guide

## Simple 2-Step Startup

### Step 1: Kill Old Processes (if any)
```bash
taskkill /F /IM node.exe /T
```
*Wait 3-5 seconds for ports to release*

### Step 2: Start All Services
```bash
npm run dev:all
```

That's it! 🎉

---

## 🌐 Access Your Apps

Once services start (~5 seconds), open:

| App | URL |
|-----|-----|
| **Main Site** | http://localhost:5175 |
| **Admin Dashboard** | http://admin.localhost:5177 |
| **Tenant App** | http://tenant.localhost:5179 |
| **Backend API** | http://localhost:3001/api/health |

---

## ✅ Verify Everything Works

```bash
npm run verify:static
```

Expected output:
```
✅ Main Site (5175) responded
✅ Admin App (5177) responded  
✅ Tenant App (5179) responded
✅ Backend API (3001) responded
```

---

## 🛠️ Available Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev:all` | Start all 4 services (main, admin, tenant, backend) |
| `npm run dev:apps` | Start only frontend apps (no backend) |
| `npm run dev:main` | Start main site only |
| `npm run dev:admin` | Start admin app only |
| `npm run dev:tenant` | Start tenant app only |
| `npm run dev:backend` | Start backend only |
| `npm run verify:static` | Check if all services are responding |
| `npm run dev:kill` | Kill Node processes (optional helper) |

---

## 🎯 Static Ports

All ports are **fixed and predictable**:

```
Backend:     3001
Main Site:   5175
Admin App:   5177
Tenant App:  5179
```

With `strictPort: true`, Vite will **fail with clear error** if ports are busy instead of silently using different ports.

---

## 🚨 Troubleshooting

### Port Already in Use

**Error:**
```
Error: Port 5175 is already in use
```

**Solution:**
```bash
# Kill all Node processes
taskkill /F /IM node.exe /T

# Wait 5 seconds

# Start again
npm run dev:all
```

### Services Not Starting

**Check if anything is running:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue
```

**If you see processes, kill them:**
```bash
taskkill /F /IM node.exe /T
```

### Verify Hosts File

Make sure these entries exist in `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 localhost
127.0.0.1 admin.localhost
127.0.0.1 tenant.localhost
```

---

## 💡 Pro Tips

1. **Use separate terminals** for easier debugging (one per service)
2. **Keep verify script handy**: Run `npm run verify:static` after startup
3. **Browser cache**: Hard refresh (`Ctrl+Shift+R`) if you see stale content
4. **HMR works**: Edit files and see instant updates (no manual refresh)
5. **Backend logs**: Watch the BACKEND output for API request logs

---

## 📚 More Documentation

- **Full Setup Guide**: [STATIC_SETUP_GUIDE.md](./STATIC_SETUP_GUIDE.md)
- **Migration Summary**: [STATIC_MIGRATION_SUMMARY.md](./STATIC_MIGRATION_SUMMARY.md)
- **Script Trace**: [DEV_ALL_TRACE.md](./DEV_ALL_TRACE.md)
- **Troubleshooting**: [STATIC_TROUBLESHOOTING.md](./STATIC_TROUBLESHOOTING.md)

---

**Last Updated**: October 20, 2025  
**Version**: 2.0 (Manual cleanup)

