import React from 'react';

interface BrandData {
  name: string;
  logo: string;
  url?: string;
  scale?: string;
  verticalPosition?: string;
  horizontalPosition?: string;
}

interface BrandItemProps {
  brand: BrandData;
}

const BrandItem: React.FC<BrandItemProps> = ({ brand }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if no URL
    if (!brand.url) {
      e.preventDefault();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback if image fails to load
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <a
      href={brand.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center"
      onClick={handleClick}
    >
      <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl overflow-hidden">
        <img 
          src={brand.logo} 
          alt={brand.name}
          className={`object-contain ${brand.scale || 'scale-75'} ${brand.verticalPosition || 'translate-y-0'} ${brand.horizontalPosition || 'translate-x-0'}`}
          onError={handleImageError}
        />
        {/* Fallback text if image fails */}
        <span className="hidden text-white text-lg font-bold text-center px-4">
          {brand.name}
        </span>
      </div>
    </a>
  );
};

export default BrandItem;