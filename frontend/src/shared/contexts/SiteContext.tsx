import React, { createContext, useContext } from 'react';

import { SiteActions,SiteContextType } from '@shared/types/site';

// Simplified context for tenant-based sites
// All sites are now tenant-based, so we don't need complex location detection
const initialState: SiteContextType = {
  siteState: 'tenant', // Changed from 'mdh' to 'tenant'
  currentLocation: null,
  businessData: null,
  isLoading: false,
  hasError: false,
};

// Context
const SiteContext = createContext<(SiteContextType & SiteActions) | null>(null);

// Provider component
export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All routes are now tenant-based, so we're always in tenant mode
  const contextValue: SiteContextType & SiteActions = {
    ...initialState,
    // Legacy actions that are no longer needed but kept for compatibility
    setLocation: () => {},
    clearLocation: () => {},
    setLoading: () => {},
    setError: () => {},
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

// Hook to use the context
// eslint-disable-next-line react-refresh/only-export-components -- Standard context pattern: hook and provider together
export const useSiteState = () => {
  const context = useContext(SiteContext);
  if (!context) {
    console.error('useSiteState must be used within a SiteProvider');
    // Return a safe fallback instead of throwing
    return {
      siteState: 'mdh' as const,
      currentLocation: null,
      businessData: null,
      isLoading: false,
      hasError: false,
      setLocation: () => {},
      clearLocation: () => {},
      setLoading: () => {},
      setError: () => {},
    };
  }
  return context;
};
