import React from 'react';

import { useSiteContext } from '@/shared/hooks';

import HeaderAffiliate from './HeaderAffiliate';
import HeaderMDH from './HeaderMDH';

const Header: React.FC = () => {
  const { isMDH } = useSiteContext();
  return isMDH ? <HeaderMDH /> : <HeaderAffiliate />;
};

export default Header;
