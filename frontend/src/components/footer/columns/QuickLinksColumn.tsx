import React from 'react';

const QuickLinksColumn: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Careers', href: '/careers' }
  ];

  return (
    <div className="text-center md:text-left md:justify-self-end">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Quick Links</h3>
      <div className="flex flex-col space-y-3">
        {quickLinks.map((link, index) => (
          <a 
            key={index}
            href={link.href} 
            className="text-lg hover:text-orange-400 transition-colors duration-200 inline-block"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksColumn;