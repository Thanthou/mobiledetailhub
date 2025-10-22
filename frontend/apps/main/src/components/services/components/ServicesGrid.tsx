import React from 'react';

import { useServices } from '@main/components/services/hooks/useServices';
import { ServicesGridProps } from '@main/components/services/types/service.types';

import ServiceCard from './ServiceCard';

const ServicesGrid: React.FC<ServicesGridProps> = ({ locationData }) => {
  const { services } = useServices(locationData);

  // Split services for mobile: first 3 and last 3
  const firstThreeServices = services.slice(0, 3);
  const lastThreeServices = services.slice(3, 6);

  return (
    <>
      {/* MOBILE: First 3 services with header */}
      <section 
        id="services" 
        className="md:hidden relative z-0 h-screen snap-start snap-always bg-stone-800 px-4 py-4"
      >
        <div className="mx-auto w-full h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Our Services
          </h2>
          
          <ul className="grid grid-cols-1 gap-4">
            {firstThreeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* MOBILE: Last 3 services */}
      <section 
        className="md:hidden relative z-0 h-screen snap-start snap-always bg-stone-800 px-4 py-2"
      >
        <div className="mx-auto w-full h-full flex flex-col justify-start pt-[80px]">
          <ul className="grid grid-cols-1 gap-4 [&>li>div>div]:h-[calc((100vh-200px)/3)]">
            {lastThreeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* DESKTOP: All services in one section */}
      <section 
        id="services-desktop" 
        className="hidden md:block relative z-0 min-h-screen snap-start snap-always bg-stone-800 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 md:py-12 pt-[100px] md:pt-[120px]"
      >
        <div className="mx-auto w-full">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 md:mb-6 lg:mb-8">
            Our Services
          </h2>
          
          {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default ServicesGrid;
