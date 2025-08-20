import React, { useEffect, useState } from 'react';
import SocialMediaIcons from '../SocialMediaIcons';
import { NAV_LINKS } from '../constants';
import LoginButton from '../LoginButton';
import { useAuth } from '../../../contexts/AuthContext';
import UserMenu from '../UserMenu';

const HeaderMDH: React.FC = () => {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [headerDisplay, setHeaderDisplay] = useState<string | null>(null);
  const [socialMedia, setSocialMedia] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/mdh-config')
      .then(res => res.json())
      .then(data => {
        setLogoUrl(data.logo_url);
        setHeaderDisplay(data.header_display);
        setSocialMedia({
          facebook: data.facebook,
          instagram: data.instagram,
          tiktok: data.tiktok,
          youtube: data.youtube,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  let content;
  if (loading) {
    content = <div className="text-white text-center">Loading...</div>;
  } else if (!logoUrl && !headerDisplay) {
    content = <div className="text-white text-center">Header placeholder</div>;
  } else {
    content = (
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white">{headerDisplay}</h1>
        </div>
        <nav className="flex space-x-4 ml-8">
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
        {Object.values(socialMedia).some(Boolean) && (
          <SocialMediaIcons socialMedia={socialMedia} />
        )}
        {user ? <UserMenu /> : <LoginButton />}
      </div>
    );
  }

  return (
    <header className="fixed top-0 z-50 bg-black/20 backdrop-blur-sm w-full">
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          {/* 1. Logo/Business Name */}
          <div className="flex items-center space-x-3">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">{headerDisplay}</h1>
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
            {Object.values(socialMedia).some(Boolean) && (
              <SocialMediaIcons socialMedia={socialMedia} />
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
