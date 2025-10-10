/**
 * Vite Build Chunk Configuration
 * Centralized manual chunk splitting strategy
 * 
 * Philosophy:
 * - Vendor code separate for better caching
 * - Features split by domain for parallel loading
 * - Shared code in dedicated chunks
 * - Scalable as features/verticals expand
 */

import type { GetManualChunk } from 'rollup';

/**
 * Large vendor libraries that should be in separate chunks
 * Update this as new large dependencies are added
 */
const VENDOR_CHUNKS = {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'query-vendor': ['@tanstack/react-query'],
  'ui-vendor': ['lucide-react'],
} as const;

/**
 * Features that should always be in the main bundle (not code-split)
 * These are critical for initial page load
 */
const CRITICAL_FEATURES = [
  'header',
  'footer',
  'hero',
] as const;

/**
 * Features that should be lazy-loaded (separate chunks)
 * These improve initial page load time
 */
const LAZY_FEATURES = [
  'booking',
  'tenantDashboard',
  'adminDashboard',
  'tenantOnboarding',
] as const;

/**
 * Determine which vendor chunk a module belongs to
 */
function getVendorChunk(id: string): string | null {
  for (const [chunkName, packages] of Object.entries(VENDOR_CHUNKS)) {
    if (packages.some(pkg => id.includes(`node_modules/${pkg}`))) {
      return chunkName;
    }
  }
  return null;
}

/**
 * Determine if a feature should be lazy-loaded
 */
function shouldLazyLoadFeature(featureName: string): boolean {
  return (LAZY_FEATURES as readonly string[]).includes(featureName);
}

/**
 * Determine if a feature is critical (main bundle)
 */
function isCriticalFeature(featureName: string): boolean {
  return (CRITICAL_FEATURES as readonly string[]).includes(featureName);
}

/**
 * Main manual chunk strategy
 * 
 * Strategy:
 * 1. Split large vendors for better caching
 * 2. Split features by domain for parallel loading
 * 3. Keep critical features in main bundle
 * 4. Lazy-load heavy features
 * 5. Group shared code for reuse
 * 
 * @param id - Module ID from Rollup
 * @returns Chunk name or undefined (automatic chunking)
 */
export const manualChunks: GetManualChunk = (id) => {
  // 1. Vendor chunks - split by library group
  if (id.includes('node_modules')) {
    const vendorChunk = getVendorChunk(id);
    if (vendorChunk) {
      return vendorChunk;
    }
    // All other vendors go into generic vendor chunk
    return 'vendor';
  }
  
  // 2. Feature chunks - split by feature folder
  if (id.includes('src/features/')) {
    const featureMatch = id.match(/src\/features\/([^/]+)/);
    if (featureMatch && featureMatch[1]) {
      const featureName = featureMatch[1];
      
      // Critical features go in main bundle
      if (isCriticalFeature(featureName)) {
        return undefined;  // Let Vite decide (usually main bundle)
      }
      
      // Lazy features get their own chunks
      if (shouldLazyLoadFeature(featureName)) {
        return `feature-${featureName}`;
      }
      
      // Other features get feature chunks
      return `feature-${featureName}`;
    }
  }
  
  // 3. Shared UI components - frequently used across features
  if (id.includes('shared/ui')) {
    return 'shared-ui';
  }
  
  // 4. Shared utilities and hooks - frequently used
  if (id.includes('shared/utils') || id.includes('shared/hooks')) {
    return 'shared-utils';
  }
  
  // 5. Shared contexts and state - app-wide
  if (id.includes('shared/contexts') || id.includes('shared/state')) {
    return 'shared-core';
  }
  
  // 6. Shared types and schemas - small, can be in main bundle
  if (id.includes('shared/types') || id.includes('shared/schemas')) {
    return undefined;  // Include in importing chunks
  }
  
  // Everything else uses Vite's automatic chunking
  return undefined;
};

/**
 * Chunk configuration summary for documentation/logging
 */
export const chunkConfig = {
  vendorChunks: VENDOR_CHUNKS,
  criticalFeatures: CRITICAL_FEATURES,
  lazyFeatures: LAZY_FEATURES,
  strategy: {
    vendors: 'Split by library group',
    features: 'Split by domain',
    critical: 'Include in main bundle',
    lazy: 'Separate chunks for code-splitting',
    shared: 'Grouped by category (ui, utils, core)',
  },
} as const;

