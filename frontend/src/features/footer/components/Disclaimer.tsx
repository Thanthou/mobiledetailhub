import React from 'react';
import { env } from '@/shared/env';

interface DisclaimerProps {
  businessInfo: {
    name: string;
  };
}

const Disclaimer: React.FC<DisclaimerProps> = ({ businessInfo }) => {
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
              href={env.DEV ? 'http://localhost:5173' : 'https://mobiledetailhub.com'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200 flex items-center gap-2 ml-1"
            >
              <img 
                src="/icons/favicon.webp" 
                alt="Mobile Detail Hub Logo" 
                className="h-6 w-6"
              />
              Mobile Detail Hub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
