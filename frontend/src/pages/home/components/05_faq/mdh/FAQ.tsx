/* eslint-disable react-refresh/only-export-components */
import React from 'react';

import FAQExpandButton from '../components/FAQExpandButton';
import FAQFooter from '../components/FAQFooter';
import FAQHeader from '../components/FAQHeader';
import FAQTabbedInterface from '../components/FAQTabbedInterface';
import { useFAQMDH } from './useFAQMDH';

const FAQMDH: React.FC = () => {
  const {
    isExpanded,
    setIsExpanded,
    openItems,
    toggleItem,
    groupedFAQs,
    categories,
    servicesLine,
    nearbyList
  } = useFAQMDH();

  return (
    <section className="bg-stone-900 py-16" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4">
        {!isExpanded ? (
          <FAQExpandButton onToggleExpanded={() => { setIsExpanded(true); }} />
        ) : (
          <div className="space-y-8">
            <FAQHeader
              servicesLine={servicesLine}
              nearbyList={nearbyList}
              onToggleExpanded={() => { setIsExpanded(false); }}
            />
            <FAQTabbedInterface
              groupedFAQs={groupedFAQs}
              categories={categories}
              openItems={openItems}
              onToggleItem={toggleItem}
            />
            <FAQFooter />
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQMDH;