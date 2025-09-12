import React from 'react';

interface NavLink {
  name: string;
  href: string;
  onClick?: () => void;
}

interface NavigationProps {
  navLinks?: NavLink[];
}

const Navigation: React.FC<NavigationProps> = ({ navLinks = [] }) => {
  return (
    <nav className="flex flex-col space-y-1">
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={link.onClick}
          className="block px-4 py-2 text-white hover:text-orange-400 hover:bg-stone-700 transition-colors duration-200"
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
