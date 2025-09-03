import React from "react";
import type { SectionProps } from "../types/service";
import { SECTION_IDS } from "../utils/sectionIds";
import { CTAButton } from "../../../components/Book_Quote";

const Action: React.FC<SectionProps> = ({ id = SECTION_IDS.ACTION, onBook, onQuote, bookLabel = "Book", quoteLabel = "Quote", className, serviceData }) => {
  return (
    <section id={id} className={`bg-stone-800 py-16 ${className ?? ""}`}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {serviceData?.action?.title || "Ready to get started?"}
        </h2>
        <p className="mt-2 text-slate-300">
          {serviceData?.action?.description || "Choose an option to continue."}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton type="book" onClick={onBook} className="w-full sm:w-48" />
          <CTAButton type="quote" onClick={onQuote} variant="outlined" className="w-full sm:w-48" />
        </div>
        <div className="mt-4 text-xs text-slate-400">Secure checkout • Verified reviews</div>
      </div>
    </section>
  );
};
export default Action;
