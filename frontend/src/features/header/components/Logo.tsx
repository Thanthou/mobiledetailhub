import React from 'react';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';
import { useData } from '../contexts/DataProvider';

const Logo: React.FC = () => {
  const { siteData } = useIndustrySiteData();
  const { industry } = useData();
  
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center hover:opacity-80 transition-opacity"
      aria-label={`${industry} home`}
    >
      <img 
        src={siteData?.logo?.url || `/${industry}/icons/logo.webp`} 
        alt={siteData?.logo?.alt || `${industry} Logo`} 
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
