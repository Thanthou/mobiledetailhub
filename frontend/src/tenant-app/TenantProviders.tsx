import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ErrorBoundary } from '@/shared/ui';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { DataProvider } from '@/shared/contexts/DataContext';
import { TenantConfigProvider } from '@/shared/contexts/TenantConfigContext';
import { WebsiteContentProvider } from '@/shared/contexts/WebsiteContentContext';

// Create a single QueryClient instance for the tenant app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface TenantProvidersProps {
  children: React.ReactNode;
}

export const TenantProviders: React.FC<TenantProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataProvider>
            <TenantConfigProvider>
              <WebsiteContentProvider>
                {children}
              </WebsiteContentProvider>
            </TenantConfigProvider>
          </DataProvider>
        </AuthProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
