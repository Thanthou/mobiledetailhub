import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@shared/ui';

const ApplicationHeader: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 bg-gray-950/95 backdrop-blur-sm w-full border-b border-gray-800 relative">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Business Name */}
          <div className="flex items-center space-x-3">
            <img 
              src="/icons/logo.webp" 
              alt="That Smart Site Logo" 
              className="h-14 w-14 object-contain"
              width={56}
              height={56}
              decoding="async"
              loading="eager"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">That Smart Site</h1>
            </div>
          </div>

          {/* Back Button */}
          <Link to="/">
            <Button 
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ApplicationHeader;
