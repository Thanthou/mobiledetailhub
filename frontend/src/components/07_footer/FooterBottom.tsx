import React from 'react';

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
          <p className="text-gray-300 text-base">
            Powered by -{' '}
            <a 
              href="https://mobiledetailhub.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              Mobile Detail Hub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;