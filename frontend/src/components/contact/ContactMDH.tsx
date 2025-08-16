import React from 'react';
import { useBusinessConfig } from '../../hooks/useBusinessConfig';
import ServiceAreas from './ServiceAreas';

const ContactMDH: React.FC = () => {
  const { businessConfig, isLoading, error } = useBusinessConfig();
  if (isLoading || error || !businessConfig) return null;
  return (
    <section id="contact" className="bg-stone-700 py-12 flex justify-center">
      <ServiceAreas businessConfig={businessConfig} isMDH={true} />
    </section>
  );
};
export default ContactMDH;
