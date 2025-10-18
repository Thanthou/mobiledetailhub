#!/usr/bin/env node
/**
 * Phase 4.2: Express Routes Auto-Fix Script
 * Automatically fixes common issues in route files
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.resolve(__dirname, '../backend/routes');

const fixes = {
  convertedFiles: [],
  errors: []
};

async function fixRouteFile(filePath) {
  const relativePath = path.relative(routesDir, filePath);
  const fileName = path.basename(filePath);
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Fix 1: Convert require() to import statements
    const requireMatches = content.match(/const\s+\{[^}]+\}\s*=\s*require\(['"][^'"]+['"]\)/g);
    if (requireMatches) {
      for (const match of requireMatches) {
        const importMatch = match.match(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\)/);
        if (importMatch) {
          const [, imports, modulePath] = importMatch;
          const newImport = `import { ${imports} } from '${modulePath.replace('.js', '.js')}';`;
          content = content.replace(match, newImport);
          modified = true;
        }
      }
    }

    // Fix 2: Convert legacy pool import
    if (content.includes("import { pool } from '../database/pool.js'")) {
      content = content.replace(
        "import { pool } from '../database/pool.js'",
        "import { getPool } from '../database/pool.js'"
      );
      modified = true;
    }

    // Fix 3: Replace pool usage patterns
    const poolPatterns = [
      {
        from: /if\s*\(\s*!pool\s*\)\s*{\s*const\s+error\s*=\s*new\s+Error\('Database connection not available'\);\s*error\.statusCode\s*=\s*500;\s*throw\s+error;\s*}/g,
        to: 'const pool = await getPool();'
      },
      {
        from: /const\s+pool\s*=\s*await\s+getPool\(\);\s*if\s*\(\s*!pool\s*\)\s*{\s*const\s+error\s*=\s*new\s+Error\('Database connection not available'\);\s*error\.statusCode\s*=\s*500;\s*throw\s+error;\s*}/g,
        to: 'const pool = await getPool();'
      }
    ];

    for (const pattern of poolPatterns) {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        modified = true;
      }
    }

    // Fix 4: Add proper logger import if missing
    if (content.includes('console.log') || content.includes('console.error')) {
      if (!content.includes('createModuleLogger') && !content.includes('logger')) {
        // Add logger import after other imports
        const importMatch = content.match(/(import\s+[^;]+;[\s\n]*)+/);
        if (importMatch) {
          const loggerImport = "import { createModuleLogger } from '../config/logger.js';\n";
          content = content.replace(importMatch[0], importMatch[0] + loggerImport);
          modified = true;
        }
      }
    }

    // Fix 5: Add router declaration if missing
    if (!content.includes('const router = express.Router()') && !content.includes('const router = express.Router();')) {
      const expressImport = content.match(/import\s+express\s+from\s+['"]express['"];?/);
      if (expressImport) {
        const routerLine = '\nconst router = express.Router();\n';
        content = content.replace(expressImport[0], expressImport[0] + routerLine);
        modified = true;
      }
    }

    // Fix 6: Add logger instance if missing
    if (content.includes('createModuleLogger') && !content.includes('const logger = createModuleLogger')) {
      const routerMatch = content.match(/const\s+router\s*=\s*express\.Router\(\);?/);
      if (routerMatch) {
        const loggerLine = '\nconst logger = createModuleLogger(\'routeName\');\n';
        content = content.replace(routerMatch[0], routerMatch[0] + loggerLine);
        modified = true;
      }
    }

    // Fix 7: Add asyncHandler to async routes that don't have it
    const asyncRoutePattern = /router\.(get|post|put|delete|patch)\([^,]+,\s*async\s*\(/g;
    const asyncHandlerPattern = /asyncHandler\s*\(/g;
    
    if (asyncRoutePattern.test(content) && !asyncHandlerPattern.test(content)) {
      // Add asyncHandler import if missing
      if (!content.includes('asyncHandler')) {
        const importMatch = content.match(/(import\s+[^;]+;[\s\n]*)+/);
        if (importMatch) {
          const asyncHandlerImport = "import { asyncHandler } from '../middleware/errorHandler.js';\n";
          content = content.replace(importMatch[0], importMatch[0] + asyncHandlerImport);
          modified = true;
        }
      }
    }

    // Fix 8: Convert console.log to logger calls
    if (content.includes('console.log')) {
      content = content.replace(/console\.log\(/g, 'logger.info(');
      modified = true;
    }
    if (content.includes('console.error')) {
      content = content.replace(/console\.error\(/g, 'logger.error(');
      modified = true;
    }

    // Fix 9: Add basic JSDoc if missing
    if (!content.includes('/**') && !content.includes('@fileoverview')) {
      const fileDoc = `/**
 * @fileoverview API routes for ${fileName.replace('.js', '')}
 * @version 1.0.0
 * @author That Smart Site
 */

`;
      content = fileDoc + content;
      modified = true;
    }

    // Write the modified content back
    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      fixes.convertedFiles.push(relativePath);
      console.log(`✅ Fixed: ${relativePath}`);
    } else {
      console.log(`⚪ No changes needed: ${relativePath}`);
    }

  } catch (error) {
    fixes.errors.push({ file: relativePath, error: error.message });
    console.log(`❌ Error fixing ${relativePath}: ${error.message}`);
  }
}

async function fixAllRoutes() {
  console.log('🔧 Phase 4.2: Express Routes Auto-Fix');
  console.log('=====================================\n');

  try {
    const files = await fs.readdir(routesDir);
    const routeFiles = files.filter(file => file.endsWith('.js'));

    console.log(`1️⃣ Processing ${routeFiles.length} route files...\n`);

    for (const file of routeFiles) {
      const filePath = path.join(routesDir, file);
      await fixRouteFile(filePath);
    }

    console.log('\n2️⃣ Summary:');
    console.log(`   Files modified: ${fixes.convertedFiles.length}`);
    console.log(`   Errors: ${fixes.errors.length}`);

    if (fixes.convertedFiles.length > 0) {
      console.log('\n   Modified files:');
      fixes.convertedFiles.forEach(file => console.log(`   - ${file}`));
    }

    if (fixes.errors.length > 0) {
      console.log('\n   Errors:');
      fixes.errors.forEach(({ file, error }) => console.log(`   - ${file}: ${error}`));
    }

    console.log('\n🎉 Express Routes Auto-Fix Complete!');

  } catch (error) {
    console.error('Error during auto-fix:', error);
    process.exit(1);
  }
}

fixAllRoutes();
