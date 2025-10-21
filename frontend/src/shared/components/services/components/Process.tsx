import React from 'react';

import type { ProcessStep as ProcessStepType, ServiceData } from '@shared/components/services/types/service-data';

interface ProcessProps {
  serviceData: ServiceData;
}

const ProcessStep = ({ 
  step, 
  isReversed = false 
}: { 
  step: ProcessStepType; 
  isReversed?: boolean;
}) => (
  <div className={`grid gap-8 lg:grid-cols-2 items-start ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
    {/* Text Content */}
    <div className={`${isReversed ? 'lg:col-start-2' : ''} space-y-4`}>
      <div className="flex items-center mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-xl font-bold mr-4 flex-shrink-0">
          {step.number}
        </div>
        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
      </div>
      {Array.isArray(step.bullets) ? (
        <ul className="text-slate-300 leading-relaxed space-y-2 pl-6">
          {step.bullets.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-orange-400 mr-3 text-lg flex-shrink-0" aria-hidden="true">•</span>
              <span className="text-slate-300 text-lg">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300 leading-relaxed pl-6">{step.description}</p>
      )}
    </div>
    
    {/* Image */}
    <div className={`${isReversed ? 'lg:col-start-1' : ''} flex justify-center lg:justify-start`}>
      <div className="aspect-[4/3] rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-md">
        {step.image?.src ? (
          <img 
            src={step.image.src} 
            alt={step.image.alt || step.title}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
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

const Process: React.FC<ProcessProps> = ({ serviceData }) => {
  const steps = serviceData.process?.steps || [];

  return (
    <section className="bg-stone-900 py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12">
          {serviceData.process?.title || "Process"}
        </h2>
        <div className="space-y-20">
          {steps.map((step: ProcessStepType, index: number) => (
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
