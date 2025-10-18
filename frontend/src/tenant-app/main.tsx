import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { TenantProviders } from './TenantProviders';
import TenantApp from './TenantApp';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TenantProviders>
        <TenantApp />
      </TenantProviders>
    </BrowserRouter>
  </React.StrictMode>
);
