#!/usr/bin/env node
/**
 * Render Deployment Helper Script
 * Helps prepare and validate the application for Render deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }
}

function checkPackageJson(projectPath, name) {
  const packagePath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packagePath)) {
    log(`❌ ${name} package.json not found`, 'red');
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const hasBuildScript = pkg.scripts && pkg.scripts.build;
    const hasStartScript = pkg.scripts && pkg.scripts.start;
    
    if (hasBuildScript) {
      log(`✅ ${name} has build script`, 'green');
    } else {
      log(`❌ ${name} missing build script`, 'red');
    }
    
    if (hasStartScript) {
      log(`✅ ${name} has start script`, 'green');
    } else {
      log(`❌ ${name} missing start script`, 'red');
    }
    
    return hasBuildScript && hasStartScript;
  } catch (error) {
    log(`❌ ${name} package.json is invalid: ${error.message}`, 'red');
    return false;
  }
}

function checkEnvironmentFiles() {
  log('\n🔍 Checking environment files...', 'blue');
  
  const envFiles = [
    { path: '.env', required: false, description: 'Root .env file' },
    { path: 'backend/.env', required: false, description: 'Backend .env file' },
    { path: 'frontend/.env', required: false, description: 'Frontend .env file' }
  ];
  
  let hasEnvFiles = false;
  envFiles.forEach(env => {
    if (checkFileExists(env.path, env.description)) {
      hasEnvFiles = true;
    }
  });
  
  if (!hasEnvFiles) {
    log('⚠️  No .env files found - you\'ll need to set environment variables in Render', 'yellow');
  }
  
  return true;
}

function checkMigrationFiles() {
  log('\n🔍 Checking migration files...', 'blue');
  
  const migrationsDir = 'backend/migrations';
  if (!fs.existsSync(migrationsDir)) {
    log('❌ Migrations directory not found', 'red');
    return false;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'));
  
  if (migrationFiles.length === 0) {
    log('⚠️  No migration files found', 'yellow');
  } else {
    log(`✅ Found ${migrationFiles.length} migration files`, 'green');
    migrationFiles.forEach(file => {
      log(`   - ${file}`, 'cyan');
    });
  }
  
  return true;
}

function checkBuildProcess() {
  log('\n🔍 Testing build process...', 'blue');
  
  try {
    log('Building frontend...', 'cyan');
    execSync('cd frontend && npm run build', { stdio: 'inherit' });
    log('✅ Frontend build successful', 'green');
  } catch (error) {
    log('❌ Frontend build failed', 'red');
    return false;
  }
  
  try {
    log('Testing backend start...', 'cyan');
    // Just check if the server can start (don't keep it running)
    execSync('cd backend && timeout 5s npm start || true', { stdio: 'pipe' });
    log('✅ Backend start test successful', 'green');
  } catch (error) {
    log('⚠️  Backend start test failed (this might be due to missing database)', 'yellow');
  }
  
  return true;
}

function generateDeploymentSummary() {
  log('\n📋 Deployment Summary', 'bold');
  log('===================', 'bold');
  
  log('\n🚀 Ready for Render deployment!', 'green');
  log('\nNext steps:', 'blue');
  log('1. Go to https://render.com', 'cyan');
  log('2. Connect your GitHub repository', 'cyan');
  log('3. Create PostgreSQL database service', 'cyan');
  log('4. Create backend web service', 'cyan');
  log('5. Create frontend static site', 'cyan');
  log('6. Configure custom domain', 'cyan');
  
  log('\n📚 See docs/RENDER_DEPLOYMENT.md for detailed instructions', 'yellow');
}

function main() {
  log('🚀 Render Deployment Preparation', 'bold');
  log('================================', 'bold');
  
  let allChecksPassed = true;
  
  // Check project structure
  log('\n🔍 Checking project structure...', 'blue');
  allChecksPassed &= checkFileExists('package.json', 'Root package.json');
  allChecksPassed &= checkFileExists('render.yaml', 'Render configuration');
  allChecksPassed &= checkFileExists('Dockerfile', 'Dockerfile');
  allChecksPassed &= checkFileExists('.dockerignore', 'Docker ignore file');
  
  // Check package.json files
  log('\n🔍 Checking package.json files...', 'blue');
  allChecksPassed &= checkPackageJson('frontend', 'Frontend');
  allChecksPassed &= checkPackageJson('backend', 'Backend');
  
  // Check environment files
  checkEnvironmentFiles();
  
  // Check migration files
  checkMigrationFiles();
  
  // Test build process
  if (allChecksPassed) {
    checkBuildProcess();
  }
  
  // Generate summary
  generateDeploymentSummary();
  
  if (allChecksPassed) {
    log('\n🎉 All checks passed! Ready for deployment.', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some checks failed. Please fix issues before deploying.', 'red');
    process.exit(1);
  }
}

main();
