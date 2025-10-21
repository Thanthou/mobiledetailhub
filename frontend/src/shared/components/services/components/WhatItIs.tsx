import React from 'react';

import { ServiceData } from '@shared/components/services/types/service.types';

import { ProtectionComparisonChart } from './ProtectionComparisonChart';

interface WhatItIsProps {
  serviceData: ServiceData;
}

const WhatItIs: React.FC<WhatItIsProps> = ({ serviceData }) => {
  const hasChart = serviceData.whatItIs?.chart?.type === 'protection-comparison';
  const isPaintCorrection = serviceData.slug === 'paint-correction';
  const isCeramicCoating = serviceData.slug === 'ceramic-coating';
  
  return (
    <section className="bg-stone-800 py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Protection Comparison Chart - First */}
        {hasChart && serviceData.whatItIs?.chart && (
          <div className="mb-12">
            <ProtectionComparisonChart
              ratings={serviceData.whatItIs.chart.data}
              title={serviceData.whatItIs.chart.title}
              description={serviceData.whatItIs.chart.description}
            />
          </div>
        )}
        
        {/* Text Content - Second */}
        {isPaintCorrection ? (
          // Special two-column layout for paint correction
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What It Is</h2>
                <p className="text-slate-300 mb-6 text-lg">
                  {serviceData.whatItIs?.description || "Explain what the service is. Placeholder text."}
                </p>
              </div>
              
              <div>
                <ul className="space-y-2 text-slate-300">
                  {serviceData.whatItIs?.benefits?.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-3 text-lg" aria-hidden="true">•</span>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              {serviceData.whatItIs?.image?.src && (
                <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-lg mx-auto">
                  <img 
                    src={serviceData.whatItIs.image.src} 
                    alt={serviceData.whatItIs.image.alt || "Service illustration"}
                    width={500}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {serviceData.whatItIs?.video?.src && (
                <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto">
                  <video 
                    src={serviceData.whatItIs.video.src}
                    controls
                    className="w-full h-full object-cover"
                    aria-label={serviceData.whatItIs.video.alt || "Service video"}
                    playsInline
                    style={{ aspectRatio: '2/3' }}
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        ) : isCeramicCoating ? (
          // Two column layout for ceramic coating (after chart)
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">What It Is</h2>
              <p className="text-slate-300 mb-6">
                {serviceData.whatItIs?.description || "Explain what the service is. Placeholder text."}
              </p>
            </div>
            
            <div className="flex flex-col justify-center">
              <ul className="space-y-2 text-slate-300">
                {serviceData.whatItIs?.benefits?.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-400 mr-3 text-lg" aria-hidden="true">•</span>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Two column layout for other services
          <div className="grid gap-10 lg:grid-cols-2">
            <div className={`space-y-6 ${serviceData.whatItIs?.video?.src ? 'flex flex-col justify-center' : ''}`}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What It Is</h2>
                <p className="text-slate-300 mb-6 text-lg">
                  {serviceData.whatItIs?.description || "Explain what the service is. Placeholder text."}
                </p>
              </div>
              
              <div>
                <ul className="space-y-2 text-slate-300">
                  {serviceData.whatItIs?.benefits?.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-3 text-lg" aria-hidden="true">•</span>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              {serviceData.whatItIs?.image?.src && (
                <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-full max-w-lg mx-auto">
                  <img 
                    src={serviceData.whatItIs.image.src} 
                    alt={serviceData.whatItIs.image.alt || "Service illustration"}
                    width={500}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {serviceData.whatItIs?.video?.src && (
                <div className="rounded-2xl bg-stone-700 ring-1 ring-white/10 overflow-hidden w-80 sm:w-[22.4rem] lg:w-[25.6rem] mx-auto">
                  <video 
                    src={serviceData.whatItIs.video.src}
                    controls
                    className="w-full h-full object-cover"
                    aria-label={serviceData.whatItIs.video.alt || "Service video"}
                    playsInline
                    style={{ aspectRatio: '2/3' }}
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatItIs;
