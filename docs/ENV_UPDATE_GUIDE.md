# .env File Update Guide for Dynamic Ports

## Current Issues in Your .env File

Your `.env` file currently has hardcoded ports that need to be updated for the dynamic port system:

### ❌ **Current Hardcoded Values:**
```bash
FRONTEND_URL=http://localhost:5175
PORT=3001
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/oauth/callback
```

### ✅ **Updated Dynamic Values:**

Replace the hardcoded values with these dynamic alternatives:

```bash
# Remove or comment out these hardcoded values:
# FRONTEND_URL=http://localhost:5175
# PORT=3001

# Add these dynamic alternatives:
# Backend will auto-detect port (3001, 3002, 3003...)
# PORT=3001  # Optional: only if you want to force a specific port

# Frontend will auto-detect port (5175, 5176, 5177...)
# FRONTEND_URL=http://localhost:5175  # Optional: only if you want to force a specific port

# Google OAuth will use dynamic backend port
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/oauth/callback  # This will be updated by the system
```

## How Dynamic Ports Work

1. **Backend Port**: System finds first free port starting from 3001
2. **Frontend Port**: System finds first free port starting from 5175  
3. **API Calls**: Frontend automatically uses the correct backend port
4. **OAuth Redirects**: Backend uses its actual port for redirects

## Recommended .env Updates

### Option 1: Remove Hardcoded Ports (Recommended)
```bash
# Remove these lines entirely:
# FRONTEND_URL=http://localhost:5175
# PORT=3001

# Keep everything else the same
```

### Option 2: Keep as Fallbacks
```bash
# Keep these as fallbacks (system will override if needed):
FRONTEND_URL=http://localhost:5175
PORT=3001
```

## What Happens After Update

- ✅ System automatically finds free ports
- ✅ No more port conflicts
- ✅ Frontend connects to correct backend port
- ✅ OAuth redirects work with correct port
- ✅ All API calls use dynamic ports

## Testing

After updating your .env file:

1. Stop current processes: `Ctrl+C`
2. Run: `npm run dev:all`
3. Check logs for port assignments
4. Verify both services start without conflicts
