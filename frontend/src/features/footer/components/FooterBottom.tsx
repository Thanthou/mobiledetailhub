import React from 'react';

import { config } from '@/../config/env';

interface FooterBottomProps {
  businessInfo: {
    name: string;
  };
}

const FooterBottom: React.FC<FooterBottomProps> = ({ businessInfo }) => {
  return (
    <div className="border-t border-stone-600 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="text-gray-300 text-base">
            © 2024 {businessInfo.name}. All rights reserved.
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-gray-300 text-base flex items-center justify-center md:justify-end">
            Powered by -
            <a 
              href={config.isDevelopment ? 'http://localhost:5173' : 'https://mobiledetailhub.com'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200 flex items-center gap-2 ml-1"
            >
              Mobile Detail Hub
              <img 
                src="/icons/favicon.webp" 
                alt="Mobile Detail Hub Logo" 
                className="h-16 w-16"
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
