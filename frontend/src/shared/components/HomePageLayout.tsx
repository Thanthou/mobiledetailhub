import React from 'react';

interface HomePageLayoutProps {
  children: React.ReactNode;
}

/**
 * Simple layout wrapper for home and location pages
 */
const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
      {children}
    </div>
  );
};

export default HomePageLayout;

