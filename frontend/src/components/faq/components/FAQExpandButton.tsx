import React from 'react';

interface FAQExpandButtonProps {
  onToggleExpanded: () => void;
}

const FAQExpandButton: React.FC<FAQExpandButtonProps> = ({ onToggleExpanded }) => {
  return (
    <div className="text-center flex justify-center items-center">
      <button
        onClick={onToggleExpanded}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-12 py-6 md:px-24 md:py-8 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg text-xl md:text-2xl"
        aria-label="View Frequently Asked Questions about mobile detailing services"
        style={{ minWidth: '340px' }}
      >
        <span className="font-bold">Frequently Asked Questions</span>
      </button>
    </div>
  );
};

export default FAQExpandButton;