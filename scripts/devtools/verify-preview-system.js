#!/usr/bin/env node

/**
 * Preview System Verification Script
 * 
 * Checks that all components of the preview system are properly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const { green, red, yellow, blue, reset, bold } = colors;

console.log(`${bold}${blue}🔍 Preview System Verification${reset}\n`);

let allChecksPassed = true;

// Check 1: Backend preview routes file
console.log(`${bold}1. Backend Preview Routes${reset}`);
const previewRoutesPath = path.join(ROOT_DIR, 'backend/routes/previews.js');
if (fs.existsSync(previewRoutesPath)) {
  console.log(`${green}✓${reset} backend/routes/previews.js exists`);
} else {
  console.log(`${red}✗${reset} backend/routes/previews.js missing`);
  allChecksPassed = false;
}

// Check 2: Preview token utility
console.log(`\n${bold}2. Preview Token Utility${reset}`);
const previewTokenPath = path.join(ROOT_DIR, 'backend/utils/previewToken.js');
if (fs.existsSync(previewTokenPath)) {
  const content = fs.readFileSync(previewTokenPath, 'utf-8');
  if (content.includes('export function signPreview') && content.includes('export function verifyPreview')) {
    console.log(`${green}✓${reset} backend/utils/previewToken.js uses ES modules`);
  } else {
    console.log(`${red}✗${reset} backend/utils/previewToken.js not converted to ES modules`);
    allChecksPassed = false;
  }
} else {
  console.log(`${red}✗${reset} backend/utils/previewToken.js missing`);
  allChecksPassed = false;
}

// Check 3: Server.js includes preview routes
console.log(`\n${bold}3. Backend Server Configuration${reset}`);
const serverPath = path.join(ROOT_DIR, 'backend/server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf-8');
  if (serverContent.includes("import previewRoutes from './routes/previews.js'")) {
    console.log(`${green}✓${reset} Preview routes imported in server.js`);
  } else {
    console.log(`${red}✗${reset} Preview routes not imported in server.js`);
    allChecksPassed = false;
  }
  if (serverContent.includes("app.use('/api/previews', previewRoutes)")) {
    console.log(`${green}✓${reset} Preview routes registered in server.js`);
  } else {
    console.log(`${red}✗${reset} Preview routes not registered in server.js`);
    allChecksPassed = false;
  }
} else {
  console.log(`${red}✗${reset} backend/server.js missing`);
  allChecksPassed = false;
}

// Check 4: Tenant app preview components
console.log(`\n${bold}4. Tenant App Preview Components${reset}`);
const previewPagePath = path.join(ROOT_DIR, 'frontend/apps/tenant-app/src/components/PreviewPage.tsx');
const previewHookPath = path.join(ROOT_DIR, 'frontend/apps/tenant-app/src/hooks/usePreviewParams.ts');
const previewDataPath = path.join(ROOT_DIR, 'frontend/apps/tenant-app/src/data/previewMockData.ts');

if (fs.existsSync(previewPagePath)) {
  console.log(`${green}✓${reset} PreviewPage.tsx exists`);
} else {
  console.log(`${red}✗${reset} PreviewPage.tsx missing`);
  allChecksPassed = false;
}

if (fs.existsSync(previewHookPath)) {
  console.log(`${green}✓${reset} usePreviewParams.ts exists`);
} else {
  console.log(`${red}✗${reset} usePreviewParams.ts missing`);
  allChecksPassed = false;
}

if (fs.existsSync(previewDataPath)) {
  console.log(`${green}✓${reset} previewMockData.ts exists`);
  
  // Count industries
  const dataContent = fs.readFileSync(previewDataPath, 'utf-8');
  const industries = ['mobile-detailing', 'house-cleaning', 'lawncare', 'pet-grooming', 'barber'];
  let foundIndustries = 0;
  industries.forEach(industry => {
    if (dataContent.includes(`'${industry}':`)) {
      foundIndustries++;
    }
  });
  console.log(`${green}✓${reset} Found ${foundIndustries}/5 industry templates`);
  if (foundIndustries < 5) {
    console.log(`${yellow}⚠${reset} Some industries may be missing data`);
  }
} else {
  console.log(`${red}✗${reset} previewMockData.ts missing`);
  allChecksPassed = false;
}

// Check 5: Tenant app routes
console.log(`\n${bold}5. Tenant App Routing${reset}`);
const tenantAppPath = path.join(ROOT_DIR, 'frontend/apps/tenant-app/src/TenantApp.tsx');
if (fs.existsSync(tenantAppPath)) {
  const tenantAppContent = fs.readFileSync(tenantAppPath, 'utf-8');
  if (tenantAppContent.includes('import PreviewPage from')) {
    console.log(`${green}✓${reset} PreviewPage imported in TenantApp.tsx`);
  } else {
    console.log(`${red}✗${reset} PreviewPage not imported in TenantApp.tsx`);
    allChecksPassed = false;
  }
  
  const previewRoutes = [
    '/mobile-detailing-preview',
    '/house-cleaning-preview',
    '/lawncare-preview',
    '/pet-grooming-preview',
    '/barber-preview'
  ];
  
  let routesFound = 0;
  previewRoutes.forEach(route => {
    if (tenantAppContent.includes(`path="${route}"`)) {
      routesFound++;
    }
  });
  
  if (routesFound === previewRoutes.length) {
    console.log(`${green}✓${reset} All ${previewRoutes.length} preview routes registered`);
  } else {
    console.log(`${yellow}⚠${reset} Only ${routesFound}/${previewRoutes.length} preview routes found`);
    allChecksPassed = false;
  }
} else {
  console.log(`${red}✗${reset} TenantApp.tsx missing`);
  allChecksPassed = false;
}

// Check 6: Main site dev dashboard
console.log(`\n${bold}6. Main Site Dev Dashboard${reset}`);
const devDashboardPath = path.join(ROOT_DIR, 'frontend/apps/main-site/src/components/DevDashboard.tsx');
if (fs.existsSync(devDashboardPath)) {
  const dashboardContent = fs.readFileSync(devDashboardPath, 'utf-8');
  if (dashboardContent.includes('tenant.localhost:5177')) {
    console.log(`${green}✓${reset} Industry links point to tenant.localhost:5177`);
  } else if (dashboardContent.includes('localhost:5179')) {
    console.log(`${yellow}⚠${reset} Industry links still point to old port 5179`);
    allChecksPassed = false;
  } else {
    console.log(`${red}✗${reset} Industry links not configured correctly`);
    allChecksPassed = false;
  }
} else {
  console.log(`${red}✗${reset} DevDashboard.tsx missing`);
  allChecksPassed = false;
}

// Check 7: Port registry
console.log(`\n${bold}7. Port Registry${reset}`);
const portRegistryPath = path.join(ROOT_DIR, '.port-registry.json');
if (fs.existsSync(portRegistryPath)) {
  const registry = JSON.parse(fs.readFileSync(portRegistryPath, 'utf-8'));
  console.log(`${green}✓${reset} .port-registry.json exists`);
  console.log(`   Main: ${registry.main?.host || 'N/A'}:${registry.main?.port || 'N/A'}`);
  console.log(`   Admin: ${registry.admin?.host || 'N/A'}:${registry.admin?.port || 'N/A'}`);
  console.log(`   Tenant: ${registry.tenant?.host || 'N/A'}:${registry.tenant?.port || 'N/A'}`);
  console.log(`   Backend: ${registry.backend?.host || 'N/A'}:${registry.backend?.port || 'N/A'}`);
  
  if (registry.tenant?.port !== 5177) {
    console.log(`${yellow}⚠${reset} Tenant port is not 5177`);
  }
  if (registry.tenant?.host !== 'tenant.localhost') {
    console.log(`${yellow}⚠${reset} Tenant host is not tenant.localhost`);
  }
} else {
  console.log(`${yellow}⚠${reset} .port-registry.json missing (optional)`);
}

// Check 8: Documentation
console.log(`\n${bold}8. Documentation${reset}`);
const docsPath = path.join(ROOT_DIR, 'docs/frontend/PREVIEW_SYSTEM_SETUP.md');
if (fs.existsSync(docsPath)) {
  console.log(`${green}✓${reset} PREVIEW_SYSTEM_SETUP.md exists`);
} else {
  console.log(`${yellow}⚠${reset} Documentation missing (optional)`);
}

// Summary
console.log(`\n${bold}${'='.repeat(60)}${reset}`);
if (allChecksPassed) {
  console.log(`${bold}${green}✅ All checks passed!${reset}`);
  console.log(`\n${bold}Next Steps:${reset}`);
  console.log(`1. Ensure hosts file includes: 127.0.0.1 tenant.localhost`);
  console.log(`2. Start backend: cd backend && npm run dev`);
  console.log(`3. Start main site: cd frontend && npm run dev:main`);
  console.log(`4. Start tenant app: cd frontend && npm run dev:tenant`);
  console.log(`5. Visit: http://localhost:5175`);
  console.log(`6. Click any industry card to see preview`);
} else {
  console.log(`${bold}${red}❌ Some checks failed${reset}`);
  console.log(`\nPlease review the errors above and fix them.`);
  process.exit(1);
}

console.log(`\n${bold}Preview URLs:${reset}`);
console.log(`• Mobile Detailing: ${blue}http://tenant.localhost:5177/mobile-detailing-preview${reset}`);
console.log(`• House Cleaning: ${blue}http://tenant.localhost:5177/house-cleaning-preview${reset}`);
console.log(`• Lawn Care: ${blue}http://tenant.localhost:5177/lawncare-preview${reset}`);
console.log(`• Pet Grooming: ${blue}http://tenant.localhost:5177/pet-grooming-preview${reset}`);
console.log(`• Barber Shop: ${blue}http://tenant.localhost:5177/barber-preview${reset}`);
console.log();

