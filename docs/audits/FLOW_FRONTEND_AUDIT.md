# Frontend Flow Tracer Audit Report

**Generated:** 2025-10-21T22:46:07.045Z
**Duration:** 1249ms
**Score:** 100/100

---

## Summary

- ✅ **Passed:** 7
- ⚠️  **Warnings:** 0
- ❌ **Errors:** 0

## Description

Complete frontend flow analysis: maps React component dependencies, validates architectural boundaries, identifies unreachable code.

## ✅ All Checks Passed!

No issues found during this audit.

---

## Detailed Log

Apps: main-site

## Phase 1: File Discovery

✅ Found 875 TypeScript/TSX files

## Phase 2: AST Parsing

✅ All files parsed successfully

## Phase 3: Graph Construction

✅ Built dependency graph with 875 nodes

## Phase 4: App Analysis

✅ main-site: 155 reachable files
✅ main-site: No boundary violations
✅ main-site: No unreachable app files
✅ main-site: Report saved to docs\audits\FLOW_FRONTEND_MAIN_SITE.md

## Phase 5: Report Generation


---

## Recommendations

1. Review boundary violations - they violate architectural rules
2. Investigate unreachable files - they may be dead code
3. Consider consolidating duplicate components across apps
4. Use this flow map for impact analysis before making changes
