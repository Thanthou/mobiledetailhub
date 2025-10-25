/**
 * Marketing Site (Tenant-0)
 * 
 * KISS: Literally the same as a tenant site, just with marketing content
 * Uses the EXACT SAME components as tenant sites
 * Data comes from @data/main/ instead of database
 * 
 * Pattern copied from: PreviewPage.tsx
 */

import { useEffect, useState, lazy, Suspense } from 'react';
import { usePreviewData } from '@shared/contexts/PreviewDataProvider';
import { useFavicon, useScrollSpy } from '@shared/hooks';
import { setPageTitle } from '@shared/utils';

// Lazy load quote modal
const LazyRequestQuoteModal = lazy(() => import('../components/quotes/components/LazyRequestQuoteModal'));

// Import tenant site components (now local to main app)
import Header from '../components/header/components/Header';
import Hero from '../components/hero/components/Hero';
import ServicesGrid from '../components/services/components/ServicesGrid';
import Reviews from '../components/reviews/components/Reviews';
import FAQ from '../components/faq/components/FAQ';
import Gallery from '../components/gallery/components/Gallery';
import Footer from '../components/footer/components/Footer';

export function MarketingSite() {
  const { isLoading, previewConfig, industry } = usePreviewData();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Set favicon
  useFavicon(industry);
  
  // Track which section is currently visible for header navigation
  useScrollSpy({
    ids: ['top', 'services', 'services-desktop', 'reviews', 'faq', 'gallery', 'gallery-desktop', 'footer'],
    headerPx: 88,
    threshold: 0.55,
    updateHash: false,
  });
  
  // Quote modal handlers
  const handleOpenQuoteModal = () => setIsQuoteModalOpen(true);
  const handleCloseQuoteModal = () => setIsQuoteModalOpen(false);
  
  // Set page title
  useEffect(() => {
    setPageTitle('That Smart Site - Professional Websites for Local Businesses');
  }, []);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <main className="snap-container overflow-y-scroll h-screen snap-y snap-mandatory scrollbar-hide">
        <Hero onRequestQuote={handleOpenQuoteModal} />
        <ServicesGrid />
        <Reviews />
        <FAQ />
        <Gallery onRequestQuote={handleOpenQuoteModal} />
        
        {/* Footer - standalone section */}
        <section 
          id="footer" 
          className="relative snap-start snap-always bg-stone-900 min-h-screen flex items-center"
        >
          <div className="w-full pt-[88px] py-12">
            <Footer onRequestQuote={handleOpenQuoteModal} />
          </div>
        </section>
      </main>
      
      {/* Quote Modal */}
      <Suspense fallback={null}>
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={handleCloseQuoteModal}
        />
      </Suspense>
    </>
  );
}

