import React from 'react';

import { ServiceData } from '@tenant-app/components/services/types/service.types';
import { CTAButtons } from '@shared/ui';

interface ServiceHeroProps {
  serviceData: ServiceData;
  onRequestQuote?: () => void;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ serviceData, onRequestQuote }) => {
  return (
    <section className="bg-stone-900 py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Image and Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-center mb-8">
          {/* Service Image */}
          <div className="aspect-[3/2] rounded-2xl bg-stone-800/80 ring-1 ring-white/10 overflow-hidden">
            {serviceData.hero.image?.src ? (
              <img 
                src={serviceData.hero.image.src} 
                alt={serviceData.hero.image.alt}
                width={800}
                height={533}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                Image Placeholder
              </div>
            )}
          </div>
          
          {/* Content */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {serviceData.hero.headline || serviceData.title || "Service Title"}
            </h1>
            <p className="mt-3 text-slate-300 text-xl md:text-2xl">
              {serviceData.hero.subheadline || serviceData.shortDescription || "Short subhead that sells the value. Placeholder copy."}
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-6">
              <CTAButtons 
                layout="horizontal"
                bookNowProps={{
                  children: serviceData.hero.ctas?.[0]?.label || "Book Now"
                }}
                getQuoteProps={{
                  children: serviceData.hero.ctas?.[1]?.label || "Request Quote",
                  variant: "outline-white",
                  onClick: onRequestQuote
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
