import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItemWithIndex } from '../types';

interface FAQItemProps {
  item: FAQItemWithIndex;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <article
      className="bg-stone-700 rounded-lg shadow-sm border border-stone-600 overflow-hidden"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex justify-between items-center hover:bg-stone-600 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.originalIndex}`}
      >
        <h4 className="text-lg font-semibold text-white pr-4" itemProp="name">
          {item.question}
        </h4>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          id={`faq-answer-${item.originalIndex}`}
          className="px-6 pb-6"
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <div className="border-t border-stone-600 pt-4">
            <p className="text-gray-300 leading-relaxed" itemProp="text">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

export default FAQItem;