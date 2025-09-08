import { ChevronUp } from 'lucide-react';
import React from 'react';

interface FAQHeaderProps {
  servicesLine: string;
  nearbyList: string;
  onToggleExpanded: () => void;
}

const FAQHeader: React.FC<FAQHeaderProps> = ({ 
  servicesLine, 
  nearbyList, 
  onToggleExpanded 
}) => {
  return (
    <header className="text-center">
      <h2
        id="faq-heading"
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
      >
        Frequently Asked Questions About Mobile Detailing
      </h2>
      <p className="text-lg text-gray-300 mb-6">
        Professional {servicesLine.toLowerCase()}
        {nearbyList ? <> in {nearbyList}</> : null}.
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

export default FAQHeader;