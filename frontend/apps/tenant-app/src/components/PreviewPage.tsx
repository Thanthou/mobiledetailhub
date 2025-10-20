/**
 * Preview Page Component
 * 
 * Renders industry preview pages using actual tenant components with preview data
 * Shows what a tenant site looks like for each industry
 */

import React, { useState } from 'react';
import { usePreviewParams } from '../hooks/usePreviewParams';
import { PreviewDataProvider, usePreviewData } from '../contexts/PreviewDataContext';

// Import the actual tenant-app components
import Header from '../components/header/components/Header';
import Hero from '../components/hero/components/Hero';
import ServicesGrid from '../components/services/components/ServicesGrid';
import Reviews from '../components/reviews/components/Reviews';
import FAQ from '../components/faq/components/FAQ';
import Gallery from '../components/gallery/components/Gallery';
import Footer from '../components/footer/components/Footer';
import { LazyRequestQuoteModal } from '../components/quotes';


function PreviewContent() {
  const { isPreviewMode, isLoading, previewConfig } = usePreviewData();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const handleOpenQuoteModal = () => setIsQuoteModalOpen(true);
  const handleCloseQuoteModal = () => setIsQuoteModalOpen(false);
  
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
  
  if (!isPreviewMode || !previewConfig) {
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
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Use the actual tenant-app components */}
      <Header />
      <Hero onRequestQuote={handleOpenQuoteModal} />
      <ServicesGrid />
      <Reviews />
      <FAQ />
      <Gallery />
      <Footer />
      
      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen}
          onClose={handleCloseQuoteModal}
        />
      )}
    </div>
  );
}

export function PreviewPage() {
  const previewParams = usePreviewParams();
  
  // If no preview mode detected, show error
  if (!previewParams.mode) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Preview Not Found</h1>
          <p className="text-white/70 mb-6">
            This doesn't appear to be a valid preview URL.
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
  
  return (
    <PreviewDataProvider>
      <PreviewContent />
    </PreviewDataProvider>
  );
}

export default PreviewPage;

