/**
 * Frontend Error Debug Script
 * Can be loaded in browser console for debugging
 * Usage: Copy and paste this script into browser console
 */

(function() {
  'use strict';

  // Check if errorMonitor is available
  if (typeof window !== 'undefined' && window.errorMonitor) {
    console.log('🎯 MDH Error Monitor is already loaded!');
    console.log('Available commands:');
    console.log('  errorMonitor.printErrors() - Print all errors');
    console.log('  errorMonitor.getErrors() - Get all errors');
    console.log('  errorMonitor.clearErrors() - Clear error history');
    console.log('  errorMonitor.exportErrors() - Export errors as JSON');
    console.log('  errorMonitor.getErrorSummary() - Get error summary');
    return;
  }

  // Create a simple error monitor if the main one isn't available
  const simpleErrorMonitor = {
    errors: [],
    maxErrors: 100,

    captureError(errorData) {
      const error = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...errorData
      };

      this.errors.push(error);

      if (this.errors.length > this.maxErrors) {
        this.errors = this.errors.slice(-this.maxErrors);
      }

      console.group(`🚨 Error Captured`);
      console.error('Time:', error.timestamp.toISOString());
      console.error('Message:', error.message);
      console.error('Type:', error.type);
      if (error.stack) console.error('Stack:', error.stack);
      console.groupEnd();
    },

    printErrors() {
      console.group('🔍 All Captured Errors');
      console.log(`Total Errors: ${this.errors.length}`);
      
      if (this.errors.length === 0) {
        console.log('No errors captured yet.');
        console.groupEnd();
        return;
      }

      this.errors.forEach((error, index) => {
        console.group(`Error ${index + 1}`);
        console.log('Time:', error.timestamp.toISOString());
        console.log('Type:', error.type);
        console.log('Message:', error.message);
        if (error.stack) console.log('Stack:', error.stack);
        console.groupEnd();
      });
      
      console.groupEnd();
    },

    getErrors() {
      return this.errors;
    },

    clearErrors() {
      this.errors = [];
      console.log('🧹 Error history cleared');
    },

    exportErrors() {
      const exportData = {
        timestamp: new Date().toISOString(),
        errors: this.errors
      };
      
      const json = JSON.stringify(exportData, null, 2);
      console.log('📁 Exported errors:');
      console.log(json);
      
      // Copy to clipboard if possible
      if (navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => {
          console.log('✅ Errors copied to clipboard');
        }).catch(() => {
          console.log('❌ Failed to copy to clipboard');
        });
      }
      
      return json;
    },

    getErrorSummary() {
      const byType = this.errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {});

      return {
        total: this.errors.length,
        byType,
        recent: this.errors.slice(-5)
      };
    }
  };

  // Set up error capturing
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = function(...args) {
    simpleErrorMonitor.captureError({
      type: 'console',
      message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
      stack: new Error().stack
    });
    originalConsoleError.apply(console, args);
  };

  console.warn = function(...args) {
    simpleErrorMonitor.captureError({
      type: 'console',
      message: `WARNING: ${args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')}`,
      stack: new Error().stack
    });
    originalConsoleWarn.apply(console, args);
  };

  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    simpleErrorMonitor.captureError({
      type: 'unhandled',
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    simpleErrorMonitor.captureError({
      type: 'promise',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });

  // Make it available globally
  window.simpleErrorMonitor = simpleErrorMonitor;

  console.log('🎯 MDH Simple Error Monitor loaded!');
  console.log('Available commands:');
  console.log('  simpleErrorMonitor.printErrors() - Print all errors');
  console.log('  simpleErrorMonitor.getErrors() - Get all errors');
  console.log('  simpleErrorMonitor.clearErrors() - Clear error history');
  console.log('  simpleErrorMonitor.exportErrors() - Export errors as JSON');
  console.log('  simpleErrorMonitor.getErrorSummary() - Get error summary');

})();
