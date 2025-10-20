import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@shared/ui';
import { errorMonitor } from '@shared/utils/errorMonitoring';
import { apiCall } from '@shared/api';

import { TenantProviders } from './TenantProviders';
import TenantApp from './TenantApp';
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
          code: `TENANT_${error.type.toUpperCase()}`,
          severity: error.type === 'react' ? 'high' : 'medium',
          category: 'tenant'
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

// DEBUG: Log when app loads
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 TENANT APP MAIN.TSX LOADING!');
console.log('Current pathname:', window.location.pathname);
console.log('Current href:', window.location.href);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Intercept ALL navigation to catch redirects
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function(...args) {
  console.log('🔄 history.pushState called:', args[2], 'Stack:', new Error().stack?.split('\n').slice(1, 3).join('\n'));
  return originalPushState.apply(this, args);
};

window.history.replaceState = function(...args) {
  console.log('🔄 history.replaceState called:', args[2], 'Stack:', new Error().stack?.split('\n').slice(1, 3).join('\n'));
  return originalReplaceState.apply(this, args);
};

// Add navigation listener
window.addEventListener('popstate', () => {
  console.log('🔙 Navigation event (back/forward):', window.location.pathname);
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        {/* All routes handled by TenantApp, preview mode via ?industry= query param */}
        <TenantProviders>
          <TenantApp />
        </TenantProviders>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
