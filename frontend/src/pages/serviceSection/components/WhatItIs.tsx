import React from "react";

import { ProtectionComparisonChart } from "@/components/ProtectionComparisonChart";

import type { SectionProps } from "../types/service";
import { SECTION_IDS } from "../utils/sectionIds";

const WhatItIs: React.FC<SectionProps> = ({ id = SECTION_IDS.WHAT, className, serviceData }) => {
  return (
    <section id={id} className={`bg-stone-800 py-16 ${className ?? ""}`}>
      {serviceData?.whatItIs.chart ? (
        // Full-width layout for charts
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">What It Is</h2>
            <p className="text-slate-300 max-w-3xl mx-auto">
              {serviceData.whatItIs.description}
            </p>
            <div className="mt-6 flex justify-center">
              <div className="ml-16">
                <ul className="space-y-2 text-slate-300 text-left">
                  {serviceData.whatItIs.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <ProtectionComparisonChart 
              title={serviceData.whatItIs.chart.title}
            />
          </div>
        </div>
      ) : (
        // Original 2-column layout for images/videos
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div className={serviceData?.whatItIs.image && (serviceData.whatItIs.image.endsWith('.mp4') || serviceData.whatItIs.image.endsWith('.webm') || serviceData.whatItIs.image.endsWith('.mov'))
              ? 'flex flex-col justify-center' // Center content vertically when video is present
              : ''}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What It Is</h2>
            <p className="mt-3 text-slate-300">
              {serviceData?.whatItIs.description || "Explain what the service is. Placeholder text."}
            </p>
            <ul className="mt-6 space-y-2 text-slate-300">
              {serviceData?.whatItIs.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              )) || (
                <>
                  <li>• Placeholder benefit</li>
                  <li>• Placeholder benefit</li>
                  <li>• Placeholder benefit</li>
                </>
              )}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            {serviceData?.whatItIs.image ? (
              <div className={`rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden ${
                serviceData.whatItIs.image.endsWith('.mp4') || serviceData.whatItIs.image.endsWith('.webm') || serviceData.whatItIs.image.endsWith('.mov')
                  ? 'w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto' // 2:3 aspect ratio for videos (portrait/shorts) - 20% reduction from previous size
                  : 'w-full max-w-lg mx-auto' // Let image determine height naturally
              }`}>
                {serviceData.whatItIs.image.endsWith('.mp4') || serviceData.whatItIs.image.endsWith('.webm') || serviceData.whatItIs.image.endsWith('.mov') ? (
                  <video 
                    src={serviceData.whatItIs.image} 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    onEnded={(e) => { e.currentTarget.pause(); }}
                    onLoadedData={(e) => e.currentTarget.volume = 0.2}
                    style={{ aspectRatio: '2/3' }}
                  >
                    <track
                      kind="captions"
                      srcLang="en"
                      label="English captions"
                      src=""
                      default
                    />
                  </video>
                ) : (
                  <img 
                    src={serviceData.whatItIs.image} 
                    alt="Service illustration"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 h-56 sm:h-64 lg:h-80 flex items-center justify-center text-white/50">
                Image/Video placeholder
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default WhatItIs;
