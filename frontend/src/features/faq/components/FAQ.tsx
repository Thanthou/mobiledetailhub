import React from 'react';

import { useFAQData } from '../hooks/useFAQData';
import type { FAQProps, FAQRef } from '../types';

import FAQContent from './FAQContent';

const FAQ = React.forwardRef<FAQRef, FAQProps>(({ autoExpand = false }, ref) => {
  const { faqData, isExpanded, setIsExpanded, openItems, toggleItem } = useFAQData({ autoExpand });

  return (
    <FAQContent
      ref={ref}
      data={faqData}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      openItems={openItems}
      toggleItem={toggleItem}
    />
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
