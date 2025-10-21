# Routing Validation Audit
Generated: 2025-10-21T10:09:50.186Z

## 📊 Score: 100/100

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
- Files using context without router: 0

✅ All router context usage properly wrapped

---

## ⚠️ Issues
✅ No issues found

---

## 📝 Recommendations
- Maintain one router instance per app.
- Avoid nested routers in shared or layout components.
- Ensure useNavigate and useRouter only appear inside routed components.
- Keep route definitions close to app entry points.
