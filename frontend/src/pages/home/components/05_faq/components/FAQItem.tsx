import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

import type { FAQItemWithIndex } from '../types';

interface FAQItemProps {
  item: FAQItemWithIndex;
  isOpen: boolean;
  onToggle: () => void;
  highlightTerm?: string;
}

// Helper function to highlight text
const highlightText = (text: string, highlightTerm?: string) => {
  if (!highlightTerm || !highlightTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${highlightTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-orange-400/20 text-orange-200 px-1 rounded">
        {part}
      </mark>
    ) : part
  );
};

const FAQItem: React.FC<FAQItemProps> = ({ item, isOpen, onToggle, highlightTerm }) => {
  return (
    <article
      className={`bg-stone-700 rounded-lg shadow-sm border border-stone-600 overflow-hidden ${isOpen ? 'h-fit' : 'h-full flex flex-col'}`}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={onToggle}
        className={`w-full text-left p-6 flex justify-between items-start hover:bg-stone-600 transition-colors ${!isOpen ? 'flex-shrink-0' : ''}`}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.originalIndex.toString()}`}
      >
        <h4 className="text-lg font-semibold text-white pr-4" itemProp="name">
          {highlightText(item.question, highlightTerm)}
        </h4>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {isOpen ? (
        <div
          id={`faq-answer-${item.originalIndex.toString()}`}
          className="px-6 pb-6"
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <div className="border-t border-stone-600 pt-4">
            <p className="text-gray-300 leading-relaxed" itemProp="text">
              {highlightText(item.answer, highlightTerm)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-grow"></div>
      )}
    </article>
  );
};

export default FAQItem;