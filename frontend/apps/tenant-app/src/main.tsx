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

// TEMPORARILY DISABLED - to see raw errors without monitoring loop
// errorMonitor.enable();

// // Set up error reporting to backend
// errorMonitor.addListener(async (error) => {
//   try {
//     await apiCall('/api/errors/track', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         errors: [{
//           message: error.message,
//           stack: error.stack,
//           type: error.type,
//           url: error.url,
//           userAgent: error.userAgent,
//           sessionId: error.sessionId,
//           userId: error.userId,
//           componentStack: error.componentStack,
//           networkInfo: error.networkInfo,
//           timestamp: error.timestamp.toISOString(),
//           code: `TENANT_${error.type.toUpperCase()}`,
//           severity: error.type === 'react' ? 'high' : 'medium',
//           category: 'tenant'
//         }],
//         sessionId: error.sessionId,
//         timestamp: error.timestamp.toISOString()
//       })
//     });
//   } catch (reportError) {
//     console.warn('Failed to report error to backend:', reportError);
//   }
// });

const root = createRoot(container);

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
