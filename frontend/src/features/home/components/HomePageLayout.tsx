import React from 'react';

interface HomePageLayoutProps {
  children: React.ReactNode;
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <div>
      <div id="top"></div>
      {children}
    </div>
  );
};

export default HomePageLayout;
