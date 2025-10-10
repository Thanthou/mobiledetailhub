// Website Content Context
// Loads website content from database once on page load

import React, { createContext, ReactNode, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { websiteContentApi, WebsiteContentData } from '../api/websiteContent.api';

interface WebsiteContentContextType {
  content: WebsiteContentData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const WebsiteContentContext = createContext<WebsiteContentContextType | null>(null);

interface WebsiteContentProviderProps {
  children: ReactNode;
}

export const WebsiteContentProvider: React.FC<WebsiteContentProviderProps> = ({ children }) => {
  // Get tenant slug from URL params (same logic as DataProvider)
  const params = useParams();
  const slug = params.businessSlug || params.tenantSlug || params.slug || 'jps';

  const {
    data: content,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['website-content', slug],
    queryFn: async () => {
      // Always use the tenant-specific endpoint since main site uses 'jps' tenant
      const result = await websiteContentApi.getWebsiteContent(slug);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!slug,
  });

  const contextValue: WebsiteContentContextType = {
    content: content || null,
    isLoading,
    error: error?.message ?? null,
    refetch: () => { void refetch(); },
  };

  return (
    <WebsiteContentContext.Provider value={contextValue}>
      {children}
    </WebsiteContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- Standard context pattern: hook and provider together
export const useWebsiteContent = (): WebsiteContentContextType => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within a WebsiteContentProvider');
  }
  return context;
};
