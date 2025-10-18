import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Providers } from '../app/providers';
import AdminApp from './AdminApp';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <AdminApp />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
