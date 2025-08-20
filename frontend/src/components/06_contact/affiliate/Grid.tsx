import React from 'react';
import ContactInfoColumn from '../columns/Contact';
import ServiceAreas from './ServiceAreas';

interface ContactGridProps {
  config: any;
}

const ContactGrid: React.FC<ContactGridProps> = ({ config }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
      <ContactInfoColumn 
        businessInfo={{
          phone: config.phone,
          email: config.email,
          address: config.location
        }}
      />
      <ServiceAreas />
    </div>
  );
};

export default ContactGrid;