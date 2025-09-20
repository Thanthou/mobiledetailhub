import React from 'react';
import ServiceCard from './ServiceCard';
import { useServices } from '@/features/services/hooks/useServices';

const ServicesGrid: React.FC = () => {
  const { services } = useServices();

  return (
    <section id="services" className="h-screen bg-stone-800 snap-start snap-always">
      <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {services.map((service) => (
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
