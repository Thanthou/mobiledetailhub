import React, { createContext, useContext } from 'react';

import type { WebsiteContentData } from '@/shared/api/websiteContent.api';

import { useWebsiteContentData } from '../hooks/useWebsiteContentData';

interface WebsiteContentContextValue {
  contentData: WebsiteContentData | null;
  loading: boolean;
  error: string | null;
  updateContent: (data: Partial<WebsiteContentData>) => Promise<boolean>;
  isUpdating: boolean;
  refetch: () => Promise<void>;
}

const WebsiteContentContext = createContext<WebsiteContentContextValue | undefined>(undefined);

interface WebsiteContentProviderProps {
  tenantSlug: string;
  children: React.ReactNode;
}

export const WebsiteContentProvider: React.FC<WebsiteContentProviderProps> = ({ 
  tenantSlug, 
  children 
}) => {
  const value = useWebsiteContentData(tenantSlug);

  return (
    <WebsiteContentContext.Provider value={value}>
      {children}
    </WebsiteContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- Hook is part of the provider pattern
export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within WebsiteContentProvider');
  }
  return context;
};

