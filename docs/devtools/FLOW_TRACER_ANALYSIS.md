# Flow Tracer Analysis & Proposal

**Date**: October 21, 2025  
**Context**: That Smart Site - Multi-tenant SaaS Platform  
**Purpose**: Design a comprehensive flow tracing system to map all execution paths, detect unreachable code, and validate architectural rules

---

## 1. User's Vision

### The Core Problem
"I want a 'man in the machine' that traces every possible path a user could take through the system."

### Specific Goals
1. **Capture all possible flow paths** from entry points through the entire system
2. **Track execution smartly** - build a complete call graph and control flow map
3. **Rule Validation** - Detect violations of architectural boundaries
4. **Reachability Analysis** - Find code that isn't reachable from any entry point
5. **Purpose Verification** - For unreachable code, determine if it serves a purpose or is dead code

### Use Cases
- **Architecture Enforcement**: Ensure apps don't import from each other
- **Dead Code Detection**: Find orphaned files, unused routes, unreferenced components
- **Documentation**: Generate complete system flow maps for new developers
- **Debugging**: Trace request → middleware → route → controller → service → database paths
- **Security Auditing**: Identify all paths to sensitive operations
- **Refactoring Safety**: Know what will break if you remove/change something

---

## 2. Current State Analysis

### Existing Audit Tools

#### ✅ `audit-boundaries.js`
**What it does:**
- Scans all import statements in frontend code
- Validates architectural rules (apps can't import from each other)
- Checks shared/bootstrap layer purity

**What it doesn't do:**
- Doesn't trace execution flow
- Doesn't identify unreachable code
- Only analyzes static imports, not runtime behavior

#### ✅ `audit-routes.js`
**What it does:**
- Scans backend route files for code quality issues
- Detects pattern violations (console.log, missing error handlers)
- Validates consistency (import syntax, response formats)

**What it doesn't do:**
- Doesn't map actual request flows
- Doesn't trace middleware chains
- Doesn't connect routes to controllers/services

#### ✅ `audit-routing.js`
**What it does:**
- Finds React Router instances
- Validates router context usage
- Detects nested routers

**What it doesn't do:**
- Doesn't enumerate all frontend routes
- Doesn't map route → component relationships
- Doesn't trace user navigation paths

#### ✅ Other Tools Available
- **Madge**: Dependency graph visualization, circular dependency detection
- **Depcheck**: Finds unused npm dependencies
- **ESLint**: Static code analysis, pattern enforcement

### The Gap

**Current tools check individual concerns in isolation.**

**Missing: Holistic system-wide flow analysis that:**
1. Starts from entry points (`backend/server.js`, `frontend/apps/*/src/main.tsx`)
2. Builds complete call graph (who calls what)
3. Identifies all reachable code
4. Flags unreachable code
5. Maps user journey paths (HTTP request → response, page navigation → component tree)
6. Validates flows against architectural rules

---

## 3. Technical Requirements

### Entry Points to Analyze

#### Backend Entry Points
- `backend/server.js` - Express server initialization
- Middleware chain (order matters!)
- All route handlers in `backend/routes/*.js`
- Controllers in `backend/controllers/*.js`
- Services in `backend/services/*.js`

#### Frontend Entry Points
- `frontend/apps/main-site/index.html` → `src/main.tsx` → `MainSiteApp.tsx`
- `frontend/apps/admin-app/index.html` → `src/main.tsx` → `AdminApp.tsx`
- `frontend/apps/tenant-app/index.html` → `src/main.tsx` → `TenantApp.tsx`

### Flow Types to Trace

#### 1. HTTP Request Flow (Backend)
```
Browser Request
  ↓
server.js (line 288-314: subdomain routing)
  ↓
Middleware Chain (CORS, logging, subdomain, tenant resolver)
  ↓
Route Handler (backend/routes/*.js)
  ↓
Controller (backend/controllers/*.js)
  ↓
Service (backend/services/*.js)
  ↓
Database Query
  ↓
Response JSON
```

#### 2. Frontend Route Flow
```
User navigates to /admin/dashboard
  ↓
React Router matches route
  ↓
Component renders
  ↓
useEffect hooks run
  ↓
API calls to backend
  ↓
State updates
  ↓
Re-render with data
```

#### 3. Component Tree Flow
```
main.tsx
  ↓
MainSiteApp.tsx
  ↓
Routes definition
  ↓
Page components
  ↓
Shared components
  ↓
Hooks (useAuth, useApi, etc.)
```

### Analysis Outputs Needed

#### 1. Call Graph
- **Format**: Directed graph (adjacency list or matrix)
- **Nodes**: Files, functions, components, routes
- **Edges**: "calls", "imports", "renders"
- **Attributes**: Entry point distance, call depth, dependency count

#### 2. Reachability Report
- **Reachable Code**: Everything accessible from entry points
- **Unreachable Code**: Exists in codebase but no path leads to it
- **Orphaned Files**: Not imported by anything
- **Orphaned Routes**: Defined but not registered in Express/React Router

#### 3. Flow Documentation
- **Request Path Maps**: All HTTP endpoints with full middleware/handler chain
- **Page Navigation Maps**: All frontend routes with component hierarchies
- **API Call Matrix**: Which frontend components call which backend endpoints

#### 4. Violation Report
- **Architectural Violations**: Cross-app imports, boundary breaches
- **Dead Code**: Files/functions that can't be reached
- **Suspicious Patterns**: Routes without middleware, components without parents

---

## 4. Proposed Solution

### Approach: Static Code Analysis + AST Parsing

**Why static analysis?**
- Can analyze entire codebase without running it
- No need for instrumentation or runtime overhead
- Can detect unreachable paths that runtime tracing might miss
- Faster and more comprehensive than dynamic analysis

### Tool Architecture

```
┌─────────────────────────────────────────────────────┐
│          Flow Tracer Core Engine                    │
├─────────────────────────────────────────────────────┤
│  1. File Discovery                                  │
│     - Scan backend/routes, controllers, services    │
│     - Scan frontend/apps, shared, bootstrap         │
│                                                      │
│  2. AST Parser                                      │
│     - Parse JS/TS files into abstract syntax trees  │
│     - Extract imports, exports, function calls      │
│     - Identify route definitions, component renders │
│                                                      │
│  3. Graph Builder                                   │
│     - Build call graph from parsed data             │
│     - Track import relationships                    │
│     - Map middleware chains                         │
│     - Trace React component hierarchy               │
│                                                      │
│  4. Reachability Analyzer                          │
│     - Start from entry points                       │
│     - BFS/DFS traversal of call graph               │
│     - Mark all reachable nodes                      │
│     - Flag unreachable nodes                        │
│                                                      │
│  5. Rule Validator                                  │
│     - Check flows against .cursorrules              │
│     - Detect cross-app imports in call paths        │
│     - Validate middleware ordering                  │
│                                                      │
│  6. Report Generator                                │
│     - Visual flow diagrams (Mermaid/DOT)            │
│     - Markdown reports                              │
│     - JSON output for programmatic use              │
│     - Interactive HTML dashboard                    │
└─────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Backend Flow Tracer
**Goal**: Map all HTTP request flows from `server.js` to database

**Steps:**
1. Parse `backend/server.js` to extract:
   - Middleware registration order
   - Static file serving rules
   - Route mounting points
   
2. Parse `backend/routes/*.js` to extract:
   - All route definitions (GET, POST, PUT, DELETE)
   - Middleware applied to each route
   - Controller/handler function names
   
3. Parse `backend/controllers/*.js` to extract:
   - All exported functions
   - Service imports and calls
   
4. Parse `backend/services/*.js` to extract:
   - All exported functions
   - Database queries
   
5. Build graph:
   - Node types: middleware, route, controller, service
   - Edge types: "uses", "calls", "chains_to"
   
6. Generate report:
   - All HTTP endpoints with full call chain
   - Middleware execution order per endpoint
   - Unreachable routes/controllers/services
   - Orphaned files

#### Phase 2: Frontend Flow Tracer
**Goal**: Map all frontend routes and component trees

**Steps:**
1. Parse each `apps/*/src/main.tsx` to find:
   - Router initialization
   - Root component
   
2. Parse each app's main component to extract:
   - Route definitions (<Route> components)
   - Page components mapped to routes
   
3. Parse each page component to extract:
   - Imported shared components
   - Hook usage
   - API calls (fetch, axios, apiCall)
   
4. Parse shared components/hooks recursively
   
5. Build graph:
   - Node types: route, page, component, hook
   - Edge types: "renders", "uses", "calls_api"
   
6. Generate report:
   - All frontend routes per app
   - Component hierarchy per route
   - Unreachable components
   - API call matrix

#### Phase 3: Full-Stack Flow Integration
**Goal**: Connect frontend API calls to backend endpoints

**Steps:**
1. Extract all frontend API calls:
   - `fetch('/api/...')`
   - `apiCall('/api/...')`
   - `axios.get('/api/...')`
   
2. Match with backend routes
   
3. Build integrated graph:
   - Show complete user journey: route → component → API call → backend route → service → DB
   
4. Generate report:
   - End-to-end flow diagrams
   - Frontend-to-backend dependency matrix

#### Phase 4: Continuous Monitoring
**Goal**: Run flow tracer as part of CI/CD

**Steps:**
1. Create npm script: `npm run audit:flows`
2. Integrate with existing audit suite
3. Git pre-commit hook to detect new violations
4. CI pipeline check (fail on architectural violations)

---

## 5. Technical Challenges & Solutions

### Challenge 1: Dynamic Imports
**Problem**: `import()` statements can't be statically analyzed  
**Solution**: 
- Flag dynamic imports for manual review
- Use heuristics (e.g., all files in `routes/` directory are probably loaded)
- Add annotation system for developers to mark intentional dynamic imports

### Challenge 2: Callback Hell & Promises
**Problem**: Tracing async call chains is complex  
**Solution**:
- Focus on direct function calls first
- Use convention-based heuristics (controllers call services)
- Add explicit annotations where needed

### Challenge 3: React Component Composition
**Problem**: Components can be passed as props, making static analysis hard  
**Solution**:
- Trace common patterns (children, render props)
- Flag complex patterns for manual review
- Focus on route → page component mapping first

### Challenge 4: Middleware Ordering
**Problem**: Middleware execution order affects behavior  
**Solution**:
- Parse middleware registration order in `server.js`
- Maintain ordered list
- Validate middleware dependencies (e.g., auth before protected routes)

### Challenge 5: Performance at Scale
**Problem**: Large codebase = slow analysis  
**Solution**:
- Cache AST parsing results
- Incremental analysis (only re-analyze changed files)
- Parallel processing where possible

---

## 6. Alternative Approaches

### Option A: Runtime Instrumentation
**How it works**: Add logging/tracing to actual code execution  
**Pros**: Accurate, captures runtime behavior  
**Cons**: 
- Requires running the app
- Only traces paths actually executed
- Performance overhead
- Requires test coverage to hit all paths

**Verdict**: Not suitable for this use case

### Option B: Use Existing Tools
**Madge + Custom Analysis**
- Use Madge for dependency graph
- Build custom layer on top for reachability

**Pros**: Leverage proven tool  
**Cons**: Madge doesn't understand Express routes or React Router

**Verdict**: Good complement, but not sufficient alone

### Option C: TypeScript Compiler API
**How it works**: Use TypeScript's built-in parser  
**Pros**: Official, robust, handles all TS features  
**Cons**: More complex API, might be overkill  

**Verdict**: Consider for Phase 2+ if needed

### Option D: Hybrid Approach (RECOMMENDED)
**Combine:**
- Static analysis for code structure
- Madge for dependency graphs
- Custom parsers for Express/React Router specifics
- Manual annotations for complex patterns

---

## 7. Deliverables

### Immediate (Phase 1)
1. **Script**: `scripts/audits/audit-flows.js`
2. **Report**: `docs/audits/FLOW_AUDIT.md`
3. **Outputs**:
   - List of all HTTP endpoints with full call chain
   - List of unreachable backend files
   - Middleware execution order per route
   - Architectural violations in backend flows

### Near-Term (Phase 2)
1. **Frontend flow analysis**
2. **Report**: Extended FLOW_AUDIT.md
3. **Outputs**:
   - All frontend routes per app
   - Component tree per route
   - Unreachable frontend components
   - Shared component usage matrix

### Future (Phase 3+)
1. **Interactive dashboard** (HTML/React)
2. **Visual flow diagrams** (Mermaid or D3.js)
3. **CI/CD integration**
4. **Real-time monitoring**

---

## 8. Open Questions for Discussion

1. **Scope**: Should we trace down to individual function calls within services, or stop at service level?

2. **Annotations**: Should developers be required to annotate complex dynamic patterns, or should the tool be fully automatic?

3. **Thresholds**: What constitutes "dead code"? A file not imported by anything? A function not called in last 6 months?

4. **Output Format**: What's most useful?
   - Markdown reports (current standard)
   - JSON (programmatic consumption)
   - Interactive HTML dashboard
   - Mermaid diagrams
   - DOT graphs for GraphViz

5. **Performance**: How fast does this need to be? Real-time on every file save, or batch overnight?

6. **Integration**: Should this be:
   - Standalone tool run manually
   - Pre-commit hook (blocking)
   - CI pipeline check (blocking or warning)
   - Continuous background service

7. **Granularity**: Do we need to trace:
   - Line-by-line execution paths (control flow)?
   - Just file-to-file dependencies?
   - Function-level call graph?
   - Component-level for frontend?

---

## 9. Comparison with User's Original Vision

### ✅ What This Achieves
1. **"Capture all possible flow paths"** → ✅ Complete call graph from entry points
2. **"Track execution smartly"** → ✅ BFS/DFS traversal with intelligent caching
3. **"See if anything violates rules"** → ✅ Rule validation integrated
4. **"See if other code doesn't make it in"** → ✅ Reachability analysis
5. **"Does it serve a purpose"** → ✅ Dead code detection with context

### ⚠️ Limitations
- Static analysis can't capture all runtime behavior
- Dynamic imports require manual annotation
- Complex callback patterns might be missed
- Doesn't replace unit tests or runtime profiling

### 🎯 Recommendation
**Start with Phase 1 (Backend Flow Tracer)** as a proof of concept:
- Clear, well-defined scope
- Immediate value (map all API endpoints)
- Test feasibility of approach
- Iterate based on results before expanding to frontend

---

## 10. Next Steps

### If Approved:
1. **Review this analysis** with team/ChatGPT for feedback
2. **Decide on scope** (Phase 1 only, or all phases?)
3. **Choose output formats** (markdown, JSON, HTML dashboard?)
4. **Set success criteria** (what does "done" look like?)
5. **Begin implementation** of Phase 1

### Questions to Answer:
- Is the proposed architecture sound?
- Are there tools/libraries we should leverage?
- What's the priority order of deliverables?
- Should this replace or complement existing audit tools?

---

## Appendix: Technical Stack for Implementation

### Recommended Libraries

#### AST Parsing
- **acorn** or **@babel/parser**: JavaScript/JSX parsing
- **@typescript-eslint/parser**: TypeScript parsing
- **espree**: ESLint's parser (already in project)

#### Graph Analysis
- **graphlib**: Graph data structures and algorithms
- **madge**: Dependency graph (already in project)

#### Pattern Matching
- **Regex**: For quick pattern detection
- **AST traversal**: For accurate analysis

#### Visualization
- **mermaid**: Flowchart generation (markdown-compatible)
- **graphviz**: DOT format graphs
- **d3.js**: Interactive diagrams (if building dashboard)

#### Reporting
- **chalk**: Colored terminal output (already in project)
- **cli-table3**: Formatted tables (already in project)
- **markdown-table**: Generate markdown tables

---

**End of Analysis**

This document is open for review, critique, and improvement. Please share with ChatGPT or other team members for additional perspectives.

