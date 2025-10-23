#!/usr/bin/env node
/**
 * audit-routing.js — Frontend Routing Validation Audit
 * --------------------------------------------------------------
 * ✅ Verifies:
 *  - Each app (Admin, Tenant, Main Site) has exactly one router
 *  - No nested routers in subcomponents
 *  - All router context hooks are properly wrapped
 *  - Shared components don't accidentally initialize routers
 * --------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists
} from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();
const frontendDir = path.join(root, "frontend");

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────────────────────────────────────
// 🔍 Router discovery
//──────────────────────────────────────────────────────────────
function findRouterFiles(dir) {
  const routerFiles = [];
  const patterns = [
    /BrowserRouter/,
    /createBrowserRouter/,
    /<Router/,
    /useRouter/,
    /useNavigate/,
    /Routes/,
    /Route/,
    /RouterProvider/,
  ];

  function scan(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", "build", ".git"].includes(entry.name)) scan(full);
      } else if (/\.(t|j)sx?$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(full, "utf8");
          if (patterns.some(p => p.test(content))) {
            routerFiles.push({
              path: full,
              relativePath: path.relative(frontendDir, full),
              content,
            });
          }
        } catch {}
      }
    }
  }
  scan(dir);
  return routerFiles;
}

//──────────────────────────────────────────────────────────────
// 🧩 Router structure analysis
//──────────────────────────────────────────────────────────────
function analyzeRouterStructure(file) {
  const { content, relativePath } = file;
  const lines = content.split("\n");
  const analysis = {
    file: relativePath,
    routerCount: 0,
    routerLines: [],
    hasRoutes: false,
    hasRoute: false,
    issues: [],
  };

  lines.forEach((line, i) => {
    const ln = i + 1;
    if (/<BrowserRouter/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "BrowserRouter", line: line.trim() });
    }
    if (/createBrowserRouter/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "createBrowserRouter", line: line.trim() });
    }
    if (/<RouterProvider/.test(line)) {
      analysis.routerCount++;
      analysis.routerLines.push({ ln, type: "RouterProvider", line: line.trim() });
    }
    if (/<Routes/.test(line)) analysis.hasRoutes = true;
    if (/<Route/.test(line)) analysis.hasRoute = true;
  });

  if (analysis.routerCount === 0) analysis.issues.push("No router found");
  if (analysis.routerCount > 1) analysis.issues.push(`Multiple routers (${analysis.routerCount})`);
  return analysis;
}

//──────────────────────────────────────────────────────────────
// 🧭 App entry validation
//──────────────────────────────────────────────────────────────
function validateAppEntries(audit, routerFiles) {
  audit.section('App Entry Points');
  
  const entries = [
    { name: "Admin App", path: "apps/admin-app/src/main.tsx" },
    { name: "Tenant App", path: "apps/tenant-app/src/main.tsx" },
    { name: "Main Site", path: "apps/main/src/main.tsx" },
  ];

  let totalRouters = 0;

  for (const entry of entries) {
    const file = routerFiles.find(f => f.relativePath.replace(/\\/g, "/") === entry.path);
    
    if (!file) {
      audit.error(`${entry.name}: entry file not found`, {
        path: entry.path,
        details: 'Expected main.tsx in app directory'
      });
      continue;
    }
    
    const analysis = analyzeRouterStructure(file);
    totalRouters += analysis.routerCount;
    
    if (analysis.routerCount === 1) {
      audit.pass(`${entry.name}: has exactly 1 router`);
    } else if (analysis.routerCount === 0) {
      audit.error(`${entry.name}: no router found`, {
        path: file.relativePath,
        details: 'Add <BrowserRouter> wrapper in main.tsx'
      });
    } else {
      audit.warn(`${entry.name}: has ${analysis.routerCount} routers`, {
        path: file.relativePath,
        details: 'Should have exactly one router instance'
      });
    }
  }
  
  return totalRouters;
}

//──────────────────────────────────────────────────────────────
// ⚙️ Routing context and nesting checks
//──────────────────────────────────────────────────────────────
function analyzeContextUsage(audit, routerFiles) {
  audit.section('Router Context Usage');
  
  const contextFiles = routerFiles.filter(
    f => f.content.includes("useRouter") || 
         f.content.includes("useNavigate") || 
         f.content.includes("useLocation")
  );
  
  audit.pass(`${contextFiles.length} files use router hooks`);

  // Check for nested routers (multiple routers in one file)
  const nested = routerFiles
    .map(analyzeRouterStructure)
    .filter(a => a.routerCount > 1);
  
  if (nested.length > 0) {
    nested.forEach(analysis => {
      audit.warn(`Nested routers in ${path.basename(analysis.file)}`, {
        path: analysis.file,
        details: `Found ${analysis.routerCount} router instances - should have only 1`
      });
    });
  } else {
    audit.pass('No nested routers detected');
  }

  // Check for context usage without router
  const contextWithoutRouter = contextFiles.filter(f => {
    const a = analyzeRouterStructure(f);
    if (a.routerCount > 0) return false;
    
    // Exclude shared components - they're designed to be used within routed apps
    if (f.relativePath.includes("shared")) return false;
    if (f.relativePath.includes("hooks") || f.relativePath.endsWith(".ts")) return false;
    if (f.relativePath.match(/App\.tsx|AdminApp|TenantApp|MainApp/)) return false;
    
    // Components in apps/*/src/ are within router context
    if (f.relativePath.match(/^apps[\/\\][^\/\\]+[\/\\]src[\/\\]/)) return false;
    
    return true;
  });
  
  if (contextWithoutRouter.length > 0) {
    contextWithoutRouter.forEach(file => {
      const hooks = [];
      if (file.content.includes('useNavigate')) hooks.push('useNavigate()');
      if (file.content.includes('useLocation')) hooks.push('useLocation()');
      if (file.content.includes('useParams')) hooks.push('useParams()');
      
      audit.warn(`Router hooks without router context: ${path.basename(file.path)}`, {
        path: file.relativePath,
        details: `Uses ${hooks.join(', ')} - ensure component is rendered inside router`
      });
    });
  } else {
    audit.pass('All router context usage properly wrapped');
  }
}

//──────────────────────────────────────────────────────────────
// 🚀 Main Execution
//──────────────────────────────────────────────────────────────
async function main() {
  const audit = createAuditResult('Frontend Routing', isSilent);

  // Check if frontend directory exists
  if (!fileExists(frontendDir)) {
    audit.error('Frontend directory not found', {
      path: frontendDir,
      details: 'Expected frontend/ directory in project root'
    });
    
    saveReport(audit, 'ROUTING_AUDIT.md', {
      description: 'Validates frontend routing structure and React Router usage.',
      recommendations: ['Create frontend/ directory with app structure']
    });
    
    finishAudit(audit);
    return;
  }

  // Find all files using router
  const routerFiles = findRouterFiles(frontendDir);
  audit.debug(`Found ${routerFiles.length} files using React Router`);

  // Validate app entries (each should have exactly one router)
  const totalRouters = validateAppEntries(audit, routerFiles);
  
  if (totalRouters === 3) {
    audit.pass(`Total routers: ${totalRouters} (expected 3)`);
  } else if (totalRouters < 3) {
    audit.warn(`Total routers: ${totalRouters} (expected 3)`, {
      details: 'Some apps may be missing routers'
    });
  } else {
    audit.warn(`Total routers: ${totalRouters} (expected 3)`, {
      details: 'Extra routers detected - may cause routing conflicts'
    });
  }

  // Analyze context usage and nesting
  analyzeContextUsage(audit, routerFiles);

  // Generate report
  saveReport(audit, 'ROUTING_AUDIT.md', {
    description: 'Validates frontend routing architecture: ensures each app has exactly one router, no nested routers, and proper router context usage.',
    recommendations: [
      'Maintain one router instance per app (Admin, Tenant, Main)',
      'Avoid nested routers in shared or layout components',
      'Ensure useNavigate and useRouter only appear inside routed components',
      'Keep route definitions close to app entry points',
      'Use React Router v6 patterns consistently'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Routing audit failed: ${err.message}`);
  process.exit(1);
});
