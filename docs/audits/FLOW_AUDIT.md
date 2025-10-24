# Backend Flow Tracer Audit Report

**Generated:** 2025-10-24T06:47:19.948Z
**Duration:** 340ms
**Score:** 94/100

---

## Summary

- ✅ **Passed:** 10
- ⚠️  **Warnings:** 2
- ❌ **Errors:** 0

## Description

Complete backend flow analysis: maps all HTTP request paths, builds call graph, identifies unreachable code.

## Issues Found

### 🟡 Warnings

1. **Unreachable files: 1**
   - Details: These files are not imported from any entry point

2. **  routes\subdomainTest.js**
   - Details: Has exports but not imported

---

## Detailed Log


## Phase 1: File Discovery

✅ Found 93 files to analyze

## Phase 2: AST Parsing

✅ Successfully parsed 93 files

## Phase 3: Path Alias Resolution


## Phase 4: Call Graph Construction

✅ Built call graph with 93 nodes

## Phase 5: Reachability Analysis

✅ Reachability analysis complete

## Phase 6: Graph Export

✅ Graph exported as JSON: docs\audits\FLOW_GRAPH.json
✅ Graph exported as DOT: docs\audits\FLOW_GRAPH.dot

## File Discovery

✅ Discovered 93 backend files

## Entry Points

✅ Entry point: server.js

## HTTP Endpoints

✅ Discovered 215 HTTP endpoints

## Reachability Analysis

✅ Reachable files: 88/93 (94.6%)
⚠️ **WARNING**: Unreachable files: 1
⚠️ **WARNING**:   routes\subdomainTest.js

## Dependency Analysis


---

## Recommendations

1. ⚠️ PRIORITY: Investigate 1 unreachable files
2. Review unreachable files - they may be dead code that can be removed
3. Ensure all route handlers are properly connected to controllers/services
4. Consider refactoring files with high import counts (>10) to reduce coupling
5. Monitor files imported by many others - changes will have wide impact
6. Use this flow map for impact analysis before making changes
