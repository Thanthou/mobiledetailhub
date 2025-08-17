import React from 'react';

interface LoadingStateProps {
  isLoading: boolean;
  currentBusiness: string;
  currentConfig: any;
  onRetry: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  currentBusiness,
  currentConfig,
  onRetry
}) => {
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-xl">
          {isLoading ? 'Switching business...' : 'Loading business...'}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Current business: {currentBusiness || 'none'}
        </p>
        {currentConfig?.business?.name && (
          <p className="text-sm text-blue-400 mt-1">
            Loading: {currentConfig.business.name}
          </p>
        )}
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Reset if stuck
        </button>
      </div>
    </div>
  );
};

export default LoadingState;