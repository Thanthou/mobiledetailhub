import React from 'react';

const FooterLoadingState: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-orange-400 mb-4">Loading Footer...</h3>
          <p className="text-gray-300">Please wait while we load the footer content.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLoadingState;
