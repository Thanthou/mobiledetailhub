/**
 * Preview CTA Button
 * 
 * Fixed position "Get This Site" button for preview mode.
 * Can be positioned in top-left or top-right.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import { useData } from '@/shared/hooks/useData';
import { useSectionStore } from '@/shared/state/sectionStore';

interface PreviewCTAButtonProps {
  position?: 'left' | 'right';
}

export const PreviewCTAButton: React.FC<PreviewCTAButtonProps> = ({ position = 'left' }) => {
  const navigate = useNavigate();
  const data = useData();
  const currentSection = useSectionStore((s) => s.current);

  const handleGetThisSite = () => {
    // Pass preview data to onboarding form
    void navigate('/tenant-onboarding', {
      state: {
        fromPreview: true,
        businessName: data.businessName,
        phone: data.phone,
        city: data.serviceAreas[0]?.city || '',
        state: data.serviceAreas[0]?.state || '',
        industry: data.industry,
      },
    });
  };

  // Only show button in specific sections: hero (top), gallery, and footer
  const shouldShowButton = currentSection === 'top' || 
                          currentSection === 'gallery' || 
                          currentSection === 'gallery-desktop' || 
                          currentSection === 'footer';

  // Debug: Log current section (remove this after testing)
  console.log('PreviewCTAButton - Current section:', currentSection, 'Should show:', shouldShowButton);

  // Don't render if not in an allowed section
  if (!shouldShowButton) {
    return null;
  }

  // Hide right button on mobile (show only on desktop)
  if (position === 'right') {
    return (
      <div className="hidden md:block fixed top-4 right-4 z-[10000]" style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={handleGetThisSite}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>Get This Site</span>
        </button>
      </div>
    );
  }

  // Left button: positioned below header on mobile, top-left on desktop
  return (
    <div className={`fixed left-4 z-[10000] ${position === 'left' ? 'top-[88px] md:top-4' : ''}`} style={{ pointerEvents: 'auto' }}>
      <button
        type="button"
        onClick={handleGetThisSite}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors shadow-lg"
      >
        <Sparkles className="h-4 w-4" />
        <span>Get This Site</span>
      </button>
    </div>
  );
};

