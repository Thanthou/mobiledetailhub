#!/usr/bin/env node
/**
 * Phase 4.3: Fix Remaining Route Issues
 * Targets specific remaining problems after initial auto-fix
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.resolve(__dirname, '../backend/routes');

const problematicFiles = [
  'previews.js',
  'schedule.js', 
  'seo.js',
  'serviceAreas.js',
  'services.js',
  'tenantImages.js',
  'tenantManifest.js',
  'tenantReviews.js',
  'upload.js'
];

async function fixRemainingIssues(filePath) {
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Fix 1: Convert remaining require() statements to import
    const requirePatterns = [
      {
        from: /const\s+express\s*=\s*require\(['"]express['"]\);/g,
        to: "import express from 'express';"
      },
      {
        from: /const\s+router\s*=\s*express\.Router\(\);/g,
        to: "const router = express.Router();"
      },
      {
        from: /const\s+\{[^}]+\}\s*=\s*require\(['"][^'"]+['"]\);/g,
        to: (match) => {
          const importMatch = match.match(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);/);
          if (importMatch) {
            const [, imports, modulePath] = importMatch;
            return `import { ${imports} } from '${modulePath.replace('.js', '.js')}';`;
          }
          return match;
        }
      }
    ];

    for (const pattern of requirePatterns) {
      if (typeof pattern.to === 'function') {
        const newContent = content.replace(pattern.from, pattern.to);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      } else {
        if (pattern.from.test(content)) {
          content = content.replace(pattern.from, pattern.to);
          modified = true;
        }
      }
    }

    // Fix 2: Ensure proper import order
    const imports = [];
    const otherCode = [];
    
    const lines = content.split('\n');
    let inImports = true;
    
    for (const line of lines) {
      if (inImports && (line.startsWith('import ') || line.startsWith('const ') && line.includes('require('))) {
        imports.push(line);
      } else {
        inImports = false;
        otherCode.push(line);
      }
    }
    
    if (imports.length > 0) {
      // Sort imports
      imports.sort();
      
      // Rebuild content
      const newContent = imports.join('\n') + '\n\n' + otherCode.join('\n');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    // Fix 3: Standardize response formats
    const responsePatterns = [
      {
        from: /res\.json\(\{\s*success:\s*true,\s*data:\s*([^}]+)\s*\}\)/g,
        to: 'res.json({ success: true, data: $1 })'
      },
      {
        from: /res\.json\(\{\s*success:\s*false,\s*error:\s*([^}]+)\s*\}\)/g,
        to: 'res.json({ success: false, error: $1 })'
      }
    ];

    for (const pattern of responsePatterns) {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        modified = true;
      }
    }

    // Write the modified content back
    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Fixed remaining issues: ${relativePath}`);
      return true;
    } else {
      console.log(`⚪ No additional changes needed: ${relativePath}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Error fixing ${relativePath}: ${error.message}`);
    return false;
  }
}

async function fixRemainingRoutes() {
  console.log('🔧 Phase 4.3: Fix Remaining Route Issues');
  console.log('=========================================\n');

  let fixedCount = 0;

  for (const fileName of problematicFiles) {
    const filePath = path.join(routesDir, fileName);
    const wasFixed = await fixRemainingIssues(filePath);
    if (wasFixed) fixedCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${problematicFiles.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`\n🎉 Remaining Issues Fix Complete!`);
}

fixRemainingRoutes();
