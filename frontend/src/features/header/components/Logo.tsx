import React from 'react';
import siteData from '@/data/mobile-detailing/site.json';

const Logo: React.FC = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center hover:opacity-80 transition-opacity"
      aria-label="Mobile Detail Hub home"
    >
      <img 
        src={siteData.logo.url} 
        alt={siteData.logo.alt} 
        className="h-10 w-10 md:h-12 md:w-12"
        width={48}
        height={48}
        decoding="async"
        loading="eager"
      />
    </button>
  );
};

export default Logo;
