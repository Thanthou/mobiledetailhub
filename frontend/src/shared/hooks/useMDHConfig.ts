import { useContext } from 'react';

import type { MDHConfigContextType } from '@/shared/contexts/MDHConfigContext';
import { MDHConfigContext } from '@/shared/contexts/MDHConfigContext';

export const useMDHConfig = (): MDHConfigContextType => {
  const context = useContext(MDHConfigContext);
  if (!context) {
    throw new Error('useMDHConfig must be used within an MDHConfigProvider');
  }
  return context;
};
