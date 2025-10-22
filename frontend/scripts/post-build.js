#!/usr/bin/env node
/**
 * Post-build script to flatten HTML files from nested apps/* structure
 * to the root of each dist folder where the backend expects them.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const apps = [
  { dist: 'dist/main', nestedHtml: 'dist/main/apps/main/index.html' },
  { dist: 'dist/admin', nestedHtml: 'dist/admin/apps/admin-app/index.html' },
  { dist: 'dist/tenant', nestedHtml: 'dist/tenant/apps/tenant-app/index.html' },
];

console.log('📦 Post-build: Flattening HTML files...\n');

for (const app of apps) {
  const nestedPath = path.resolve(rootDir, app.nestedHtml);
  const flatPath = path.resolve(rootDir, app.dist, 'index.html');
  
  if (fs.existsSync(nestedPath)) {
    // Read the HTML
    let html = fs.readFileSync(nestedPath, 'utf8');
    
    // Fix asset paths: ../../ → ./
    html = html.replace(/\.\.\/\.\.\//g, './');
    
    // Write to root of dist folder
    fs.writeFileSync(flatPath, html, 'utf8');
    
    // Clean up nested apps folder
    const appsDir = path.resolve(rootDir, app.dist, 'apps');
    if (fs.existsSync(appsDir)) {
      fs.rmSync(appsDir, { recursive: true, force: true });
    }
    
    console.log(`✓ ${app.dist}/index.html`);
  } else {
    console.warn(`⚠️  Could not find ${nestedPath}`);
  }
}

console.log('\n✅ Post-build complete!\n');

