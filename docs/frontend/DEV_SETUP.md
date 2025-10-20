# 🚀 Development Setup Guide

## **Quick Start**

```bash
# Install all dependencies
npm run install:all

# Start all apps (main, admin, tenant, backend, dev hub)
npm run dev:all
```

## **What Gets Started**

| App | URL | Purpose |
|-----|-----|---------|
| **Main Site** | `http://main.localhost:8080` | Marketing + Onboarding |
| **Admin App** | `http://admin.localhost:8080` | Platform Management |
| **Tenant App** | `http://tenant.localhost:8080` | Business Websites |
| **Backend** | `http://localhost:3001+` | API Server |
| **Dev Hub** | `http://localhost:8080` | Central Router |

## **Required: Hosts File Setup**

Add these entries to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1 main.localhost
127.0.0.1 admin.localhost  
127.0.0.1 tenant.localhost
```

## **Individual App Commands**

```bash
# Start just the main site
npm run dev:main

# Start just the admin app  
npm run dev:admin

# Start just the tenant app
npm run dev:tenant

# Start just the dev hub
npm run dev:hub

# Start all frontend apps (no backend)
npm run dev:apps
```

## **How It Works**

1. **Port Discovery**: Each app finds a free port automatically
2. **Port Registry**: All ports are tracked in `.port-registry.json`
3. **Dev Hub**: Routes requests based on hostname
4. **Cross-Links**: Admin/Tenant buttons work via hostname routing

## **Troubleshooting**

### Port Conflicts
```bash
# Kill all Node processes
npm run predev:all

# Or manually
node scripts/automation/cleanup/kill-node-processes.js
```

### Registry Issues
```bash
# Clear port registry
node scripts/automation/port-registry.js clear
```

### Check Port Status
```bash
# View current port assignments
node scripts/read-port.js main
node scripts/read-port.js admin  
node scripts/read-port.js tenant
```

## **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Site     │    │   Admin App     │    │   Tenant App    │
│   Port: 5175+   │    │   Port: 5176+   │    │   Port: 5177+   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Dev Hub       │
                    │   Port: 8080    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend       │
                    │   Port: 3001+   │
                    └─────────────────┘
```

## **Production vs Development**

- **Development**: All apps run on localhost with different ports
- **Production**: Each app runs on its own subdomain
  - `thatsmartsite.com` → Main Site
  - `admin.thatsmartsite.com` → Admin App
  - `business-name.thatsmartsite.com` → Tenant App
