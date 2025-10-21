/**
 * Preview Page Component - Incremental Build
 * 
 * Building piece by piece to avoid render loops.
 * Start minimal, add components one at a time.
 */

import { useEffect } from 'react';
import { usePreviewData } from '../contexts/PreviewDataProvider';
import { useFavicon, useScrollSpy } from '@shared/hooks';
import { setPageTitle } from '@shared/utils';

// Import tenant components one by one
import Header from '../components/header/components/Header';
import Hero from '../components/hero/components/Hero';
import ServicesGrid from '../components/services/components/ServicesGrid';
import Reviews from '../components/reviews/components/Reviews';
import FAQ from '../components/faq/components/FAQ';
import Gallery from '../components/gallery/components/Gallery';
// Note: Footer is included inside Gallery component, no need to import separately

/**
 * Preview Page - Incremental Component Build
 * 
 * Clean architecture using simple hooks and utilities.
 */
export function PreviewPage() {
  const { isLoading, previewConfig, industry } = usePreviewData();
  
  // Set industry-specific favicon (one line!)
  useFavicon(industry);
  
  // Track which section is currently visible for header navigation
  // Include both mobile and desktop section IDs for responsive layouts
  useScrollSpy({
    ids: ['top', 'services', 'services-desktop', 'reviews', 'faq', 'gallery', 'gallery-desktop', 'footer'],
    headerPx: 88, // Header height
    threshold: 0.55,
    updateHash: false, // Don't update URL hash in preview mode
  });
  
  // Set page title
  useEffect(() => {
    if (industry) {
      const displayName = industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setPageTitle(`${displayName} Preview | That Smart Site`);
    } else {
      setPageTitle('Preview | That Smart Site');
    }
    
    // Stop favicon spinner
    const stopSpinner = () => {
      if (document.readyState === 'complete') {
        window.dispatchEvent(new Event('load'));
      }
    };
    stopSpinner();
    const timeoutId = setTimeout(stopSpinner, 100);
    return () => clearTimeout(timeoutId);
  }, [industry]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (!previewConfig) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Preview Not Available</h1>
          <p className="text-white/70 mb-6">
            Unable to load preview data for this industry.
          </p>
          <a 
            href="http://localhost:5175" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Main Site
          </a>
        </div>
      </div>
    );
  }
  
  // Render preview page - components added incrementally
  return (
    <>
      <Header />
      <main className="snap-container overflow-y-scroll h-screen snap-y snap-mandatory">
        <Hero />
        <ServicesGrid />
        <Reviews />
        <FAQ />
        <Gallery />
        {/* Note: Footer is included inside Gallery component */}
      </main>
    </>
  );
}

export default PreviewPage;

