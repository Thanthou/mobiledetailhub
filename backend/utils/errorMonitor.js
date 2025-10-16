/**
 * Enhanced Backend Error Monitoring System
 * Provides comprehensive error tracking, logging, and terminal output
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BackendErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 1000;
    this.sessionId = this.generateSessionId();
    this.isEnabled = true;
    this.listeners = [];
    this.errorLogFile = path.join(__dirname, '../logs/errors.json');
    this.maxLogFileSize = 10 * 1024 * 1024; // 10 MB
    this.maxRotatedLogs = 5; // Keep last 5 rotated logs
    this.setupErrorLogging();
  }

  generateSessionId() {
    return `backend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async setupErrorLogging() {
    // Ensure logs directory exists
    const logsDir = path.dirname(this.errorLogFile);
    try {
      await fs.mkdir(logsDir, { recursive: true });
    } catch (error) {
      console.warn('Could not create logs directory:', error.message);
    }
  }

  captureError(errorData) {
    if (!this.isEnabled) {return;}

    const error = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.sessionId,
      type: 'backend',
      ...errorData,
    };

    this.errors.push(error);

    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(error));

    // Log to console with enhanced formatting
    this.logErrorToConsole(error);

    // Log to file
    this.logErrorToFile(error);
  }

  logErrorToConsole(error) {
    const timestamp = error.timestamp.toISOString();
    const type = error.type || 'ERROR';
    const message = error.message || 'Unknown error';
    const stack = error.stack || '';
    const url = error.url || 'N/A';
    const method = error.method || 'N/A';
    const statusCode = error.statusCode || 'N/A';
    const userId = error.userId || 'N/A';
    const ip = error.ip || 'N/A';

    console.log('\n' + '='.repeat(80));
    console.log(`🚨 BACKEND ERROR CAPTURED - ${timestamp}`);
    console.log('='.repeat(80));
    console.log(`Type: ${type}`);
    console.log(`Message: ${message}`);
    console.log(`URL: ${method} ${url}`);
    console.log(`Status Code: ${statusCode}`);
    console.log(`User ID: ${userId}`);
    console.log(`IP: ${ip}`);
    console.log(`Session ID: ${error.sessionId}`);
    
    if (stack) {
      console.log('\nStack Trace:');
      console.log(stack);
    }

    if (error.details) {
      console.log('\nAdditional Details:');
      console.log(JSON.stringify(error.details, null, 2));
    }

    if (error.requestBody) {
      console.log('\nRequest Body:');
      console.log(JSON.stringify(error.requestBody, null, 2));
    }

    if (error.query) {
      console.log('\nQuery:');
      console.log(JSON.stringify(error.query, null, 2));
    }

    console.log('='.repeat(80) + '\n');
  }

  async rotateLogIfNeeded() {
    try {
      // Check if log file exists and its size
      const stats = await fs.stat(this.errorLogFile).catch(() => null);
      
      if (!stats || stats.size < this.maxLogFileSize) {
        return; // No rotation needed
      }

      // Rotate: errors.json -> errors.1.json -> errors.2.json -> ... -> errors.5.json (deleted)
      for (let i = this.maxRotatedLogs - 1; i > 0; i--) {
        const oldFile = this.errorLogFile.replace('.json', `.${i}.json`);
        const newFile = this.errorLogFile.replace('.json', `.${i + 1}.json`);
        
        try {
          await fs.rename(oldFile, newFile);
        } catch {
          // File doesn't exist, continue
        }
      }

      // Move current log to .1
      const rotatedFile = this.errorLogFile.replace('.json', '.1.json');
      await fs.rename(this.errorLogFile, rotatedFile);
      
      console.log(`🔄 Log rotated: ${path.basename(this.errorLogFile)} -> ${path.basename(rotatedFile)}`);
    } catch (rotationError) {
      console.warn('Failed to rotate log file:', rotationError.message);
    }
  }

  async logErrorToFile(error) {
    try {
      // Rotate log if needed before writing
      await this.rotateLogIfNeeded();

      const logEntry = {
        ...error,
        timestamp: error.timestamp.toISOString(),
      };

      // Append to error log file
      await fs.appendFile(
        this.errorLogFile,
        JSON.stringify(logEntry) + '\n'
      );
    } catch (fileError) {
      console.warn('Failed to write error to log file:', fileError.message);
    }
  }

  // Enhanced error capture methods
  captureRequestError(req, res, error, additionalData = {}) {
    this.captureError({
      type: 'request',
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      statusCode: error.statusCode || 500,
      userId: req.user?.id,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      requestBody: req.body,
      query: req.query,
      params: req.params,
      ...additionalData,
    });
  }

  captureDatabaseError(error, query, params = []) {
    this.captureError({
      type: 'database',
      message: error.message,
      stack: error.stack,
      query: query,
      params: params,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });
  }

  captureValidationError(error, field, value) {
    this.captureError({
      type: 'validation',
      message: error.message,
      field: field,
      value: value,
      stack: error.stack,
    });
  }

  captureAuthError(error, userId, action) {
    this.captureError({
      type: 'auth',
      message: error.message,
      stack: error.stack,
      userId: userId,
      action: action,
    });
  }

  captureMiddlewareError(error, middleware, req) {
    this.captureError({
      type: 'middleware',
      message: error.message,
      stack: error.stack,
      middleware: middleware,
      url: req.url,
      method: req.method,
    });
  }

  // Public methods
  enable() {
    this.isEnabled = true;
    console.log('✅ Backend Error Monitor enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('❌ Backend Error Monitor disabled');
  }

  getErrors() {
    return [...this.errors];
  }

  getErrorsByType(type) {
    return this.errors.filter(error => error.type === type);
  }

  getRecentErrors(count = 10) {
    return this.errors.slice(-count);
  }

  clearErrors() {
    this.errors = [];
    console.log('🧹 Error history cleared');
  }

  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getErrorSummary() {
    const byType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: this.errors.length,
      byType,
      recent: this.getRecentErrors(5),
      sessionId: this.sessionId,
    };
  }

  printErrorsToConsole() {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 BACKEND ERROR MONITOR - ALL CAPTURED ERRORS');
    console.log('='.repeat(80));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Total Errors: ${this.errors.length}`);
    
    if (this.errors.length === 0) {
      console.log('No errors captured yet.');
      console.log('='.repeat(80) + '\n');
      return;
    }

    this.errors.forEach((error, index) => {
      console.log(`\n--- Error ${index + 1} (${error.type}) ---`);
      console.log(`Time: ${error.timestamp.toISOString()}`);
      console.log(`Message: ${error.message}`);
      if (error.url) {console.log(`URL: ${error.method} ${error.url}`);}
      if (error.statusCode) {console.log(`Status: ${error.statusCode}`);}
      if (error.userId) {console.log(`User: ${error.userId}`);}
      if (error.stack) {console.log(`Stack: ${error.stack}`);}
    });
    
    console.log('='.repeat(80) + '\n');
  }

  async exportErrors() {
    const exportData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      totalErrors: this.errors.length,
      errors: this.errors,
    };

    const exportFile = path.join(__dirname, '../logs/error-export.json');
    await fs.writeFile(exportFile, JSON.stringify(exportData, null, 2));
    console.log(`📁 Errors exported to: ${exportFile}`);
    return exportFile;
  }

  // Real-time error monitoring
  startRealTimeMonitoring() {
    console.log('🔄 Starting real-time error monitoring...');
    console.log('Press Ctrl+C to stop monitoring\n');

    const unsubscribe = this.addListener((error) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] 🚨 ${error.type.toUpperCase()}: ${error.message}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping error monitoring...');
      unsubscribe();
      process.exit(0);
    });

    return unsubscribe;
  }
}

// Create singleton instance
const errorMonitor = new BackendErrorMonitor();

// Export the instance and class
export {
  errorMonitor,
  BackendErrorMonitor,
};
