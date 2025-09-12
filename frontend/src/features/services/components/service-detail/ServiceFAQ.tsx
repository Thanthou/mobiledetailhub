import React, { useState } from 'react';

import { Button } from '@/shared/ui';

import type { SectionProps } from '../../types/service';
import { isServiceData, isServiceFAQ } from '../../utils/typeGuards';

const ServiceFAQ: React.FC<SectionProps> = ({ serviceData }: SectionProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Type guard checks
  if (!isServiceData(serviceData)) {
    return null;
  }

  if (!isServiceFAQ(serviceData.faq)) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {serviceData.faq.title}
          </h2>
          <p className="text-lg text-gray-600">
            Common questions about our {serviceData.title.toLowerCase()} services
          </p>
        </div>

        <div className="space-y-4">
          {serviceData.faq.questions.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg">
              <Button
                variant="ghost"
                size="lg"
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100"
                onClick={() => {
                  toggleItem(item.id);
                }}
                rightIcon={
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openItems.has(item.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
              </Button>
              {openItems.has(item.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
