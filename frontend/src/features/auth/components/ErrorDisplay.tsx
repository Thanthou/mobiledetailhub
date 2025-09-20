import React from 'react';

import { RateLimitInfo } from '../types';

interface ErrorDisplayProps {
  error: string;
  rateLimitInfo?: RateLimitInfo | null;
  countdown: number;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, rateLimitInfo, countdown }) => {
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!error) return null;

  return (
    <div
      className="mx-8 mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm"
      role="alert"
      aria-live="polite"
      id="login-error-message"
    >
      {error}
      {rateLimitInfo && countdown > 0 && (
        <div className="mt-2 text-center">
          <div className="text-lg font-mono font-bold text-orange-400">
            {formatCountdown(countdown)}
          </div>
          <div className="text-xs text-red-200">
            Try again in {countdown} seconds
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
