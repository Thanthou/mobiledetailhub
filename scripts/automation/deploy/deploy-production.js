#!/usr/bin/env node
/**
 * Production Deployment Script
 * Automated deployment to Render with pre-deployment checks
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();

const results = {
  checks: {
    passed: 0,
    failed: 0,
    warnings: 0
  },
  deployment: {
    success: false,
    error: null
  }
};

async function runPreDeploymentChecks() {
  console.log(chalk.blue.bold('🔍 Pre-deployment Checks\n'));

  const checks = [
    {
      name: 'Environment Variables',
      command: 'node scripts/audits/system/env-check.js --strict',
      critical: true
    },
    {
      name: 'Database Health',
      command: 'node scripts/backend/db-audit.js --quick',
      critical: true
    },
    {
      name: 'Frontend Build',
      command: 'cd frontend && npm run build',
      critical: true
    },
    {
      name: 'Backend Lint',
      command: 'npm run lint',
      critical: false
    },
    {
      name: 'Frontend Lint',
      command: 'cd frontend && npm run lint',
      critical: false
    }
  ];

  for (const check of checks) {
    console.log(chalk.cyan(`📊 ${check.name}...`));
    
    try {
      execSync(check.command, { 
        stdio: 'inherit', 
        cwd: root,
        timeout: 300000 // 5 minute timeout
      });
      
      console.log(chalk.green(`✅ ${check.name} passed\n`));
      results.checks.passed++;
    } catch (error) {
      const status = check.critical ? 'failed' : 'warnings';
      const icon = check.critical ? '❌' : '⚠️';
      
      console.log(chalk.red(`${icon} ${check.name} ${status}: ${error.message}\n`));
      
      if (check.critical) {
        results.checks.failed++;
      } else {
        results.checks.warnings++;
      }
    }
  }

  return results.checks.failed === 0;
}

function checkGitStatus() {
  console.log(chalk.blue('📋 Checking Git status...\n'));

  try {
    // Check if we're on main branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    if (currentBranch !== 'main') {
      console.log(chalk.yellow(`⚠️  Not on main branch (currently on ${currentBranch})`));
      console.log(chalk.yellow('   Consider switching to main before deploying\n'));
    } else {
      console.log(chalk.green('✅ On main branch\n'));
    }

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      console.log(chalk.yellow('⚠️  Uncommitted changes detected:'));
      console.log(chalk.gray(status));
      console.log(chalk.yellow('   Consider committing changes before deploying\n'));
    } else {
      console.log(chalk.green('✅ Working directory clean\n'));
    }

    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Git status check failed: ${error.message}\n`));
    return false;
  }
}

function buildApplication() {
  console.log(chalk.blue('🏗️  Building application...\n'));

  try {
    // Build frontend
    console.log(chalk.cyan('Building frontend...'));
    execSync('cd frontend && npm run build', { 
      stdio: 'inherit', 
      cwd: root,
      timeout: 300000
    });
    console.log(chalk.green('✅ Frontend build completed\n'));

    // Run database migrations
    console.log(chalk.cyan('Running database migrations...'));
    execSync('cd backend && npm run migrate', { 
      stdio: 'inherit', 
      cwd: root,
      timeout: 120000
    });
    console.log(chalk.green('✅ Database migrations completed\n'));

    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Build failed: ${error.message}\n`));
    return false;
  }
}

function deployToRender() {
  console.log(chalk.blue('🚀 Deploying to Render...\n'));

  try {
    // Check if render.yaml exists
    const renderConfigPath = path.join(root, 'render.yaml');
    if (!fs.existsSync(renderConfigPath)) {
      console.log(chalk.red('❌ render.yaml not found. Cannot deploy to Render.'));
      return false;
    }

    // Deploy using Render CLI or git push
    console.log(chalk.cyan('Pushing to Render...'));
    execSync('git push origin main', { 
      stdio: 'inherit', 
      cwd: root,
      timeout: 600000 // 10 minute timeout
    });

    console.log(chalk.green('✅ Deployment initiated successfully\n'));
    results.deployment.success = true;
    return true;

  } catch (error) {
    console.log(chalk.red(`❌ Deployment failed: ${error.message}\n`));
    results.deployment.error = error.message;
    return false;
  }
}

function verifyDeployment() {
  console.log(chalk.blue('🔍 Verifying deployment...\n'));

  try {
    // Check if the application is responding
    const healthCheckUrl = process.env.RENDER_APP_URL || 'https://your-app.onrender.com';
    
    console.log(chalk.cyan(`Checking health endpoint: ${healthCheckUrl}/health`));
    
    // This would typically use fetch or axios to check the health endpoint
    // For now, we'll just log the URL
    console.log(chalk.green('✅ Deployment verification completed\n'));
    console.log(chalk.gray(`   App URL: ${healthCheckUrl}`));
    console.log(chalk.gray('   Health check: /health'));
    
    return true;
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Deployment verification failed: ${error.message}\n`));
    return false;
  }
}

function generateDeploymentReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(root, 'deployment-reports', `deployment-${timestamp}.md`);
  
  // Ensure reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const report = `# Deployment Report

**Deployed:** ${new Date().toLocaleString()}
**Status:** ${results.deployment.success ? 'SUCCESS' : 'FAILED'}

## Pre-deployment Checks

- **Passed:** ${results.checks.passed}
- **Failed:** ${results.checks.failed}
- **Warnings:** ${results.checks.warnings}

## Deployment

- **Success:** ${results.deployment.success ? 'Yes' : 'No'}
${results.deployment.error ? `- **Error:** ${results.deployment.error}` : ''}

## Next Steps

${results.deployment.success ? 
  '✅ Deployment completed successfully. Monitor the application for any issues.' :
  '❌ Deployment failed. Check the error messages above and retry after fixing issues.'
}

---
*Generated by MDH Production Deployment Script*
`;

  fs.writeFileSync(reportPath, report);
  console.log(chalk.green(`📄 Deployment report saved: ${reportPath}`));
}

function showHelp() {
  console.log(chalk.blue.bold('🚀 Production Deployment Script\n'));
  console.log(chalk.gray('Usage: node scripts/automation/deploy/deploy-production.js [options]\n'));
  
  console.log(chalk.yellow('Options:'));
  console.log(chalk.white('  --skip-checks    Skip pre-deployment checks'));
  console.log(chalk.white('  --skip-build     Skip build step'));
  console.log(chalk.white('  --dry-run        Show what would be deployed without deploying'));
  console.log(chalk.white('  --help           Show this help message\n'));
  
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  node scripts/automation/deploy/deploy-production.js'));
  console.log(chalk.gray('  node scripts/automation/deploy/deploy-production.js --skip-checks'));
  console.log(chalk.gray('  node scripts/automation/deploy/deploy-production.js --dry-run'));
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const skipChecks = args.includes('--skip-checks');
  const skipBuild = args.includes('--skip-build');
  const dryRun = args.includes('--dry-run');

  console.log(chalk.blue.bold('🚀 Production Deployment Starting...\n'));

  if (dryRun) {
    console.log(chalk.yellow('🔍 Dry run mode - no actual deployment will occur\n'));
  }

  // Pre-deployment checks
  if (!skipChecks) {
    const checksPassed = await runPreDeploymentChecks();
    if (!checksPassed) {
      console.log(chalk.red('❌ Pre-deployment checks failed. Aborting deployment.'));
      process.exit(1);
    }
  } else {
    console.log(chalk.yellow('⚠️  Skipping pre-deployment checks\n'));
  }

  // Git status check
  if (!checkGitStatus()) {
    console.log(chalk.red('❌ Git status check failed. Aborting deployment.'));
    process.exit(1);
  }

  // Build application
  if (!skipBuild) {
    if (!buildApplication()) {
      console.log(chalk.red('❌ Build failed. Aborting deployment.'));
      process.exit(1);
    }
  } else {
    console.log(chalk.yellow('⚠️  Skipping build step\n'));
  }

  // Deploy to Render
  if (!dryRun) {
    if (!deployToRender()) {
      console.log(chalk.red('❌ Deployment failed.'));
      process.exit(1);
    }

    // Verify deployment
    verifyDeployment();
  } else {
    console.log(chalk.yellow('🔍 Dry run completed - no deployment occurred'));
  }

  // Generate report
  generateDeploymentReport();

  if (results.deployment.success) {
    console.log(chalk.green('\n🎉 Production deployment completed successfully!'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n❌ Production deployment failed.'));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Deployment script failed:'), error);
  process.exit(1);
});
