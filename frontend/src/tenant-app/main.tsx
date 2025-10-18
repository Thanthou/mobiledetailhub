import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Providers } from '../app/providers';
import TenantApp from './TenantApp';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <TenantApp />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
