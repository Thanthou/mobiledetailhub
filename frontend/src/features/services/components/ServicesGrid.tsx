import React from 'react';
import ServiceCard from './ServiceCard';
import { useServices } from '@/features/services/hooks/useServices';
import { ServicesGridProps } from '@/features/services/types/service.types';

const ServicesGrid: React.FC<ServicesGridProps> = ({ locationData }) => {
  const { services } = useServices(locationData);

  return (
    <section id="services" className="h-dvh bg-stone-800 snap-start snap-always pt-20">
      <div className="h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Top row - 4 smaller services */}
        <ul className="grid grid-cols-4 gap-4 w-full">
          {services.slice(0, 4).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </ul>
        
        {/* Spacing between grids */}
        <div className="h-16"></div>
        
        {/* Bottom row - 3 larger services */}
        <ul className="grid grid-cols-3 gap-6 w-full">
          {services.slice(4, 7).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ServicesGrid;
