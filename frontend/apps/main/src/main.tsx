import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@shared/ui';
import MainSiteApp from './MainSiteApp';
import { MainProviders } from './MainProviders';
import '../../../src/index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <MainProviders>
          <MainSiteApp />
        </MainProviders>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

