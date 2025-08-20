import React from 'react';

const FooterLoadingState: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-white py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-stone-600 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-stone-700 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLoadingState;