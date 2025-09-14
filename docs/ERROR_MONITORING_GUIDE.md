# Error Monitoring Guide

This guide explains how to use the comprehensive error monitoring system for both frontend and backend debugging.

## Overview

The error monitoring system provides:
- **Frontend Error Catching**: Console errors, unhandled promises, React errors, network errors
- **Backend Error Catching**: Request errors, database errors, validation errors, auth errors
- **Real-time Monitoring**: Live error tracking in terminal
- **Error Export**: Save errors to files for analysis
- **Filtering & Search**: Find specific types of errors

## Quick Start

### 1. Start Error Monitoring

```bash
# Monitor both frontend and backend errors
npm run error-monitor

# Monitor only backend errors
npm run error-monitor:backend

# Frontend errors are automatic when app is running
npm run error-monitor:frontend
```

### 2. Frontend Error Monitoring

Frontend errors are automatically captured when the app is running. You can:

#### In Browser Console:
```javascript
// Print all captured errors
errorMonitor.printErrors()

// Get error summary
errorMonitor.getErrorSummary()

// Export errors as JSON
errorMonitor.exportErrors()

// Clear error history
errorMonitor.clearErrors()
```

#### Using Debug Script:
Load the debug script in your browser console:
```javascript
// Copy and paste the contents of frontend/public/error-debug.js
// This creates a simple error monitor if the main one isn't available
```

### 3. Backend Error Monitoring

Backend errors are automatically captured and logged. Use the terminal script for interactive monitoring:

```bash
node backend/scripts/error-monitor.js
```

Available commands:
- `list` - List all errors
- `recent` - Show recent errors
- `filter <type>` - Filter by error type
- `export` - Export errors to file
- `clear` - Clear error history
- `watch` - Watch for new errors
- `quit` - Exit monitor

## Error Types

### Frontend Errors
- **console**: Console.error() and console.warn() calls
- **unhandled**: Unhandled JavaScript errors
- **promise**: Unhandled promise rejections
- **react**: React component errors
- **network**: Failed network requests

### Backend Errors
- **request**: HTTP request errors
- **database**: Database connection/query errors
- **validation**: Input validation errors
- **auth**: Authentication/authorization errors
- **middleware**: Middleware processing errors

## Usage Examples

### 1. Monitor All Errors in Real-time

```bash
# Start the unified monitor
npm run error-monitor

# In the terminal, you'll see:
# - Real-time error notifications
# - Interactive commands
# - Error summaries
```

### 2. Debug Frontend Issues

```javascript
// In browser console
errorMonitor.printErrors()

// Filter by error type
errorMonitor.getErrorsByType('network')

// Get recent errors
errorMonitor.getRecentErrors(5)

// Export for analysis
const errors = errorMonitor.exportErrors()
```

### 3. Debug Backend Issues

```bash
# Start backend monitor
npm run error-monitor:backend

# In the terminal:
error-monitor> list
error-monitor> filter database
error-monitor> recent 10
error-monitor> export
```

### 4. Export Errors for Analysis

```bash
# Export all errors
npm run error-monitor
# Then type: export

# Or programmatically in frontend:
errorMonitor.exportErrors()
```

## Configuration

### Frontend Configuration

The error monitor is automatically initialized in `frontend/src/app/App.tsx`. You can customize it:

```typescript
import { errorMonitor } from '@/shared/utils/errorMonitoring';

// Set user ID for better tracking
errorMonitor.setUserId('user123');

// Disable monitoring
errorMonitor.disable();

// Add custom error listener
errorMonitor.addListener((error) => {
  console.log('Custom error handler:', error);
});
```

### Backend Configuration

The error monitor is integrated into the error handling middleware. You can customize it:

```javascript
const { errorMonitor } = require('./utils/errorMonitor');

// Enable/disable monitoring
errorMonitor.enable();
errorMonitor.disable();

// Add custom error listener
errorMonitor.addListener((error) => {
  console.log('Custom error handler:', error);
});
```

## Error Log Files

Backend errors are automatically saved to:
- `backend/logs/errors.json` - Individual error entries
- `error-export.json` - Exported error data

## Troubleshooting

### Frontend Errors Not Captured
1. Check if the app is running (`npm run dev`)
2. Open browser console and check for error monitor messages
3. Try loading the debug script manually

### Backend Errors Not Captured
1. Check if backend is running
2. Verify error monitor is enabled
3. Check `backend/logs/` directory for log files

### Terminal Commands Not Working
1. Make sure you're in the correct directory
2. Check if Node.js is installed
3. Verify the script files exist

## Advanced Usage

### Custom Error Handlers

```javascript
// Frontend
errorMonitor.addListener((error) => {
  // Send to external service
  fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify(error)
  });
});

// Backend
errorMonitor.addListener((error) => {
  // Send to external logging service
  console.log('Sending to external service:', error);
});
```

### Error Filtering

```javascript
// Frontend - filter by type
const networkErrors = errorMonitor.getErrorsByType('network');

// Backend - use terminal filter
error-monitor> filter database
```

### Error Analysis

```javascript
// Get error summary
const summary = errorMonitor.getErrorSummary();
console.log('Total errors:', summary.total);
console.log('By type:', summary.byType);
console.log('Recent:', summary.recent);
```

## Best Practices

1. **Enable monitoring in development** - Always have error monitoring active during development
2. **Check errors regularly** - Review captured errors to identify patterns
3. **Export errors for analysis** - Save error data for deeper investigation
4. **Use filtering** - Focus on specific error types when debugging
5. **Monitor both frontend and backend** - Use the unified monitor for complete coverage

## Integration with External Services

The error monitoring system can be easily integrated with external services:

```javascript
// Example: Send to Sentry
errorMonitor.addListener((error) => {
  Sentry.captureException(error);
});

// Example: Send to custom API
errorMonitor.addListener((error) => {
  fetch('/api/error-reporting', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error)
  });
});
```

This error monitoring system provides comprehensive debugging capabilities for both frontend and backend development, making it much easier to identify and fix issues quickly.
