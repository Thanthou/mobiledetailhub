export interface ServiceData {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  whatItIs: {
    description: string;
    benefits: string[];
    image?: string;
    chart?: {
      type: 'protection-comparison';
      title?: string;
    };
  };
  process: {
    title: string;
    steps: Array<{
      number: number;
      title: string;
      description: string | string[];
      image?: string;
    }>;
  };
  results: {
    description: string[];
    beforeImage: string;
    afterImage: string;
  };
  information: {
    title: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  action: {
    title: string;
    description: string;
    bookLabel: string;
    quoteLabel: string;
  };
}
