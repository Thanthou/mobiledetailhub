#!/usr/bin/env node

/**
 * Error Monitoring Terminal Script
 * Provides real-time error monitoring and debugging capabilities
 */

const { errorMonitor } = require('../utils/errorMonitor');
const fs = require('fs').promises;
const path = require('path');

class ErrorMonitorCLI {
  constructor() {
    this.isRunning = false;
    this.filter = null;
    this.showStack = false;
    this.autoRefresh = false;
    this.refreshInterval = null;
  }

  async start() {
    console.log('🚀 MDH Error Monitor Started');
    console.log('================================');
    console.log('Commands:');
    console.log('  help, h     - Show this help');
    console.log('  list, l     - List all errors');
    console.log('  recent, r   - Show recent errors');
    console.log('  clear, c    - Clear error history');
    console.log('  export, e   - Export errors to file');
    console.log('  summary, s  - Show error summary');
    console.log('  filter, f   - Filter errors by type');
    console.log('  stack, st   - Toggle stack trace display');
    console.log('  watch, w    - Watch for new errors');
    console.log('  stop        - Stop watching');
    console.log('  quit, q     - Exit monitor');
    console.log('================================\n');

    // Enable error monitoring
    errorMonitor.enable();

    // Start watching for new errors
    this.startWatching();

    // Set up input handling
    this.setupInputHandling();
  }

  startWatching() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('👀 Watching for new errors...\n');

    this.unsubscribe = errorMonitor.addListener((error) => {
      this.displayError(error, 'NEW');
    });
  }

  stopWatching() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    console.log('🛑 Stopped watching for errors\n');
  }

  setupInputHandling() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'error-monitor> '
    });

    rl.prompt();

    rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();
      await this.handleCommand(command);
      rl.prompt();
    });

    rl.on('close', () => {
      this.stopWatching();
      console.log('\n👋 Goodbye!');
      process.exit(0);
    });
  }

  async handleCommand(command) {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'help':
      case 'h':
        this.showHelp();
        break;

      case 'list':
      case 'l':
        this.listErrors();
        break;

      case 'recent':
      case 'r':
        this.showRecentErrors(args[0] ? parseInt(args[0]) : 10);
        break;

      case 'clear':
      case 'c':
        this.clearErrors();
        break;

      case 'export':
      case 'e':
        await this.exportErrors();
        break;

      case 'summary':
      case 's':
        this.showSummary();
        break;

      case 'filter':
      case 'f':
        this.setFilter(args[0]);
        break;

      case 'stack':
      case 'st':
        this.toggleStack();
        break;

      case 'watch':
      case 'w':
        this.startWatching();
        break;

      case 'stop':
        this.stopWatching();
        break;

      case 'quit':
      case 'q':
        this.stopWatching();
        process.exit(0);
        break;

      case '':
        // Empty command, just show prompt
        break;

      default:
        console.log(`❌ Unknown command: ${cmd}`);
        console.log('Type "help" for available commands\n');
    }
  }

  showHelp() {
    console.log('\n📖 Error Monitor Commands:');
    console.log('  help, h     - Show this help');
    console.log('  list, l     - List all errors');
    console.log('  recent, r   - Show recent errors (default: 10)');
    console.log('  clear, c    - Clear error history');
    console.log('  export, e   - Export errors to file');
    console.log('  summary, s  - Show error summary');
    console.log('  filter, f   - Filter errors by type (request, database, validation, auth, middleware)');
    console.log('  stack, st   - Toggle stack trace display');
    console.log('  watch, w    - Watch for new errors');
    console.log('  stop        - Stop watching');
    console.log('  quit, q     - Exit monitor\n');
  }

  listErrors() {
    const errors = this.getFilteredErrors();
    
    if (errors.length === 0) {
      console.log('📭 No errors found\n');
      return;
    }

    console.log(`\n📋 Found ${errors.length} errors:\n`);
    errors.forEach((error, index) => {
      this.displayError(error, index + 1);
    });
    console.log('');
  }

  showRecentErrors(count = 10) {
    const errors = this.getFilteredErrors().slice(-count);
    
    if (errors.length === 0) {
      console.log('📭 No recent errors found\n');
      return;
    }

    console.log(`\n🕒 Recent ${errors.length} errors:\n`);
    errors.forEach((error, index) => {
      this.displayError(error, index + 1);
    });
    console.log('');
  }

  clearErrors() {
    errorMonitor.clearErrors();
    console.log('🧹 Error history cleared\n');
  }

  async exportErrors() {
    try {
      const exportFile = await errorMonitor.exportErrors();
      console.log(`📁 Errors exported to: ${exportFile}\n`);
    } catch (error) {
      console.log(`❌ Export failed: ${error.message}\n`);
    }
  }

  showSummary() {
    const summary = errorMonitor.getErrorSummary();
    
    console.log('\n📊 Error Summary:');
    console.log('================');
    console.log(`Session ID: ${summary.sessionId}`);
    console.log(`Total Errors: ${summary.total}`);
    console.log('\nBy Type:');
    Object.entries(summary.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    if (summary.recent.length > 0) {
      console.log('\nRecent Errors:');
      summary.recent.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.type}] ${error.message}`);
      });
    }
    console.log('');
  }

  setFilter(type) {
    if (!type) {
      this.filter = null;
      console.log('🔍 Filter cleared\n');
      return;
    }

    const validTypes = ['request', 'database', 'validation', 'auth', 'middleware'];
    if (!validTypes.includes(type)) {
      console.log(`❌ Invalid filter type. Valid types: ${validTypes.join(', ')}\n`);
      return;
    }

    this.filter = type;
    console.log(`🔍 Filter set to: ${type}\n`);
  }

  toggleStack() {
    this.showStack = !this.showStack;
    console.log(`📚 Stack trace display: ${this.showStack ? 'ON' : 'OFF'}\n`);
  }

  getFilteredErrors() {
    let errors = errorMonitor.getErrors();
    
    if (this.filter) {
      errors = errors.filter(error => error.type === this.filter);
    }
    
    return errors;
  }

  displayError(error, label) {
    const timestamp = error.timestamp.toISOString();
    const type = error.type || 'unknown';
    const message = error.message || 'No message';
    const url = error.url ? `${error.method} ${error.url}` : 'N/A';
    const statusCode = error.statusCode || 'N/A';
    const userId = error.userId || 'N/A';

    console.log(`[${label}] 🚨 ${type.toUpperCase()}`);
    console.log(`    Time: ${timestamp}`);
    console.log(`    Message: ${message}`);
    if (url !== 'N/A') console.log(`    URL: ${url}`);
    if (statusCode !== 'N/A') console.log(`    Status: ${statusCode}`);
    if (userId !== 'N/A') console.log(`    User: ${userId}`);
    
    if (this.showStack && error.stack) {
      console.log(`    Stack: ${error.stack}`);
    }
    
    console.log('');
  }
}

// Start the CLI if this file is run directly
if (require.main === module) {
  const cli = new ErrorMonitorCLI();
  cli.start().catch(console.error);
}

module.exports = ErrorMonitorCLI;
