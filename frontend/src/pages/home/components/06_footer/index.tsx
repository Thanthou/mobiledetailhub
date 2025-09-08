// Footer component exports
export { default as FooterBottom } from './FooterBottom';
export { default as FooterErrorState } from './FooterErrorState';
export { default as FooterLoadingState } from './FooterLoadingState';
export { default as GetStartedSection } from './GetStartedSection';
export { default as FooterMDH } from './mdh/Footer';
export { default as FooterGrid } from './mdh/Grid';

// Column exports
export { default as ConnectColumn } from './columns/ConnectColumn';
export { default as QuickLinksColumn } from './columns/QuickLinksColumn';
export { default as SocialMediaColumn } from './columns/SocialMediaColumn';

// Icon exports
export { default as TikTokIcon } from './icons/TikTokIcon';

import PropTypes from 'prop-types';
import React from 'react';

import { useSiteContext } from '../../../../hooks/useSiteContext';
import FooterAffiliate from './affiliate/Footer';
import FooterMDH from './mdh/Footer';

interface FooterProps {
  onRequestQuote: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote, onBookNow, onQuoteHover }) => {
  const { isMDH } = useSiteContext();
  return isMDH ? <FooterMDH /> : <FooterAffiliate onRequestQuote={onRequestQuote} onBookNow={onBookNow} onQuoteHover={onQuoteHover} />;
};

Footer.propTypes = {
  onRequestQuote: PropTypes.func.isRequired,
  onBookNow: PropTypes.func,
  onQuoteHover: PropTypes.func,
};

export default Footer;