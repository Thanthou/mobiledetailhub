import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { ErrorBoundary } from '@/shared/ui';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { DataProvider } from '@/shared/contexts/DataContext';
import { TenantConfigProvider } from '@/shared/contexts/TenantConfigContext';
import { WebsiteContentProvider } from '@/shared/contexts/WebsiteContentContext';
import { UnifiedTenantProvider } from '@/shared/contexts/TenantContext';
import { SEOManager } from './SEOManager';

// Create a single QueryClient instance for all apps
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

export interface AppShellProps extends PropsWithChildren {
  /**
   * App type determines which providers are included
   * - 'admin': Minimal providers for admin functionality
   * - 'main': Full providers for marketing site
   * - 'tenant': Full providers for tenant sites
   */
  appType: 'admin' | 'main' | 'tenant';
  
  /**
   * Whether to include HelmetProvider for SEO management
   */
  enableSEO?: boolean;
  
  /**
   * Whether to include React Query DevTools (development only)
   */
  enableDevTools?: boolean;
}

/**
 * Unified AppShell component that provides consistent context providers
 * across all three apps (Admin, Main Site, Tenant)
 * 
 * This eliminates duplication and ensures consistent behavior for:
 * - Authentication state
 * - Data management (React Query)
 * - Tenant configuration
 * - Website content
 * - SEO management
 * - Error boundaries
 */
export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  appType, 
  enableSEO = false,
  enableDevTools = false 
}) => {
  const baseProviders = (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );

  // Admin app needs minimal providers
  if (appType === 'admin') {
    return baseProviders;
  }

  // Main site and tenant apps need full provider stack
  const fullProviders = (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UnifiedTenantProvider>
            <DataProvider>
              <TenantConfigProvider>
                <WebsiteContentProvider>
                  {children}
                </WebsiteContentProvider>
              </TenantConfigProvider>
            </DataProvider>
          </UnifiedTenantProvider>
        </AuthProvider>
        {/* TODO: Add ReactQueryDevtools when enableDevTools is true */}
      </QueryClientProvider>
    </ErrorBoundary>
  );

  // Wrap with HelmetProvider if SEO is enabled
  if (enableSEO) {
    return (
      <HelmetProvider>
        {fullProviders}
      </HelmetProvider>
    );
  }

  return fullProviders;
};

/**
 * Higher-order component for wrapping apps with AppShell
 */
export function withAppShell<T extends object>(
  Component: React.ComponentType<T>,
  appType: AppShellProps['appType'],
  options: Partial<Pick<AppShellProps, 'enableSEO' | 'enableDevTools'>> = {}
) {
  return function WrappedComponent(props: T) {
    return (
      <AppShell 
        appType={appType} 
        enableSEO={options.enableSEO}
        enableDevTools={options.enableDevTools}
      >
        <Component {...props} />
      </AppShell>
    );
  };
}
