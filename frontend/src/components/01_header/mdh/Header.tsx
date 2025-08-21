import React from 'react';
import SocialMediaIcons from '../SocialMediaIcons';
import { NAV_LINKS } from '../constants';
import LoginButton from '../LoginButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useMDHConfig } from '../../../contexts/MDHConfigContext';
import UserMenu from '../UserMenu';
import { scrollToTop } from '../../../utils/scrollToTop';

const HeaderMDH: React.FC = () => {
  const { user } = useAuth();
  const { mdhConfig, isLoading, error } = useMDHConfig();

  if (isLoading) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            <div className="text-white text-center">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  if (error || !mdhConfig) {
    return (
      <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            {/* Fallback content when database is empty */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Mobile Detail Hub</h1>
            </div>
            
            {/* Fallback navigation */}
            <div className="flex items-center space-x-4 ml-auto">
              <nav className="flex space-x-4">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Login button - always show this */}
            <div className="ml-6">
              {user ? <UserMenu /> : <LoginButton />}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          {/* 1. Logo/Business Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={scrollToTop}
          >
            {mdhConfig.logo_url && (
              <img src={mdhConfig.logo_url} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">{mdhConfig.header_display}</h1>
          </div>

          {/* 2. Links/Social Media */}
          <div className="flex items-center space-x-4 ml-auto">
            <nav className="flex space-x-4">
              {NAV_LINKS.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-orange-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            {(mdhConfig.facebook || mdhConfig.instagram || mdhConfig.tiktok || mdhConfig.youtube) && (
              <SocialMediaIcons socialMedia={{
                facebook: mdhConfig.facebook,
                instagram: mdhConfig.instagram,
                tiktok: mdhConfig.tiktok,
                youtube: mdhConfig.youtube,
              }} />
            )}
          </div>

          {/* 3. Login/User */}
          <div className="ml-6">
            {user ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderMDH;
