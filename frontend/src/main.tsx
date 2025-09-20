import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './index.css';

// Register Service Worker for PWA functionality (only in production and when explicitly enabled)
if ('serviceWorker' in navigator && import.meta.env.PROD && import.meta.env.VITE_ENABLE_SW === '1') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <>
    <App />
  </>
);
