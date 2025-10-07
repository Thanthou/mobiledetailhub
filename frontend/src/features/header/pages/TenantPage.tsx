import React, { useState } from 'react';
import { DataProvider } from '../contexts/DataProvider';
import Header from '../components/Header';
import HomePage from '@/app/pages/HomePage';
import { LazyRequestQuoteModal } from '@/features/quotes';

const TenantPage: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => setIsQuoteModalOpen(true);
  const handleCloseQuoteModal = () => setIsQuoteModalOpen(false);

  return (
    <DataProvider>
      <div className="min-h-screen">
        <Header />
        <HomePage onRequestQuote={handleOpenQuoteModal} />
        
        {isQuoteModalOpen && (
          <LazyRequestQuoteModal 
            isOpen={isQuoteModalOpen} 
            onClose={handleCloseQuoteModal} 
          />
        )}
      </div>
    </DataProvider>
  );
};

export default TenantPage;
