/**
 * Error Test Button Component
 * Used to test error boundary functionality in development
 */

import React from 'react';

interface ErrorTestButtonProps {
  errorType?: 'render' | 'async' | 'promise';
}

export const ErrorTestButton: React.FC<ErrorTestButtonProps> = ({ 
  errorType = 'render' 
}) => {
  const triggerError = () => {
    switch (errorType) {
      case 'render':
        // This will trigger the ErrorBoundary
        throw new Error('Test render error - ErrorBoundary should catch this!');
      
      case 'async':
        // This will trigger unhandled promise rejection
        setTimeout(() => {
          throw new Error('Test async error - Error monitoring should catch this!');
        }, 100);
        break;
      
      case 'promise':
        // This will trigger unhandled promise rejection
        Promise.reject(new Error('Test promise rejection - Error monitoring should catch this!'));
        break;
      
      default:
        throw new Error('Unknown error type');
    }
  };

  return (
    <button
      onClick={triggerError}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      🧪 Test {errorType} Error
    </button>
  );
};
