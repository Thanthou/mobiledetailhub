import React from 'react';

interface LogoProps {
  businessName: string;
  isMDH: boolean;
}

const Logo: React.FC<LogoProps> = ({ businessName, isMDH }) => {
  return (
    <div className="flex items-center space-x-3">
      {isMDH && (
        <img 
          src="/favicon.webp" 
          alt="Mobile Detail Hub Logo" 
          className="h-8 w-8 md:h-10 md:w-10"
        />
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        {businessName}
      </h1>
    </div>
  );
};

export default Logo;