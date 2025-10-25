import React, { useState } from 'react';

import HomePage from '@tenant-app/pages/HomePage';
// Page-level composition - intentionally imports from features
// eslint-disable-next-line no-restricted-imports -- Page composition needs quote modal
import { LazyRequestQuoteModal } from '@tenant-app/components/quotes';
import { ThemeProvider } from '@shared/contexts/ThemeProvider';
import { useData } from '@shared/hooks/useData';

import { DataProvider } from '../contexts/DataProvider';

/**
 * Theme Wrapper Component
 * Wraps content in ThemeProvider using industry from DataContext
 */
function ThemedContent({ children }: { children: React.ReactNode }) {
  const { industry } = useData();
  
  return (
    <ThemeProvider industry={industry}>
      {children}
    </ThemeProvider>
  );
}

const TenantPage: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => { setIsQuoteModalOpen(true); };
  const handleCloseQuoteModal = () => { setIsQuoteModalOpen(false); };

  // Render tenant page wrapped in DataProvider -> ThemeProvider -> Content
  return (
    <DataProvider>
      <ThemedContent>
        <div className="min-h-screen">
          <HomePage onRequestQuote={handleOpenQuoteModal} />
          
          {isQuoteModalOpen && (
            <LazyRequestQuoteModal 
              isOpen={isQuoteModalOpen} 
              onClose={handleCloseQuoteModal} 
            />
          )}
        </div>
      </ThemedContent>
    </DataProvider>
  );
};

export default TenantPage;
