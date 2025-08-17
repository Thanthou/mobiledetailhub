import React from 'react';

const BrandsEmptyState: React.FC = () => {
  return (
    <section className="bg-stone-800 py-10">
      <div className="w-full">
        <div className="text-center text-white">
          <p className="text-gray-400">Brands section not configured</p>
        </div>
      </div>
    </section>
  );
};

export default BrandsEmptyState;