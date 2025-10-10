import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DataProvider, Header } from '@/features/header';
import { PreviewCTAButton, PreviewDataProvider, usePreviewParams } from '@/features/preview';
import { LazyRequestQuoteModal } from '@/features/quotes';
import { Process, Results, ServiceCTA, ServiceHero, WhatItIs } from '@/features/services';
import { useServicePage } from '@/features/services/hooks/useServicePage';

interface ServicePageProps {
  onRequestQuote?: () => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ onRequestQuote }) => {
  const { serviceData } = useServicePage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  // If token is present, we're in preview mode
  const { payload } = usePreviewParams();
  
  // Quote modal state for preview mode
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    if (onRequestQuote) {
      onRequestQuote();
    } else {
      setIsQuoteModalOpen(true);
    }
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };


  if (!serviceData) {
    return (
      <main className="bg-stone-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-slate-300">The requested service could not be found.</p>
        </div>
      </main>
    );
  }

  // Render with preview context if token is present
  if (token && payload) {
    return (
      <PreviewDataProvider payload={payload}>
        {/* Fixed "Get This Site" buttons in both corners */}
        <PreviewCTAButton position="left" />
        <PreviewCTAButton position="right" />
        
        <main className="bg-stone-900 text-white">
          <Header />
          <ServiceHero serviceData={serviceData} onRequestQuote={handleOpenQuoteModal} />
          <WhatItIs serviceData={serviceData} />
          <Process serviceData={serviceData} />
          <Results serviceData={serviceData} />
          <ServiceCTA serviceData={serviceData} onRequestQuote={handleOpenQuoteModal} />
        </main>
        
        {/* Quote Modal */}
        {isQuoteModalOpen && (
          <LazyRequestQuoteModal 
            isOpen={isQuoteModalOpen} 
            onClose={handleCloseQuoteModal} 
          />
        )}
      </PreviewDataProvider>
    );
  }

  // Regular tenant mode
  return (
    <DataProvider>
      <main className="bg-stone-900 text-white">
        <Header />
        <ServiceHero serviceData={serviceData} onRequestQuote={onRequestQuote} />
        <WhatItIs serviceData={serviceData} />
        <Process serviceData={serviceData} />
        <Results serviceData={serviceData} />
        <ServiceCTA serviceData={serviceData} onRequestQuote={onRequestQuote} />
      </main>
    </DataProvider>
  );
};

export default ServicePage;
