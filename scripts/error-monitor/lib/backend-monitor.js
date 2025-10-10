/**
 * Backend Error Monitor
 * Reads from backend/logs/errors.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class BackendMonitor {
  constructor() {
    this.logPath = path.resolve(__dirname, '../../../backend/logs/errors.json');
    this.watching = false;
  }
  
  async start() {
    console.log('👀 Monitoring backend errors...');
    console.log(`📁 Log file: ${this.logPath}\n`);
    
    // Show current errors
    await this.showErrors();
    
    // Watch for changes
    this.watching = true;
    this.watchErrors();
  }
  
  async showErrors() {
    try {
      const content = await fs.readFile(this.logPath, 'utf8');
      const errors = content.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
      
      if (errors.length === 0) {
        console.log('✅ No errors logged\n');
        return;
      }
      
      console.log(`📊 Found ${errors.length} error(s):\n`);
      errors.slice(-10).forEach((error, i) => {
        console.log(`[${i + 1}] ${error.level?.toUpperCase() || 'ERROR'}: ${error.message}`);
        if (error.timestamp) console.log(`    ${new Date(error.timestamp).toLocaleString()}`);
        if (error.url) console.log(`    ${error.method} ${error.url}`);
        console.log('');
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📭 No error log file yet\n');
      } else {
        console.error('❌ Failed to read error log:', error.message);
      }
    }
  }
  
  async watchErrors() {
    try {
      const watcher = fs.watch(this.logPath);
      
      for await (const event of watcher) {
        if (event.eventType === 'change' && this.watching) {
          console.log('\n🔔 New error logged!');
          await this.showErrors();
        }
      }
    } catch (error) {
      // File doesn't exist yet, that's OK
    }
  }
  
  stop() {
    this.watching = false;
  }
}

