Perfect. Here’s your **Cursor-ready master plan** — formatted for direct use inside Cursor or your repo root as `MIGRATION_PLAN.md`.
It includes sections, code blocks, and checklists Cursor can interpret as discrete steps.

---

# 🧭 MIGRATION_PLAN.md

**That Smart Site — 3-Layer Architecture Migration Guide**

---

## 🎯 **Goal**

Refactor the platform into a clean, scalable **three-layer architecture**:

1. **Admin / Main-site layer** → Marketing, onboarding, and dashboard
2. **Tenant layer** → White-label websites for each client
3. **Shared layer** → Reusable logic, hooks, and UI

This plan preserves all functionality while improving modularity, build stability, and Render deploy reliability.

---

# 🧱 **Phase 1 — Folder Reorganization & Aliasing (Safe / 0 Risk)**

### 🎯 Objective

Create the clean folder layout and add TypeScript/Vite aliases without touching app logic.

### ✅ Steps

1. **Create folder structure**

   ```
   frontend/src/
     admin-app/
     tenant-app/
     main-site/
     shared/
   ```

2. **Move existing code**

   * Move your admin files → `admin-app/`
   * Move tenant files → `tenant-app/`
   * Create `shared/` and move pure hooks, utils, and UI.

   Examples:

   ```
   /src/hooks/useMobileDetection.ts → /src/shared/hooks/useMobileDetection.ts
   /src/utils/api.ts → /src/shared/utils/api.ts
   /src/components/Button.tsx → /src/shared/ui/Button.tsx
   ```

3. **Add aliases in `vite.config.ts`**

   ```ts
   resolve: {
     alias: {
       '@shared': path.resolve(__dirname, 'src/shared'),
       '@admin':  path.resolve(__dirname, 'src/admin-app'),
       '@tenant': path.resolve(__dirname, 'src/tenant-app'),
     }
   }
   ```

4. **Update imports**

   * Replace `@/shared` → `@shared`
   * Verify all references compile.

5. **Build test**

   ```bash
   npm run dev
   npm run build
   ```

   ✅ If both apps still build, Phase 1 complete.

---

# ⚡ **Phase 2 — Multi-Entry Build Setup (Low Risk)**

### 🎯 Objective

Ensure each app outputs its own static bundle (`dist/admin`, `dist/tenant`, `dist/main`).

### ✅ Steps

1. **Edit `vite.config.ts`**

   ```ts
   build: {
     outDir: 'dist',
     rollupOptions: {
       input: {
         main:   path.resolve(__dirname, 'src/main-site/index.html'),
         admin:  path.resolve(__dirname, 'src/admin-app/index.html'),
         tenant: path.resolve(__dirname, 'src/tenant-app/index.html'),
       },
       output: {
         chunkFileNames: 'assets/[name]-[hash].js',
         entryFileNames: '[name]/[name]-[hash].js',
         assetFileNames: 'assets/[name]-[hash][extname]',
       },
     },
   }
   ```

2. **Verify output**
   After `npm run build`:

   ```
   dist/
     admin/index.html
     tenant/index.html
     main/index.html
   ```

3. **Simplify Render build**

   ```yaml
   buildCommand: |
     echo "==> Building full platform"
     cd backend && npm install && cd ../frontend
     npm install --include=dev
     npm run build
     echo "==> Copying builds"
     rm -rf ../backend/public
     mkdir -p ../backend/public/{main,admin,tenant}
     cp -r dist/main/*   ../backend/public/main/
     cp -r dist/admin/*  ../backend/public/admin/
     cp -r dist/tenant/* ../backend/public/tenant/
   ```

4. **Local validation**

   ```bash
   npm run build && node ../backend/server.js
   ```

   Visit `/admin`, `/tenant/test`, `/` → all load.

---

# 🧠 **Phase 3 — Provider & Router Hygiene (Medium Risk)**

### 🎯 Objective

Guarantee exactly **one Router** and proper Provider stack per app.

### ✅ Steps

1. **Admin entry**

   ```tsx
   // admin-app/main.tsx
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <BrowserRouter>
       <Providers>
         <App />
       </Providers>
     </BrowserRouter>
   );
   ```

2. **Tenant entry**
   Same structure; only one `<BrowserRouter>`.

3. **Create app-specific Providers**

   ```
   admin-app/providers.tsx
   tenant-app/providers.tsx
   ```

   Example:

   ```tsx
   export const Providers = ({ children }: PropsWithChildren) => (
     <ErrorBoundary>
       <AuthProvider>
         <DataProvider>
           <TenantConfigProvider>
             {children}
           </TenantConfigProvider>
         </DataProvider>
       </AuthProvider>
     </ErrorBoundary>
   );
   ```

4. **Fix `useData()` errors**
   Wrap global modals or components that call `useData()` inside `<DataProvider>`.

5. **Debug Routers (optional)**

   ```ts
   export const useRouterDebug = (name: string) =>
     console.log(`[RouterDebug] ${name} in router?`, useInRouterContext());
   ```

6. **Test**

   * No “Router inside Router” errors
   * No “useData must be used within a DataProvider”

---

# 🌐 **Phase 4 — Express Routing & API Cleanup (Low Risk)**

### 🎯 Objective

Serve each SPA from its folder and ensure APIs respond with JSON.

### ✅ Steps

1. **Reorder routes**

   ```js
   app.use('/api', apiRouter);

   app.use('/tenant', express.static('public/tenant'));
   app.get('/tenant/*', (_, res) =>
     res.sendFile(path.join(__dirname, 'public/tenant/index.html'))
   );

   app.use('/admin', express.static('public/admin'));
   app.get('/admin/*', (_, res) =>
     res.sendFile(path.join(__dirname, 'public/admin/index.html'))
   );

   app.use('/', express.static('public/main'));
   app.get('/*', (_, res) =>
     res.sendFile(path.join(__dirname, 'public/main/index.html'))
   );
   ```

2. **Fix frontend fetches**
   Replace all plain `/gallery`, `/reviews` calls with `/api/gallery`, `/api/reviews`.

3. **Smoke-test**

   ```bash
   curl https://localhost:10000/api/health
   ```

   should return JSON, not HTML.

---

# 🏗️ **Phase 5 — Subdomain Routing (Future Enhancement)**

### 🎯 Objective

Enable tenant access via `slug.thatsmartsite.com`.

### ✅ Steps

1. **Middleware**

   ```js
   app.use((req, res, next) => {
     const sub = req.hostname.split('.')[0];
     if (sub && sub !== 'www' && sub !== 'thatsmartsite') {
       req.tenantSlug = sub;
       return res.sendFile(path.join(__dirname, 'public/tenant/index.html'));
     }
     next();
   });
   ```

2. **Tenant loader**

   ```js
   app.use(async (req, _, next) => {
     if (req.tenantSlug)
       req.tenant = await TenantService.getBySlug(req.tenantSlug);
     next();
   });
   ```

3. **Custom domains (optional)**
   Validate incoming host → map to tenant record.

---

# 🧩 **Phase 6 — CI/CD Sanity Checks & Automation**

### 🎯 Objective

Add automated verification that all static builds exist before deploy.

### ✅ Steps

1. **Create `scripts/test-deploy.js`**

   ```js
   import fs from 'fs';
   const files = [
     'backend/public/admin/index.html',
     'backend/public/tenant/index.html',
     'backend/public/main/index.html',
   ];
   for (const f of files)
     console.log(fs.existsSync(f) ? `✅ Found: ${f}` : `❌ Missing: ${f}`);
   ```

2. **Hook into Render**

   ```yaml
   postBuildCommand: node scripts/test-deploy.js
   ```

3. **Run**
   Push to branch `refactor/3-layer-architecture`; deploy manually; check logs for all ✅.

---

# 📊 **Phase Summary**

| Phase | Description             | Risk        | Est. Time | Key Output                     |
| ----- | ----------------------- | ----------- | --------- | ------------------------------ |
| 1     | Folder reorg + aliasing | 🟢 None     | 1-2 hrs   | Clean layout                   |
| 2     | Multi-entry build       | 🟢 Low      | 1-2 hrs   | `dist/admin`, `tenant`, `main` |
| 3     | Provider cleanup        | 🟠 Medium   | 2-4 hrs   | No nested Routers              |
| 4     | Express routing         | 🟢 Low      | 1 hr      | Proper JSON routes             |
| 5     | Subdomain support       | 🟢 Optional | 1 hr      | Future scaling                 |
| 6     | CI/CD checks            | 🟢 Low      | 30 min    | Verified deploy                |

---

# ✅ **Final Deliverables**

* Modular frontend (`admin`, `tenant`, `main`)
* Stable Router and Provider structure
* Reliable Render deployment
* Clean API/static separation
* Ready for custom domains and subdomains

---

> **Tip:** work branch-by-branch
> `git checkout -b refactor/phase1-structure` → complete → commit → move to next phase.

---

Would you like me to also generate a **companion file (`render.yaml`)** aligned with this plan (with the new simplified build + post-build checks)?
