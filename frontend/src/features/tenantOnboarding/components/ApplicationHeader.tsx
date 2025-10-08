import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/ui';

const ApplicationHeader: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4 ml-[400px]">
          {/* Logo and Business Name */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button 
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-stone-700 px-3 py-2 rounded-lg"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-stone-600"></div>
            <img 
              src="/shared/icons/logo.svg" 
              alt="Go Snap Site Logo" 
              className="h-8 w-8 md:h-10 md:w-10"
              width={40}
              height={40}
              decoding="async"
              loading="eager"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Go Snap Site</h1>
              <p className="text-sm text-gray-400">Website Information</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ApplicationHeader;
