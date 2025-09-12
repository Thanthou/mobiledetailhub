import React from "react";

import { CTAButton } from "@/features/booking";
import type { SectionProps } from "@/features/services/types/service";
import { SECTION_IDS } from "@/features/services/utils/sectionIds";
import { useSiteContext } from "@/shared/hooks";
import { LocationSearchBar as GetStarted } from "@/shared/ui";

const Hero: React.FC<SectionProps> = ({ id = SECTION_IDS.HERO, onBook, onQuote, className, serviceData, onQuoteHover }) => {
  const { isAffiliate } = useSiteContext();
  return (
    <section id={id} className={`bg-stone-900 py-16 sm:py-24 ${className ?? ""}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Image and Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-center mb-8">
          {/* Service Image */}
          <div className="aspect-[3/2] rounded-2xl bg-stone-800/80 ring-1 ring-white/10 overflow-hidden">
            {serviceData.heroImage ? (
              <img 
                src={serviceData.heroImage} 
                alt={serviceData.title}
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
              {serviceData.title || "Service Title"}
            </h1>
            <p className="mt-3 text-slate-300">
              {serviceData.description || "Short subhead that sells the value. Placeholder copy."}
            </p>
            {/* CTA Buttons for affiliate pages */}
            {isAffiliate && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <CTAButton type="book" onClick={onBook} className="w-full sm:w-48" />
                <CTAButton 
                  type="quote" 
                  onClick={onQuote} 
                  onMouseEnter={onQuoteHover}
                  onFocus={onQuoteHover}
                  variant="outlined" 
                  className="w-full sm:w-48" 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Location Field - Centered below content for MDH pages */}
        {!isAffiliate && (
          <div className="flex justify-center">
            <div className="max-w-xl w-full">
              <GetStarted 
                placeholder="Enter your zip code or city to find services near you"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Hero;
