#!/usr/bin/env node
/**
 * Static Setup Verification Script
 * Verifies that all static ports are responding correctly
 */

import http from 'http';
import chalk from 'chalk';

const ports = [
  { port: 5175, name: 'Main Site', url: 'http://localhost:5175' },
  { port: 5177, name: 'Admin App', url: 'http://admin.localhost:5177' },
  { port: 5179, name: 'Tenant App', url: 'http://tenant.localhost:5179' },
  { port: 3001, name: 'Backend API', url: 'http://localhost:3001' }
];

console.log(chalk.blue('\n🔍 Verifying Static Setup...\n'));

let successCount = 0;
let failureCount = 0;

const checkPort = (portConfig) => {
  return new Promise((resolve) => {
    const { port, name, url } = portConfig;
    
    http.get(url, (res) => {
      console.log(chalk.green(`✅ ${name} (${port})`), chalk.gray(`responded: ${res.statusCode}`));
      successCount++;
      resolve(true);
    }).on('error', (err) => {
      console.log(chalk.red(`❌ ${name} (${port})`), chalk.gray(`not responding: ${err.message}`));
      failureCount++;
      resolve(false);
    });
  });
};

async function verifyAll() {
  for (const portConfig of ports) {
    await checkPort(portConfig);
  }
  
  console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold(`Results: ${successCount}/${ports.length} services responding`));
  
  if (failureCount === 0) {
    console.log(chalk.green.bold('\n✅ All services are running correctly!'));
    console.log(chalk.gray('\nYou can now access:'));
    console.log(chalk.cyan('  • Main Site:    http://localhost:5175'));
    console.log(chalk.cyan('  • Admin App:    http://admin.localhost:5177'));
    console.log(chalk.cyan('  • Tenant App:   http://tenant.localhost:5179'));
    console.log(chalk.cyan('  • Backend API:  http://localhost:3001/api/health'));
  } else {
    console.log(chalk.yellow.bold(`\n⚠️  ${failureCount} service(s) not responding`));
    console.log(chalk.gray('\nMake sure you ran: npm run dev:all'));
  }
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

verifyAll();

