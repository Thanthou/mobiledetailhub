/**
 * Mobile Detailing Preview Page
 * 
 * Shows a preview of what a mobile detailing tenant site looks like
 * Uses existing tenant-app components with mobile-detailing data
 */

import React from 'react';

// Import tenant components (they already exist!)
import Header from '@/tenant-app/components/header/components/Header';
import Hero from '@/tenant-app/components/hero/components/Hero';
import ServicesGrid from '@/tenant-app/components/services/components/ServicesGrid';
import Reviews from '@/tenant-app/components/reviews/components/Reviews';
import FAQ from '@/tenant-app/components/faq/components/FAQ';
import Gallery from '@/tenant-app/components/gallery/components/Gallery';
import Footer from '@/tenant-app/components/footer/components/Footer';

export function MobileDetailingPreview() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner indicating this is a preview */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        📱 Preview Mode: Mobile Detailing Template • <a href="/" className="underline hover:text-blue-200">Back to Dashboard</a>
      </div>
      
      {/* Use actual tenant components */}
      <Header />
      <Hero />
      <ServicesGrid />
      <Reviews />
      <FAQ />
      <Gallery />
      <Footer />
    </div>
  );
}

