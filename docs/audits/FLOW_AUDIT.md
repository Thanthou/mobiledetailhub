# Backend Flow Tracer Audit Report

**Generated:** 2025-10-25T21:01:15.883Z
**Duration:** 345ms
**Score:** 58/100

---

## Summary

- ✅ **Passed:** 10
- ⚠️  **Warnings:** 14
- ❌ **Errors:** 0

## Description

Complete backend flow analysis: maps all HTTP request paths, builds call graph, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **Unreachable files: 13**
   - Details: These files are not imported from any entry point

2. **  schemas\validation\admin.schemas.js**
   - Details: Has exports but not imported

3. **  schemas\validation\analytics.schemas.js**
   - Details: Has exports but not imported

4. **  schemas\validation\auth.schemas.js**
   - Details: Has exports but not imported

5. **  schemas\validation\common.js**
   - Details: Has exports but not imported

6. **  schemas\validation\domains.schemas.js**
   - Details: Has exports but not imported

7. **  schemas\validation\errors.schemas.js**
   - Details: Has exports but not imported

8. **  schemas\validation\images.schemas.js**
   - Details: Has exports but not imported

9. **  schemas\validation\payments.schemas.js**
   - Details: Has exports but not imported

10. **  schemas\validation\reputation.schemas.js**
   - Details: Has exports but not imported

11. **  schemas\validation\schedule.schemas.js**
   - Details: Has exports but not imported

12. **  schemas\validation\services.schemas.js**
   - Details: Has exports but not imported

13. **  schemas\validation\tenants.schemas.js**
   - Details: Has exports but not imported

14. **  schemas\validation\website.schemas.js**
   - Details: Has exports but not imported

---

## Detailed Log


## Phase 1: File Discovery

✅ Found 108 files to analyze

## Phase 2: AST Parsing

✅ Successfully parsed 108 files

## Phase 3: Path Alias Resolution


## Phase 4: Call Graph Construction

✅ Built call graph with 108 nodes

## Phase 5: Reachability Analysis

✅ Reachability analysis complete

## Phase 6: Graph Export

✅ Graph exported as JSON: docs\audits\FLOW_GRAPH.json
✅ Graph exported as DOT: docs\audits\FLOW_GRAPH.dot

## File Discovery

✅ Discovered 108 backend files

## Entry Points

✅ Entry point: server.js

## HTTP Endpoints

✅ Discovered 224 HTTP endpoints

## Reachability Analysis

✅ Reachable files: 90/108 (83.3%)
⚠️ **WARNING**: Unreachable files: 13
⚠️ **WARNING**:   schemas\validation\admin.schemas.js
⚠️ **WARNING**:   schemas\validation\analytics.schemas.js
⚠️ **WARNING**:   schemas\validation\auth.schemas.js
⚠️ **WARNING**:   schemas\validation\common.js
⚠️ **WARNING**:   schemas\validation\domains.schemas.js
⚠️ **WARNING**:   schemas\validation\errors.schemas.js
⚠️ **WARNING**:   schemas\validation\images.schemas.js
⚠️ **WARNING**:   schemas\validation\payments.schemas.js
⚠️ **WARNING**:   schemas\validation\reputation.schemas.js
⚠️ **WARNING**:   schemas\validation\schedule.schemas.js
⚠️ **WARNING**:   schemas\validation\services.schemas.js
⚠️ **WARNING**:   schemas\validation\tenants.schemas.js
⚠️ **WARNING**:   schemas\validation\website.schemas.js

## Dependency Analysis


---

## Recommendations

1. ⚠️ PRIORITY: Investigate 13 unreachable files
2. Review unreachable files - they may be dead code that can be removed
3. Ensure all route handlers are properly connected to controllers/services
4. Consider refactoring files with high import counts (>10) to reduce coupling
5. Monitor files imported by many others - changes will have wide impact
6. Use this flow map for impact analysis before making changes
