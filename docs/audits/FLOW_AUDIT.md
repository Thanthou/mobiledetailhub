# Backend Flow Tracer Audit Report

**Generated:** 2025-10-25T07:26:14.978Z
**Duration:** 361ms
**Score:** 100/100

---

## Summary

- ✅ **Passed:** 11
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 0

## Description

Complete backend flow analysis: maps all HTTP request paths, builds call graph, identifies unreachable code.

## ✅ All Checks Passed!

No issues found during this audit.

---

## Detailed Log


## Phase 1: File Discovery

✅ Found 95 files to analyze

## Phase 2: AST Parsing

✅ Successfully parsed 95 files

## Phase 3: Path Alias Resolution


## Phase 4: Call Graph Construction

✅ Built call graph with 95 nodes

## Phase 5: Reachability Analysis

✅ Reachability analysis complete

## Phase 6: Graph Export

✅ Graph exported as JSON: docs\audits\FLOW_GRAPH.json
✅ Graph exported as DOT: docs\audits\FLOW_GRAPH.dot

## File Discovery

✅ Discovered 95 backend files

## Entry Points

✅ Entry point: server.js

## HTTP Endpoints

✅ Discovered 224 HTTP endpoints

## Reachability Analysis

✅ Reachable files: 90/95 (94.7%)
✅ All files are reachable from entry points

## Dependency Analysis


---

## Recommendations

1. Review unreachable files - they may be dead code that can be removed
2. Ensure all route handlers are properly connected to controllers/services
3. Consider refactoring files with high import counts (>10) to reduce coupling
4. Monitor files imported by many others - changes will have wide impact
5. Use this flow map for impact analysis before making changes
