import React, { createContext, useContext } from 'react';

interface TenantContextType {
  slug: string | null;
}

const TenantContext = createContext<TenantContextType | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
  slug: string | null;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children, slug }) => {
  return (
    <TenantContext.Provider value={{ slug }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
