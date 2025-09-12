import React, { useEffect } from 'react';

import { preloadCriticalModals } from '@/shared/utils/modalCodeSplitting';
import { scrollRestoration } from '@/shared/utils/scrollRestoration';

import { Providers } from './providers';
import { AppRoutes } from './routes';

function App() {
  // Global scroll restoration effect
  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Cleanup scroll positions on app unmount
    return () => {
      scrollRestoration.clearScrollPositions();
    };
  }, []);

  // Preload critical modals for better performance
  useEffect(() => {
    // Start preloading after app initializes
    const timer = setTimeout(() => {
      void preloadCriticalModals().catch((error: unknown) => {
        // Modal preloading failed
        console.warn('Modal preloading failed:', error);
      });
    }, 1000);

    return () => { clearTimeout(timer); };
  }, []);

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
