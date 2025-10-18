#!/usr/bin/env node
/**
 * Phase 3.2: Routing Validation Audit
 * Scans frontend for router instances and validates single router per app
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, '..', 'frontend', 'src');

/**
 * Find all files containing router-related code
 */
function findRouterFiles(dir) {
  const routerFiles = [];
  const routerPatterns = [
    /BrowserRouter/,
    /createBrowserRouter/,
    /<Router/,
    /useRouter/,
    /useNavigate/,
    /Routes/,
    /Route/,
    /RouterProvider/
  ];

  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
          // Skip node_modules and other irrelevant directories
          if (!['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
            scanDirectory(fullPath);
          }
        } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts') || item.name.endsWith('.jsx') || item.name.endsWith('.js'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if file contains router patterns
            const hasRouterCode = routerPatterns.some(pattern => pattern.test(content));
            
            if (hasRouterCode) {
              routerFiles.push({
                path: fullPath,
                relativePath: path.relative(frontendDir, fullPath),
                content: content
              });
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  scanDirectory(dir);
  return routerFiles;
}

/**
 * Analyze router structure in a file
 */
function analyzeRouterStructure(file) {
  const { content, relativePath } = file;
  const lines = content.split('\n');
  
  const analysis = {
    file: relativePath,
    hasBrowserRouter: false,
    hasCreateBrowserRouter: false,
    hasRouterProvider: false,
    hasRoutes: false,
    hasRoute: false,
    routerCount: 0,
    routerLines: [],
    issues: []
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for BrowserRouter
    if (/<BrowserRouter/.test(line)) {
      analysis.hasBrowserRouter = true;
      analysis.routerCount++;
      analysis.routerLines.push({ line: lineNumber, content: line.trim(), type: 'BrowserRouter' });
    }
    
    // Check for createBrowserRouter
    if (/createBrowserRouter/.test(line)) {
      analysis.hasCreateBrowserRouter = true;
      analysis.routerCount++;
      analysis.routerLines.push({ line: lineNumber, content: line.trim(), type: 'createBrowserRouter' });
    }
    
    // Check for RouterProvider
    if (/<RouterProvider/.test(line)) {
      analysis.hasRouterProvider = true;
      analysis.routerCount++;
      analysis.routerLines.push({ line: lineNumber, content: line.trim(), type: 'RouterProvider' });
    }
    
    // Check for Routes
    if (/<Routes/.test(line)) {
      analysis.hasRoutes = true;
    }
    
    // Check for Route
    if (/<Route/.test(line)) {
      analysis.hasRoute = true;
    }
  });

  // Identify issues
  if (analysis.routerCount === 0) {
    analysis.issues.push('No router found');
  } else if (analysis.routerCount > 1) {
    analysis.issues.push(`Multiple routers found (${analysis.routerCount})`);
  }

  return analysis;
}

/**
 * Validate app entry points
 */
function validateAppEntries(routerFiles) {
  const appEntries = [
    { name: 'Admin App', path: 'admin-app/main.tsx' },
    { name: 'Tenant App', path: 'tenant-app/main.tsx' },
    { name: 'Main Site', path: 'main-site/main.tsx' }
  ];

  const validation = {
    entries: [],
    totalRouters: 0,
    issues: []
  };

  for (const entry of appEntries) {
    const entryFile = routerFiles.find(f => f.relativePath.replace(/\\/g, '/') === entry.path);
    
    if (!entryFile) {
      validation.entries.push({
        name: entry.name,
        path: entry.path,
        status: 'missing',
        routerCount: 0,
        issues: ['Entry file not found']
      });
      validation.issues.push(`${entry.name}: Entry file missing`);
      continue;
    }

    const analysis = analyzeRouterStructure(entryFile);
    validation.totalRouters += analysis.routerCount;

    validation.entries.push({
      name: entry.name,
      path: entry.path,
      status: analysis.routerCount === 1 ? 'valid' : analysis.routerCount === 0 ? 'no-router' : 'multiple-routers',
      routerCount: analysis.routerCount,
      issues: analysis.issues,
      routerLines: analysis.routerLines
    });

    if (analysis.routerCount !== 1) {
      validation.issues.push(`${entry.name}: ${analysis.issues.join(', ')}`);
    }
  }

  return validation;
}

/**
 * Main audit function
 */
async function auditRouting() {
  console.log('🔍 Phase 3.2: Routing Validation Audit\n');

  // Find all router files
  console.log('1️⃣ Scanning for router files...');
  const routerFiles = findRouterFiles(frontendDir);
  console.log(`   Found ${routerFiles.length} files with router code\n`);

  // Analyze each router file
  console.log('2️⃣ Analyzing router structure...');
  const analyses = routerFiles.map(analyzeRouterStructure);
  
  // Group by app
  const adminFiles = analyses.filter(a => a.file.includes('admin-app'));
  const tenantFiles = analyses.filter(a => a.file.includes('tenant-app'));
  const mainFiles = analyses.filter(a => a.file.includes('main-site'));
  const sharedFiles = analyses.filter(a => !a.file.includes('admin-app') && !a.file.includes('tenant-app') && !a.file.includes('main-site'));

  console.log(`   Admin App files: ${adminFiles.length}`);
  console.log(`   Tenant App files: ${tenantFiles.length}`);
  console.log(`   Main Site files: ${mainFiles.length}`);
  console.log(`   Shared files: ${sharedFiles.length}\n`);

  // Validate app entries
  console.log('3️⃣ Validating app entry points...');
  const validation = validateAppEntries(routerFiles);

  for (const entry of validation.entries) {
    const status = entry.status === 'valid' ? '✅' : entry.status === 'no-router' ? '❌' : '⚠️';
    console.log(`   ${status} ${entry.name}: ${entry.routerCount} router(s)`);
    
    if (entry.issues.length > 0) {
      entry.issues.forEach(issue => console.log(`      - ${issue}`));
    }
    
    if (entry.routerLines && entry.routerLines.length > 0) {
      entry.routerLines.forEach(rl => {
        console.log(`      Line ${rl.line}: ${rl.content}`);
      });
    }
  }

  console.log(`\n4️⃣ Summary:`);
  console.log(`   Total router instances: ${validation.totalRouters}`);
  console.log(`   Expected: 3 (one per app)`);
  console.log(`   Status: ${validation.totalRouters === 3 ? '✅ Valid' : '❌ Invalid'}`);

  if (validation.issues.length > 0) {
    console.log(`\n⚠️  Issues found:`);
    validation.issues.forEach(issue => console.log(`   - ${issue}`));
  }

  // Check for potential router nesting
  console.log(`\n5️⃣ Checking for router nesting...`);
  const nestedRouters = analyses.filter(a => a.routerCount > 1);
  
  if (nestedRouters.length > 0) {
    console.log(`   ⚠️  Found ${nestedRouters.length} files with multiple routers:`);
    nestedRouters.forEach(nr => {
      console.log(`   - ${nr.file}: ${nr.routerCount} routers`);
    });
  } else {
    console.log(`   ✅ No router nesting detected`);
  }

  // Check for missing router context
  console.log(`\n6️⃣ Checking for router context usage...`);
  const contextFiles = routerFiles.filter(f => 
    f.content.includes('useRouter') || 
    f.content.includes('useNavigate') || 
    f.content.includes('useLocation')
  );

  console.log(`   Files using router context: ${contextFiles.length}`);
  
  const contextWithoutRouter = contextFiles.filter(f => {
    const analysis = analyzeRouterStructure(f);
    return analysis.routerCount === 0;
  });

  if (contextWithoutRouter.length > 0) {
    console.log(`   ⚠️  Files using router context without router:`);
    contextWithoutRouter.forEach(f => {
      console.log(`   - ${f.relativePath}`);
    });
  } else {
    console.log(`   ✅ All router context usage is properly wrapped`);
  }

  console.log(`\n🎉 Routing validation audit completed!`);
  
  return {
    totalFiles: routerFiles.length,
    totalRouters: validation.totalRouters,
    isValid: validation.totalRouters === 3 && validation.issues.length === 0,
    issues: validation.issues,
    entries: validation.entries
  };
}

// Run the audit
auditRouting().catch(console.error);
