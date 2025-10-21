#!/usr/bin/env node
/**
 * audit-performance.js — Frontend Performance Audit
 * --------------------------------------------------------------
 * ✅ Analyzes:
 *  - Route loading strategy (lazy vs eager)
 *  - Bundle sizes and chunking
 *  - Component size distribution
 *  - Performance issues & recommendations
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists,
  formatBytes
} from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend/src");
const distDir = path.join(root, "frontend/dist");

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🔍 Route and Component Discovery
//──────────────────────────────────────────────────────────────
function findRouteDefinitions() {
  const routeFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", "build"].includes(entry.name)) walk(full);
      } else if (/\.(t|j)sx?$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf8");
        if (/Route|createRoutesFromElements|path=/.test(content))
          routeFiles.push({
            path: full,
            relativePath: path.relative(frontendDir, full),
            content,
          });
      }
    }
  }
  walk(frontendDir);
  return routeFiles;
}

function analyzeRoutePatterns(routeFiles) {
  const routes = [];
  for (const file of routeFiles) {
    const routeTags = file.content.match(/<Route\s+[^>]*path=["']([^"']+)["']/g) || [];
    const lazy = /React\.lazy|import\(/.test(file.content);
    const suspense = /<Suspense/.test(file.content);
    for (const tag of routeTags) {
      const match = tag.match(/path=["']([^"']+)["']/);
      if (match)
        routes.push({
          file: file.relativePath,
          path: match[1],
          isLazy: lazy,
          hasSuspense: suspense,
        });
    }
  }
  return routes;
}

function analyzeBundleSizes() {
  if (!fs.existsSync(distDir)) {
    return { bundles: [], totalSizeKB: 0, error: true };
  }

  const bundles = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith(".js")) {
        const size = fs.statSync(full).size;
        bundles.push({
          name: e.name,
          path: path.relative(distDir, full),
          sizeKB: Math.round(size / 1024),
          isVendor: /vendor|node_modules/.test(e.name),
          isChunk: /chunk/.test(e.name),
        });
      }
    }
  }
  walk(distDir);
  const totalSizeKB = bundles.reduce((s, b) => s + b.sizeKB, 0);
  return { bundles, totalSizeKB, error: false };
}

function findComponentFiles(dir, arr = []) {
  if (!fs.existsSync(dir)) return arr;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!["node_modules", "dist", "build", ".next", "__tests__"].includes(e.name))
        findComponentFiles(full, arr);
    } else if (/\.(tsx|ts)$/.test(e.name) && !/\.test\./.test(e.name)) {
      arr.push(full);
    }
  }
  return arr;
}

function countLines(fp) {
  try {
    return fs.readFileSync(fp, "utf8").split("\n").length;
  } catch {
    return 0;
  }
}

function analyzeComponents() {
  const files = findComponentFiles(frontendDir);
  const comps = files.map(f => ({
    path: path.relative(frontendDir, f),
    lines: countLines(f),
  }));
  const large = comps.filter(c => c.lines >= 200);
  const huge = comps.filter(c => c.lines >= 750);
  return { comps, large, huge };
}

//──────────────────────────────────────────────────────────────
// ⚙️ Performance Checks
//──────────────────────────────────────────────────────────────
function runPerformanceChecks(audit, routes, bundles, compData) {
  audit.section('Route Loading Strategy');
  
  const lazyRoutes = routes.filter(r => r.isLazy).length;
  const eagerRoutes = routes.filter(r => !r.isLazy).length;
  
  audit.pass(`Total routes: ${routes.length} (${lazyRoutes} lazy, ${eagerRoutes} eager)`);
  
  if (eagerRoutes > 10) {
    audit.warn(`${eagerRoutes} eager routes found`, {
      details: 'Consider converting non-critical routes to lazy-loaded'
    });
  } else {
    audit.pass('Route loading strategy is efficient');
  }
  
  const missingSuspense = routes.filter(r => r.isLazy && !r.hasSuspense);
  if (missingSuspense.length > 0) {
    audit.error(`${missingSuspense.length} lazy routes missing Suspense boundary`, {
      details: 'Wrap lazy routes with <Suspense> for smoother UX'
    });
  } else if (lazyRoutes > 0) {
    audit.pass('All lazy routes have Suspense boundaries');
  }

  // Bundle size checks
  audit.section('Bundle Sizes');
  
  if (bundles.error) {
    audit.warn('Build directory not found', {
      details: 'Run: npm run build to generate bundles'
    });
  } else {
    const totalMB = (bundles.totalSizeKB / 1024).toFixed(2);
    audit.pass(`Total bundle size: ${totalMB}MB across ${bundles.bundles.length} files`);
    
    const largeBundles = bundles.bundles.filter(b => b.sizeKB > 500);
    if (largeBundles.length > 0) {
      largeBundles.forEach(bundle => {
        audit.error(`Large bundle: ${bundle.name} (${bundle.sizeKB}KB)`, {
          path: bundle.path,
          details: 'Use dynamic imports and code splitting to reduce size'
        });
      });
    } else {
      audit.pass('All bundles under 500KB threshold');
    }
  }

  // Component size checks
  audit.section('Component Sizes');
  
  audit.pass(`Total components: ${compData.comps.length}`);
  audit.debug(`  Large (200+ lines): ${compData.large.length}`);
  audit.debug(`  Huge (750+ lines): ${compData.huge.length}`);
  
  if (compData.huge.length > 0) {
    compData.huge.forEach(comp => {
      audit.error(`Huge component: ${path.basename(comp.path)} (${comp.lines} lines)`, {
        path: comp.path,
        details: 'Split into smaller, focused components for maintainability'
      });
    });
  } else if (compData.large.length > 0) {
    const topLarge = compData.large
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 3);
    
    topLarge.forEach(comp => {
      if (comp.lines >= 500) {
        audit.warn(`Large component: ${path.basename(comp.path)} (${comp.lines} lines)`, {
          path: comp.path,
          details: 'Consider refactoring for better maintainability'
        });
      }
    });
    
    if (compData.large.length - topLarge.length > 0) {
      audit.debug(`  ... and ${compData.large.length - topLarge.length} more large components`);
    }
  } else {
    audit.pass('All components under 200 lines');
  }
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
function runPerformanceAudit() {
  const audit = createAuditResult('Performance', isSilent);

  // Check if frontend directory exists
  if (!fileExists(frontendDir)) {
    audit.error('Frontend source directory not found', {
      path: frontendDir,
      details: 'Expected frontend/src/ directory'
    });
    
    saveReport(audit, 'PERFORMANCE_AUDIT.md', {
      description: 'Frontend not found - cannot analyze performance.',
      recommendations: ['Create frontend/ directory structure']
    });
    
    finishAudit(audit);
    return;
  }

  // Run analyses
  const routeFiles = findRouteDefinitions();
  const routes = analyzeRoutePatterns(routeFiles);
  const bundleData = analyzeBundleSizes();
  const compData = analyzeComponents();

  // Run checks
  runPerformanceChecks(audit, routes, bundleData, compData);

  // Generate report
  saveReport(audit, 'PERFORMANCE_AUDIT.md', {
    description: 'Analyzes frontend performance: route loading strategy, bundle sizes, and component complexity.',
    recommendations: [
      'Use dynamic imports and lazy loading for large chunks',
      'Convert non-critical routes to lazy-loaded with React.lazy()',
      'Wrap lazy routes with <Suspense> for smoother UX',
      'Refactor components over 500 lines into smaller, focused units',
      'Use code splitting to reduce initial bundle size',
      'Monitor bundle sizes during development: npm run build',
      'Consider using React.memo() for expensive components'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

runPerformanceAudit();
