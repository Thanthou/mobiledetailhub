import React from 'react';
import { ChevronUp } from 'lucide-react';
import { getGeoParts } from '../utils/geoHelpers';

interface AffiliateHeaderProps {
  geoConfig: any;
  onToggleExpanded: () => void;
}

const AffiliateHeader: React.FC<AffiliateHeaderProps> = ({ 
  geoConfig, 
  onToggleExpanded 
}) => {
  const geo = getGeoParts(geoConfig || {});

  return (
    <header className="text-center">
      <h2
        id="faq-heading"
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
      >
        Frequently Asked Questions — Mobile Detailing in {geo.cityState}
      </h2>
      <p className="text-lg text-gray-300 mb-6">
        Professional detailing, ceramic coating, and PPF in {geo.nearbyList}.
      </p>
      <button
        onClick={onToggleExpanded}
        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
        aria-label="Hide FAQ section"
      >
        <ChevronUp className="h-5 w-5" />
        Hide FAQ
      </button>
    </header>
  );
};

export default AffiliateHeader;