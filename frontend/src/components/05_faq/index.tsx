import { useSiteContext } from '../../hooks/useSiteContext';
import FAQMDH from './mdh/FAQ';
import FAQAffiliate from './affiliate/FAQ';

const FAQ = () => {
  const { isMDH } = useSiteContext();
  return isMDH ? <FAQMDH /> : <FAQAffiliate />;
};

export default FAQ;