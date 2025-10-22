# 🚧 Work-in-Progress Features

Features in this directory are **production-quality code** that isn't yet integrated into the application.

---

## Current WIP Features

| Feature | Owner | Created | Target | Reason Not Integrated |
|---------|-------|---------|--------|----------------------|
| _(none yet)_ | - | - | - | - |

---

## Guidelines

### When to use `features-wip/`

- ✅ Feature code is complete and tested
- ✅ Waiting for external dependencies (API, design, etc.)
- ✅ Ready to wire into routes within 1-2 months
- ✅ Code is production-quality

### When NOT to use `features-wip/`

- ❌ Quick prototype/spike → Use `features-experimental/` instead
- ❌ Feature is integrated but disabled → Use feature flags instead
- ❌ Code isn't production-ready → Keep in feature branch until it is

---

## Adding a WIP Feature

1. Create feature directory with clear name
2. Add `README.md` with status, owner, and integration plan
3. Build feature as if it were production-ready
4. List it in the table above
5. Set a target integration date (< 2 months)

**Example README template:**

```markdown
# Feature Name

**Status:** 🚧 Work-in-Progress  
**Owner:** @username  
**Created:** YYYY-MM-DD  
**Target Integration:** YYYY-MM-DD

## Description
Brief description of what this feature does.

## Why Not Integrated Yet?
- [ ] Waiting for backend API endpoints
- [ ] Design review in progress  
- [ ] Performance optimization needed

## Integration Checklist
- [ ] Backend API ready
- [ ] Add routes to TenantApp.tsx
- [ ] Add tests
- [ ] Move to src/components/
```

---

## Promoting to Stable

When ready to integrate:

1. **Move to components:**
   ```bash
   git mv src/features-wip/my-feature src/components/my-feature
   ```

2. **Add routes in TenantApp.tsx**

3. **Update this README** (remove from table)

4. **Run audits** to ensure no issues

---

## Review Schedule

- **Weekly:** Check if any features are ready for integration
- **Monthly:** Review if features are on track for target dates
- **Quarterly:** Archive or delete features > 3 months old

---

See: [Feature Maturity System](../../../../docs/devtools/FEATURE_MATURITY_SYSTEM.md)

