import React from 'react';

import type { FAQItem, FAQRef } from '../types';

interface FAQContentProps {
  data: FAQItem[];
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  openItems: Set<string>;
  toggleItem: (question: string) => void;
  ref?: React.Ref<FAQRef>;
}

const FAQContent = React.forwardRef<FAQRef, FAQContentProps>(
  ({ data, isExpanded, setIsExpanded, openItems, toggleItem }, ref) => {
    // Group FAQs by category
    const groupedFAQs = data.reduce<Record<string, FAQItem[]>>((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    const categories = Object.keys(groupedFAQs);

    // Imperative handle for ref
    React.useImperativeHandle(ref, () => ({
      expand: () => {
        setIsExpanded(true);
      },
    }), [setIsExpanded]);

    return (
      <section className="bg-stone-900 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-7xl mx-auto px-4">
          {!isExpanded ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <button
                onClick={() => {
                  setIsExpanded(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                View FAQs
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                  }}
                  className="text-white hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category} className="bg-stone-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{category}</h3>
                    <div className="space-y-3">
                      {groupedFAQs[category].map((faq, index) => (
                        <div key={index} className="border-b border-stone-700 last:border-b-0 pb-3 last:pb-0">
                          <button
                            onClick={() => {
                              toggleItem(faq.question);
                            }}
                            className="w-full text-left text-white hover:text-blue-300 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{faq.question}</span>
                              <span className="text-xl">
                                {openItems.has(faq.question) ? '−' : '+'}
                              </span>
                            </div>
                          </button>
                          {openItems.has(faq.question) && (
                            <div className="mt-2 text-gray-300">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
);

FAQContent.displayName = 'FAQContent';

export default FAQContent;
