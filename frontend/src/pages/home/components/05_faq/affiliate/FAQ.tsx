
import React from 'react';
import { FAQProps, FAQRef } from '../types';
import { useAffiliateData } from '../hooks/useAffiliateData';
import { useFAQState } from '../hooks/useFAQState';
import { useFAQEffects } from '../hooks/useFAQEffects';
import { useFAQ } from '/src/contexts/FAQContext';
import FAQExpandButton from '../components/FAQExpandButton';
import AffiliateHeader from '../components/AffiliateHeader';
import FAQTabbedInterface from '../components/FAQTabbedInterface';
import AffiliateFooter from '../components/AffiliateFooter';

const FAQAffiliate = React.forwardRef<FAQRef, FAQProps>(
  ({ autoExpand = false }, ref) => {
    // Use global FAQ state for expansion
    const { isExpanded, setIsExpanded } = useFAQ();
    
    // Use local state for individual FAQ items
    const {
      openItems,
      toggleItem,
      resetState
    } = useFAQState(autoExpand);

    // Custom hook for affiliate FAQ data
    const { faqData, groupedFAQs, categories, geoConfig } = useAffiliateData();

    // Custom hook for side effects
    useFAQEffects({
      faqData,
      isExpanded,
      resetState,
      setIsExpanded
    });

    // Imperative handle for ref
    React.useImperativeHandle(ref, () => ({
      expand: () => setIsExpanded(true),
    }), [setIsExpanded]);

    return (
      <section className="bg-stone-900 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-7xl mx-auto px-4">
          {!isExpanded ? (
            <FAQExpandButton onToggleExpanded={() => setIsExpanded(true)} />
          ) : (
            <div className="space-y-8">
              <AffiliateHeader
                geoConfig={geoConfig}
                onToggleExpanded={() => setIsExpanded(false)}
              />

              <FAQTabbedInterface
                groupedFAQs={groupedFAQs}
                categories={categories}
                openItems={openItems}
                onToggleItem={toggleItem}
              />

              <AffiliateFooter />
            </div>
          )}
        </div>
      </section>
    );
  }
);

FAQAffiliate.displayName = 'FAQAffiliate';

export default FAQAffiliate;
