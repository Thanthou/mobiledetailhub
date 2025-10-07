import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, TenantConfigProvider } from '@/shared/contexts';
import { WebsiteContentProvider } from '@/shared/contexts/WebsiteContentContext';
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
          <TenantConfigProvider>
            <Router>
              <WebsiteContentProvider>
                {children}
              </WebsiteContentProvider>
            </Router>
          </TenantConfigProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

