import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DataProvider, Header } from '@tenant-app/components/header';
import { PreviewCTAButton, PreviewDataProvider, usePreviewParams } from '@admin-app/components/preview';
import { LazyRequestQuoteModal } from '@tenant-app/components/quotes';
import { Process, Results, ServiceCTA, ServiceHero, WhatItIs } from '@tenant-app/components/services';
import { useServicePage } from '@tenant-app/components/services/hooks/useServicePage';
import { usePreviewData } from '@tenant-app/contexts/PreviewDataProvider';

interface ServicePageProps {
  onRequestQuote?: () => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ onRequestQuote }) => {
  const { serviceData } = useServicePage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  // Check if we're in URL-based preview mode (new system)
  const { isPreviewMode } = usePreviewData();
  
  // If token is present, we're in old preview mode (admin preview)
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

  // URL-based preview mode (/{industry}-preview/services/:serviceType)
  if (isPreviewMode) {
    return (
      <main className="bg-stone-900 text-white">
        <Header />
        <ServiceHero serviceData={serviceData} onRequestQuote={handleOpenQuoteModal} />
        <WhatItIs serviceData={serviceData} />
        <Process serviceData={serviceData} />
        <Results serviceData={serviceData} />
        <ServiceCTA serviceData={serviceData} onRequestQuote={handleOpenQuoteModal} />
        
        {/* Quote Modal */}
        {isQuoteModalOpen && (
          <LazyRequestQuoteModal 
            isOpen={isQuoteModalOpen} 
            onClose={handleCloseQuoteModal} 
          />
        )}
      </main>
    );
  }

  // Regular tenant mode
  return (
    <DataProvider>
      <main className="bg-stone-900 text-white">
        <Header />
        <ServiceHero serviceData={serviceData} {...(onRequestQuote && { onRequestQuote })} />
        <WhatItIs serviceData={serviceData} />
        <Process serviceData={serviceData} />
        <Results serviceData={serviceData} />
        <ServiceCTA serviceData={serviceData} {...(onRequestQuote && { onRequestQuote })} />
      </main>
    </DataProvider>
  );
};

export default ServicePage;
