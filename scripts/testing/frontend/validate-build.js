#!/usr/bin/env node
/**
 * Build Validation Script for 3-Layer Architecture
 * Validates that all 3 apps build correctly and are ready for deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const frontendDir = path.join(root, 'frontend');
const backendDir = path.join(root, 'backend');

console.log('🔍 Validating 3-layer architecture build...\n');

// Step 1: Check if frontend builds successfully
console.log('1️⃣ Building frontend...');
try {
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
  console.log('✅ Frontend build successful\n');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Step 2: Validate build output structure
console.log('2️⃣ Validating build structure...');
const distDir = path.join(frontendDir, 'dist');
const requiredApps = ['main', 'admin', 'tenant'];

const missingApps = [];
for (const app of requiredApps) {
  // Map app names to their actual directory names in dist/src/
  const appDirMap = {
    'main': 'main-site',
    'admin': 'admin-app', 
    'tenant': 'tenant-app'
  };
  
  const actualAppDir = appDirMap[app];
  const appDir = path.join(distDir, 'src', actualAppDir);
  const indexPath = path.join(appDir, 'index.html');
  
  if (!fs.existsSync(appDir)) {
    missingApps.push(`${app} (directory missing: ${appDir})`);
  } else if (!fs.existsSync(indexPath)) {
    missingApps.push(`${app} (index.html missing: ${indexPath})`);
  } else {
    console.log(`✅ ${app} app built successfully (${appDir})`);
  }
}

if (missingApps.length > 0) {
  console.error('❌ Missing builds:', missingApps.join(', '));
  process.exit(1);
}

// Step 3: Check file sizes and structure
console.log('\n3️⃣ Analyzing build output...');
for (const app of requiredApps) {
  const appDir = path.join(distDir, app);
  const files = fs.readdirSync(appDir, { recursive: true });
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  console.log(`📊 ${app}: ${htmlFiles.length} HTML, ${jsFiles.length} JS, ${cssFiles.length} CSS files`);
}

// Step 4: Test backend public directory preparation
console.log('\n4️⃣ Testing backend public directory preparation...');
const publicDir = path.join(backendDir, 'public');

// Clean and recreate
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true });
}
fs.mkdirSync(publicDir, { recursive: true });

// Create subdirectories
for (const app of requiredApps) {
  fs.mkdirSync(path.join(publicDir, app), { recursive: true });
}

console.log('✅ Backend public directory prepared');

// Step 5: Simulate deployment copy
console.log('\n5️⃣ Simulating deployment copy...');
for (const app of requiredApps) {
  // Map app names to their actual directory names in dist/src/
  const appDirMap = {
    'main': 'main-site',
    'admin': 'admin-app', 
    'tenant': 'tenant-app'
  };
  
  const actualAppDir = appDirMap[app];
  const sourceDir = path.join(distDir, 'src', actualAppDir);
  const targetDir = path.join(publicDir, app);
  
  // Copy files
  const files = fs.readdirSync(sourceDir, { recursive: true });
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.statSync(sourcePath).isFile()) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
  
  const copiedFiles = fs.readdirSync(targetDir, { recursive: true }).length;
  console.log(`✅ ${app}: ${copiedFiles} files copied from ${sourceDir}`);
}

// Step 6: Final validation
console.log('\n6️⃣ Final deployment validation...');
const totalHtmlFiles = fs.readdirSync(publicDir, { recursive: true })
  .filter(f => f.endsWith('.html')).length;

if (totalHtmlFiles === 3) {
  console.log('✅ All 3 apps ready for deployment!');
  console.log('\n🎉 3-layer architecture build validation PASSED!');
  console.log('\n📁 Deployment structure:');
  console.log('   backend/public/main/    (main site)');
  console.log('   backend/public/admin/   (admin app)');
  console.log('   backend/public/tenant/  (tenant app)');
} else {
  console.error(`❌ Expected 3 HTML files, found ${totalHtmlFiles}`);
  process.exit(1);
}
