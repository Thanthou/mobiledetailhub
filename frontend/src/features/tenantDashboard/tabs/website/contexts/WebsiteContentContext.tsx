import React, { createContext, useContext } from 'react';

import { useWebsiteContentData } from '../hooks/useWebsiteContentData';

interface WebsiteContentContextValue {
  contentData: any;
  loading: boolean;
  error: string | null;
  updateContent: (data: any) => Promise<boolean>;
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

export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within WebsiteContentProvider');
  }
  return context;
};

