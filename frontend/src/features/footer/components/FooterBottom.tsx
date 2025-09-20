import React from 'react';

interface FooterBottomProps {
  businessInfo: {
    name: string;
  };
  onRequestQuote?: () => void;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ businessInfo, onRequestQuote }) => {
  return (
    <div className="border-t border-stone-600 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="text-gray-300 text-base">
            © 2024 {businessInfo.name}. All rights reserved.
          </p>
        </div>
        <div className="text-center md:text-right">
          <button
            onClick={onRequestQuote}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
