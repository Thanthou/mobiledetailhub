import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AffiliateProvider, AuthProvider, FAQProvider, LocationProvider, MDHConfigProvider } from '@/shared/contexts';
import { ErrorBoundary } from '@/shared/ui';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider>
            <MDHConfigProvider>
              <FAQProvider>
                <Router>
                  {children}
                </Router>
              </FAQProvider>
            </MDHConfigProvider>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Specialized provider for affiliate-specific routes
export const AffiliateProviders: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider>
            <MDHConfigProvider>
              <FAQProvider>
                <Router>
                  <AffiliateProvider>
                    {children}
                  </AffiliateProvider>
                </Router>
              </FAQProvider>
            </MDHConfigProvider>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
