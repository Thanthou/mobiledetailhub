
import PropTypes from 'prop-types';
import React from 'react';

import { useFAQ } from '@/hooks/useFAQ';

import AffiliateFooter from '../components/AffiliateFooter';
import AffiliateHeader from '../components/AffiliateHeader';
import FAQExpandButton from '../components/FAQExpandButton';
import FAQTabbedInterface from '../components/FAQTabbedInterface';
import { useAffiliateData } from '../hooks/useAffiliateData';
import { useFAQEffects } from '../hooks/useFAQEffects';
import { useFAQState } from '../hooks/useFAQState';
import type { FAQProps, FAQRef } from '../types';

const FAQAffiliate = React.forwardRef<FAQRef, FAQProps>(
  ({ autoExpand = false }, ref) => {
    // Use global FAQ state for expansion
    const faqContext = useFAQ();
    const isExpanded = faqContext?.isExpanded ?? false;
    const setIsExpanded = React.useMemo(() => faqContext?.setIsExpanded ?? (() => {}), [faqContext?.setIsExpanded]);
    
    // Use local state for individual FAQ items
    const faqState = useFAQState(autoExpand);
    const openItems = faqState?.openItems ?? new Set<string>();
    const toggleItem = faqState?.toggleItem ?? (() => {});
    const resetState = faqState?.resetState ?? (() => {});

    // Custom hook for affiliate FAQ data
    const affiliateData = useAffiliateData();
    const faqData = affiliateData?.faqData ?? [];
    const groupedFAQs = affiliateData?.groupedFAQs ?? {};
    const categories = affiliateData?.categories ?? [];
    const geoConfig = affiliateData?.geoConfig;

    // Custom hook for side effects
    useFAQEffects({
      faqData,
      isExpanded,
      resetState,
      setIsExpanded
    });

    // Imperative handle for ref
    React.useImperativeHandle(ref, () => ({
      expand: () => { setIsExpanded(true); },
    }), [setIsExpanded]);

    return (
      <section className="bg-stone-900 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-7xl mx-auto px-4">
          {!isExpanded ? (
            <FAQExpandButton onToggleExpanded={() => { setIsExpanded(true); }} />
          ) : (
            <div className="space-y-8">
              <AffiliateHeader
                geoConfig={geoConfig}
                onToggleExpanded={() => { setIsExpanded(false); }}
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

FAQAffiliate.propTypes = {
  autoExpand: PropTypes.bool,
};

export default FAQAffiliate;
