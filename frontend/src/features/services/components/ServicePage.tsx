import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePrefetch } from "@/shared/hooks";
import { Header } from "@/features/header";
import { RequestQuoteModal } from "@/features/quotes";
import { useSiteContext } from "@/shared/hooks";

import { useServiceData } from "../hooks/useServiceData";
import { Action, Hero, Information, Process, Results, WhatItIs } from "./service-detail";

const ServicePage: React.FC = () => {
  const serviceData = useServiceData();
  const { isAffiliate, businessSlug } = useSiteContext();
  const { prefetchQuoteModal } = usePrefetch();
  const navigate = useNavigate();
  
  // Modal state - only needed for affiliate pages
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Modal handlers
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const handleBookNow = () => {
    // Navigate to booking page, preserving business slug for affiliate sites
    const bookingPath = businessSlug ? `/${businessSlug}/booking` : '/booking';
    navigate(bookingPath);
  };

  // Prefetch handler for better performance
  const handleQuoteModalPrefetch = (): void => {
    prefetchQuoteModal();
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
        onBook={isAffiliate ? handleBookNow : undefined} 
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
        onBook={isAffiliate ? handleBookNow : undefined} 
        onQuote={isAffiliate ? handleOpenQuoteModal : undefined} 
        bookLabel={isAffiliate ? serviceData.action.bookLabel : undefined} 
        quoteLabel={isAffiliate ? serviceData.action.quoteLabel : undefined}
        serviceData={serviceData}
      />
      
      {/* Modals - only render on affiliate pages */}
      {isAffiliate && (
        <RequestQuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={handleCloseQuoteModal} 
        />
      )}
    </main>
  );
};

export default ServicePage;
