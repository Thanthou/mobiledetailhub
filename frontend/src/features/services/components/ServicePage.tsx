import React, { useState } from "react";

import { BookingModal, prefetchQuoteModal } from "@/features/booking";
import { Header } from "@/features/header";
import { RequestQuoteModal } from "@/features/quotes";
import { useSiteContext } from "@/shared/hooks";

import { useServiceData } from "../hooks/useServiceData";
import { Action, Hero, Information, Process, Results, WhatItIs } from "./service-detail";

const ServicePage: React.FC = () => {
  const serviceData = useServiceData();
  const { isAffiliate } = useSiteContext();
  
  // Modal state - only needed for affiliate pages
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
        onBook={isAffiliate ? handleOpenBookingModal : undefined} 
        onQuote={isAffiliate ? handleOpenQuoteModal : undefined} 
        onQuoteHover={isAffiliate ? handleQuoteModalPrefetch : undefined}
        bookLabel={isAffiliate ? serviceData.action.bookLabel : undefined} 
        quoteLabel={isAffiliate ? serviceData.action.quoteLabel : undefined}
        serviceData={serviceData}
      />
      <WhatItIs serviceData={serviceData} />
      <Process serviceData={serviceData} />
      <Results serviceData={serviceData} />
      <Information serviceData={serviceData} />
      <Action 
        onBook={isAffiliate ? handleOpenBookingModal : undefined} 
        onQuote={isAffiliate ? handleOpenQuoteModal : undefined} 
        bookLabel={isAffiliate ? serviceData.action.bookLabel : undefined} 
        quoteLabel={isAffiliate ? serviceData.action.quoteLabel : undefined}
        serviceData={serviceData}
      />
      
      {/* Modals - only render on affiliate pages */}
      {isAffiliate && (
        <>
          <RequestQuoteModal 
            isOpen={isQuoteModalOpen} 
            onClose={handleCloseQuoteModal} 
          />
          <BookingModal 
            isOpen={isBookingModalOpen} 
            onClose={handleCloseBookingModal} 
          />
        </>
      )}
    </main>
  );
};

export default ServicePage;
