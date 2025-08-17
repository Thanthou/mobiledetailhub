import { FAQItem } from '../../types';

export const AFFILIATE_FAQ_PAYMENTS = (_cfg: any): FAQItem[] => [
  {
    category: "Payments & Deposits",
    question: "What payment methods do you accept?",
    answer:
      "Major credit/debit cards and popular digital wallets are accepted; some jobs allow cash on completion. All online payments are processed via secure, PCI-compliant providers.",
  },
  {
    category: "Payments & Deposits",
    question: "Do you require a deposit?",
    answer:
      "A small deposit may be required to reserve premium services (paint correction, ceramic coating, PPF) or long blocks. Deposits apply toward your total and are shown before you confirm.",
  },
  {
    category: "Payments & Deposits",
    question: "What's your cancellation policy?",
    answer:
      "You can modify or cancel up to 24 hours in advance without penalty. Late changes may incur a fee due to reserved time and prep for your appointment.",
  },
];