import { useContext } from 'react';

import { FAQContext } from '../contexts/FAQContext';

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error('useFAQ must be used within a FAQProvider');
  }
  return context;
};
