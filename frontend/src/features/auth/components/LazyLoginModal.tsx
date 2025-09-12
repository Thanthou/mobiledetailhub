import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { usePerformanceMonitor } from '@/shared/hooks';

// Lazy load the LoginModal component
const LoginModal = lazy(() => import('./LoginModal'));

interface LazyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Loading fallback component that matches the actual modal design
const LoginModalFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 w-full max-w-md">
      <div className="p-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-600 rounded-2xl mx-auto mb-4"></div>
            <div className="h-8 bg-stone-600 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-stone-600 rounded w-64 mx-auto"></div>
          </div>
          
          {/* Form skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-stone-700 rounded-xl"></div>
            <div className="h-12 bg-stone-700 rounded-xl"></div>
            <div className="h-12 bg-stone-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced error boundary for better error handling
class ModalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static override getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LoginModal lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

ModalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node.isRequired,
};

const LazyLoginModal: React.FC<LazyLoginModalProps> = ({ isOpen, onClose }) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const { startLoad, endLoad } = usePerformanceMonitor('LoginModal');

  // Enhanced prefetch logic with better caching
  const handlePrefetch = useCallback(async (): Promise<void> => {
    if (!isPreloaded && !isPreloading) {
      setIsPreloading(true);
      try {
        await import('./LoginModal');
        setIsPreloaded(true);
      } catch (error: unknown) {
        console.error('Failed to prefetch LoginModal:', error);
      } finally {
        setIsPreloading(false);
      }
    }
  }, [isPreloaded, isPreloading]);

  // Auto-prefetch after a delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      void handlePrefetch();
    }, 1500); // Prefetch after 1.5 seconds (login is more commonly used)
    
    return () => { clearTimeout(timer); };
  }, [handlePrefetch]);

  // Monitor component loading performance
  useEffect(() => {
    if (isOpen) {
      startLoad();
      const timer = setTimeout(() => {
        endLoad();
      }, 100);
      return () => { clearTimeout(timer); };
    }
  }, [isOpen, startLoad, endLoad]);

  // Don't render anything if modal is closed and not preloaded
  if (!isOpen && !isPreloaded && !isPreloading) {
    return null;
  }

  return (
    <ModalErrorBoundary fallback={<LoginModalFallback />}>
      <Suspense fallback={<LoginModalFallback />}>
        <LoginModal isOpen={isOpen} onClose={onClose} />
      </Suspense>
    </ModalErrorBoundary>
  );
};

export default LazyLoginModal;

// Enhanced prefetch function with better error handling and caching
// eslint-disable-next-line react-refresh/only-export-components
export const prefetchLoginModal = (() => {
  let prefetchPromise: Promise<unknown> | null = null;
  
  return () => {
    if (!prefetchPromise) {
      prefetchPromise = import('./LoginModal')
        .then(module => {
          // Pre-warm any dependencies or prepare the component
          return module;
        })
        .catch((error: unknown) => {
          console.error('Failed to prefetch LoginModal:', error);
          // Reset promise on error so retry is possible
          prefetchPromise = null;
          throw error;
        });
    }
    return prefetchPromise;
  };
})();

// Export hook for component prefetching
// eslint-disable-next-line react-refresh/only-export-components
export const useLoginModalPrefetch = () => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  const prefetch = useCallback(async () => {
    if (!isPrefetched) {
      try {
        await prefetchLoginModal();
        setIsPrefetched(true);
      } catch (error: unknown) {
        console.error('Prefetch failed:', error);
      }
    }
  }, [isPrefetched]);
  
  return { prefetch, isPrefetched };
};
