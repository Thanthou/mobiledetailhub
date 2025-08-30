#!/usr/bin/env node

/**
 * Image Optimization Script for Mobile Detail Hub
 * 
 * This script converts PNG images to WebP format with multiple responsive sizes
 * and generates the necessary PWA icons.
 * 
 * Prerequisites:
 * npm install sharp
 * 
 * Usage:
 * node scripts/convert-images.js
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../dist');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Responsive sizes for hero images
const HERO_SIZES = [
  { width: 640, suffix: '-sm' },   // Mobile
  { width: 1024, suffix: '-md' },  // Tablet  
  { width: 1920, suffix: '-lg' },  // Desktop
  { width: 2560, suffix: '-xl' }   // Large desktop
];

// PWA icon sizes
const ICON_SIZES = [
  { size: 192, name: 'icon-192.webp' },
  { size: 512, name: 'icon-512.webp' },
  { size: 64, name: 'favicon.webp' }
];

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    // Created directory
  }
}

async function convertHeroImages() {
  // Converting hero images
  
  const heroInputDir = path.join(INPUT_DIR, 'hero');
  const heroOutputDir = path.join(OUTPUT_DIR, 'hero');
  
      // Looking in hero directory
  
  await ensureDirectoryExists(heroOutputDir);
  
  try {
    const files = await fs.readdir(heroInputDir);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    
    // Found PNG files
    
    if (pngFiles.length === 0) {
              // No PNG files found in hero directory
      return;
    }
    
    for (const file of pngFiles) {
      const inputPath = path.join(heroInputDir, file);
      const baseName = path.parse(file).name;
      
      // Converting file
      
      // Generate responsive sizes
      for (const size of HERO_SIZES) {
        const outputPath = path.join(heroOutputDir, `${baseName}${size.suffix}.webp`);
        
        await sharp(inputPath)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'cover'
          })
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
          
                  // Generated webp file
      }
      
      // Generate AVIF for modern browsers (optional)
      const avifPath = path.join(heroOutputDir, `${baseName}.avif`);
      await sharp(inputPath)
        .resize(1920, null, { 
          withoutEnlargement: true,
          fit: 'cover'
        })
        .avif({ quality: 75, effort: 6 })
        .toFile(avifPath);
        
              // Generated avif file
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Hero directory not found - skipping hero image conversion
    } else {
      console.error(`❌ Error processing hero images: ${error.message}`);
    }
  }
}

async function generatePWAIcons() {
  // Generating PWA icons
  
  const logoInputPath = path.join(INPUT_DIR, 'assets', 'logo.webp');
  const assetsOutputDir = path.join(OUTPUT_DIR, 'assets');
  
  await ensureDirectoryExists(assetsOutputDir);
  
  try {
    // Check if logo exists
    await fs.access(logoInputPath);
    
    for (const iconConfig of ICON_SIZES) {
      const outputPath = path.join(assetsOutputDir, iconConfig.name);
      
      await sharp(logoInputPath)
        .resize(iconConfig.size, iconConfig.size, {
          fit: 'contain',
          background: { r: 11, g: 11, b: 11, alpha: 1 } // Match theme color
        })
        .webp({ quality: 90 })
        .toFile(outputPath);
        
              // Generated icon
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
              // Logo file not found - skipping PWA icon generation
              // Expected: dist/assets/logo.webp
    } else {
      console.error(`❌ Error generating PWA icons: ${error.message}`);
    }
  }
}

async function optimizeAssetImages() {
  // Optimizing asset images
  
  const assetsInputDir = path.join(INPUT_DIR, 'assets');
  const assetsOutputDir = path.join(OUTPUT_DIR, 'assets');
  
      // Looking in assets directory
  
  await ensureDirectoryExists(assetsOutputDir);
  
  try {
    const files = await fs.readdir(assetsInputDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.png') && !file.includes('logo')
    );
    
    // Found PNG files
    
    if (imageFiles.length === 0) {
              // No PNG files found in assets directory
      return;
    }
    
    for (const file of imageFiles) {
      const inputPath = path.join(assetsInputDir, file);
      const baseName = path.parse(file).name;
      const outputPath = path.join(assetsOutputDir, `${baseName}.webp`);
      
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
        
              // Converted file to webp
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
              // Assets directory not found - skipping asset optimization
    } else {
      console.error(`❌ Error optimizing asset images: ${error.message}`);
    }
  }
}

async function main() {
  // Starting image optimization
      // Looking for images in input directory
      // Output directory
  
  try {
    await convertHeroImages();
    await generatePWAIcons();
    await optimizeAssetImages();
    
    // Image optimization complete
    // Next steps:
    // 1. Update image references in components
    // 2. Add manifest link to index.html
    // 3. Test PWA installability
    
  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run only if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { convertHeroImages, generatePWAIcons, optimizeAssetImages };
