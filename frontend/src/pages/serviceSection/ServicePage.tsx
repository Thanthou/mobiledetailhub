import React, { useState } from "react";

import { BookingModal,LazyQuoteModal, prefetchQuoteModal } from "../../components/Book_Quote";
import Header from "../home/components/01_header";
import { Action,Hero, Information, Process, Results, WhatItIs } from ".";
import { useServiceData } from "./hooks/useServiceData";

const ServicePage: React.FC = () => {
  const serviceData = useServiceData();
  
  // Modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Modal handlers
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };
  
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Prefetch handler for better performance
  const handleQuoteModalPrefetch = (): void => {
    void prefetchQuoteModal();
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

  return (
    <main className="bg-stone-900 text-white">
      <Header />
      <Hero 
        onBook={handleOpenBookingModal} 
        onQuote={handleOpenQuoteModal} 
        onQuoteHover={handleQuoteModalPrefetch}
        bookLabel={serviceData.action.bookLabel} 
        quoteLabel={serviceData.action.quoteLabel}
        serviceData={serviceData}
      />
      <WhatItIs serviceData={serviceData} />
      <Process serviceData={serviceData} />
      <Results serviceData={serviceData} />
      <Information serviceData={serviceData} />
      <Action 
        onBook={handleOpenBookingModal} 
        onQuote={handleOpenQuoteModal} 
        bookLabel={serviceData.action.bookLabel} 
        quoteLabel={serviceData.action.quoteLabel}
        serviceData={serviceData}
      />
      
      {/* Modals */}
      <LazyQuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={handleCloseQuoteModal} 
      />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={handleCloseBookingModal} 
      />
    </main>
  );
};
export default ServicePage;