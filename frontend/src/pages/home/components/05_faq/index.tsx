import FAQAffiliate from './affiliate/FAQ';
import { useFAQSelector } from './hooks/useFAQSelector';
import FAQMDH from './mdh/FAQ';

const FAQ = () => {
  const { isMDH } = useFAQSelector();
  return isMDH ? <FAQMDH /> : <FAQAffiliate />;
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;