import { useContext } from 'react';

import { FAQContext, type FAQContextType } from '@/shared/contexts/FAQContext';

export const useFAQ = (): FAQContextType => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error('useFAQ must be used within a FAQProvider');
  }
  return context;
};
