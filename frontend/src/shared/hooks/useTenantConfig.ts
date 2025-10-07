import { useContext } from 'react';

import { TenantConfigContext } from '@/shared/contexts/TenantConfigContext';

export const useTenantConfig = () => {
  const context = useContext(TenantConfigContext);
  
  if (!context) {
    throw new Error('useTenantConfig must be used within a TenantConfigProvider');
  }
  
  return context;
};
