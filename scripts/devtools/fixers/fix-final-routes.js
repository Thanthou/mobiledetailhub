#!/usr/bin/env node
/**
 * Phase 4.4: Final Route Cleanup
 * Fixes the last remaining mixed import/require issues
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.resolve(__dirname, '../backend/routes');

const remainingFiles = [
  'seo.js',
  'serviceAreas.js', 
  'tenantImages.js',
  'tenantManifest.js',
  'tenantReviews.js',
  'upload.js'
];

async function fixFinalIssues(filePath) {
  const relativePath = path.relative(routesDir, filePath);
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Fix 1: Convert require() to import
    const requireToImport = [
      {
        from: /const\s+express\s*=\s*require\(['"]express['"]\);/g,
        to: "import express from 'express';"
      },
      {
        from: /const\s+router\s*=\s*express\.Router\(\);/g,
        to: "const router = express.Router();"
      },
      {
        from: /const\s+\{[^}]+\}\s*=\s*require\(['"]([^'"]+)['"]\);/g,
        to: (match, modulePath) => {
          const importMatch = match.match(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);/);
          if (importMatch) {
            const [, imports, path] = importMatch;
            return `import { ${imports} } from '${path.replace('.js', '.js')}';`;
          }
          return match;
        }
      },
      {
        from: /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);/g,
        to: (match, varName, modulePath) => {
          return `import ${varName} from '${modulePath.replace('.js', '.js')}';`;
        }
      }
    ];

    for (const pattern of requireToImport) {
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

    // Fix 2: Convert module.exports to export default
    if (content.includes('module.exports')) {
      content = content.replace(/module\.exports\s*=\s*router;?/g, 'export default router;');
      modified = true;
    }

    // Fix 3: Clean up double semicolons and extra spaces
    content = content.replace(/;;+/g, ';');
    content = content.replace(/\s+import/g, '\nimport');
    content = content.replace(/import\s+\{\s+/g, 'import { ');
    content = content.replace(/\s+\}\s+from/g, ' } from');

    // Fix 4: Ensure proper import order
    const lines = content.split('\n');
    const imports = [];
    const otherLines = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('import ') || line.trim().startsWith('const ') && line.includes('require(')) {
        imports.push(line);
      } else {
        otherLines.push(line);
      }
    }
    
    if (imports.length > 0) {
      // Sort and deduplicate imports
      const uniqueImports = [...new Set(imports)];
      uniqueImports.sort();
      
      // Rebuild content
      const newContent = uniqueImports.join('\n') + '\n\n' + otherLines.join('\n');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    // Write the modified content back
    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${relativePath}`);
      return true;
    } else {
      console.log(`⚪ No changes needed: ${relativePath}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Error fixing ${relativePath}: ${error.message}`);
    return false;
  }
}

async function fixFinalRoutes() {
  console.log('🔧 Phase 4.4: Final Route Cleanup');
  console.log('==================================\n');

  let fixedCount = 0;

  for (const fileName of remainingFiles) {
    const filePath = path.join(routesDir, fileName);
    const wasFixed = await fixFinalIssues(filePath);
    if (wasFixed) fixedCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${remainingFiles.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`\n🎉 Final Route Cleanup Complete!`);
}

fixFinalRoutes();
