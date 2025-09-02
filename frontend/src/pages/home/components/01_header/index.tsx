import React from 'react';
import { useSiteContext } from '../../../../hooks/useSiteContext';
import HeaderMDH from './mdh/Header';
import HeaderAffiliate from './affiliate/Header';

const Header: React.FC = () => {
  const { isMDH } = useSiteContext();
  return isMDH ? <HeaderMDH /> : <HeaderAffiliate />;
};

export default Header;
