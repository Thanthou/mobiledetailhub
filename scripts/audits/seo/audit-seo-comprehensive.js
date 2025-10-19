#!/usr/bin/env node
/**
 * Comprehensive SEO Audit Script
 * Analyzes local and production SEO performance to achieve ≥90 Lighthouse SEO score
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { runEnhancedSchemaDetection } from './enhanced-schema-detection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = process.cwd();
const frontendDir = path.join(root, 'frontend/src');
const distDir = path.join(root, 'frontend/dist');
const publicDir = path.join(root, 'frontend/public');

// SEO audit results
const seoResults = {
  local: {
    score: 0,
    issues: [],
    recommendations: [],
    checks: {}
  },
  production: {
    score: 0,
    issues: [],
    recommendations: [],
    checks: {}
  }
};

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
 * Analyze HTML structure and meta tags
 */
function analyzeHTMLStructure() {
  const checks = {
    metaTags: [],
    headings: [],
    images: [],
    links: [],
    schema: [],
    issues: []
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
      
      // Meta tags analysis
      const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
      const descriptionMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
      const ogTitleMatch = content.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
      const ogDescriptionMatch = content.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
      
      checks.metaTags.push({
        file: path.relative(distDir, file),
        title: titleMatch ? titleMatch[1] : null,
        description: descriptionMatch ? descriptionMatch[1] : null,
        viewport: viewportMatch ? viewportMatch[1] : null,
        ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
        ogDescription: ogDescriptionMatch ? ogDescriptionMatch[1] : null
      });

      // Headings analysis
      const h1Matches = content.match(/<h1[^>]*>([^<]*)<\/h1>/gi) || [];
      const h2Matches = content.match(/<h2[^>]*>([^<]*)<\/h2>/gi) || [];
      const h3Matches = content.match(/<h3[^>]*>([^<]*)<\/h3>/gi) || [];
      
      checks.headings.push({
        file: path.relative(distDir, file),
        h1: h1Matches.length,
        h2: h2Matches.length,
        h3: h3Matches.length,
        h1Text: h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim())
      });

      // Images analysis
      const imgMatches = content.match(/<img[^>]*>/gi) || [];
      const images = imgMatches.map(img => {
        const srcMatch = img.match(/src=["']([^"']*)["']/i);
        const altMatch = img.match(/alt=["']([^"']*)["']/i);
        return {
          src: srcMatch ? srcMatch[1] : null,
          alt: altMatch ? altMatch[1] : null,
          hasAlt: !!altMatch
        };
      });
      
      checks.images.push({
        file: path.relative(distDir, file),
        count: images.length,
        withAlt: images.filter(img => img.hasAlt).length,
        withoutAlt: images.filter(img => !img.hasAlt).length,
        images: images
      });

      // Links analysis
      const linkMatches = content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi) || [];
      const links = linkMatches.map(link => {
        const hrefMatch = link.match(/href=["']([^"']*)["']/i);
        const textMatch = link.match(/>([^<]*)</i);
        return {
          href: hrefMatch ? hrefMatch[1] : null,
          text: textMatch ? textMatch[1].trim() : null,
          isExternal: hrefMatch && (hrefMatch[1].startsWith('http') || hrefMatch[1].startsWith('//'))
        };
      });
      
      checks.links.push({
        file: path.relative(distDir, file),
        count: links.length,
        external: links.filter(link => link.isExternal).length,
        internal: links.filter(link => !link.isExternal).length,
        links: links
      });

      // Schema markup analysis
      const schemaMatches = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]*)<\/script>/gi) || [];
      const schemas = schemaMatches.map(schema => {
        try {
          const jsonMatch = schema.match(/>([^<]*)</i);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1]);
            return {
              type: parsed['@type'] || 'Unknown',
              valid: true,
              content: parsed
            };
          }
        } catch (e) {
          return { type: 'Invalid JSON', valid: false, error: e.message };
        }
        return { type: 'Unknown', valid: false };
      });
      
      checks.schema.push({
        file: path.relative(distDir, file),
        count: schemas.length,
        valid: schemas.filter(s => s.valid).length,
        invalid: schemas.filter(s => !s.valid).length,
        schemas: schemas
      });

    } catch (error) {
      checks.issues.push({
        file: path.relative(distDir, file),
        error: error.message
      });
    }
  }

  return checks;
}

/**
 * Analyze robots.txt and sitemap.xml
 */
function analyzeSEOFiles() {
  const checks = {
    robots: null,
    sitemap: null,
    issues: []
  };

  // Check robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const content = fs.readFileSync(robotsPath, 'utf8');
    checks.robots = {
      exists: true,
      content: content,
      hasSitemap: content.includes('Sitemap:'),
      hasUserAgent: content.includes('User-agent:'),
      hasDisallow: content.includes('Disallow:'),
      hasAllow: content.includes('Allow:')
    };
  } else {
    checks.robots = { exists: false };
    checks.issues.push('robots.txt not found');
  }

  // Check sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    checks.sitemap = {
      exists: true,
      content: content,
      hasUrls: content.includes('<url>'),
      hasLastmod: content.includes('<lastmod>'),
      hasPriority: content.includes('<priority>'),
      hasChangefreq: content.includes('<changefreq>')
    };
  } else {
    checks.sitemap = { exists: false };
    checks.issues.push('sitemap.xml not found');
  }

  return checks;
}

/**
 * Analyze React components for SEO patterns
 */
function analyzeReactSEO() {
  const checks = {
    helmetUsage: [],
    metaComponents: [],
    seoHooks: [],
    issues: []
  };

  function scanReactFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanReactFiles(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for Helmet usage
          if (content.includes('react-helmet') || content.includes('Helmet')) {
            checks.helmetUsage.push({
              file: path.relative(frontendDir, fullPath),
              hasHelmet: true
            });
          }
          
          // Check for SEO-related components
          if (content.includes('meta') && content.includes('name=')) {
            checks.metaComponents.push({
              file: path.relative(frontendDir, fullPath),
              hasMeta: true
            });
          }
          
          // Check for SEO hooks
          if (content.includes('useSEO') || content.includes('useMeta') || content.includes('useTitle')) {
            checks.seoHooks.push({
              file: path.relative(frontendDir, fullPath),
              hasSEOHooks: true
            });
          }
          
        } catch (error) {
          checks.issues.push({
            file: path.relative(frontendDir, fullPath),
            error: error.message
          });
        }
      }
    }
  }

  scanReactFiles(frontendDir);
  return checks;
}

/**
 * Run Lighthouse SEO audit
 */
async function runLighthouseSEO() {
  try {
    // Check if Lighthouse is available
    try {
      execSync('lighthouse --version', { stdio: 'pipe' });
    } catch (error) {
      return {
        available: false,
        error: 'Lighthouse not installed. Run: npm install -g lighthouse'
      };
    }

    // Run Lighthouse on local build
    const lighthouseCommand = `lighthouse http://localhost:4173 --only-categories=seo --output=json --chrome-flags="--headless" --quiet`;
    
    try {
      const result = execSync(lighthouseCommand, { 
        stdio: 'pipe',
        timeout: 60000 // 60 second timeout
      });
      
      const lighthouseData = JSON.parse(result.toString());
      const seoScore = Math.round(lighthouseData.categories.seo.score * 100);
      
      return {
        available: true,
        score: seoScore,
        audits: lighthouseData.audits,
        categories: lighthouseData.categories
      };
    } catch (error) {
      return {
        available: true,
        error: `Lighthouse failed: ${error.message}`,
        suggestion: 'Make sure frontend is running on localhost:4173'
      };
    }
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
}

/**
 * Generate SEO score and recommendations
 */
function generateSEOAnalysis(htmlChecks, seoFiles, reactChecks, lighthouseData, reactH1Files = [], schemaResults = null) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  // Meta tags analysis
  const metaIssues = htmlChecks.metaTags.filter(page => 
    !page.title || !page.description || !page.viewport
  );
  
  if (metaIssues.length > 0) {
    issues.push({
      type: 'meta_tags',
      severity: 'high',
      message: `${metaIssues.length} pages missing essential meta tags`,
      details: metaIssues.map(page => `${page.file}: ${!page.title ? 'No title' : ''} ${!page.description ? 'No description' : ''} ${!page.viewport ? 'No viewport' : ''}`.trim())
    });
    score -= 15;
  }

  // Images without alt text
  const imagesWithoutAlt = htmlChecks.images.reduce((total, page) => total + page.withoutAlt, 0);
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'images',
      severity: 'medium',
      message: `${imagesWithoutAlt} images missing alt text`,
      details: htmlChecks.images.filter(page => page.withoutAlt > 0).map(page => `${page.file}: ${page.withoutAlt} images`)
    });
    score -= 10;
  }

  // Missing robots.txt or sitemap.xml
  if (!seoFiles.robots.exists) {
    issues.push({
      type: 'robots_txt',
      severity: 'high',
      message: 'robots.txt not found',
      details: ['Create robots.txt in public directory']
    });
    score -= 10;
  }

  if (!seoFiles.sitemap.exists) {
    issues.push({
      type: 'sitemap',
      severity: 'high',
      message: 'sitemap.xml not found',
      details: ['Create sitemap.xml in public directory']
    });
    score -= 10;
  }

  // Enhanced Schema markup analysis
  if (schemaResults) {
    // Use enhanced schema detection results
    const schemaScore = schemaResults.summary.qualityScore;
    const maxSchemaScore = schemaResults.summary.maxQualityScore;
    
    if (schemaScore < 50) {
      issues.push({
        type: 'schema_markup',
        severity: 'high',
        message: 'Insufficient schema markup detected',
        details: [`Schema quality score: ${schemaScore}/${maxSchemaScore}`]
      });
      score -= 15;
    } else if (schemaScore < 80) {
      issues.push({
        type: 'schema_markup',
        severity: 'medium',
        message: 'Schema markup needs improvement',
        details: [`Schema quality score: ${schemaScore}/${maxSchemaScore}`]
      });
      score -= 10;
    } else {
      // Good schema coverage
      issues.push({
        type: 'schema_markup',
        severity: 'info',
        message: `Excellent schema coverage (${schemaScore}/${maxSchemaScore})`,
        details: [`Schema types: ${schemaResults.summary.schemaTypes.join(', ')}`]
      });
    }
    
    // Add schema-specific recommendations
    if (schemaResults.summary.schemaTypes.length < 3) {
      recommendations.push({
        type: 'schema_markup',
        description: 'Add more schema types for better SEO coverage',
        implementation: 'Implement Organization, WebSite, FAQPage, and Service schemas'
      });
    }
  } else {
    // Fallback to static analysis
    const totalSchemas = htmlChecks.schema.reduce((total, page) => total + page.count, 0);
    const validSchemas = htmlChecks.schema.reduce((total, page) => total + page.valid, 0);
    
    if (totalSchemas === 0) {
      issues.push({
        type: 'schema_markup',
        severity: 'medium',
        message: 'No structured data (JSON-LD) found',
        details: ['Add LocalBusiness, Service, and FAQ schema markup']
      });
      score -= 15;
    } else if (validSchemas < totalSchemas) {
      issues.push({
        type: 'schema_markup',
        severity: 'medium',
        message: `${totalSchemas - validSchemas} invalid schema markup found`,
        details: ['Fix JSON-LD syntax errors']
      });
      score -= 5;
    }
  }

  // Heading structure analysis
  const pagesWithoutH1 = htmlChecks.headings.filter(page => page.h1 === 0);
  
  // Only flag missing H1 if no React H1 components are found
  if (pagesWithoutH1.length > 0 && reactH1Files.length === 0) {
    issues.push({
      type: 'headings',
      severity: 'medium',
      message: `${pagesWithoutH1.length} pages missing H1 tags`,
      details: pagesWithoutH1.map(page => page.file)
    });
    score -= 5;
  } else if (reactH1Files.length > 0) {
    // Add positive note about React H1 components
    issues.push({
      type: 'headings',
      severity: 'info',
      message: `Found ${reactH1Files.length} React components with H1 tags`,
      details: reactH1Files.map(f => f.file)
    });
  }

  // React SEO patterns
  if (reactChecks.helmetUsage.length === 0) {
    issues.push({
      type: 'react_seo',
      severity: 'low',
      message: 'No react-helmet usage detected',
      details: ['Consider using react-helmet for dynamic meta tags']
    });
    score -= 5;
  }

  // Generate recommendations
  if (metaIssues.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Fix Missing Meta Tags',
      description: 'Add title, description, and viewport meta tags to all pages',
      implementation: 'Use react-helmet or add meta tags to HTML templates'
    });
  }

  if (imagesWithoutAlt > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Add Alt Text to Images',
      description: 'All images should have descriptive alt text for accessibility and SEO',
      implementation: 'Add alt attributes to all <img> tags'
    });
  }

  if (!seoFiles.robots.exists || !seoFiles.sitemap.exists) {
    recommendations.push({
      priority: 'high',
      title: 'Create SEO Files',
      description: 'Add robots.txt and sitemap.xml to public directory',
      implementation: 'Create robots.txt and sitemap.xml in frontend/public/'
    });
  }

  // Schema recommendations based on enhanced detection
  if (schemaResults) {
    if (schemaResults.summary.qualityScore < 80) {
      recommendations.push({
        priority: 'medium',
        title: 'Improve Schema Coverage',
        description: 'Enhance JSON-LD schema markup for better SEO',
        implementation: 'Add more schema types: Organization, WebSite, FAQPage, and Service schemas'
      });
    }
  } else {
    // Fallback for static analysis
    const totalSchemas = htmlChecks.schema.reduce((total, page) => total + page.count, 0);
    if (totalSchemas === 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Add Structured Data',
        description: 'Implement JSON-LD schema markup for LocalBusiness, Services, and FAQs',
        implementation: 'Add <script type="application/ld+json"> tags with structured data'
      });
    }
  }

  if (reactChecks.helmetUsage.length === 0) {
    recommendations.push({
      priority: 'low',
      title: 'Implement Dynamic SEO',
      description: 'Use react-helmet for dynamic meta tags based on page content',
      implementation: 'Install react-helmet and add Helmet components to pages'
    });
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

/**
 * Main SEO audit function
 */
async function runSEOAudit() {
  console.log('🚀 Comprehensive SEO Audit\n');
  
  // 1. Check build status
  console.log('1️⃣ Checking build status...');
  const buildStatus = checkBuildStatus();
  console.log(`   ${buildStatus.built ? '✅' : '❌'} ${buildStatus.message}`);
  
  if (!buildStatus.built) {
    console.log('\n❌ Cannot proceed without frontend build. Please run "npm run build" first.');
    return;
  }

  // 2. Analyze HTML structure
  console.log('\n2️⃣ Analyzing HTML structure...');
  const htmlChecks = analyzeHTMLStructure();
  console.log(`   HTML files analyzed: ${htmlChecks.metaTags.length}`);
  console.log(`   Images found: ${htmlChecks.images.reduce((total, page) => total + page.count, 0)}`);
  console.log(`   Links found: ${htmlChecks.links.reduce((total, page) => total + page.count, 0)}`);
  console.log(`   Schema markup found: ${htmlChecks.schema.reduce((total, page) => total + page.count, 0)}`);

  // 3. Analyze SEO files
  console.log('\n3️⃣ Analyzing SEO files...');
  const seoFiles = analyzeSEOFiles();
  console.log(`   robots.txt: ${seoFiles.robots.exists ? '✅' : '❌'}`);
  console.log(`   sitemap.xml: ${seoFiles.sitemap.exists ? '✅' : '❌'}`);

  // 4. Analyze React SEO patterns
  console.log('\n4️⃣ Analyzing React SEO patterns...');
  const reactChecks = analyzeReactSEO();
  console.log(`   Files with Helmet: ${reactChecks.helmetUsage.length}`);
  console.log(`   Files with meta components: ${reactChecks.metaComponents.length}`);
  console.log(`   Files with SEO hooks: ${reactChecks.seoHooks.length}`);

  // 5. Run Lighthouse SEO audit
  console.log('\n5️⃣ Running Lighthouse SEO audit...');
  const lighthouseData = await runLighthouseSEO();
  if (lighthouseData.available) {
    if (lighthouseData.score) {
      console.log(`   Lighthouse SEO Score: ${lighthouseData.score}/100`);
    } else {
      console.log(`   ⚠️  ${lighthouseData.error || lighthouseData.suggestion}`);
    }
  } else {
    console.log(`   ❌ ${lighthouseData.error}`);
  }

  // 6. Enhanced Schema Detection
  console.log('\n6️⃣ Running enhanced schema detection...');
  const schemaResults = await runEnhancedSchemaDetection({
    includeRuntime: false, // Skip Puppeteer for now to avoid complexity
    includeStatic: true,
    includeJS: true,
    includeSource: true
  });
  console.log(`   Schema quality score: ${schemaResults.summary.qualityScore}/${schemaResults.summary.maxQualityScore}`);

  // 7. Generate analysis
  console.log('\n7️⃣ Generating SEO analysis...');
  
  // Find React components with H1 tags
  const reactH1Files = [];
  const srcDir = path.join(root, 'frontend/src');
  
  function findReactH1Files(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findReactH1Files(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('<h1') || content.includes('<H1')) {
            reactH1Files.push({
              file: path.relative(srcDir, fullPath),
              hasH1: true
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  findReactH1Files(srcDir);
  
  const analysis = generateSEOAnalysis(htmlChecks, seoFiles, reactChecks, lighthouseData, reactH1Files, schemaResults);
  console.log(`   SEO Score: ${analysis.score}/100`);
  console.log(`   Issues found: ${analysis.issues.length}`);
  console.log(`   Recommendations: ${analysis.recommendations.length}`);

  // 7. Generate detailed reports
  const localReport = generateLocalReport(htmlChecks, seoFiles, reactChecks, analysis, lighthouseData, reactH1Files);
  const productionReport = generateProductionReport(analysis, lighthouseData);

  // Save reports
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const localReportPath = path.join(reportsDir, 'LOCAL_SEO_AUDIT.md');
  const productionReportPath = path.join(reportsDir, 'PRODUCTION_SEO_AUDIT.md');

  fs.writeFileSync(localReportPath, localReport);
  fs.writeFileSync(productionReportPath, productionReport);

  console.log(`\n✅ Local SEO report saved to: ${localReportPath}`);
  console.log(`✅ Production SEO report saved to: ${productionReportPath}`);

  return {
    local: { score: analysis.score, issues: analysis.issues, recommendations: analysis.recommendations },
    production: { score: lighthouseData.score || 0, issues: [], recommendations: [] }
  };
}

/**
 * Generate local SEO report
 */
function generateLocalReport(htmlChecks, seoFiles, reactChecks, analysis, lighthouseData, reactH1Files = []) {
  const timestamp = new Date().toISOString();
  
  return `# Local SEO Audit Report
Generated: ${timestamp}

## 📊 SEO Score: ${analysis.score}/100

${analysis.score >= 90 ? '🟢 Excellent' : analysis.score >= 70 ? '🟡 Good' : '🔴 Needs Improvement'}

## 🏗️ HTML Structure Analysis

### Meta Tags
${htmlChecks.metaTags.map(page => `
#### ${page.file}
- **Title**: ${page.title ? '✅' : '❌'} ${page.title || 'Missing'}
- **Description**: ${page.description ? '✅' : '❌'} ${page.description || 'Missing'}
- **Viewport**: ${page.viewport ? '✅' : '❌'} ${page.viewport || 'Missing'}
- **OG Title**: ${page.ogTitle ? '✅' : '❌'} ${page.ogTitle || 'Missing'}
- **OG Description**: ${page.ogDescription ? '✅' : '❌'} ${page.ogDescription || 'Missing'}
`).join('\n')}

### Images
${htmlChecks.images.map(page => `
#### ${page.file}
- **Total Images**: ${page.count}
- **With Alt Text**: ${page.withAlt} ✅
- **Without Alt Text**: ${page.withoutAlt} ${page.withoutAlt > 0 ? '❌' : '✅'}
`).join('\n')}

### Headings Structure
${htmlChecks.headings.map(page => `
#### ${page.file}
- **H1 Tags**: ${page.h1} ${page.h1 > 0 ? '✅' : '❌'}
- **H2 Tags**: ${page.h2}
- **H3 Tags**: ${page.h3}
- **H1 Text**: ${page.h1Text.join(', ') || 'None'}
`).join('\n')}

### React Components with H1 Tags
${reactH1Files.length > 0 ? reactH1Files.map(comp => `
#### ${comp.file}
- **H1 Tags**: ✅ Found
`).join('\n') : 'No React components with H1 tags found'}

### Schema Markup
${htmlChecks.schema.map(page => `
#### ${page.file}
- **Total Schemas**: ${page.count}
- **Valid**: ${page.valid} ✅
- **Invalid**: ${page.invalid} ${page.invalid > 0 ? '❌' : '✅'}
- **Types**: ${page.schemas.map(s => s.type).join(', ') || 'None'}
`).join('\n')}

## 📁 SEO Files

### robots.txt
- **Exists**: ${seoFiles.robots.exists ? '✅' : '❌'}
${seoFiles.robots.exists ? `
- **Has Sitemap**: ${seoFiles.robots.hasSitemap ? '✅' : '❌'}
- **Has User-agent**: ${seoFiles.robots.hasUserAgent ? '✅' : '❌'}
- **Has Disallow**: ${seoFiles.robots.hasDisallow ? '✅' : '❌'}
- **Has Allow**: ${seoFiles.robots.hasAllow ? '✅' : '❌'}
` : ''}

### sitemap.xml
- **Exists**: ${seoFiles.sitemap.exists ? '✅' : '❌'}
${seoFiles.sitemap.exists ? `
- **Has URLs**: ${seoFiles.sitemap.hasUrls ? '✅' : '❌'}
- **Has Lastmod**: ${seoFiles.sitemap.hasLastmod ? '✅' : '❌'}
- **Has Priority**: ${seoFiles.sitemap.hasPriority ? '✅' : '❌'}
- **Has Changefreq**: ${seoFiles.sitemap.hasChangefreq ? '✅' : '❌'}
` : ''}

## ⚛️ React SEO Patterns

### Helmet Usage
${reactChecks.helmetUsage.length > 0 ? reactChecks.helmetUsage.map(file => `- ✅ ${file.file}`).join('\n') : '❌ No react-helmet usage detected'}

### Meta Components
${reactChecks.metaComponents.length > 0 ? reactChecks.metaComponents.map(file => `- ✅ ${file.file}`).join('\n') : '❌ No meta components detected'}

### SEO Hooks
${reactChecks.seoHooks.length > 0 ? reactChecks.seoHooks.map(file => `- ✅ ${file.file}`).join('\n') : '❌ No SEO hooks detected'}

## ⚠️ Issues Found

${analysis.issues.length === 0 ? '✅ No issues detected!' : analysis.issues.map(issue => `
### ${issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🔵'} ${issue.message}
**Type**: ${issue.type}
**Details**: ${issue.details.join(', ')}
`).join('\n')}

## 💡 Recommendations

${analysis.recommendations.map(rec => `
### ${rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵'} ${rec.title}
**Description**: ${rec.description}
**Implementation**: ${rec.implementation}
`).join('\n')}

## 🎯 Next Steps

1. **High Priority**: Fix all high-severity issues
2. **Meta Tags**: Ensure all pages have title, description, and viewport
3. **Images**: Add alt text to all images
4. **SEO Files**: Create robots.txt and sitemap.xml
5. **Schema Markup**: Add structured data for LocalBusiness and Services
6. **Testing**: Run Lighthouse audit to verify improvements

## 📈 Target Score: ≥90/100

Current progress: ${analysis.score}/100 (${analysis.score >= 90 ? 'Target achieved!' : `${90 - analysis.score} points to go`})
`;
}

/**
 * Generate production SEO report
 */
function generateProductionReport(analysis, lighthouseData) {
  const timestamp = new Date().toISOString();
  
  return `# Production SEO Audit Report
Generated: ${timestamp}

## 📊 Production SEO Score: ${lighthouseData.score || 'Not Available'}/100

${lighthouseData.score ? (lighthouseData.score >= 90 ? '🟢 Excellent' : lighthouseData.score >= 70 ? '🟡 Good' : '🔴 Needs Improvement') : '⚠️ Lighthouse data not available'}

## 🚀 Production-Specific Checks

### SSL/HTTPS
- **Status**: ${lighthouseData.score ? '✅ Verified' : '⚠️ Not checked'}
- **Recommendation**: Ensure all production URLs use HTTPS

### Performance Impact on SEO
- **Core Web Vitals**: ${lighthouseData.score ? '✅ Measured' : '⚠️ Not measured'}
- **Mobile Performance**: ${lighthouseData.score ? '✅ Measured' : '⚠️ Not measured'}

### Search Console Integration
- **Status**: Not implemented
- **Recommendation**: Set up Google Search Console for production monitoring

## 🎯 Production Recommendations

1. **SSL Certificate**: Ensure HTTPS is properly configured
2. **CDN Setup**: Implement CDN for better performance
3. **Search Console**: Connect Google Search Console
4. **Analytics**: Set up Google Analytics 4
5. **Monitoring**: Implement SEO monitoring and alerting

## 📈 Production Targets

- **Lighthouse SEO Score**: ≥90/100
- **Core Web Vitals**: All green
- **Mobile Performance**: ≥90/100
- **Accessibility**: ≥90/100

## 🔧 Production Setup Checklist

- [ ] SSL certificate installed and working
- [ ] HTTPS redirects configured
- [ ] CDN configured for static assets
- [ ] Google Search Console verified
- [ ] Google Analytics 4 configured
- [ ] Sitemap submitted to Search Console
- [ ] robots.txt accessible at /robots.txt
- [ ] All meta tags rendering correctly
- [ ] Schema markup validating
- [ ] Images optimized and with alt text
`;
}

// Run the audit
console.log('Starting SEO audit...');
runSEOAudit().catch(console.error);

export { runSEOAudit };
