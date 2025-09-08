import React from 'react';

import BrandItem from './BrandItem';

interface BrandData {
  name: string;
  logo: string;
  url?: string;
  scale?: string;
  verticalPosition?: string;
  horizontalPosition?: string;
}

interface BrandsGridProps {
  brandItems: BrandData[];
}

const BrandsGrid: React.FC<BrandsGridProps> = ({ brandItems }) => {
  return (
    <div className="flex justify-center items-center gap-4">
      {brandItems.map((brand, index) => (
        <BrandItem 
          key={index}
          brand={brand}
        />
      ))}
    </div>
  );
};

export default BrandsGrid;