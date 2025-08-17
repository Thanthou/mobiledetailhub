import React from 'react';

interface BrandsErrorStateProps {
  error: string;
}

const BrandsErrorState: React.FC<BrandsErrorStateProps> = ({ error }) => {
  return (
    <section className="bg-stone-800 py-10">
      <div className="w-full">
        <div className="text-center text-white">
          <p className="text-red-400 mb-2">Error loading brands</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    </section>
  );
};

export default BrandsErrorState;