#!/usr/bin/env node

/**
 * Safely kills all Node.js processes before starting dev servers
 * Prevents "Port already in use" errors during development
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killNodeProcesses() {
  try {
    console.log('🧹 Cleaning up old dev servers...');
    
    if (process.platform === 'win32') {
      // Windows: Kill all node.exe processes
      try {
        await execAsync('taskkill /F /IM node.exe /T 2>nul', { shell: 'cmd.exe' });
        console.log('✅ Killed old Node processes');
      } catch (error) {
        // No processes to kill - this is fine
        if (!error.message.includes('not found')) {
          console.log('ℹ️  No Node processes to clean up');
        }
      }
    } else {
      // Unix/Mac: Kill node processes
      try {
        await execAsync('pkill -9 node');
        console.log('✅ Killed old Node processes');
      } catch (error) {
        // No processes to kill - this is fine
        console.log('ℹ️  No Node processes to clean up');
      }
    }
    
    // Give ports time to release
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Ports cleared and ready\n');
    process.exit(0);
    
  } catch (error) {
    console.warn('⚠️  Could not clean up processes:', error.message);
    console.log('ℹ️  Continuing anyway...\n');
    process.exit(0);
  }
}

killNodeProcesses();

