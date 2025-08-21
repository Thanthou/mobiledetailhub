import React from 'react';
import ContactInfoColumn from '../columns/Contact';
import ServiceAreas from './ServiceAreas';
import { useLocation } from '../../../contexts/LocationContext';

interface ContactGridProps {
  config: any;
}

const ContactGrid: React.FC<ContactGridProps> = ({ config }) => {
  const { selectedLocation } = useLocation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
      <ContactInfoColumn 
        businessInfo={{
          phone: config.phone,
          email: config.email,
          address: selectedLocation?.fullLocation || 'Location not set'
        }}
      />
      <ServiceAreas />
    </div>
  );
};

export default ContactGrid;