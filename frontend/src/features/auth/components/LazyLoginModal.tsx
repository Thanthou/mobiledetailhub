import React, { lazy, Suspense, useEffect } from 'react';

import { LazyLoginModalProps } from '../types/auth.types';
import { useLoginModalPrefetch } from '../hooks/useLoginModalPrefetch';
import LoginModalErrorBoundary from './LoginModalErrorBoundary';
import LoginModalFallback from './LoginModalFallback';

// Lazy load the LoginModal component
const LoginModal = lazy(() => import('./LoginModal'));

const LazyLoginModal: React.FC<LazyLoginModalProps> = ({ isOpen, onClose }) => {
  const { isPreloading, isPreloaded, handleOpen } = useLoginModalPrefetch();

  // Monitor component loading performance
  useEffect(() => {
    if (isOpen) {
      const cleanup = handleOpen();
      return cleanup;
    }
    return undefined;
  }, [isOpen, handleOpen]);

  // Don't render anything if modal is closed and not preloaded
  if (!isOpen && !isPreloaded && !isPreloading) {
    return null;
  }

  return (
    <LoginModalErrorBoundary fallback={<LoginModalFallback />}>
      <Suspense fallback={<LoginModalFallback />}>
        <LoginModal isOpen={isOpen} onClose={onClose} />
      </Suspense>
    </LoginModalErrorBoundary>
  );
};

export default LazyLoginModal;

// Re-export prefetch functions from the hook
export { prefetchLoginModal, useLoginModalPrefetch } from '../hooks/useLoginModalPrefetch';
