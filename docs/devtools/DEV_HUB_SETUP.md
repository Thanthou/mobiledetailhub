# Dev Hub Setup & Port Registry

The Dev Hub runs on `localhost:8080` and routes requests to the correct frontend app based on hostname.

## Static Port Assignments

| App     | Port | Hostname          | Vite Config              |
|---------|------|-------------------|--------------------------|
| Main    | 5175 | localhost         | vite.config.main.ts      |
| Admin   | 5176 | admin.localhost   | vite.config.admin.ts     |
| Tenant  | 5177 | tenant.localhost  | vite.config.tenant.ts    |
| Backend | 3001 | localhost         | backend/server.js        |

## How It Works

1. **Port Registry** (`.port-registry.json`):
   - Static reference file at project root
   - Maps app name → port + hostname
   - Dev Hub reads this at startup

2. **Dev Hub** (`scripts/devtools/dev-hub.js`):
   - Runs on port `8080`
   - Proxies by hostname:
     - `http://localhost:8080` → `http://localhost:5175` (main site)
     - `http://admin.localhost:8080` → `http://localhost:5176`
     - `http://tenant.localhost:8080` → `http://localhost:5177`
   - Handles WebSocket (HMR) and API proxying

3. **Hosts File**:
   - Required: Map `*.localhost` to `127.0.0.1`
   - Run `npm run setup:hosts` to check/guide setup
   - Manual entries:
     ```
     127.0.0.1 admin.localhost
     127.0.0.1 tenant.localhost
     ```
   - Note: `localhost` already resolves to `127.0.0.1` (no setup needed)

## Setup Steps

### 1. Configure Hosts File
```bash
npm run setup:hosts
```

### 2. Start All Apps
```bash
# Option A: Start individually
npm run dev:main     # Port 5175
npm run dev:admin    # Port 5176
npm run dev:tenant   # Port 5177
npm run dev:backend  # Port 3001

# Option B: Start all at once (if script exists)
npm run dev:all
```

### 3. Start Dev Hub
```bash
npm run dev:hub      # Port 8080
```

### 4. Access Apps
- Main Site: http://localhost:8080
- Admin App: http://admin.localhost:8080
- Tenant App: http://tenant.localhost:8080
- Port Registry: http://localhost:8080/.port-registry.json

## Troubleshooting

### 404 Errors
- **Check hosts file**: Run `npm run setup:hosts` to verify
- **Check apps are running**: Visit ports directly (5175, 5176, 5177)
- **Check registry**: Visit http://localhost:8080/.port-registry.json

### Cross-Link Issues
- **Ensure consistent hostnames**: Always use `*.localhost:8080` for internal links
- **Check Vite ports**: Verify `vite.config.*.ts` matches `.port-registry.json`

### Port Conflicts
- **Static ports**: If ports are in use, update:
  1. `.port-registry.json`
  2. Corresponding `vite.config.*.ts`
  3. Restart apps and Dev Hub

## Development Workflow

```bash
# 1. One-time setup
npm run setup:hosts

# 2. Daily workflow
npm run dev:backend    # Terminal 1
npm run dev:main       # Terminal 2
npm run dev:admin      # Terminal 3
npm run dev:tenant     # Terminal 4
npm run dev:hub        # Terminal 5 (after all apps start)

# 3. Visit
open http://localhost:8080
```

## Benefits of Static Ports

✅ **Predictable**: Same ports every time  
✅ **Simple**: No dynamic port detection needed  
✅ **Fast**: Dev Hub starts instantly  
✅ **Debuggable**: Easy to verify what's running where  
✅ **Bookmarkable**: URLs never change  

## Architecture

```
User Browser
    ↓
localhost:8080 (Dev Hub)
    ↓
Proxy Router (by hostname)
    ├─ main.localhost    → localhost:5175 (Main Site)
    ├─ admin.localhost   → localhost:5176 (Admin App)
    └─ tenant.localhost  → localhost:5177 (Tenant App)
         ↓
    All apps proxy /api → localhost:3001 (Backend)
```

