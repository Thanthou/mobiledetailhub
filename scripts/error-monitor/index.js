#!/usr/bin/env node

/**
 * Unified Error Monitor CLI
 * Monitors errors across backend and frontend with --target flag
 * 
 * Usage:
 *   npm run error-monitor                    # Backend only (default)
 *   npm run error-monitor -- --target=backend
 *   npm run error-monitor -- --target=frontend  
 *   npm run error-monitor -- --target=all
 */

import { parseArgs, printHelp } from './lib/cli.js';
import { BackendMonitor } from './lib/backend-monitor.js';
import { FrontendMonitor } from './lib/frontend-monitor.js';

async function main() {
  const args = parseArgs();
  
  if (args.flags.has('help') || args.flags.has('h')) {
    printHelp(
      'Error Monitor',
      'Monitor errors across backend and frontend',
      [
        'npm run error-monitor',
        'npm run error-monitor -- --target=backend',
        'npm run error-monitor -- --target=frontend',
        'npm run error-monitor -- --target=all',
      ]
    );
    process.exit(0);
  }
  
  const target = args.options.get('target') || 'backend';
  
  console.log('🚀 MDH Error Monitor Started');
  console.log(`📍 Target: ${target}`);
  console.log('================================\n');
  
  switch (target) {
    case 'backend':
      await new BackendMonitor().start();
      break;
      
    case 'frontend':
      await new FrontendMonitor().start();
      break;
      
    case 'all': {
      console.log('🔄 Monitoring both backend and frontend...\n');
      const backend = new BackendMonitor();
      const frontend = new FrontendMonitor();
      await Promise.all([
        backend.start(),
        frontend.start(),
      ]);
      break;
    }
      
    default:
      console.error(`❌ Invalid target: ${target}`);
      console.error('Valid targets: backend, frontend, all');
      process.exit(1);
  }
}

main().catch(console.error);

