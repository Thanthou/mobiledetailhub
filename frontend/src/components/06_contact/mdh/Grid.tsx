import React from 'react';
import ContactInfoColumnMDH from './ContactInfoColumn';
import ServiceAreas from './ServiceAreas';

interface ContactGridProps {
  config: any;
}

const ContactGrid: React.FC<ContactGridProps> = ({ config }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
      <ContactInfoColumnMDH 
        businessInfo={{
          phone: config.phone,
          email: config.email,
          address: "Anywhere, USA"
        }}
      />
      <ServiceAreas />
    </div>
  );
};

export default ContactGrid;