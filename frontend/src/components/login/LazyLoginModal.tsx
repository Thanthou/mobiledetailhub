import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

// Lazy load the LoginModal component
const LoginModal = lazy(() => import('./LoginModal'));

interface LazyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Loading fallback component that matches the actual modal design
const LoginModalFallback: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    
    {/* Modal skeleton */}
    <div className="relative w-full max-w-md transform">
      <div className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="h-7 bg-stone-600 rounded w-20"></div>
              <div className="h-6 w-6 bg-stone-600 rounded"></div>
            </div>
            
            {/* Form skeleton */}
            <div className="space-y-6">
              {/* Email field */}
              <div>
                <div className="h-4 bg-stone-600 rounded w-16 mb-2"></div>
                <div className="h-12 bg-stone-700 rounded"></div>
              </div>
              
              {/* Password field */}
              <div>
                <div className="h-4 bg-stone-600 rounded w-20 mb-2"></div>
                <div className="h-12 bg-stone-700 rounded"></div>
              </div>
              
              {/* Submit button */}
              <div className="h-12 bg-orange-500 rounded"></div>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-stone-600"></div>
                <div className="px-4 h-4 bg-stone-600 rounded w-8"></div>
                <div className="flex-1 h-px bg-stone-600"></div>
              </div>
              
              {/* Social buttons */}
              <div className="space-y-3">
                <div className="h-12 bg-stone-700 rounded"></div>
                <div className="h-12 bg-stone-700 rounded"></div>
              </div>
              
              {/* Toggle text */}
              <div className="text-center">
                <div className="h-4 bg-stone-600 rounded w-48 mx-auto"></div>
              </div>
            </div>
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
      } catch (error) {
        console.error('Failed to prefetch LoginModal:', error);
      } finally {
        setIsPreloading(false);
      }
    }
  }, [isPreloaded, isPreloading]);

  // Auto-prefetch after a delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrefetch();
    }, 1500); // Prefetch after 1.5 seconds (login is more commonly used)
    
    return () => clearTimeout(timer);
  }, [handlePrefetch]);

  // Monitor component loading performance
  useEffect(() => {
    if (isOpen) {
      startLoad();
      const timer = setTimeout(() => {
        endLoad();
      }, 100);
      return () => clearTimeout(timer);
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
export const prefetchLoginModal = (() => {
  let prefetchPromise: Promise<any> | null = null;
  
  return () => {
    if (!prefetchPromise) {
      prefetchPromise = import('./LoginModal')
        .then(module => {
          // Pre-warm any dependencies or prepare the component
          return module;
        })
        .catch(error => {
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
export const useLoginModalPrefetch = () => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  const prefetch = useCallback(async () => {
    if (!isPrefetched) {
      try {
        await prefetchLoginModal();
        setIsPrefetched(true);
      } catch (error) {
        console.error('Prefetch failed:', error);
      }
    }
  }, [isPrefetched]);
  
  return { prefetch, isPrefetched };
};
