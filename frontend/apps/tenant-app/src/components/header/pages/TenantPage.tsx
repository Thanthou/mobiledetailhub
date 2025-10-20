import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import HomePage from '@/main-site/pages/HomePage';
// Page-level composition - intentionally imports from features
// eslint-disable-next-line no-restricted-imports -- Page composition needs quote modal
import { LazyRequestQuoteModal } from '@/tenant-app/components/quotes';
import { MobileDetailingPreview as IndustryPreviewPage } from '@/main-site/pages/MobileDetailingPreview';

import { DataProvider } from '../contexts/DataProvider';

const TenantPage: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Check for preview mode via query param
  const previewIndustry = searchParams.get('industry');

  const handleOpenQuoteModal = () => { setIsQuoteModalOpen(true); };
  const handleCloseQuoteModal = () => { setIsQuoteModalOpen(false); };

  // If preview mode, skip DataProvider and show preview
  if (previewIndustry) {
    return <IndustryPreviewPage industry={previewIndustry} />;
  }

  // Normal tenant page
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
