import React from 'react';

const BrandsLoadingState: React.FC = () => {
  return (
    <section className="bg-stone-800 py-10">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="h-8 bg-stone-600 rounded w-64 mx-auto mb-2 animate-pulse"></div>
        </div>
        <div className="flex justify-center items-center gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div 
              key={index}
              className="w-40 h-40 bg-stone-600 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsLoadingState;