#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import path mappings
const importMappings = {
  // Features that moved to tenant-app/components
  '@/features/booking': '@/tenant-app/components/booking',
  '@/features/reviews': '@/tenant-app/components/reviews',
  '@/features/services': '@/tenant-app/components/services',
  '@/features/hero': '@/tenant-app/components/hero',
  '@/features/gallery': '@/tenant-app/components/gallery',
  '@/features/faq': '@/tenant-app/components/faq',
  '@/features/header': '@/tenant-app/components/header',
  '@/features/footer': '@/tenant-app/components/footer',
  '@/features/cta': '@/tenant-app/components/cta',
  '@/features/locations': '@/tenant-app/components/locations',
  '@/features/quotes': '@/tenant-app/components/quotes',
  '@/features/customers': '@/tenant-app/components/customers',
  '@/features/tenantDashboard': '@/tenant-app/components/tenantDashboard',
  
  // Features that moved to admin-app/components
  '@/features/adminDashboard': '@/admin-app/components/adminDashboard',
  '@/features/preview': '@/admin-app/components/preview',
  '@/features/devPreview': '@/admin-app/components/devPreview',
  '@/features/tenantOnboarding': '@/admin-app/components/tenantOnboarding',
  
  // Features that moved to shared
  '@/features/auth': '@/shared/auth',
  '@/features/seo': '@/shared/seo',
  '@/features/industries': '@/shared/industries',
  '@/features/_templates': '@/shared/_templates',
  '@/features/frontend': '@/shared/frontend',
  '@/features/backend': '@/shared/backend',
};

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply each mapping
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^'"]*)['"]`, 'g');
      const newContent = content.replace(regex, `from '${newPath}$1'`);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Also fix import statements without 'from'
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(`import ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^'"]*)['"]`, 'g');
      const newContent = content.replace(regex, `import '${newPath}$1'`);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix all TypeScript/JavaScript files
function fixImportsRecursively(dir) {
  let fixedCount = 0;
  
  function walkDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          walkDir(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
        if (fixImportsInFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  }
  
  walkDir(dir);
  return fixedCount;
}

// Main execution
const frontendDir = path.join(__dirname, '../frontend/src');
console.log('🔧 Fixing import paths in frontend...');
console.log(`📁 Scanning directory: ${frontendDir}`);

const fixedCount = fixImportsRecursively(frontendDir);
console.log(`\n✅ Fixed imports in ${fixedCount} files`);
console.log('🎉 Import path fixes complete!');
