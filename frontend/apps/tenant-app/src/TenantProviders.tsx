import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AppShell } from '@shared/bootstrap';
import { ErrorBoundary } from '@shared/ui';
import { WebsiteContentProvider } from '@shared/contexts/WebsiteContentContext';
import { inPreviewMode } from '@shared/utils';
import { PreviewDataProvider } from './contexts/PreviewDataProvider';

interface TenantProvidersProps {
  children: React.ReactNode;
}

// Separate QueryClient for preview mode (minimal config, no retries)
const previewQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

/**
 * Preview-only providers
 * 
 * Minimal provider stack for preview mode:
 * - QueryClient (with retries disabled)
 * - PreviewDataProvider (mock tenant data)
 * - WebsiteContentProvider (disabled for preview routes, but provides context)
 * 
 * DOES NOT include:
 * - ConfigProvider (would fetch runtime config from API)
 * - DataProvider (would fetch live tenant data)
 * - AuthProvider (no authentication in preview)
 * - TenantConfigProvider (no live config)
 */
function PreviewProviders({ children }: TenantProvidersProps) {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={previewQueryClient}>
          <PreviewDataProvider>
            <WebsiteContentProvider>
              {children}
            </WebsiteContentProvider>
          </PreviewDataProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

/**
 * Live tenant providers
 * 
 * Full provider stack for live tenant sites:
 * - AppShell with all providers (Auth, Data, TenantConfig, WebsiteContent)
 * - SEO management enabled
 */
function LiveProviders({ children }: TenantProvidersProps) {
  return (
    <AppShell appType="tenant" enableSEO>
      {children}
    </AppShell>
  );
}

/**
 * Tenant app providers with preview/live split
 * 
 * Architecture:
 * - Preview mode: Minimal providers + mock data (NO API calls)
 * - Live mode: Full AppShell with tenant data fetching
 * 
 * This ensures that live data providers (DataProvider, WebsiteContentProvider)
 * never mount in preview mode, preventing API calls and the favicon spinner.
 */
export const TenantProviders: React.FC<TenantProvidersProps> = ({ children }) => {
  // Single source of truth for preview detection
  const isPreview = inPreviewMode();
  
  if (isPreview) {
    return <PreviewProviders>{children}</PreviewProviders>;
  }

  return <LiveProviders>{children}</LiveProviders>;
};
