import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        {error && (
          <p className="text-red-600 mb-4">{error.message}</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
