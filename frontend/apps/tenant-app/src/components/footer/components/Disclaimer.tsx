import React from 'react';

interface DisclaimerProps {
  businessInfo: {
    name: string;
  };
}

const Disclaimer: React.FC<DisclaimerProps> = ({ businessInfo }) => {
  return (
    <div className="border-t border-stone-600 pt-4 md:pt-8">
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-sm md:text-base">
            © 2024 {businessInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
