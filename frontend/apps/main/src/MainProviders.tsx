import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PreviewDataProvider } from '@shared/contexts/PreviewDataProvider';
import { WebsiteContentProvider } from '@shared/contexts/WebsiteContentContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface MainProvidersProps {
  children: ReactNode;
}

/**
 * Main App Providers
 * 
 * Wraps the main app with necessary context providers.
 * PreviewDataProvider is included for PreviewPage demos, but HomePage doesn't use it.
 */
export function MainProviders({ children }: MainProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PreviewDataProvider>
        <WebsiteContentProvider>
          {children}
        </WebsiteContentProvider>
      </PreviewDataProvider>
    </QueryClientProvider>
  );
}

