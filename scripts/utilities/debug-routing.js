#!/usr/bin/env node
/**
 * Debug Routing Audit
 * Shows what files are being found and why they're not matching
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, '..', 'frontend', 'src');

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
          if (!['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
            scanDirectory(fullPath);
          }
        } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts') || item.name.endsWith('.jsx') || item.name.endsWith('.js'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
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

console.log('🔍 Debug Routing Audit\n');

const routerFiles = findRouterFiles(frontendDir);

console.log('Found router files:');
routerFiles.forEach(f => {
  console.log(`  - ${f.relativePath}`);
});

console.log('\nLooking for entry files:');
const entryFiles = [
  'admin-app/main.tsx',
  'tenant-app/main.tsx', 
  'main-site/main.tsx'
];

entryFiles.forEach(entry => {
  const found = routerFiles.find(f => f.relativePath === entry);
  console.log(`  ${entry}: ${found ? '✅ Found' : '❌ Not found'}`);
  if (found) {
    console.log(`    Content preview: ${found.content.substring(0, 100)}...`);
  }
});

console.log('\nFiles containing BrowserRouter:');
const browserRouterFiles = routerFiles.filter(f => f.content.includes('BrowserRouter'));
browserRouterFiles.forEach(f => {
  console.log(`  - ${f.relativePath}`);
});
