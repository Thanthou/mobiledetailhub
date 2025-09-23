import React from 'react';
import { CTAButtons } from '@/shared/ui';
import { ServiceData } from '@/features/services/types/service.types';

interface ServiceCTAProps {
  serviceData: ServiceData;
  onRequestQuote?: () => void;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({ serviceData, onRequestQuote }) => {
  return (
    <section className="bg-stone-900 py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {serviceData.cta?.title || "Ready to get started?"}
        </h2>
        {serviceData.cta?.description && (
          <p className="text-slate-300 mb-8">
            {serviceData.cta.description}
          </p>
        )}
        
        <CTAButtons 
          layout="horizontal"
          bookNowProps={{
            children: serviceData.cta?.primary?.label || serviceData.hero?.ctas?.[0]?.label || "Book Now"
          }}
          getQuoteProps={{
            children: serviceData.cta?.secondary?.label || serviceData.hero?.ctas?.[1]?.label || "Request Quote",
            variant: "outline-white",
            onClick: onRequestQuote || (() => console.log('Request Quote clicked - no handler provided'))
          }}
        />
      </div>
    </section>
  );
};

export default ServiceCTA;
