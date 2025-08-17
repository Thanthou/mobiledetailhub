import React from 'react';
import ContactAffiliate from '../contact/ContactAffiliate';
import ContactMDH from '../contact/ContactMDH';

interface ContactSectionProps {
  currentBusiness: string;
  onRequestQuote: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  currentBusiness,
  onRequestQuote
}) => {
  return (
    <div id="contact">
      {currentBusiness === 'mdh' ? (
        <ContactMDH />
      ) : (
        <ContactAffiliate onRequestQuote={onRequestQuote} />
      )}
    </div>
  );
};

export default ContactSection;