/**
 * Preview Loading State
 * 
 * Displayed while preview data is being loaded/verified.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const PreviewLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto" />
        <h2 className="text-2xl font-semibold text-white">Loading Preview...</h2>
        <p className="text-gray-400">Setting up your demo site</p>
      </div>
    </div>
  );
};

