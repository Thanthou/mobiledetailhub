#!/usr/bin/env node

/**
 * Asset/Static File Audit
 * 
 * Checks favicons, image optimization, static file serving
 * Priority: 🟡 Medium - Improves UX and performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAuditResult, saveReport, finishAudit } from './shared/audit-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const audit = createAuditResult('Assets', process.env.AUDIT_SILENT === 'true');

// Modern favicon requirements (SVG + PNG sizes)
const REQUIRED_FAVICONS = [
  { name: 'favicon.svg', size: 'vector', format: 'svg', priority: 'high' },
  { name: 'favicon-16x16.png', size: '16x16', format: 'png', priority: 'high' },
  { name: 'favicon-32x32.png', size: '32x32', format: 'png', priority: 'high' },
  { name: 'apple-touch-icon.png', size: '180x180', format: 'png', priority: 'medium' },
  { name: 'android-chrome-192x192.png', size: '192x192', format: 'png', priority: 'medium' },
  { name: 'android-chrome-512x512.png', size: '512x512', format: 'png', priority: 'medium' }
];

// Legacy favicon (optional for ancient browsers)
const LEGACY_FAVICON = { name: 'favicon.ico', size: '16x16,32x32', format: 'ico', priority: 'low' };

// Image optimization thresholds
const IMAGE_THRESHOLDS = {
  maxSizeKB: 500, // 500KB max for web images
  maxWidth: 1920, // Max width for responsive images
  maxHeight: 1080, // Max height for responsive images
  webpSupported: true,
  avifSupported: false // Not widely supported yet
};

audit.section('Favicon Check');
checkFavicons();

audit.section('Static File Serving');
checkStaticFileServing();

audit.section('Image Optimization');
checkImageOptimization();

audit.section('Asset Organization');
checkAssetOrganization();

audit.section('Public Directory Structure');
checkPublicDirectoryStructure();

audit.section('Build Assets');
checkBuildAssets();

function checkFavicons() {
  const publicDir = path.join(projectRoot, 'frontend/public');
  const backendPublicDir = path.join(projectRoot, 'backend/public');
  
  let foundFavicons = 0;
  let totalRequired = REQUIRED_FAVICONS.length;
  let highPriorityFound = 0;
  let highPriorityRequired = REQUIRED_FAVICONS.filter(f => f.priority === 'high').length;

  // Check frontend public directory for modern favicons
  if (fs.existsSync(publicDir)) {
    for (const favicon of REQUIRED_FAVICONS) {
      const faviconPath = path.join(publicDir, favicon.name);
      if (fs.existsSync(faviconPath)) {
        foundFavicons++;
        if (favicon.priority === 'high') highPriorityFound++;
        
        audit.pass(`Favicon found: ${favicon.name} (${favicon.size})`);
        
        // Check file size
        const stats = fs.statSync(faviconPath);
        const sizeKB = Math.round(stats.size / 1024);
        if (sizeKB < 100) {
          audit.pass(`Favicon size OK: ${favicon.name} (${sizeKB}KB)`);
        } else {
          audit.warn(`Favicon size large: ${favicon.name} (${sizeKB}KB)`, faviconPath);
        }
      } else {
        if (favicon.priority === 'high') {
          audit.warn(`Missing high-priority favicon: ${favicon.name}`, publicDir);
        } else {
          audit.info(`Missing optional favicon: ${favicon.name}`, publicDir);
        }
      }
    }
  }

  // Check for legacy favicon (optional)
  if (fs.existsSync(publicDir)) {
    const legacyPath = path.join(publicDir, LEGACY_FAVICON.name);
    if (fs.existsSync(legacyPath)) {
      const stats = fs.statSync(legacyPath);
      const sizeKB = Math.round(stats.size / 1024);
      if (sizeKB < 100) {
        audit.pass(`Legacy favicon found: ${LEGACY_FAVICON.name} (${sizeKB}KB)`);
      } else {
        audit.warn(`Legacy favicon large: ${LEGACY_FAVICON.name} (${sizeKB}KB)`, legacyPath);
      }
    } else {
      audit.info(`Legacy favicon not found: ${LEGACY_FAVICON.name} (optional for modern browsers)`);
    }
  }

  // Check backend public directories for modern favicons
  const backendApps = ['main', 'admin', 'tenant'];
  for (const app of backendApps) {
    const appPublicDir = path.join(backendPublicDir, app);
    if (fs.existsSync(appPublicDir)) {
      // Check for SVG favicon (modern)
      const svgPath = path.join(appPublicDir, 'favicon.svg');
      if (fs.existsSync(svgPath)) {
        audit.pass(`Backend SVG favicon found: ${app}/favicon.svg`);
      } else {
        audit.info(`Backend SVG favicon not found: ${app}/favicon.svg (will use frontend version)`);
      }
      
      // Check for PNG favicons
      const png16Path = path.join(appPublicDir, 'favicon-16x16.png');
      const png32Path = path.join(appPublicDir, 'favicon-32x32.png');
      if (fs.existsSync(png16Path) && fs.existsSync(png32Path)) {
        audit.pass(`Backend PNG favicons found: ${app}/favicon-*.png`);
      } else {
        audit.info(`Backend PNG favicons not found: ${app}/favicon-*.png (will use frontend versions)`);
      }
    }
  }

  // Check for favicon in HTML files
  checkFaviconReferences();

  audit.info(`Modern favicons found: ${foundFavicons}/${totalRequired}`);
  audit.info(`High-priority favicons: ${highPriorityFound}/${highPriorityRequired}`);
}

function checkFaviconReferences() {
  const htmlFiles = [
    path.join(projectRoot, 'frontend/index.html'),
    path.join(projectRoot, 'backend/public/main/index.html'),
    path.join(projectRoot, 'backend/public/admin/index.html'),
    path.join(projectRoot, 'backend/public/tenant/index.html')
  ];

  for (const htmlFile of htmlFiles) {
    if (fs.existsSync(htmlFile)) {
      const content = fs.readFileSync(htmlFile, 'utf8');
      
      // Check for modern SVG favicon (highest priority)
      if (content.includes('<link rel="icon" type="image/svg+xml"')) {
        audit.pass(`SVG favicon referenced in HTML: ${path.basename(htmlFile)}`);
      } else if (content.includes('<link rel="icon" href="/favicon.svg"')) {
        audit.pass(`SVG favicon referenced in HTML: ${path.basename(htmlFile)}`);
      } else {
        audit.warn(`SVG favicon not referenced in HTML: ${path.basename(htmlFile)}`, htmlFile);
      }

      // Check for PNG favicon references
      if (content.includes('<link rel="icon" type="image/png"')) {
        audit.pass(`PNG favicon referenced in HTML: ${path.basename(htmlFile)}`);
      } else {
        audit.info(`PNG favicon not referenced in HTML: ${path.basename(htmlFile)} (optional)`);
      }

      // Check for legacy .ico favicon (optional)
      if (content.includes('<link rel="icon" type="image/x-icon"')) {
        audit.pass(`Legacy favicon referenced in HTML: ${path.basename(htmlFile)}`);
      } else {
        audit.info(`Legacy favicon not referenced in HTML: ${path.basename(htmlFile)} (optional)`);
      }

      // Check for Apple touch icon
      if (content.includes('<link rel="apple-touch-icon"')) {
        audit.pass(`Apple touch icon referenced in HTML: ${path.basename(htmlFile)}`);
      } else {
        audit.warn(`Apple touch icon not referenced in HTML: ${path.basename(htmlFile)}`, htmlFile);
      }

      // Check for theme color
      if (content.includes('<meta name="theme-color"')) {
        audit.pass(`Theme color meta tag found: ${path.basename(htmlFile)}`);
      } else {
        audit.warn(`Theme color meta tag missing: ${path.basename(htmlFile)}`, htmlFile);
      }
    }
  }
}

function checkStaticFileServing() {
  // Check both server.js and bootstrap files
  const serverFiles = [
    path.join(projectRoot, 'backend/server.js'),
    path.join(projectRoot, 'backend/bootstrap/server.start.js'),
    path.join(projectRoot, 'backend/bootstrap/setupSecurity.js')
  ];
  
  let serverContent = '';
  let filesFound = [];
  
  for (const serverFile of serverFiles) {
    if (fs.existsSync(serverFile)) {
      serverContent += fs.readFileSync(serverFile, 'utf8') + '\n';
      filesFound.push(path.relative(projectRoot, serverFile));
    }
  }
  
  if (filesFound.length === 0) {
    audit.error('Server files not found', { path: 'backend/server.js or backend/bootstrap/' });
    return;
  }
  
  // Check for static file serving
  if (serverContent.includes('express.static')) {
    audit.pass('Express static file serving configured');
    
    // Check for specific static directories
    const staticDirs = ['public', 'uploads', 'assets'];
    for (const dir of staticDirs) {
      if (serverContent.includes(dir)) {
        audit.pass(`Static directory configured: ${dir}`);
      }
    }
  } else {
    audit.error('Express static file serving not configured', { path: 'backend/server.js or backend/bootstrap/server.start.js' });
  }

  // Check for proper static file headers (cache headers)
  if (serverContent.includes('maxAge') || serverContent.includes('Cache-Control') || serverContent.includes('cache-control')) {
    audit.pass('Cache headers configured for static files');
  } else {
    audit.warn('Cache headers not configured for static files', { path: filesFound.join(', ') });
  }

  // Check for security headers on static files
  if (serverContent.includes('helmet') || serverContent.includes('security')) {
    audit.pass('Security headers configured');
  } else {
    audit.warn('Security headers not configured', { path: filesFound.join(', ') });
  }
}

function checkImageOptimization() {
  const uploadsDir = path.join(projectRoot, 'backend/uploads');
  const publicDir = path.join(projectRoot, 'frontend/public');
  
  let totalImages = 0;
  let optimizedImages = 0;
  let oversizedImages = 0;

  // Check uploads directory
  if (fs.existsSync(uploadsDir)) {
    const imageFiles = findImageFiles(uploadsDir);
    totalImages += imageFiles.length;

    for (const imageFile of imageFiles) {
      const stats = fs.statSync(imageFile);
      const sizeKB = Math.round(stats.size / 1024);
      
      if (sizeKB <= IMAGE_THRESHOLDS.maxSizeKB) {
        optimizedImages++;
        audit.pass(`Image size OK: ${path.basename(imageFile)} (${sizeKB}KB)`);
      } else {
        oversizedImages++;
        audit.warn(`Image size large: ${path.basename(imageFile)} (${sizeKB}KB)`, imageFile);
      }
    }
  }

  // Check frontend public directory
  if (fs.existsSync(publicDir)) {
    const imageFiles = findImageFiles(publicDir);
    totalImages += imageFiles.length;

    for (const imageFile of imageFiles) {
      const stats = fs.statSync(imageFile);
      const sizeKB = Math.round(stats.size / 1024);
      
      if (sizeKB <= IMAGE_THRESHOLDS.maxSizeKB) {
        optimizedImages++;
        audit.pass(`Public image size OK: ${path.basename(imageFile)} (${sizeKB}KB)`);
      } else {
        oversizedImages++;
        audit.warn(`Public image size large: ${path.basename(imageFile)} (${sizeKB}KB)`, imageFile);
      }
    }
  }

  // Check for WebP support
  if (fs.existsSync(uploadsDir) || fs.existsSync(publicDir)) {
    const allImageFiles = [
      ...findImageFiles(uploadsDir),
      ...findImageFiles(publicDir)
    ];

    const webpFiles = allImageFiles.filter(file => file.endsWith('.webp'));
    if (webpFiles.length > 0) {
      audit.pass(`WebP images found: ${webpFiles.length}`);
    } else {
      audit.warn('No WebP images found - consider adding WebP support for better performance');
    }
  }

  audit.info(`Total images: ${totalImages}`);
  audit.info(`Optimized images: ${optimizedImages}/${totalImages}`);
  audit.info(`Oversized images: ${oversizedImages}`);
}

function findImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const imageFiles = [];

  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
        // Skip .original backup files created by image optimization
        if (!file.includes('.original.')) {
          imageFiles.push(filePath);
        }
      }
    }
  }

  scanDirectory(dir);
  return imageFiles;
}

function checkAssetOrganization() {
  const frontendDir = path.join(projectRoot, 'frontend');
  const backendDir = path.join(projectRoot, 'backend');
  
  // Check frontend asset organization
  const frontendAssetDirs = [
    'src/assets',
    'src/images',
    'src/icons',
    'public/images',
    'public/icons'
  ];

  let organizedAssets = 0;
  for (const assetDir of frontendAssetDirs) {
    const fullPath = path.join(frontendDir, assetDir);
    if (fs.existsSync(fullPath)) {
      organizedAssets++;
      audit.pass(`Frontend asset directory exists: ${assetDir}`);
    }
  }

  // Check backend asset organization
  const backendAssetDirs = [
    'uploads',
    'public',
    'templates'
  ];

  for (const assetDir of backendAssetDirs) {
    const fullPath = path.join(backendDir, assetDir);
    if (fs.existsSync(fullPath)) {
      audit.pass(`Backend asset directory exists: ${assetDir}`);
    } else {
      audit.warn(`Backend asset directory missing: ${assetDir}`, backendDir);
    }
  }

  // Check for asset manifest or build files
  const buildFiles = [
    'dist',
    'build',
    'assets.json',
    'manifest.json'
  ];

  for (const buildFile of buildFiles) {
    const fullPath = path.join(frontendDir, buildFile);
    if (fs.existsSync(fullPath)) {
      audit.pass(`Build asset file/directory exists: ${buildFile}`);
    }
  }
}

function checkPublicDirectoryStructure() {
  const backendPublicDir = path.join(projectRoot, 'backend/public');
  
  if (!fs.existsSync(backendPublicDir)) {
    audit.error('Backend public directory not found', { path: 'backend/public' });
    return;
  }

  const publicApps = fs.readdirSync(backendPublicDir)
    .filter(item => {
      const itemPath = path.join(backendPublicDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

  audit.info(`Public apps found: ${publicApps.join(', ')}`);

  for (const app of publicApps) {
    const appDir = path.join(backendPublicDir, app);
    const indexFile = path.join(appDir, 'index.html');
    
    if (fs.existsSync(indexFile)) {
      audit.pass(`App index.html exists: ${app}`);
    } else {
      audit.error(`App index.html missing: ${app}`, appDir);
    }

    // Check for app-specific assets
    const appAssets = fs.readdirSync(appDir)
      .filter(item => {
        const itemPath = path.join(appDir, item);
        return fs.statSync(itemPath).isFile();
      });

    if (appAssets.length > 0) {
      audit.pass(`App has assets: ${app} (${appAssets.length} files)`);
    } else {
      audit.warn(`App has no assets: ${app}`, appDir);
    }
  }
}

function checkBuildAssets() {
  const frontendDir = path.join(projectRoot, 'frontend');
  
  // Check for build configuration
  const buildConfigs = [
    'vite.config.ts',
    'vite.config.js',
    'webpack.config.js',
    'rollup.config.js'
  ];

  let buildConfigFound = false;
  for (const config of buildConfigs) {
    const configPath = path.join(frontendDir, config);
    if (fs.existsSync(configPath)) {
      buildConfigFound = true;
      audit.pass(`Build configuration found: ${config}`);
    }
  }

  if (!buildConfigFound) {
    audit.warn('No build configuration found', { path: 'frontend/' });
  }

  // Check for asset optimization in build config
  if (fs.existsSync(path.join(frontendDir, 'vite.config.ts'))) {
    const viteConfig = fs.readFileSync(path.join(frontendDir, 'vite.config.ts'), 'utf8');
    
    if (viteConfig.includes('build.rollupOptions') || viteConfig.includes('build.chunkSizeWarningLimit')) {
      audit.pass('Vite build optimization configured');
    } else {
      audit.warn('Vite build optimization not configured', { path: 'frontend/vite.config.ts' });
    }
  }

  // Check for dist directory
  const distDir = path.join(frontendDir, 'dist');
  if (fs.existsSync(distDir)) {
    audit.pass('Build output directory exists: dist');
    
    const distFiles = fs.readdirSync(distDir);
    if (distFiles.length > 0) {
      audit.pass(`Build output has files: ${distFiles.length} files`);
    } else {
      audit.warn('Build output directory is empty', distDir);
    }
  } else {
    audit.warn('Build output directory not found: dist', frontendDir);
  }
}

// Calculate score
const totalChecks = audit.passed + audit.warnings + audit.errors;
const score = totalChecks > 0 ? Math.round((audit.passed / totalChecks) * 100) : 0;

audit.section('Summary');
audit.info(`Total asset checks: ${totalChecks}`);
audit.info(`Score: ${score}/100`);

// Save report and finish
saveReport(audit, 'ASSETS_AUDIT.md', {
  description: 'Validates static assets, favicons, images, and file serving configuration',
  recommendations: [
    'Generate all required favicon sizes: 16x16, 32x32, 180x180, 192x192, 512x512',
    'Optimize images to be under 500KB for web delivery',
    'Add WebP versions of images for better performance',
    'Configure static file caching headers in server.js',
    'Add favicon references to all HTML files (<link rel="icon">)',
    'Ensure backend/public directories exist for each app (main, admin, tenant)'
  ]
});

finishAudit(audit);
