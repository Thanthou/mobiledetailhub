import React from 'react';
import { useBusinessConfig } from '../../hooks/useBusinessConfig';
import ContactInfo from './ContactInfo';
import ServiceAreas from './ServiceAreas';

const ContactAffiliate: React.FC<{ onRequestQuote?: () => void }> = ({ onRequestQuote }) => {
  const { businessConfig, isLoading, error, getBusinessInfoWithOverrides } = useBusinessConfig();
  if (isLoading || error || !businessConfig || !getBusinessInfoWithOverrides) return null;
  const businessInfo = getBusinessInfoWithOverrides;
  return (
    <section id="contact" className="bg-stone-700 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-40">
        <ContactInfo businessInfo={businessInfo} onRequestQuote={onRequestQuote} />
        <ServiceAreas businessConfig={businessConfig} isMDH={false} />
      </div>
    </section>
  );
};
export default ContactAffiliate;
