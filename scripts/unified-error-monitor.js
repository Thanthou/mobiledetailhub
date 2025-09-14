#!/usr/bin/env node

/**
 * Unified Error Monitor
 * Monitors both frontend and backend errors in real-time
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class UnifiedErrorMonitor {
  constructor() {
    this.frontendErrors = [];
    this.backendErrors = [];
    this.isRunning = false;
    this.frontendProcess = null;
    this.backendProcess = null;
  }

  async start() {
    console.log('🚀 MDH Unified Error Monitor Started');
    console.log('====================================');
    console.log('This monitor will track errors from both frontend and backend');
    console.log('Press Ctrl+C to stop monitoring\n');

    this.isRunning = true;

    // Start monitoring both frontend and backend
    await this.startBackendMonitoring();
    await this.startFrontendMonitoring();

    // Set up graceful shutdown
    process.on('SIGINT', () => {
      this.stop();
    });

    // Start the interactive CLI
    this.startCLI();
  }

  async startBackendMonitoring() {
    try {
      console.log('🔧 Starting backend error monitoring...');
      
      // Start backend server with error monitoring
      this.backendProcess = spawn('node', ['backend/scripts/error-monitor.js'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('🚨')) {
          this.handleBackendError(output);
        }
        console.log(`[BACKEND] ${output}`);
      });

      this.backendProcess.stderr.on('data', (data) => {
        console.error(`[BACKEND ERROR] ${data.toString()}`);
      });

      this.backendProcess.on('close', (code) => {
        console.log(`Backend monitoring process exited with code ${code}`);
      });

    } catch (error) {
      console.error('❌ Failed to start backend monitoring:', error.message);
    }
  }

  async startFrontendMonitoring() {
    try {
      console.log('🎨 Starting frontend error monitoring...');
      
      // Check if frontend is running
      const frontendRunning = await this.checkFrontendRunning();
      
      if (!frontendRunning) {
        console.log('⚠️  Frontend not running. Start it with: npm run dev (in frontend directory)');
        console.log('   Frontend errors will be monitored once the server starts\n');
        return;
      }

      console.log('✅ Frontend is running, monitoring console errors...');
      console.log('   Open browser console to see frontend errors in real-time\n');

    } catch (error) {
      console.error('❌ Failed to start frontend monitoring:', error.message);
    }
  }

  async checkFrontendRunning() {
    try {
      const response = await fetch('http://localhost:5173');
      return response.ok;
    } catch {
      return false;
    }
  }

  handleBackendError(output) {
    // Parse backend error output and store
    const error = {
      timestamp: new Date(),
      source: 'backend',
      output: output.trim()
    };
    
    this.backendErrors.push(error);
    
    // Keep only last 100 errors
    if (this.backendErrors.length > 100) {
      this.backendErrors = this.backendErrors.slice(-100);
    }
  }

  startCLI() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'unified-monitor> '
    });

    console.log('\n📖 Available Commands:');
    console.log('  help, h     - Show help');
    console.log('  status, s   - Show monitoring status');
    console.log('  list, l     - List all errors');
    console.log('  recent, r   - Show recent errors');
    console.log('  backend, b  - Show backend errors');
    console.log('  frontend, f - Show frontend errors');
    console.log('  all, a      - Show all errors');
    console.log('  clear, c    - Clear error history');
    console.log('  export, e   - Export all errors');
    console.log('  quit, q     - Exit monitor\n');

    rl.prompt();

    rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();
      await this.handleCommand(command);
      rl.prompt();
    });

    rl.on('close', () => {
      this.stop();
    });
  }

  async handleCommand(command) {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'help':
      case 'h':
        this.showHelp();
        break;

      case 'status':
      case 's':
        this.showStatus();
        break;

      case 'list':
      case 'l':
        this.showAllErrors();
        break;

      case 'recent':
      case 'r':
        this.showRecentErrors(args[0] ? parseInt(args[0]) : 10);
        break;

      case 'backend':
      case 'b':
        this.showBackendErrors();
        break;

      case 'frontend':
      case 'f':
        this.showFrontendErrors();
        break;

      case 'all':
      case 'a':
        this.showAllErrors();
        break;

      case 'clear':
      case 'c':
        this.clearErrors();
        break;

      case 'export':
      case 'e':
        await this.exportErrors();
        break;

      case 'quit':
      case 'q':
        this.stop();
        process.exit(0);
        break;

      case '':
        break;

      default:
        console.log(`❌ Unknown command: ${cmd}`);
        console.log('Type "help" for available commands\n');
    }
  }

  showHelp() {
    console.log('\n📖 Unified Error Monitor Commands:');
    console.log('  help, h     - Show this help');
    console.log('  status, s   - Show monitoring status');
    console.log('  list, l     - List all errors');
    console.log('  recent, r   - Show recent errors (default: 10)');
    console.log('  backend, b  - Show backend errors');
    console.log('  frontend, f - Show frontend errors');
    console.log('  all, a      - Show all errors');
    console.log('  clear, c    - Clear error history');
    console.log('  export, e   - Export all errors');
    console.log('  quit, q     - Exit monitor\n');
  }

  showStatus() {
    console.log('\n📊 Monitoring Status:');
    console.log('====================');
    console.log(`Backend Errors: ${this.backendErrors.length}`);
    console.log(`Frontend Errors: ${this.frontendErrors.length}`);
    console.log(`Total Errors: ${this.backendErrors.length + this.frontendErrors.length}`);
    console.log(`Monitoring: ${this.isRunning ? '✅ Active' : '❌ Inactive'}`);
    console.log(`Backend Process: ${this.backendProcess ? '✅ Running' : '❌ Not running'}`);
    console.log('');
  }

  showBackendErrors() {
    if (this.backendErrors.length === 0) {
      console.log('📭 No backend errors captured\n');
      return;
    }

    console.log(`\n🔧 Backend Errors (${this.backendErrors.length}):\n`);
    this.backendErrors.slice(-10).forEach((error, index) => {
      console.log(`${index + 1}. [${error.timestamp.toISOString()}]`);
      console.log(`   ${error.output}\n`);
    });
  }

  showFrontendErrors() {
    if (this.frontendErrors.length === 0) {
      console.log('📭 No frontend errors captured\n');
      console.log('💡 Frontend errors are shown in the browser console');
      console.log('   Open your browser and check the console for real-time errors\n');
      return;
    }

    console.log(`\n🎨 Frontend Errors (${this.frontendErrors.length}):\n`);
    this.frontendErrors.slice(-10).forEach((error, index) => {
      console.log(`${index + 1}. [${error.timestamp.toISOString()}]`);
      console.log(`   ${error.output}\n`);
    });
  }

  showRecentErrors(count = 10) {
    const allErrors = [
      ...this.backendErrors.map(e => ({ ...e, source: 'backend' })),
      ...this.frontendErrors.map(e => ({ ...e, source: 'frontend' }))
    ].sort((a, b) => a.timestamp - b.timestamp);

    if (allErrors.length === 0) {
      console.log('📭 No errors captured\n');
      return;
    }

    const recentErrors = allErrors.slice(-count);
    console.log(`\n🕒 Recent ${recentErrors.length} Errors:\n`);
    recentErrors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.source.toUpperCase()}] [${error.timestamp.toISOString()}]`);
      console.log(`   ${error.output}\n`);
    });
  }

  showAllErrors() {
    const allErrors = [
      ...this.backendErrors.map(e => ({ ...e, source: 'backend' })),
      ...this.frontendErrors.map(e => ({ ...e, source: 'frontend' }))
    ].sort((a, b) => a.timestamp - b.timestamp);

    if (allErrors.length === 0) {
      console.log('📭 No errors captured\n');
      return;
    }

    console.log(`\n🔍 All Errors (${allErrors.length}):\n`);
    allErrors.slice(-20).forEach((error, index) => {
      console.log(`${index + 1}. [${error.source.toUpperCase()}] [${error.timestamp.toISOString()}]`);
      console.log(`   ${error.output}\n`);
    });
  }

  clearErrors() {
    this.backendErrors = [];
    this.frontendErrors = [];
    console.log('🧹 Error history cleared\n');
  }

  async exportErrors() {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        backendErrors: this.backendErrors,
        frontendErrors: this.frontendErrors,
        totalErrors: this.backendErrors.length + this.frontendErrors.length
      };

      const exportFile = path.join(process.cwd(), 'error-export.json');
      await fs.writeFile(exportFile, JSON.stringify(exportData, null, 2));
      console.log(`📁 All errors exported to: ${exportFile}\n`);
    } catch (error) {
      console.log(`❌ Export failed: ${error.message}\n`);
    }
  }

  stop() {
    console.log('\n🛑 Stopping unified error monitor...');
    
    this.isRunning = false;
    
    if (this.backendProcess) {
      this.backendProcess.kill();
    }
    
    console.log('👋 Goodbye!');
  }
}

// Start the monitor if this file is run directly
if (require.main === module) {
  const monitor = new UnifiedErrorMonitor();
  monitor.start().catch(console.error);
}

module.exports = UnifiedErrorMonitor;
