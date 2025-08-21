import React from 'react';

interface FAQErrorStateProps {
  error: string;
}

const FAQErrorState: React.FC<FAQErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center text-white">
      <p className="text-red-400 mb-2">Error loading FAQ</p>
      <p className="text-gray-400 text-sm">{error}</p>
    </div>
  );
};

export default FAQErrorState;