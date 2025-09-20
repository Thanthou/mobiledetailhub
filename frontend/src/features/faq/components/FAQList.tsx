import React from 'react';

import type { FAQItem } from '@/features/faq/types';
import FAQItem from './FAQItem';

interface FAQListProps {
  faqs: FAQItem[];
  expandedFaq: number | string | null;
  onToggleFaq: (id: number | string) => void;
}

const FAQList: React.FC<FAQListProps> = ({ faqs, expandedFaq, onToggleFaq }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {faqs.map((faq) => (
        <FAQItem
          key={faq.question}
          faq={faq}
          isExpanded={expandedFaq === faq.question}
          onToggle={() => onToggleFaq(faq.question)}
        />
      ))}
    </div>
  );
};

export default FAQList;
