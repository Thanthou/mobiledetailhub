#!/usr/bin/env node
/**
 * Phase 3.3: Route Performance Audit
 * Analyzes frontend routes for performance optimization opportunities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = process.cwd();
const frontendDir = path.join(root, 'frontend/src');
const distDir = path.join(root, 'frontend/dist');

// Route analysis results
const routeAnalysis = {
  routes: [],
  lazyRoutes: [],
  eagerRoutes: [],
  bundleAnalysis: {},
  performanceIssues: [],
  recommendations: []
};

/**
 * Find all route definitions in the frontend
 */
function findRouteDefinitions() {
  const routeFiles = [];
  
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('Route') || content.includes('path=') || content.includes('createRoutesFromElements')) {
          routeFiles.push({
            path: fullPath,
            relativePath: path.relative(frontendDir, fullPath),
            content
          });
        }
      }
    }
  }
  
  walkDir(frontendDir);
  return routeFiles;
}

/**
 * Analyze route patterns and lazy loading
 */
function analyzeRoutePatterns(routeFiles) {
  const routes = [];
  const lazyRoutes = [];
  const eagerRoutes = [];
  
  for (const file of routeFiles) {
    const content = file.content;
    
    // Find Route components
    const routeMatches = content.match(/<Route\s+[^>]*path=["']([^"']+)["'][^>]*>/g) || [];
    const lazyMatches = content.match(/React\.lazy\(|import\(/g) || [];
    const suspenseMatches = content.match(/<Suspense/g) || [];
    
    for (const match of routeMatches) {
      const pathMatch = match.match(/path=["']([^"']+)["']/);
      if (pathMatch) {
        const routePath = pathMatch[1];
        const isLazy = lazyMatches.length > 0;
        const hasSuspense = suspenseMatches.length > 0;
        
        const routeInfo = {
          path: routePath,
          file: file.relativePath,
          isLazy,
          hasSuspense,
          lazyCount: lazyMatches.length,
          suspenseCount: suspenseMatches.length
        };
        
        routes.push(routeInfo);
        
        if (isLazy) {
          lazyRoutes.push(routeInfo);
        } else {
          eagerRoutes.push(routeInfo);
        }
      }
    }
  }
  
  return { routes, lazyRoutes, eagerRoutes };
}

/**
 * Analyze bundle sizes and chunking
 */
function analyzeBundleSizes() {
  if (!fs.existsSync(distDir)) {
    return {
      error: 'Build directory not found. Run "npm run build" first.',
      bundles: [],
      totalSize: 0,
      averageSize: 0
    };
  }
  
  const bundles = [];
  let totalSize = 0;
  
  function walkDistDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDistDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const stats = fs.statSync(fullPath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += stats.size;
        
        bundles.push({
          name: entry.name,
          path: path.relative(distDir, fullPath),
          size: stats.size,
          sizeKB,
          isChunk: entry.name.includes('chunk'),
          isVendor: entry.name.includes('vendor') || entry.name.includes('node_modules')
        });
      }
    }
  }
  
  walkDistDir(distDir);
  
  return {
    bundles: bundles.sort((a, b) => b.size - a.size),
    totalSize,
    totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
    averageSize: bundles.length > 0 ? Math.round(totalSize / bundles.length / 1024) : 0
  };
}

/**
 * Detect performance issues
 */
function detectPerformanceIssues(routes, bundles) {
  const issues = [];
  
  // Large bundles
  const largeBundles = bundles.filter(b => b.sizeKB > 500);
  if (largeBundles.length > 0) {
    issues.push({
      type: 'large_bundles',
      severity: 'high',
      message: `${largeBundles.length} bundles exceed 500KB`,
      details: largeBundles.map(b => `${b.name}: ${b.sizeKB}KB`),
      recommendation: 'Consider code splitting or lazy loading for large components'
    });
  }
  
  // Too many eager routes
  const eagerCount = routes.filter(r => !r.isLazy).length;
  if (eagerCount > 10) {
    issues.push({
      type: 'too_many_eager_routes',
      severity: 'medium',
      message: `${eagerCount} routes are loaded eagerly`,
      details: routes.filter(r => !r.isLazy).map(r => r.path),
      recommendation: 'Consider lazy loading for non-critical routes'
    });
  }
  
  // Missing Suspense boundaries
  const routesWithoutSuspense = routes.filter(r => r.isLazy && !r.hasSuspense);
  if (routesWithoutSuspense.length > 0) {
    issues.push({
      type: 'missing_suspense',
      severity: 'high',
      message: `${routesWithoutSuspense.length} lazy routes missing Suspense boundaries`,
      details: routesWithoutSuspense.map(r => r.path),
      recommendation: 'Wrap lazy components with Suspense for better UX'
    });
  }
  
  // Large vendor bundles
  const vendorBundles = bundles.filter(b => b.isVendor);
  const largeVendorBundles = vendorBundles.filter(b => b.sizeKB > 1000);
  if (largeVendorBundles.length > 0) {
    issues.push({
      type: 'large_vendor_bundles',
      severity: 'medium',
      message: `${largeVendorBundles.length} vendor bundles exceed 1MB`,
      details: largeVendorBundles.map(b => `${b.name}: ${b.sizeKB}KB`),
      recommendation: 'Consider splitting vendor bundles or removing unused dependencies'
    });
  }
  
  return issues;
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(routes, bundles, issues) {
  const recommendations = [];
  
  // Lazy loading recommendations
  const eagerRoutes = routes.filter(r => !r.isLazy);
  if (eagerRoutes.length > 5) {
    recommendations.push({
      category: 'Code Splitting',
      priority: 'high',
      title: 'Implement Lazy Loading',
      description: `You have ${eagerRoutes.length} routes that could benefit from lazy loading`,
      routes: eagerRoutes.map(r => r.path),
      implementation: 'Wrap components with React.lazy() and Suspense'
    });
  }
  
  // Bundle optimization
  const totalSizeMB = bundles.reduce((sum, b) => sum + b.size, 0) / 1024 / 1024;
  if (totalSizeMB > 5) {
    recommendations.push({
      category: 'Bundle Optimization',
      priority: 'high',
      title: 'Optimize Bundle Size',
      description: `Total bundle size is ${totalSizeMB.toFixed(2)}MB, consider optimization`,
      implementation: 'Use dynamic imports, tree shaking, and bundle analysis'
    });
  }
  
  // Performance budgets
  recommendations.push({
    category: 'Performance Budget',
    priority: 'medium',
    title: 'Implement Performance Budgets',
    description: 'Set performance budgets to prevent regressions',
    implementation: 'Add budget.json and Lighthouse CI integration'
  });
  
  return recommendations;
}

/**
 * Generate performance score
 */
function calculatePerformanceScore(routes, bundles, issues) {
  let score = 100;
  
  // Deduct for large bundles
  const largeBundles = bundles.filter(b => b.sizeKB > 500).length;
  score -= largeBundles * 5;
  
  // Deduct for too many eager routes
  const eagerCount = routes.filter(r => !r.isLazy).length;
  if (eagerCount > 10) score -= 10;
  if (eagerCount > 20) score -= 10;
  
  // Deduct for missing Suspense
  const missingSuspense = routes.filter(r => r.isLazy && !r.hasSuspense).length;
  score -= missingSuspense * 10;
  
  // Deduct for performance issues
  score -= issues.filter(i => i.severity === 'high').length * 15;
  score -= issues.filter(i => i.severity === 'medium').length * 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Main audit function
 */
function runPerformanceAudit() {
  console.log('🚀 Phase 3.3: Route Performance Audit\n');
  
  // 1. Find route definitions
  console.log('1️⃣ Finding route definitions...');
  const routeFiles = findRouteDefinitions();
  console.log(`   Found ${routeFiles.length} files with route definitions`);
  
  // 2. Analyze route patterns
  console.log('\n2️⃣ Analyzing route patterns...');
  const { routes, lazyRoutes, eagerRoutes } = analyzeRoutePatterns(routeFiles);
  console.log(`   Total routes: ${routes.length}`);
  console.log(`   Lazy routes: ${lazyRoutes.length}`);
  console.log(`   Eager routes: ${eagerRoutes.length}`);
  
  // 3. Analyze bundle sizes
  console.log('\n3️⃣ Analyzing bundle sizes...');
  const bundleAnalysis = analyzeBundleSizes();
  if (bundleAnalysis.error) {
    console.log(`   ⚠️  ${bundleAnalysis.error}`);
  } else {
    console.log(`   Total bundles: ${bundleAnalysis.bundles.length}`);
    console.log(`   Total size: ${bundleAnalysis.totalSizeMB}MB`);
    console.log(`   Average size: ${bundleAnalysis.averageSize}KB`);
  }
  
  // 4. Detect performance issues
  console.log('\n4️⃣ Detecting performance issues...');
  const issues = detectPerformanceIssues(routes, bundleAnalysis.bundles || []);
  console.log(`   Issues found: ${issues.length}`);
  issues.forEach(issue => {
    console.log(`   ${issue.severity === 'high' ? '🔴' : '🟡'} ${issue.message}`);
  });
  
  // 5. Generate recommendations
  console.log('\n5️⃣ Generating recommendations...');
  const recommendations = generateRecommendations(routes, bundleAnalysis.bundles || [], issues);
  console.log(`   Recommendations: ${recommendations.length}`);
  
  // 6. Calculate performance score
  const performanceScore = calculatePerformanceScore(routes, bundleAnalysis.bundles || [], issues);
  console.log(`\n📊 Performance Score: ${performanceScore}/100`);
  
  // 7. Generate detailed report
  const report = generateDetailedReport(routes, bundleAnalysis, issues, recommendations, performanceScore);
  
  // Save report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const reportPath = path.join(reportsDir, 'ROUTE_PERFORMANCE_AUDIT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n✅ Detailed report saved to: ${reportPath}`);
  
  return {
    routes,
    bundles: bundleAnalysis.bundles || [],
    issues,
    recommendations,
    performanceScore
  };
}

/**
 * Generate detailed report
 */
function generateDetailedReport(routes, bundleAnalysis, issues, recommendations, performanceScore) {
  const timestamp = new Date().toISOString();
  
  return `# Route Performance Audit Report
Generated: ${timestamp}

## 📊 Performance Score: ${performanceScore}/100

${performanceScore >= 80 ? '🟢 Excellent' : performanceScore >= 60 ? '🟡 Good' : '🔴 Needs Improvement'}

## 🛣️ Route Analysis

### Route Summary
- **Total Routes**: ${routes.length}
- **Lazy Routes**: ${routes.filter(r => r.isLazy).length}
- **Eager Routes**: ${routes.filter(r => !r.isLazy).length}
- **Routes with Suspense**: ${routes.filter(r => r.hasSuspense).length}

### Route Details
${routes.map(route => `
#### ${route.path}
- **File**: \`${route.file}\`
- **Lazy Loading**: ${route.isLazy ? '✅ Yes' : '❌ No'}
- **Suspense Boundary**: ${route.hasSuspense ? '✅ Yes' : '❌ No'}
- **Lazy Components**: ${route.lazyCount}
`).join('\n')}

## 📦 Bundle Analysis

${bundleAnalysis.error ? `**Error**: ${bundleAnalysis.error}` : `
### Bundle Summary
- **Total Bundles**: ${bundleAnalysis.bundles.length}
- **Total Size**: ${bundleAnalysis.totalSizeMB}MB
- **Average Size**: ${bundleAnalysis.averageSize}KB

### Largest Bundles
${bundleAnalysis.bundles.slice(0, 10).map(bundle => `
- **${bundle.name}**: ${bundle.sizeKB}KB ${bundle.isVendor ? '(Vendor)' : ''} ${bundle.isChunk ? '(Chunk)' : ''}
`).join('')}
`}

## ⚠️ Performance Issues

${issues.length === 0 ? '✅ No performance issues detected!' : issues.map(issue => `
### ${issue.severity === 'high' ? '🔴' : '🟡'} ${issue.message}
**Type**: ${issue.type}
**Details**: ${issue.details.join(', ')}
**Recommendation**: ${issue.recommendation}
`).join('\n')}

## 💡 Recommendations

${recommendations.map(rec => `
### ${rec.priority === 'high' ? '🔴' : '🟡'} ${rec.title}
**Category**: ${rec.category}
**Description**: ${rec.description}
${rec.routes ? `**Affected Routes**: ${rec.routes.join(', ')}` : ''}
**Implementation**: ${rec.implementation}
`).join('\n')}

## 🎯 Next Steps

1. **High Priority**: Address all high-severity issues
2. **Code Splitting**: Implement lazy loading for non-critical routes
3. **Bundle Optimization**: Analyze and optimize large bundles
4. **Performance Budgets**: Set up monitoring to prevent regressions
5. **Testing**: Implement performance testing in CI/CD

## 📈 Performance Targets

- **Bundle Size**: < 500KB per route
- **Total Bundle**: < 5MB
- **Lazy Loading**: > 70% of routes
- **Suspense Coverage**: 100% of lazy routes
- **Performance Score**: > 80/100
`;
}

// Run the audit
console.log('Starting performance audit...');
runPerformanceAudit();

export { runPerformanceAudit };
