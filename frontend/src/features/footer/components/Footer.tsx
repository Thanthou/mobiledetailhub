import React from 'react';
import PropTypes from 'prop-types';

import { useSiteContext } from '@/shared/hooks';

import FooterAffiliate from './FooterAffiliate';
import FooterMDH from './FooterMDH';

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
