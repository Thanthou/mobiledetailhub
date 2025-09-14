import React, { useEffect } from 'react';

import { preloadCriticalModals } from '@/shared/utils/modalCodeSplitting';
import { scrollRestoration } from '@/shared/utils/scrollRestoration';
import { errorMonitor } from '@/shared/utils/errorMonitoring';

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

  // Initialize error monitoring
  useEffect(() => {
    // Set up error monitoring
    errorMonitor.enable();
    
    // Add error listener for real-time debugging
    const unsubscribe = errorMonitor.addListener((error) => {
      // In development, show a more detailed error notification
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚨 New Error Captured`);
        console.error('Type:', error.type);
        console.error('Message:', error.message);
        console.error('Time:', error.timestamp.toISOString());
        console.error('URL:', error.url);
        if (error.stack) console.error('Stack:', error.stack);
        console.groupEnd();
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
