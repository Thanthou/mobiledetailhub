import React from "react";

import { CTAButton } from "@/features/booking";
import type { SectionProps } from "@/features/services/types/service";
import { SECTION_IDS } from "@/features/services/utils/sectionIds";
import { useSiteContext } from "@/shared/hooks";
import { LocationSearchBar as GetStarted } from "@/shared/ui";

const Action: React.FC<SectionProps> = ({ id = SECTION_IDS.ACTION, onBook, onQuote, className, serviceData }) => {
  const { isAffiliate } = useSiteContext();
  return (
    <section id={id} className={`bg-stone-800 py-16 ${className ?? ""}`}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {serviceData.action.title || "Ready to get started?"}
        </h2>
        <p className="mt-2 text-slate-300">
          {serviceData.action.description || (isAffiliate ? "Choose an option to continue." : "Enter your location to find services near you.")}
        </p>
        <div className="mt-6">
          {isAffiliate ? (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <CTAButton type="book" onClick={onBook} className="w-full sm:w-48" />
                <CTAButton type="quote" onClick={onQuote} variant="outlined" className="w-full sm:w-48" />
              </div>
              <div className="mt-4 text-xs text-slate-400">Secure checkout • Verified reviews</div>
            </>
          ) : (
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
      </div>
    </section>
  );
};
export default Action;
