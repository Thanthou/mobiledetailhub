import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { config } from '@shared/env';
import { ErrorBoundary } from '@shared/ui';
import { errorMonitor } from '@shared/utils/errorMonitoring';
import { apiCall } from '@shared/api';

import MainSiteApp from './MainSiteApp';
import { MainSiteProviders } from './providers';

import '../../../src/index.css';

// Register Service Worker for PWA functionality (only in production and when explicitly enabled)
if ('serviceWorker' in navigator && config.serviceWorkerEnabled) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err: unknown) => {
      console.warn('SW registration failed:', err);
    });
  });
}

// Temporarily disable auto error reporting to avoid potential feedback loops during triage
// errorMonitor.enable();

// Set up error reporting to backend (disabled for now during triage)
/*
errorMonitor.addListener(async (error) => {
  try {
    await apiCall('/api/errors/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Reporting': 'true'
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
          code: `FRONTEND_${error.type.toUpperCase()}`,
          severity: error.type === 'react' ? 'high' : 'medium',
          category: 'frontend'
        }],
        sessionId: error.sessionId,
        timestamp: error.timestamp.toISOString()
      })
    });
  } catch (reportError) {
    console.warn('Failed to report error to backend:', reportError);
  }
});
*/

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <BrowserRouter>
      <ErrorBoundary>
        <MainSiteProviders>
          <MainSiteApp />
        </MainSiteProviders>
      </ErrorBoundary>
    </BrowserRouter>
  </HelmetProvider>
);
