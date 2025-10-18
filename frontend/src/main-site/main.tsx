import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { config } from '@/shared/env';

import MainSiteApp from './MainSiteApp';
import { MainSiteProviders } from './providers';

import '../index.css';

// Register Service Worker for PWA functionality (only in production and when explicitly enabled)
if ('serviceWorker' in navigator && config.serviceWorkerEnabled) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err: unknown) => {
      console.warn('SW registration failed:', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <BrowserRouter>
      <MainSiteProviders>
        <MainSiteApp />
      </MainSiteProviders>
    </BrowserRouter>
  </HelmetProvider>
);
