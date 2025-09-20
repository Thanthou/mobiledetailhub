import { useContext } from 'react';

import { MDHConfigContext } from '@/shared/contexts/MDHConfigContext';

export const useMDHConfig = () => {
  const context = useContext(MDHConfigContext);
  
  if (!context) {
    throw new Error('useMDHConfig must be used within an MDHConfigProvider');
  }
  
  return context;
};
