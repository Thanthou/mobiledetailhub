#!/usr/bin/env node
/**
 * Global Audit Runner
 * Orchestrates all audit phases and generates comprehensive reports
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();
const scriptsDir = path.join(root, 'scripts');

console.log(chalk.blue.bold('🚀 Running Complete Audit Suite...\n'));

// Phase execution order
const phases = [
  { name: 'Backend Audits', script: 'audits/backend/audit-schema-switching.js' },
  { name: 'Frontend Audits', script: 'audits/frontend/audit-routing.js' },
  { name: 'System Audits', script: 'audits/system/debug-subdomain.js' },
  { name: 'SEO Audits', script: 'audits/seo/test-anchors.js' },
  { name: 'Project Overview', script: 'project-overview.js' }
];

async function runPhase(phase) {
  console.log(chalk.yellow(`📊 Running ${phase.name}...`));
  
  try {
    const scriptPath = path.join(scriptsDir, phase.script);
    if (fs.existsSync(scriptPath)) {
      execSync(`node ${scriptPath}`, { stdio: 'inherit' });
      console.log(chalk.green(`✅ ${phase.name} completed\n`));
    } else {
      console.log(chalk.red(`❌ Script not found: ${phase.script}\n`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ ${phase.name} failed: ${error.message}\n`));
  }
}

// Run all phases
for (const phase of phases) {
  await runPhase(phase);
}

console.log(chalk.blue.bold('🎉 Audit suite completed!'));
