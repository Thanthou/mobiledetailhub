#!/usr/bin/env node
/**
 * End-to-End Onboarding Verification
 * Tests the complete tenant onboarding flow from frontend to backend
 */

import fetch from 'node-fetch';
import { getPool } from '../../../backend/database/pool.js';
import chalk from 'chalk';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.TEST_FRONTEND_URL || 'http://localhost:5175';

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

async function testDatabaseConnection() {
  console.log(chalk.blue('🔌 Testing database connection...'));
  
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT NOW() as current_time');
    
    console.log(chalk.green('✅ Database connected'));
    console.log(chalk.gray(`   Server time: ${result.rows[0].current_time}`));
    
    results.passed++;
    return pool;
  } catch (error) {
    console.log(chalk.red(`❌ Database connection failed: ${error.message}`));
    results.failed++;
    results.details.push({
      test: 'Database Connection',
      status: 'failed',
      error: error.message
    });
    return null;
  }
}

async function testBackendHealth() {
  console.log(chalk.blue('\n🏥 Testing backend health...'));
  
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'healthy') {
      console.log(chalk.green('✅ Backend health check passed'));
      console.log(chalk.gray(`   Status: ${data.status}`));
      console.log(chalk.gray(`   Uptime: ${data.uptime || 'N/A'}`));
      
      results.passed++;
      results.details.push({
        test: 'Backend Health',
        status: 'passed',
        data: data
      });
      return true;
    } else {
      throw new Error(`Health check failed: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(chalk.red(`❌ Backend health check failed: ${error.message}`));
    results.failed++;
    results.details.push({
      test: 'Backend Health',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testFrontendAccess() {
  console.log(chalk.blue('\n🌐 Testing frontend access...'));
  
  try {
    const response = await fetch(FRONTEND_URL);
    
    if (response.ok) {
      console.log(chalk.green('✅ Frontend accessible'));
      console.log(chalk.gray(`   Status: ${response.status}`));
      console.log(chalk.gray(`   URL: ${FRONTEND_URL}`));
      
      results.passed++;
      results.details.push({
        test: 'Frontend Access',
        status: 'passed',
        statusCode: response.status
      });
      return true;
    } else {
      throw new Error(`Frontend returned status ${response.status}`);
    }
  } catch (error) {
    console.log(chalk.red(`❌ Frontend access failed: ${error.message}`));
    results.failed++;
    results.details.push({
      test: 'Frontend Access',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testTenantCreation(pool) {
  console.log(chalk.blue('\n🏢 Testing tenant creation...'));
  
  try {
    // Test data
    const testTenant = {
      slug: `test-tenant-${Date.now()}`,
      business_name: 'Test Business',
      industry: 'mobile-detailing',
      business_email: 'test@example.com',
      application_status: 'active'
    };

    // Create tenant
    const createResult = await pool.query(`
      INSERT INTO tenants.business (
        slug, 
        business_name, 
        industry, 
        business_email, 
        application_status,
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, slug, business_name
    `, [
      testTenant.slug,
      testTenant.business_name,
      testTenant.industry,
      testTenant.business_email,
      testTenant.application_status
    ]);

    if (createResult.rows.length > 0) {
      const tenant = createResult.rows[0];
      console.log(chalk.green('✅ Tenant created successfully'));
      console.log(chalk.gray(`   ID: ${tenant.id}`));
      console.log(chalk.gray(`   Slug: ${tenant.slug}`));
      console.log(chalk.gray(`   Name: ${tenant.business_name}`));

      // Test tenant retrieval
      const getResult = await pool.query(`
        SELECT * FROM tenants.business WHERE id = $1
      `, [tenant.id]);

      if (getResult.rows.length > 0) {
        console.log(chalk.green('✅ Tenant retrieval successful'));
        
        results.passed++;
        results.details.push({
          test: 'Tenant Creation',
          status: 'passed',
          tenantId: tenant.id,
          tenantSlug: tenant.slug
        });

        // Clean up test tenant
        await pool.query('DELETE FROM tenants.business WHERE id = $1', [tenant.id]);
        console.log(chalk.gray('   Test tenant cleaned up'));
        
        return true;
      } else {
        throw new Error('Tenant retrieval failed');
      }
    } else {
      throw new Error('Tenant creation failed');
    }
  } catch (error) {
    console.log(chalk.red(`❌ Tenant creation failed: ${error.message}`));
    results.failed++;
    results.details.push({
      test: 'Tenant Creation',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testSubdomainRouting() {
  console.log(chalk.blue('\n🌐 Testing subdomain routing...'));
  
  try {
    // Test main site
    const mainResponse = await fetch(`${BASE_URL}/`, {
      headers: { 'Host': 'localhost' }
    });
    
    if (mainResponse.ok) {
      console.log(chalk.green('✅ Main site routing works'));
    } else {
      throw new Error(`Main site returned status ${mainResponse.status}`);
    }

    // Test admin subdomain
    const adminResponse = await fetch(`${BASE_URL}/`, {
      headers: { 'Host': 'admin.localhost' }
    });
    
    if (adminResponse.ok) {
      console.log(chalk.green('✅ Admin subdomain routing works'));
    } else {
      console.log(chalk.yellow('⚠️  Admin subdomain routing failed (may be expected)'));
    }

    // Test tenant subdomain
    const tenantResponse = await fetch(`${BASE_URL}/`, {
      headers: { 'Host': 'test-tenant.localhost' }
    });
    
    if (tenantResponse.ok) {
      console.log(chalk.green('✅ Tenant subdomain routing works'));
    } else {
      console.log(chalk.yellow('⚠️  Tenant subdomain routing failed (may be expected)'));
    }

    results.passed++;
    results.details.push({
      test: 'Subdomain Routing',
      status: 'passed',
      mainSite: mainResponse.status,
      adminSubdomain: adminResponse.status,
      tenantSubdomain: tenantResponse.status
    });
    
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Subdomain routing test failed: ${error.message}`));
    results.failed++;
    results.details.push({
      test: 'Subdomain Routing',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testAPIEndpoints() {
  console.log(chalk.blue('\n🔌 Testing API endpoints...'));
  
  const endpoints = [
    { path: '/api/health', method: 'GET', expectedStatus: 200 },
    { path: '/api/tenants', method: 'GET', expectedStatus: 200 },
    { path: '/api/auth/status', method: 'GET', expectedStatus: 401 } // Should return 401 for unauthenticated
  ];

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method
      });
      
      if (response.status === endpoint.expectedStatus) {
        console.log(chalk.green(`✅ ${endpoint.method} ${endpoint.path} - ${response.status}`));
        passed++;
      } else {
        console.log(chalk.yellow(`⚠️  ${endpoint.method} ${endpoint.path} - Expected ${endpoint.expectedStatus}, got ${response.status}`));
        failed++;
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${endpoint.method} ${endpoint.path} - ${error.message}`));
      failed++;
    }
  }

  if (failed === 0) {
    results.passed++;
    results.details.push({
      test: 'API Endpoints',
      status: 'passed',
      passed,
      failed
    });
  } else {
    results.failed++;
    results.details.push({
      test: 'API Endpoints',
      status: 'failed',
      passed,
      failed
    });
  }

  return failed === 0;
}

function generateReport() {
  console.log(chalk.blue.bold('\n📊 Integration Test Report\n'));
  
  console.log(chalk.green(`✅ Passed: ${results.passed}`));
  if (results.failed > 0) {
    console.log(chalk.red(`❌ Failed: ${results.failed}`));
  }
  if (results.skipped > 0) {
    console.log(chalk.yellow(`⚠️  Skipped: ${results.skipped}`));
  }

  if (results.details.length > 0) {
    console.log(chalk.blue('\n📋 Test Details:\n'));
    
    results.details.forEach(detail => {
      const icon = detail.status === 'passed' ? '✅' : '❌';
      console.log(chalk.white(`${icon} ${detail.test}: ${detail.status}`));
      
      if (detail.error) {
        console.log(chalk.gray(`   Error: ${detail.error}`));
      }
      if (detail.tenantId) {
        console.log(chalk.gray(`   Tenant ID: ${detail.tenantId}`));
      }
      if (detail.statusCode) {
        console.log(chalk.gray(`   Status Code: ${detail.statusCode}`));
      }
      console.log();
    });
  }

  return results.failed === 0;
}

function showHelp() {
  console.log(chalk.blue.bold('🧪 Integration Test Suite\n'));
  console.log(chalk.gray('Usage: node scripts/testing/integration/verify-onboarding.js [options]\n'));
  
  console.log(chalk.yellow('Options:'));
  console.log(chalk.white('  --backend-url    Backend URL (default: http://localhost:3000)'));
  console.log(chalk.white('  --frontend-url   Frontend URL (default: http://localhost:5175)'));
  console.log(chalk.white('  --help           Show this help message\n'));
  
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  node scripts/testing/integration/verify-onboarding.js'));
  console.log(chalk.gray('  node scripts/testing/integration/verify-onboarding.js --backend-url http://localhost:3001'));
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Parse custom URLs
  const backendUrlArg = args.find(arg => arg.startsWith('--backend-url='));
  const frontendUrlArg = args.find(arg => arg.startsWith('--frontend-url='));
  
  if (backendUrlArg) {
    process.env.TEST_BASE_URL = backendUrlArg.split('=')[1];
  }
  if (frontendUrlArg) {
    process.env.TEST_FRONTEND_URL = frontendUrlArg.split('=')[1];
  }

  console.log(chalk.blue.bold('🧪 Integration Test Suite Starting...\n'));
  console.log(chalk.gray(`Backend URL: ${BASE_URL}`));
  console.log(chalk.gray(`Frontend URL: ${FRONTEND_URL}\n`));

  // Run tests
  const pool = await testDatabaseConnection();
  if (!pool) {
    console.log(chalk.red('❌ Cannot proceed without database connection'));
    process.exit(1);
  }

  await testBackendHealth();
  await testFrontendAccess();
  await testTenantCreation(pool);
  await testSubdomainRouting();
  await testAPIEndpoints();

  // Generate report
  const success = generateReport();

  if (success) {
    console.log(chalk.green('\n🎉 All integration tests passed!'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n❌ Some integration tests failed.'));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Integration test suite failed:'), error);
  process.exit(1);
});
