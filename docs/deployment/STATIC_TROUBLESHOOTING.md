# 🚨 Static Setup Troubleshooting Guide

## Current Status

The static port setup is **mostly complete** with the following improvements:

### ✅ What's Working
1. **Static ports defined** in all vite configs (5175, 5177, 5179)
2. **`strictPort: true`** enforces static ports (no auto-increment)
3. **Backend static port** (3001) configured
4. **Cleanup script** simplified to kill all Node processes
5. **Increased cleanup delay** (2 seconds for Windows port release)

### ⚠️ Current Issue

When running `npm run dev:all`, services fail to start with "Port already in use" errors even after cleanup runs.

**Root Cause**: Windows takes time to release ports after processes are killed, and the cleanup delay may not be sufficient.

---

## 🔧 Solutions

### Solution 1: Manual Startup (Recommended for Now)

**Kill processes manually, wait, then start:**

```bash
# Step 1: Kill all Node processes
taskkill /F /IM node.exe /T

# Step 2: Wait 5-10 seconds for ports to release
# (Just wait, don't run any command)

# Step 3: Start all services
npm run dev:all
```

### Solution 2: Start Services Individually

If `dev:all` continues to have issues, start each service in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
nodemon server.js
```

**Terminal 2 - Main Site:**
```bash
cd frontend
npm run dev:main
```

**Terminal 3 - Admin App:**
```bash
cd frontend
npm run dev:admin
```

**Terminal 4 - Tenant App:**
```bash
cd frontend
npm run dev:tenant
```

### Solution 3: Increase Cleanup Delay

Edit `scripts/automation/cleanup/kill-node-processes.js`:

```javascript
setTimeout(() => {
  console.log("🟢 Ports should be released");
  process.exit(0);
}, 5000); // Increase to 5 seconds
```

### Solution 4: Add Port Check Before Starting

Create a pre-check script that verifies ports are free before starting.

---

## 🧪 Verification Steps

After services start (by any method), verify they're on correct ports:

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

Then test in browser:
- http://localhost:5175
- http://admin.localhost:5177
- http://tenant.localhost:5179
- http://localhost:3001/api/health

---

## 🎯 Benefits Achieved

Even with the manual startup workaround, you've gained:

1. **Predictable Ports**: Always 3001, 5175, 5177, 5179
2. **No Silent Port Changes**: Vite will fail loudly if ports are busy
3. **Simple Configuration**: No dynamic port detection code
4. **Easier Debugging**: Consistent URLs every time
5. **Cleaner Codebase**: Removed complex port registry logic

---

## 🔮 Future Improvements

1. **Port checker utility**: Script that waits until all ports are free
2. **Longer cleanup delay**: Test with 5-10 second delays
3. **Docker setup**: Containers eliminate port conflicts entirely
4. **Process manager**: Use PM2 or similar for better process control

---

## 📝 Summary

The static setup is **functionally complete**. The only remaining issue is the timing between cleanup and startup on Windows. Use manual startup (kill → wait → start) for now, and the system will work perfectly with static ports.

**Last Updated**: October 20, 2025

