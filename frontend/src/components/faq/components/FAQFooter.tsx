import React from 'react';

interface FAQFooterProps {
  onRequestQuote?: () => void;
}

const FAQFooter: React.FC<FAQFooterProps> = ({ onRequestQuote }) => {
  return (
    <div className="text-center py-8">
      <div className="space-y-4">
        <p className="text-gray-300">
          {onRequestQuote ? (
            <>
              or{" "}
              <button
                onClick={onRequestQuote}
                className="text-orange-400 hover:text-orange-300 underline font-medium"
              >
                request a quote online
              </button>{" "}
              to get started.
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default FAQFooter;