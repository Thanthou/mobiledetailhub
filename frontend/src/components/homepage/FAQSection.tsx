import React from 'react';
import { FAQMDH, FAQAffiliate } from '../faq';

interface FAQSectionProps {
  currentBusiness: string;
  onRequestQuote: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  currentBusiness,
  onRequestQuote
}) => {
  return (
    <div id="faq">
      {currentBusiness === 'mdh' ? (
        <FAQMDH onRequestQuote={onRequestQuote} autoCollapseOnScroll={true} />
      ) : (
        <FAQAffiliate onRequestQuote={onRequestQuote} autoCollapseOnScroll={true} />
      )}
    </div>
  );
};

export default FAQSection;