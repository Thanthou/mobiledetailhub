import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ErrorBoundary } from '@shared/ui';
import { errorMonitor } from '@shared/utils/errorMonitoring';
import { apiCall } from '@shared/api';

import { AdminProviders } from './AdminProviders';
import AdminApp from './AdminApp';
import '../../../src/index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Enable error monitoring and connect to backend
errorMonitor.enable();

// Set up error reporting to backend
errorMonitor.addListener(async (error) => {
  try {
    // Prevent infinite loop - don't report errors from error reporting
    if (error.url?.includes('/api/errors/track')) {
      return;
    }
    
    await apiCall('/api/errors/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errors: [{
          message: error.message,
          stack: error.stack,
          type: error.type,
          url: error.url,
          userAgent: error.userAgent,
          sessionId: error.sessionId,
          userId: error.userId,
          componentStack: error.componentStack,
          networkInfo: error.networkInfo,
          timestamp: error.timestamp.toISOString(),
          code: `ADMIN_${error.type.toUpperCase()}`,
          severity: error.type === 'react' ? 'high' : 'medium',
          category: 'admin'
        }],
        sessionId: error.sessionId,
        timestamp: error.timestamp.toISOString()
      })
    });
  } catch (reportError) {
    console.warn('Failed to report error to backend:', reportError);
  }
});

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AdminProviders>
            <AdminApp />
          </AdminProviders>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

