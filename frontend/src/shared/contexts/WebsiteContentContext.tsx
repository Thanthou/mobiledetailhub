// Website Content Context
// Loads website content from database once on page load

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteContentApi, WebsiteContentData } from '../api/websiteContent.api';
import { useSiteContext } from '../utils/siteContext';

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
  const { isMainSite, locationData } = useSiteContext();
  
  // Determine which tenant slug to use
  const tenantSlug = useMemo(() => {
    if (isMainSite) {
      return 'jps'; // Main site uses 'jps' as tenant slug (based on database data)
    }
    
    // For location sites, we need to determine the tenant slug
    // This could be based on location data or some other logic
    // For now, we'll use a placeholder that needs to be implemented
    return locationData?.tenantSlug || 'jps';
  }, [isMainSite, locationData]);

  const {
    data: content,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['website-content', tenantSlug],
    queryFn: async () => {
      // Always use the tenant-specific endpoint since main site uses 'jps' tenant
      const result = await websiteContentApi.getWebsiteContent(tenantSlug);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!tenantSlug,
  });

  const contextValue: WebsiteContentContextType = {
    content: content || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };

  return (
    <WebsiteContentContext.Provider value={contextValue}>
      {children}
    </WebsiteContentContext.Provider>
  );
};

export const useWebsiteContent = (): WebsiteContentContextType => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within a WebsiteContentProvider');
  }
  return context;
};
