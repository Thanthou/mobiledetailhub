import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ApplicationHeaderProps {}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = () => {
  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4 ml-[400px]">
          {/* Logo and Business Name */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <button className="text-gray-300 hover:text-white hover:bg-stone-700 px-3 py-2 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Back
              </button>
            </Link>
            <div className="h-6 w-px bg-stone-600"></div>
            <img src="/icons/logo.webp" alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Mobile Detail Hub</h1>
              <p className="text-sm text-gray-400">Affiliate Application</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ApplicationHeader;
