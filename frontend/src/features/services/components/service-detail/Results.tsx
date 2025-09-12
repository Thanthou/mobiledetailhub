import React from "react";

import type { SectionProps } from "../../types/service";
import { SECTION_IDS } from "../../utils/sectionIds";
import BeforeAfterSlider from "./BeforeAfterSlider";

const Results: React.FC<SectionProps> = ({ id = SECTION_IDS.RESULTS, className, serviceData }) => {
  // Define container sizes based on service configuration
  const getContainerSize = (size?: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'w-60 sm:w-[16.8rem] lg:w-[19.2rem]';
      case 'large':
        return 'w-[30rem] sm:w-[33.6rem] lg:w-[38.4rem]';
      case 'medium':
      default:
        return 'w-80 sm:w-[22.4rem] lg:w-[25.6rem]';
    }
  };

  const containerSize = getContainerSize(serviceData.results.containerSize);

  return (
    <section id={id} className={`bg-stone-800 py-16 ${className || ""}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[3fr_2fr] items-center">
        {/* Image/Video - First column */}
        <div className="w-full">
          {serviceData.results.beforeImage && serviceData.results.afterImage ? (
            // Check if it's a video file
            serviceData.results.beforeImage.endsWith('.mp4') || serviceData.results.beforeImage.endsWith('.webm') || serviceData.results.beforeImage.endsWith('.mov') ? (
              <div className={`${containerSize} mx-auto rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden`}>
                <video 
                  src={serviceData.results.beforeImage} 
                  className="w-full h-full object-cover"
                  controls
                  loop
                  playsInline
                  onLoadedData={(e) => e.currentTarget.volume = 0.2}
                  style={{ aspectRatio: '2/3' }}
                >
                  <track kind="captions" src="" label="No captions available" />
                </video>
              </div>
            ) : (
              <div className={`${containerSize} mx-auto`}>
                <BeforeAfterSlider
                  beforeImage={serviceData.results.beforeImage}
                  afterImage={serviceData.results.afterImage}
                  beforeLabel="BEFORE"
                  afterLabel="AFTER"
                />
              </div>
            )
          ) : (
            <div className="w-full aspect-[3/2] rounded-2xl bg-stone-700 ring-1 ring-white/10 flex items-center justify-center text-white/70">
              Before/After images not available
            </div>
          )}
        </div>
        
        {/* Content - Second column */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Results</h2>
          <div className="mt-3 text-slate-300">
            <ul className="space-y-3">
              {serviceData.results.description.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1 text-lg">•</span>
                  <span className="text-lg leading-relaxed">{point}</span>
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
