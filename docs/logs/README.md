# Logs Directory

This directory stores debug and audit logs from development and testing.

## 📝 What Goes Here

- **Audit logs** - Output from SEO, performance, and dependency audits
- **Debug logs** - Verbose output from scripts run with `--debug` flag
- **Test logs** - Output from test runs and validation scripts

## 🔧 Usage

When running audit scripts, redirect output here:

### PowerShell
```powershell
node scripts/audits/audit-seo.js --debug 2>&1 | Tee-Object docs/logs/seo-audit-debug.log
```

### Bash
```bash
node scripts/audits/audit-seo.js --debug 2>&1 | tee docs/logs/seo-audit-debug.log
```

## 🗑️ Cleanup

These files are git-ignored and can be safely deleted. They're for local debugging only.

```powershell
# Clean all logs
Remove-Item docs/logs/*.log
```

## 📂 Recommended Naming

- `audit-debug.log` - General audit output
- `seo-audit-debug.log` - SEO-specific audits
- `performance-debug.log` - Performance testing
- `schema-validation.log` - Schema validation runs
- `build-debug.log` - Build process debugging

---

**All `.log` files in this directory are automatically ignored by git.**

