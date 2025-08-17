import React from 'react';
import { FooterMDH, FooterAffiliate } from '../footer';

interface FooterSectionProps {
  currentBusiness: string;
  onRequestQuote: () => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({
  currentBusiness,
  onRequestQuote
}) => {
  return (
    <>
      {currentBusiness === 'mdh' ? (
        <FooterMDH businessSlug={currentBusiness} />
      ) : (
        <FooterAffiliate businessSlug={currentBusiness} onRequestQuote={onRequestQuote} />
      )}
    </>
  );
};

export default FooterSection;