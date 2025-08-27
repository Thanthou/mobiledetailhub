import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

// Lazy load the QuoteModal component
const QuoteModal = lazy(() => import('./QuoteModal'));

interface LazyQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Loading fallback component that matches the actual modal design
const QuoteModalFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-stone-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div className="p-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-stone-600 rounded w-48 mb-2"></div>
              <div className="h-4 bg-stone-600 rounded w-64"></div>
            </div>
            <div className="h-6 w-6 bg-stone-600 rounded"></div>
          </div>
          
          {/* Contact Information Section */}
          <div className="mb-8">
            <div className="h-6 bg-stone-600 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-stone-700 rounded"></div>
              <div className="h-12 bg-stone-700 rounded"></div>
            </div>
            <div className="h-12 bg-stone-700 rounded mt-6"></div>
          </div>
          
          {/* Vehicle Information Section */}
          <div className="mb-8">
            <div className="h-6 bg-stone-600 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-12 bg-stone-700 rounded"></div>
              <div className="h-12 bg-stone-700 rounded"></div>
              <div className="h-12 bg-stone-700 rounded"></div>
            </div>
          </div>
          
          {/* Service Section */}
          <div className="mb-8">
            <div className="h-6 bg-stone-600 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-12 bg-stone-700 rounded"></div>
              <div className="h-20 bg-stone-700 rounded md:col-span-2"></div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-stone-600">
            <div className="flex-1 h-12 bg-orange-500 rounded"></div>
            <div className="flex-1 h-12 bg-stone-700 rounded"></div>
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
    console.error('QuoteModal lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const LazyQuoteModal: React.FC<LazyQuoteModalProps> = ({ isOpen, onClose }) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const { startLoad, endLoad } = usePerformanceMonitor('QuoteModal');

  // Enhanced prefetch logic with better caching
  const handlePrefetch = useCallback(async (): Promise<void> => {
    if (!isPreloaded && !isPreloading) {
      setIsPreloading(true);
      try {
        await import('./QuoteModal');
        setIsPreloaded(true);
      } catch (error) {
        console.error('Failed to prefetch QuoteModal:', error);
      } finally {
        setIsPreloading(false);
      }
    }
  }, [isPreloaded, isPreloading]);

  // Auto-prefetch after a delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrefetch();
    }, 2000); // Prefetch after 2 seconds of page load
    
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
    <ModalErrorBoundary fallback={<QuoteModalFallback />}>
      <Suspense fallback={<QuoteModalFallback />}>
        <QuoteModal isOpen={isOpen} onClose={onClose} />
      </Suspense>
    </ModalErrorBoundary>
  );
};

export default LazyQuoteModal;

// Enhanced prefetch function with better error handling and caching
export const prefetchQuoteModal = (() => {
  let prefetchPromise: Promise<any> | null = null;
  
  return () => {
    if (!prefetchPromise) {
      prefetchPromise = import('./QuoteModal')
        .then(module => {
          // Pre-warm any dependencies or prepare the component
          return module;
        })
        .catch(error => {
          console.error('Failed to prefetch QuoteModal:', error);
          // Reset promise on error so retry is possible
          prefetchPromise = null;
          throw error;
        });
    }
    return prefetchPromise;
  };
})();

// Export hook for component prefetching
export const useQuoteModalPrefetch = () => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  const prefetch = useCallback(async () => {
    if (!isPrefetched) {
      try {
        await prefetchQuoteModal();
        setIsPrefetched(true);
      } catch (error) {
        console.error('Prefetch failed:', error);
      }
    }
  }, [isPrefetched]);
  
  return { prefetch, isPrefetched };
};
