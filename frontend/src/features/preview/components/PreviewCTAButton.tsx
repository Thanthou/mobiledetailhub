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

interface PreviewCTAButtonProps {
  position?: 'left' | 'right';
}

export const PreviewCTAButton: React.FC<PreviewCTAButtonProps> = ({ position = 'left' }) => {
  const navigate = useNavigate();
  const data = useData();

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

  const positionClasses = position === 'left' 
    ? 'left-4' 
    : 'right-4';

  return (
    <div className={`fixed top-4 ${positionClasses} z-[10000]`} style={{ pointerEvents: 'auto' }}>
      <button
        type="button"
        onClick={handleGetThisSite}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors shadow-lg"
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Get This Site</span>
      </button>
    </div>
  );
};

