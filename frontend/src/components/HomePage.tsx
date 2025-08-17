import React, { useState } from 'react';
import { useBusinessLogic } from '../hooks/useBusinessLogic';
import BusinessSelector from './BusinessSelector';
import HomePageSections from './homepage/HomePageSections';
import LoadingState from './homepage/LoadingState';
import QuoteModal from './QuoteModal';

const HomePage: React.FC = () => {
  // Business logic hook
  const { currentBusiness, currentConfig, isLoading, handleBusinessChange } = useBusinessLogic();
  
  // Modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Event handlers
  const handleBookNow = () => {
    console.log('Book now clicked');
  };

  const handleRetry = () => {
    if (currentBusiness) {
      handleBusinessChange(currentBusiness);
    }
  };

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  // Loading state
  if (!currentConfig || isLoading) {
    return <LoadingState 
      isLoading={isLoading}
      currentBusiness={currentBusiness}
      currentConfig={currentConfig}
      onRetry={handleRetry}
    />;
  }

  if (!currentConfig) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Error loading business configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Business Selector */}
      <BusinessSelector
  selectedBusiness={currentBusiness}
  onBusinessChange={handleBusinessChange}
/>
      
      {/* All Homepage Sections */}
      <HomePageSections
        currentBusiness={currentBusiness}
        currentConfig={currentConfig}
        onBookNow={handleBookNow}
        onRequestQuote={openQuoteModal}
      />

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
      />
    </div>
  );
};

export default HomePage;