import { useState, useCallback, useEffect } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({ hasError: false });

  const handleError = useCallback((error: Error, errorInfo?: any) => {
    console.error('useErrorBoundary caught an error:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error
    });

    // Log to external service in production
    if (import.meta.env.PROD) {
      console.error('Production error:', { error, errorInfo });
    }
  }, []);

  const resetError = useCallback(() => {
    setErrorState({ hasError: false, error: undefined });
  }, []);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      handleError(event.error || new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(event.reason));
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  return {
    ...errorState,
    handleError,
    resetError
  };
};
