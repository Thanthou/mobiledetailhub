import React from 'react';

import type { FAQItem as FAQItemType } from '@/features/faq/types';

import FAQItem from './FAQItem';

interface FAQListProps {
  faqs: FAQItemType[];
  expandedFaq: number | string | null;
  onToggleFaq: (id: number | string) => void;
}

const FAQList: React.FC<FAQListProps> = ({ faqs, expandedFaq, onToggleFaq }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {faqs.map((faq, index) => {
        // Use id if available, otherwise fall back to question or index
        const key = faq.id ?? `faq-${String(index)}`;
        return (
          <FAQItem
            key={key}
            faq={faq}
            isExpanded={expandedFaq === key}
            onToggle={() => {
              onToggleFaq(key);
            }}
          />
        );
      })}
    </div>
  );
};

export default FAQList;
