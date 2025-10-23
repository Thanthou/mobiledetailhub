import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GradientText } from '@shared/ui';

interface HeaderProps {
  onGetStarted?: () => void;
  activeSection?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export default function Header({ onGetStarted, activeSection, scrollContainerRef }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'top', label: 'Home' },
    { id: 'advantage', label: 'Features' },
    { id: 'preview', label: 'Preview' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  // Update indicator position when active section changes
  useEffect(() => {
    if (!navRef.current || !activeSection) return;

    const activeLink = navRef.current.querySelector(`[data-section="${activeSection}"]`);
    if (activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const scrollContainer = scrollContainerRef?.current;
    
    if (element && scrollContainer) {
      const containerTop = scrollContainer.offsetTop;
      const elementTop = element.offsetTop - containerTop;

      scrollContainer.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    } else if (element) {
      // Fallback to window scroll
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/icons/logo.png" 
              alt="That Smart Site Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <GradientText 
              variant="cyan-purple" 
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              That Smart Site
            </GradientText>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div ref={navRef} className="relative flex items-center space-x-8">
              {/* Animated indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
              
              {navItems.map((item) => (
                <button
                  key={item.id}
                  data-section={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-lg transition-colors relative py-1 ${
                    activeSection === item.id ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
            aria-expanded={open}
          >
            <span className="sr-only">Open main menu</span>
            {open ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

          {/* Mobile menu */}
          {open && (
            <div className="md:hidden border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-950">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOpen(false);
                      scrollToSection(item.id);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      activeSection === item.id
                        ? 'text-white bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setOpen(false);
                    onGetStarted?.();
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
    </header>
  );
}

