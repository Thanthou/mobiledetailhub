# Routing Validation Audit
Generated: 2025-10-19T09:35:34.085Z

## 📊 Score: 95/100

### Summary
- Total Router Files: undefined
- Total Routers: 3
- Expected: 3 (one per app)

### App Entries
- Admin App: ✅ Valid (1 routers)
- Tenant App: ✅ Valid (1 routers)
- Main Site: ✅ Valid (1 routers)

### Router Context
- Files using router context: 12
- Files with multiple routers: 0
- Files using context without router: 8

### ⚠️ Files using router context without router
- admin-app\components\preview\components\PreviewCTAButton.tsx
- admin-app\components\preview\pages\PreviewGeneratorPage.tsx
- admin-app\components\tenantOnboarding\components\SuccessPage.tsx
- shared\ui\layout\LoginPage.tsx
- tenant-app\components\booking\components\BookingFlowController.tsx
- tenant-app\components\header\components\DevNavigation.tsx
- tenant-app\components\header\components\UserMenu.tsx
- tenant-app\components\services\components\ServiceCard.tsx

---

## ⚠️ Issues
✅ No issues found

---

## 📝 Recommendations
- Maintain one router instance per app.
- Avoid nested routers in shared or layout components.
- Ensure useNavigate and useRouter only appear inside routed components.
- Keep route definitions close to app entry points.
