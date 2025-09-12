import React from "react";

import type { SectionProps } from "../../types/service";
import { SECTION_IDS } from "../../utils/sectionIds";
import { isServiceData } from "../../utils/typeGuards";

const ProcessStep = ({ 
  step, 
  isReversed = false 
}: { 
  step: { number: number; title: string; description: string | string[]; image?: string }; 
  isReversed?: boolean;
}) => (
  <div className={`grid gap-8 lg:grid-cols-2 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
    {/* Text Content */}
    <div className={isReversed ? 'lg:col-start-2' : ''}>
      <div className="flex items-center mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-xl font-bold mr-4">
          {step.number}
        </div>
        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
      </div>
      {Array.isArray(step.description) ? (
        <ul className="text-slate-300 leading-relaxed space-y-2 ml-13">
          {step.description.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-orange-400 mr-3 mt-1 text-lg">•</span>
              <span className="text-lg">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300 leading-relaxed text-lg ml-13">{step.description}</p>
      )}
    </div>
    
    {/* Image */}
    <div className={isReversed ? 'lg:col-start-1' : ''}>
      <div className="aspect-[4/3] rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden">
        {step.image ? (
          <img 
            src={step.image} 
            alt={step.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            Step {step.number} Image
          </div>
        )}
      </div>
    </div>
  </div>
);

const Process: React.FC<SectionProps> = ({ id = SECTION_IDS.PROCESS, className, serviceData }) => {
  // Type guard checks
  if (!isServiceData(serviceData)) {
    return null;
  }

  const steps = serviceData.process.steps;

  return (
    <section id={id} className={`bg-stone-900 py-16 ${className || ""}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12">
          {serviceData.process.title || "Process"}
        </h2>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <ProcessStep 
              key={step.number} 
              step={step} 
              isReversed={index % 2 === 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Process;
