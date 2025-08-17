import React from 'react';

const FAQLoadingState: React.FC = () => {
  return (
    <div className="text-center text-white">
      <div className="animate-pulse">
        <div className="h-8 bg-stone-600 rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-stone-700 rounded w-48 mx-auto"></div>
      </div>
    </div>
  );
};

export default FAQLoadingState;