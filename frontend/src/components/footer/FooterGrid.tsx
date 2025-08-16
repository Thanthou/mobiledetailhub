import React from 'react';
import QuickLinksColumn from './columns/QuickLinksColumn';
import SocialMediaColumn from './columns/SocialMediaColumn';
import ConnectColumn from './columns/ConnectColumn';

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig, businessSlug }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12 max-w-5xl mx-auto">
      <QuickLinksColumn />
      <SocialMediaColumn socialMedia={parentConfig?.socialMedia} />
      <ConnectColumn />
    </div>
  );
};

export default FooterGrid;