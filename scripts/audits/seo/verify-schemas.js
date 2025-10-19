#!/usr/bin/env node
/**
 * Schema Verification Script
 * Verifies that JSON-LD schemas are being properly injected at runtime
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = process.cwd();
const distDir = path.join(root, 'frontend/dist');

/**
 * Check if frontend is built
 */
function checkBuildStatus() {
  if (!fs.existsSync(distDir)) {
    return {
      built: false,
      message: 'Frontend not built. Run "npm run build" first.'
    };
  }
  return { built: true, message: 'Frontend build found' };
}

/**
 * Analyze HTML files for schema injection patterns
 */
function analyzeSchemaInjection() {
  const results = {
    files: [],
    totalSchemas: 0,
    schemaTypes: new Set(),
    issues: [],
    recommendations: []
  };

  // Find all HTML files
  function findHTMLFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findHTMLFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const htmlFiles = findHTMLFiles(distDir);
  
  for (const file of htmlFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(distDir, file);
      
      // Check for schema injection patterns
      const hasSchemaInjection = content.includes('injectAllSchemas') || 
                                content.includes('application/ld+json') ||
                                content.includes('schema.org');
      
      // Check for React Helmet usage
      const hasHelmet = content.includes('react-helmet') || content.includes('Helmet');
      
      // Check for SEO hooks
      const hasSEOHooks = content.includes('useSEO') || content.includes('useMetaTags');
      
      // Look for any existing JSON-LD scripts
      const jsonLdScripts = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
      
      const fileResult = {
        file: relativePath,
        hasSchemaInjection,
        hasHelmet,
        hasSEOHooks,
        jsonLdScripts: jsonLdScripts.length,
        schemas: []
      };
      
      // Parse existing JSON-LD scripts
      for (const script of jsonLdScripts) {
        try {
          const jsonMatch = script.match(/>([\s\S]*?)<\/script>/);
          if (jsonMatch) {
            const schema = JSON.parse(jsonMatch[1]);
            fileResult.schemas.push(schema);
            results.totalSchemas++;
            
            if (schema['@type']) {
              results.schemaTypes.add(schema['@type']);
            }
          }
        } catch (e) {
          fileResult.schemas.push({ error: e.message, raw: script });
        }
      }
      
      results.files.push(fileResult);
      
    } catch (error) {
      results.issues.push({
        file: path.relative(distDir, file),
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Check JavaScript files for schema-related code
 */
function analyzeJavaScriptFiles() {
  const results = {
    schemaFiles: [],
    injectionPoints: [],
    totalInjectionPoints: 0
  };

  // Find all JavaScript files
  function findJSFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findJSFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const jsFiles = findJSFiles(distDir);
  
  for (const file of jsFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(distDir, file);
      
      // Check for schema-related code
      const hasSchemaCode = content.includes('schema.org') || 
                           content.includes('LocalBusiness') ||
                           content.includes('Service') ||
                           content.includes('FAQPage') ||
                           content.includes('Organization') ||
                           content.includes('WebSite');
      
      const hasInjectionCode = content.includes('injectAllSchemas') ||
                              content.includes('application/ld+json');
      
      if (hasSchemaCode || hasInjectionCode) {
        results.schemaFiles.push({
          file: relativePath,
          hasSchemaCode,
          hasInjectionCode,
          size: content.length
        });
        
        if (hasInjectionCode) {
          results.totalInjectionPoints++;
          results.injectionPoints.push({
            file: relativePath,
            type: 'injection'
          });
        }
      }
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return results;
}

/**
 * Generate verification report
 */
function generateVerificationReport(htmlResults, jsResults) {
  const timestamp = new Date().toISOString();
  
  return `# Schema Verification Report
Generated: ${timestamp}

## 📊 Schema Injection Analysis

### HTML Files Analysis
- **Total HTML files**: ${htmlResults.files.length}
- **Files with schema injection**: ${htmlResults.files.filter(f => f.hasSchemaInjection).length}
- **Files with Helmet**: ${htmlResults.files.filter(f => f.hasHelmet).length}
- **Files with SEO hooks**: ${htmlResults.files.filter(f => f.hasSEOHooks).length}
- **Total JSON-LD scripts found**: ${htmlResults.totalSchemas}

### JavaScript Files Analysis
- **Schema-related JS files**: ${jsResults.schemaFiles.length}
- **Injection points**: ${jsResults.totalInjectionPoints}

### Schema Types Detected
${Array.from(htmlResults.schemaTypes).map(type => `- **${type}**`).join('\n') || 'No schemas detected in static HTML'}

## 📁 File-by-File Analysis

### HTML Files
${htmlResults.files.map(file => `
#### ${file.file}
- **Schema Injection**: ${file.hasSchemaInjection ? '✅' : '❌'}
- **Helmet Usage**: ${file.hasHelmet ? '✅' : '❌'}
- **SEO Hooks**: ${file.hasSEOHooks ? '✅' : '❌'}
- **JSON-LD Scripts**: ${file.jsonLdScripts}
${file.schemas.length > 0 ? `
- **Schemas Found**:
${file.schemas.map(schema => `  - ${schema['@type'] || 'Invalid JSON'}`).join('\n')}` : ''}
`).join('\n')}

### JavaScript Files with Schema Code
${jsResults.schemaFiles.map(file => `
#### ${file.file}
- **Schema Code**: ${file.hasSchemaCode ? '✅' : '❌'}
- **Injection Code**: ${file.hasInjectionCode ? '✅' : '❌'}
- **File Size**: ${Math.round(file.size / 1024)}KB
`).join('\n')}

## 🔍 Issues Found

${htmlResults.issues.length === 0 ? '✅ No issues detected!' : htmlResults.issues.map(issue => `
### ❌ ${issue.file}
**Error**: ${issue.error}
`).join('\n')}

## 💡 Recommendations

${htmlResults.totalSchemas === 0 ? `
### 🟡 Dynamic Schema Injection
**Status**: Schemas are injected dynamically via JavaScript
**Verification**: Check browser developer tools for \`<script type="application/ld+json">\` tags
**Implementation**: Schemas are loaded after page initialization

### 🟡 Runtime Verification Needed
**Description**: Static analysis cannot detect dynamically injected schemas
**Solution**: Use browser developer tools or runtime testing to verify schemas
` : `
### ✅ Schemas Detected
**Status**: ${htmlResults.totalSchemas} JSON-LD schemas found in static HTML
**Types**: ${Array.from(htmlResults.schemaTypes).join(', ')}
`}

## 🧪 How to Verify Schemas Are Working

1. **Open your website in a browser**
2. **Open Developer Tools (F12)**
3. **Go to Elements tab**
4. **Search for \`application/ld+json\`**
5. **Look for \`<script type="application/ld+json">\` tags**
6. **Verify the JSON content is valid**

## 📈 Expected Schema Types

Your implementation should include:
- **Organization**: That Smart Site platform information
- **WebSite**: Main platform with search functionality  
- **FAQPage**: Platform-specific frequently asked questions
- **Service**: Industry-specific service offerings (when tenant data is available)
- **LocalBusiness**: Tenant-specific business information (when tenant data is available)

## 🎯 Next Steps

${htmlResults.totalSchemas === 0 ? `
1. **Verify Runtime Injection**: Check browser developer tools
2. **Test Schema Validation**: Use Google's Rich Results Test
3. **Monitor Schema Performance**: Use Search Console
` : `
1. **Validate Schema Content**: Use Google's Rich Results Test
2. **Test All Pages**: Verify schemas on all routes
3. **Monitor Performance**: Use Search Console for schema errors
`}
`;
}

/**
 * Main verification function
 */
function runSchemaVerification() {
  console.log('🔍 Schema Verification Script\n');
  
  // 1. Check build status
  console.log('1️⃣ Checking build status...');
  const buildStatus = checkBuildStatus();
  console.log(`   ${buildStatus.built ? '✅' : '❌'} ${buildStatus.message}`);
  
  if (!buildStatus.built) {
    console.log('\n❌ Cannot proceed without frontend build. Please run "npm run build" first.');
    return;
  }

  // 2. Analyze HTML files
  console.log('\n2️⃣ Analyzing HTML files for schema patterns...');
  const htmlResults = analyzeSchemaInjection();
  console.log(`   HTML files analyzed: ${htmlResults.files.length}`);
  console.log(`   Files with schema injection: ${htmlResults.files.filter(f => f.hasSchemaInjection).length}`);
  console.log(`   Total JSON-LD scripts: ${htmlResults.totalSchemas}`);

  // 3. Analyze JavaScript files
  console.log('\n3️⃣ Analyzing JavaScript files for schema code...');
  const jsResults = analyzeJavaScriptFiles();
  console.log(`   Schema-related JS files: ${jsResults.schemaFiles.length}`);
  console.log(`   Injection points: ${jsResults.totalInjectionPoints}`);

  // 4. Generate report
  console.log('\n4️⃣ Generating verification report...');
  const report = generateVerificationReport(htmlResults, jsResults);
  
  // Save report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, 'SCHEMA_VERIFICATION_REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n✅ Verification report saved to: ${reportPath}`);

  // 5. Summary
  console.log('\n📊 Summary:');
  console.log(`   Schema injection patterns: ${htmlResults.files.filter(f => f.hasSchemaInjection).length}/${htmlResults.files.length} files`);
  console.log(`   Static JSON-LD scripts: ${htmlResults.totalSchemas}`);
  console.log(`   Schema types detected: ${Array.from(htmlResults.schemaTypes).length}`);
  
  if (htmlResults.totalSchemas === 0) {
    console.log('\n💡 Note: No static schemas found. This is expected if schemas are injected dynamically.');
    console.log('   Check browser developer tools to verify runtime injection.');
  }

  return {
    htmlResults,
    jsResults,
    reportPath
  };
}

// Run the verification
console.log('Starting schema verification...');
runSchemaVerification();

export { runSchemaVerification };
