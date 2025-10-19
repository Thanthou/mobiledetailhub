#!/usr/bin/env node
/**
 * Environment Validation Script
 * 
 * Validates that all required environment variables are properly configured
 * and that the frontend env.ts can be imported without errors.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(50));
  log(title, 'bold');
  console.log('='.repeat(50));
}

/**
 * Check if .env file exists and has required variables
 */
function validateEnvFile() {
  logSection('🔍 Checking .env File');
  
  const envPath = path.join(root, '.env');
  const envExamplePath = path.join(root, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', 'red');
    if (fs.existsSync(envExamplePath)) {
      log('💡 Copy .env.example to .env and update with your values', 'yellow');
    }
    return false;
  }
  
  log('✅ .env file exists', 'green');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'BASE_DOMAIN'
  ];
  
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(`${varName}=`) || 
    envContent.includes(`${varName}=`)
  );
  
  if (missingVars.length === 0) {
    log('✅ All required environment variables found', 'green');
  } else {
    log(`⚠️  Missing or empty variables: ${missingVars.join(', ')}`, 'yellow');
  }
  
  return true;
}

/**
 * Validate frontend environment configuration
 */
function validateFrontendEnv() {
  logSection('🎨 Checking Frontend Environment');
  
  const frontendEnvPath = path.join(root, 'frontend/src/shared/env.ts');
  
  if (!fs.existsSync(frontendEnvPath)) {
    log('❌ Frontend env.ts not found', 'red');
    return false;
  }
  
  log('✅ Frontend env.ts exists', 'green');
  
  // Check if zod is installed
  const packageJsonPath = path.join(root, 'frontend/package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.dependencies?.zod) {
      log('✅ Zod is installed in frontend', 'green');
    } else {
      log('❌ Zod is not installed in frontend', 'red');
      return false;
    }
  }
  
  return true;
}

/**
 * Check Vite proxy configuration
 */
function validateViteProxy() {
  logSection('🔌 Checking Vite Proxy Configuration');
  
  const viteConfigPath = path.join(root, 'frontend/vite.config.base.ts');
  
  if (!fs.existsSync(viteConfigPath)) {
    log('❌ Vite base config not found', 'red');
    return false;
  }
  
  const configContent = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (configContent.includes('/api')) {
    log('✅ API proxy configuration found', 'green');
  } else {
    log('❌ API proxy configuration missing', 'red');
    return false;
  }
  
  if (configContent.includes('changeOrigin: true')) {
    log('✅ Proxy changeOrigin configured', 'green');
  } else {
    log('⚠️  Proxy changeOrigin not configured', 'yellow');
  }
  
  return true;
}

/**
 * Test environment import
 */
async function testEnvImport() {
  logSection('🧪 Testing Environment Import');
  
  try {
    // Try to import the env module using file:// URL
    const envModulePath = path.join(root, 'frontend/src/shared/env.js');
    const envModuleUrl = new URL(envModulePath, 'file://').href;
    const { env, config } = await import(envModuleUrl);
    
    log('✅ Environment module imports successfully', 'green');
    
    // Test key configurations
    log(`📊 Environment mode: ${config.mode}`, 'blue');
    log(`🔗 API base URL: ${config.apiBaseUrl}`, 'blue');
    log(`🏗️  Development mode: ${config.isDevelopment}`, 'blue');
    
    return true;
    
  } catch (error) {
    log(`❌ Failed to import environment module: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Check documentation consistency
 */
function validateDocs() {
  logSection('📚 Checking Documentation');
  
  const docsToCheck = [
    'docs/ENV_TEMPLATE.md',
    'docs/ENV_UPDATE_GUIDE.md'
  ];
  
  let allDocsExist = true;
  
  docsToCheck.forEach(docPath => {
    const fullPath = path.join(root, docPath);
    if (fs.existsSync(fullPath)) {
      log(`✅ ${docPath} exists`, 'green');
    } else {
      log(`❌ ${docPath} missing`, 'red');
      allDocsExist = false;
    }
  });
  
  return allDocsExist;
}

/**
 * Main validation function
 */
async function main() {
  log('🚀 Starting Environment Validation', 'bold');
  
  const results = {
    envFile: validateEnvFile(),
    frontendEnv: validateFrontendEnv(),
    viteProxy: validateViteProxy(),
    envImport: await testEnvImport(),
    docs: validateDocs()
  };
  
  logSection('📊 Validation Summary');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${test}: ${passed ? 'PASSED' : 'FAILED'}`, color);
  });
  
  console.log('\n' + '='.repeat(50));
  log(`Overall: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('🎉 All environment validations passed!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some validations failed. Please check the issues above.', 'yellow');
    process.exit(1);
  }
}

// Run validation
main().catch(error => {
  log(`💥 Validation script failed: ${error.message}`, 'red');
  process.exit(1);
});
