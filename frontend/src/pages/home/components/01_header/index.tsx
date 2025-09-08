import React from 'react';

import { useSiteContext } from '../../../../hooks/useSiteContext';
import HeaderAffiliate from './affiliate/Header';
import HeaderMDH from './mdh/Header';

const Header: React.FC = () => {
  const { isMDH } = useSiteContext();
  return isMDH ? <HeaderMDH /> : <HeaderAffiliate />;
};

export default Header;
