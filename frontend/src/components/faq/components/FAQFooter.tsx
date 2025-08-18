import React from 'react';

interface FAQFooterProps {
  onRequestQuote?: () => void;
}

const FAQFooter: React.FC<FAQFooterProps> = ({ onRequestQuote }) => {
  return (
    <div className="text-center py-8">
      {/* Footer content removed as per request */}
    </div>
  );
};

export default FAQFooter;