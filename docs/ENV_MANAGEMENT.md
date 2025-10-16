# Environment Management

This guide defines a single, consistent approach to environment variables across the app. It complements existing validated loaders on both sides and aligns names to avoid drift.

- Runtime boundaries: frontend (browser, Vite) vs backend (Node/Express)
- Validation: zod-based schemas already exist in both runtimes
- Principle: same semantic names, prefixed appropriately for the frontend

---

## Frontend (Vite) – `frontend/src/shared/env.ts`
- Variables must be prefixed with `VITE_` to be exposed to the client.
- Already validated and exported via:
  - `isDevelopment`, `isProduction`, `mode`
  - `apiUrl`, `apiBaseUrl`, `apiUrls.local`, `apiUrls.live`
  - Third-party keys (e.g., `VITE_STRIPE_PUBLISHABLE_KEY`)

Recommended usage pattern:
- In development, prefer relative URLs to leverage the Vite proxy (set `apiUrl` to an empty string). This is already implemented.
- In production, set `VITE_API_URL_LIVE` (or `VITE_API_BASE_URL`) and let components/hooks consume `config.apiUrl`.

Canonical names (frontend):
- `VITE_API_URL` – explicit API root override
- `VITE_API_URL_LOCAL` – local API root (e.g., `http://localhost:3001`)
- `VITE_API_URL_LIVE` – production API root
- `VITE_STRIPE_PUBLISHABLE_KEY` – Stripe public key

Notes:
- Do not hardcode host:ports in code paths; rely on `config.apiUrl` or relative URLs to the Vite proxy.

---

## Backend (Node) – `backend/config/env.js`
- Uses zod to validate required secrets and configuration.
- Canonical names (backend):
  - `NODE_ENV` – `development` | `staging` | `production`
  - `PORT` – default `3001`
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_KID`
  - Optional: `ALLOWED_ORIGINS` (comma-separated)
  - Service keys (e.g., `STRIPE_SECRET_KEY`, email provider keys)

Notes:
- Minimum length enforced for JWT secrets.
- Cookies and JWT settings centralized via `backend/config/auth.js`.

---

## Naming Alignment

| Purpose                  | Frontend (Vite)             | Backend (Node)           |
|--------------------------|-----------------------------|--------------------------|
| API base URL             | `VITE_API_URL[_LIVE|_LOCAL]`| `PORT`, ingress maps URL |
| Environment mode         | `MODE`, `DEV`, `PROD`       | `NODE_ENV`               |
| Stripe keys              | `VITE_STRIPE_PUBLISHABLE_KEY`| `STRIPE_SECRET_KEY`     |
| JWT                      | n/a (never in FE)           | `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_KID` |

Rules:
- Secrets never appear in the frontend.
- Frontend-only keys use `VITE_` prefix.
- Shared semantic meaning, different variable names when necessary due to runtime.

---

## Dev vs Prod Behavior

- Development:
  - Frontend uses relative `/api` via Vite proxy (configured in `vite.config.ts`).
  - `config.apiUrl` resolves to empty string, so API clients build relative URLs.
  - Backend runs on `PORT=3001`; prestart script frees the port automatically.

- Production:
  - Frontend uses absolute API URL via `VITE_API_URL_LIVE`.
  - Backend trusts `NODE_ENV=production` for cookie security and logging format.

---

## Best Practices

- Validate at load time with zod (already implemented both sides).
- Read once, pass down: do not sprinkle `import.meta.env`/`process.env` across the codebase.
- Keep secrets server-side only.
- Prefer relative URLs in dev to avoid CORS drift and hardcoded hosts.

---

## Quick Checklist

- Frontend
  - [x] `frontend/src/shared/env.ts` exports `config` used by API clients and hooks
  - [x] Relative URLs in dev (empty `apiUrl`) to use Vite proxy

- Backend
  - [x] `backend/config/env.js` validates JWT and service keys
  - [x] `backend/config/auth.js` centralizes auth-related settings

If you add a new integration, add its vars here and to the corresponding zod loader (frontend or backend).
