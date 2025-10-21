# META REPORT
Generated: 2025-10-21T09:46:51.684Z
Node: v24.3.0
Reports: consolidated to ≤10 files

## .CURSORRULES SNAPSHOT
{
  "version": 2,
  "metadata": {
    "project": "That Smart Site (Multi-Tenant SaaS)",
    "description": "That Smart Site is a white-label SaaS platform that generates websites for local service businesses (detailing, lawn care, maid service, pet grooming, etc.). Each tenant gets their own live subdomain site, managed via a multi-app frontend (main-site, tenant-app, admin-app) and Node.js/Express backend. The goal is modularity, maintainability, and automated provisioning at scale.",
    "architecture": "frontend (3 separate React apps) + backend (Express + PostgreSQL, multi-tenant schemas)",
    "philosophy": [
      "Code should be clean, predictable, and testable.",
      "Each app must remain independent yet interoperable through shared modules.",
      "Side effects live in hooks or services; pure logic lives in utils.",
      "Frontend apps follow feature-first structure with strict import boundaries.",
      "Automation scripts (audits, deploys, etc.) follow consistent doc and output structure."
    ]
  },

  "structure": {
    "frontend": {
      "apps": [
        {
          "name": "main-site",
          "purpose": "Public marketing + onboarding app. Handles signup, pricing, and tenant provisioning.",
          "entry": "frontend/src/main-site/MainSiteApp.tsx"
        },
        {
          "name": "tenant-app",
          "purpose": "Live tenant website for clients. Loads dynamic content and booking flows per subdomain.",
          "entry": "frontend/src/tenant-app/TenantApp.tsx"
        },
        {
          "name": "admin-app",
          "purpose": "Dashboard for tenants to manage sites, analytics, and SEO health.",
          "entry": "frontend/src/admin-app/AdminApp.tsx"
        }
      ],
      "shared": "frontend/src/shared/",
      "bootstrap": "frontend/src/bootstrap/",
      "rules": [
        {
          "pattern": "frontend/src/(main-site|tenant-app|admin-app)/**",
          "mustImportFrom": [
            "frontend/src/shared/**",
            "frontend/src/bootstrap/**"
          ],
          "forbidImportsFrom": [
            "frontend/src/(main-site|tenant-app|admin-app)/**"
          ],
          "rationale": "Apps may depend on shared or bootstrap layers, but never import from each other."
        },
        {
          "pattern": "frontend/src/shared/**",
          "forbidImportsFrom": [
            "frontend/src/(main-site|tenant-app|admin-app)/**"
          ],
          "rationale": "Shared layer must remain pure and reusable."
        },
        {
          "pattern": "frontend/src/bootstrap/**",
          "forbidImportsFrom": [
            "frontend/src/(main-site|tenant-app|admin-app)/**"
          ],
          "rationale": "Bootstrap layer initializes contexts and shells, not app-specific logic."
        }
      ]
    },

    "backend": {
      "base": "backend/",
      "rules": [
        {
          "pattern": "backend/controllers/**",
          "mustImportFrom": [
            "backend/services/**",
            "backend/middleware/**"
          ],
          "rationale": "Controllers should orchestrate, not contain business logic."
        },
        {
          "pattern": "backend/services/**",
          "forbidImportsFrom": [
            "backend/controllers/**"
          ],
          "rationale": "Services provide reusable logic and data access, independent of route handling."
        },
        {
          "pattern": "backend/middleware/**",
          "rationale": "Middleware handles authentication, tenants, validation, and logging. Should not call controllers directly."
        }
      ]
    },

    "scripts": {
      "base": "scripts/",
      "rules": [
        {
          "pattern": "scripts/audits/**",
          "purpose": "Automated health and SEO audits. Must output reports to docs/audits."
        },
        {
          "pattern": "scripts/devtools/**",
          "purpose": "Developer utilities (lint, fixers, metrics, snapshot generation). No runtime dependencies."
        },
        {
          "pattern": "scripts/automation/**",
          "purpose": "Deployment and cron jobs. Should log clearly and write to docs/logs."
        }
      ]
    }
  },

  "frontend_philosophy": [
    "Use React + TypeScript exclusively; keep components small, pure, and composable.",
    "Hooks handle all side effects; utils remain pure functions.",
    "UI components go in shared/ui with Tailwind and shadcn conventions.",
    "Each app entrypoint (AdminApp, TenantApp, MainSiteApp) owns its own routing, layout, and providers.",
    "Global state uses Zustand or Context Providers; never cross app boundaries."
  ],

  "backend_philosophy": [
    "Express routes are grouped by feature domain (auth, tenants, payments, SEO).",
    "Each route → controller → service → database chain must remain unidirectional.",
    "withTenant and tenantResolver handle schema routing at
