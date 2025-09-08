import { useContext } from 'react';

import type { MDHConfigContextType } from './MDHConfigContext';
import { MDHConfigContext } from './MDHConfigContext';

export const useMDHConfig = (): MDHConfigContextType => {
  const context = useContext(MDHConfigContext);
  if (!context) {
    throw new Error('useMDHConfig must be used within an MDHConfigProvider');
  }
  return context;
};
