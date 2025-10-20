#!/usr/bin/env node
/**
 * Asset Check Script
 * Verifies that required favicon and PWA icons exist before/after build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

const requiredAssets = [
  'favicon.ico',
  'shared/icons/logo.png',
  'shared/icons/logo.svg',
  'shared/icons/favicon.svg',
  'manifest.json'
];

console.log('\n🔍 Checking required assets...\n');

let missing = [];
let found = [];

for (const asset of requiredAssets) {
  const assetPath = path.join(publicDir, asset);
  if (fs.existsSync(assetPath)) {
    console.log(`✅ ${asset}`);
    found.push(asset);
  } else {
    console.log(`❌ ${asset} - MISSING`);
    missing.push(asset);
  }
}

console.log(`\n📊 Summary: ${found.length}/${requiredAssets.length} assets found\n`);

if (missing.length > 0) {
  console.error('⚠️  Missing required assets:');
  missing.forEach(asset => console.error(`   - ${asset}`));
  console.error('\n💡 Tip: Check frontend/public/ directory\n');
  process.exit(1);
} else {
  console.log('✅ All required assets are present!\n');
  process.exit(0);
}

