import React from 'react';

const FooterErrorState: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-white py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading footer</p>
          <p className="text-gray-400 text-sm">Please refresh the page</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterErrorState;