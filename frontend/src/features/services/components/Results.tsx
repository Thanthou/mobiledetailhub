import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { ServiceData } from '@/features/services/types/service.types';

interface ResultsProps {
  serviceData: ServiceData;
}

const Results: React.FC<ResultsProps> = ({ serviceData }) => {
  const before = serviceData.results?.images?.before?.src;
  const after = serviceData.results?.images?.after?.src;

  return (
    <section className="bg-stone-800 py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 text-center">
          Results
        </h2>
        
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Before/After Images or Video */}
          {serviceData.results?.video ? (
            <div className="text-center">
              <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto">
                <video 
                  src={serviceData.results.video.src}
                  controls
                  className="w-full h-full object-cover"
                  aria-label={serviceData.results.video.alt || "Results video"}
                  playsInline
                  style={{ aspectRatio: '2/3' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : before && after ? (
            <div className="w-full">
              <BeforeAfterSlider
                beforeImage={before}
                afterImage={after}
                beforeLabel="BEFORE"
                afterLabel="AFTER"
                className="w-full"
              />
            </div>
          ) : null}
          
          {/* Results List */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">What You'll Get</h3>
            <ul className="space-y-4 text-slate-300">
              {serviceData.results?.bullets?.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-400 mr-3 text-lg">•</span>
                  <span className="text-lg text-slate-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
