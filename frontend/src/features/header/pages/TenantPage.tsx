import React, { useState } from 'react';

import HomePage from '@main/pages/HomePage';
// Page-level composition - intentionally imports from features
// eslint-disable-next-line no-restricted-imports -- Page composition needs quote modal
import { LazyRequestQuoteModal } from '@/features/quotes';

import { DataProvider } from '../contexts/DataProvider';

const TenantPage: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => { setIsQuoteModalOpen(true); };
  const handleCloseQuoteModal = () => { setIsQuoteModalOpen(false); };

  return (
    <DataProvider>
      <div className="min-h-screen">
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
