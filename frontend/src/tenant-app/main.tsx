import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { TenantProviders } from './TenantProviders';
import TenantApp from './TenantApp';
import '../index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

// ✅ STEP 2 COMPLETE: main.tsx started executing
if (typeof window.__debugStep === 'function') {
  window.__debugStep(2, 'active');
}

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
  console.log('🔄 history.pushState called:', args[2], 'Stack:', new Error().stack.split('\n').slice(1, 3).join('\n'));
  return originalPushState.apply(this, args);
};

window.history.replaceState = function(...args) {
  console.log('🔄 history.replaceState called:', args[2], 'Stack:', new Error().stack.split('\n').slice(1, 3).join('\n'));
  return originalReplaceState.apply(this, args);
};

// Add navigation listener
window.addEventListener('popstate', (e) => {
  console.log('🔙 Navigation event (back/forward):', window.location.pathname);
});

// ✅ STEP 3: About to mount React
if (typeof window.__debugStep === 'function') {
  window.__debugStep(3, 'active');
}

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* All routes handled by TenantApp, preview mode via ?industry= query param */}
      <TenantProviders>
        <TenantApp />
      </TenantProviders>
    </BrowserRouter>
  </React.StrictMode>
);
