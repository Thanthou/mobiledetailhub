import React from 'react';
import QuickLinksColumn from '../columns/QuickLinksColumn';
import SocialMediaColumn from '../columns/SocialMediaColumn';
import ConnectColumn from '../columns/ConnectColumn';

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12 ml-52">
      <QuickLinksColumn />
      <SocialMediaColumn
        socialMedia={{
          facebook: parentConfig?.facebook,
          instagram: parentConfig?.instagram,
          tiktok: parentConfig?.tiktok,
          youtube: parentConfig?.youtube,
        }}
      />
      <ConnectColumn />
    </div>
  );
};

export default FooterGrid;