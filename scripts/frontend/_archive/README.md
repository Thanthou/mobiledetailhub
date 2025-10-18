# Archived Scripts

These scripts were experimental or one-off utilities that are no longer actively used.

## Button Refactor Scripts (Archived 2025-10-08)

### Why Archived:

These were experimentation scripts for migrating to a shared Button component. The refactoring is now complete, so these scripts are no longer needed.

**Scripts:**
- `find-button-patterns.js` - Found button patterns to refactor
- `batch-refactor-buttons.js` - Batch automated refactoring
- `simple-button-refactor.js` - Simple pattern replacements

**Status:** Refactoring complete, using `@/shared/ui/buttons/Button` and form primitives

### When to Use Archived Scripts:

- ✅ Reference for future large-scale refactorings
- ✅ Learning from past approaches
- ❌ Don't run these on current code (already refactored)

### Clean Up:

If you're confident you won't need these for reference, you can delete the entire `_archive/` directory:

```bash
rm -rf scripts/frontend/_archive
```

