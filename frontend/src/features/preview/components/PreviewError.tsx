/**
 * Preview Error State
 * 
 * Displayed when preview link is invalid, expired, or fails to load.
 */

import React from 'react';
import { AlertCircle, Mail, Phone } from 'lucide-react';

interface PreviewErrorProps {
  error: string;
}

export const PreviewError: React.FC<PreviewErrorProps> = ({ error }) => {
  const isExpired = error.toLowerCase().includes('expired');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Preview Unavailable</h2>
        <p className="text-gray-300">{error}</p>
        
        {isExpired && (
          <div className="bg-orange-900/30 border border-orange-700 rounded-md p-4">
            <p className="text-orange-200 text-sm">
              Preview links expire after 7 days for security.
            </p>
          </div>
        )}
        
        <div className="pt-4 space-y-4">
          <p className="text-sm text-gray-400">
            Need a new preview link or have questions?
          </p>
          
          <div className="flex flex-col space-y-3">
            <a
              href="tel:+15551234567"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </a>
            
            <a
              href="mailto:sales@mobiledetailhub.com"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email Sales</span>
            </a>
          </div>
          
          <a 
            href="/"
            className="text-sm text-orange-400 hover:text-orange-300 block pt-2"
          >
            Visit our main site →
          </a>
        </div>
      </div>
    </div>
  );
};

