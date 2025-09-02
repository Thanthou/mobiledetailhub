// Footer component exports
export { default as FooterMDH } from './mdh/Footer';
export { default as FooterGrid } from './mdh/Grid';
export { default as GetStartedSection } from './GetStartedSection';
export { default as FooterBottom } from './FooterBottom';
export { default as FooterLoadingState } from './FooterLoadingState';
export { default as FooterErrorState } from './FooterErrorState';

// Column exports
export { default as QuickLinksColumn } from './columns/QuickLinksColumn';
export { default as SocialMediaColumn } from './columns/SocialMediaColumn';
export { default as ConnectColumn } from './columns/ConnectColumn';

// Icon exports
export { default as TikTokIcon } from './icons/TikTokIcon';

import { useSiteContext } from '../../../../hooks/useSiteContext';
import FooterMDH from './mdh/Footer';
import FooterAffiliate from './affiliate/Footer';

interface FooterProps {
  onRequestQuote: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onRequestQuote, onBookNow, onQuoteHover }) => {
  const { isMDH } = useSiteContext();
  return isMDH ? <FooterMDH /> : <FooterAffiliate onRequestQuote={onRequestQuote} onBookNow={onBookNow} onQuoteHover={onQuoteHover} />;
};

export default Footer;