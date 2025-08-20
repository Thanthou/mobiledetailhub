import { useSiteContext } from '../../hooks/useSiteContext';
import ContactMDH from './mdh/Contact';
import ContactAffiliate from './affiliate/Contact';

const Contact = () => {
  const { isMDH } = useSiteContext();
  return isMDH ? <ContactMDH /> : <ContactAffiliate />;
};

export default Contact;
