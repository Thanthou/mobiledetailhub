/**
 * Preview Mock Data
 * 
 * Industry-specific mock data for preview pages
 * Used when showing demo sites to prospects
 */

export interface PreviewData {
  businessName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  industry: string;
  tagline: string;
  description: string;
  services: Array<{
    name: string;
    description: string;
    price?: string;
    duration?: string;
  }>;
  heroImage?: string;
  reviews: Array<{
    name: string;
    rating: number;
    text: string;
    date: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const INDUSTRY_PREVIEW_DATA: Record<string, PreviewData> = {
  'mobile-detailing': {
    businessName: 'Elite Auto Detailing',
    phone: '(555) 123-4567',
    email: 'info@eliteautodetailing.com',
    city: 'Austin',
    state: 'TX',
    industry: 'mobile-detailing',
    tagline: 'Professional Mobile Detailing at Your Doorstep',
    description: 'We bring professional auto detailing services directly to you. Our certified technicians use premium products and techniques to make your vehicle look showroom-ready.',
    services: [
      {
        name: 'Basic Wash & Wax',
        description: 'Exterior hand wash, tire shine, windows cleaned, and protective wax coating',
        price: '$89',
        duration: '1-2 hours',
      },
      {
        name: 'Interior Deep Clean',
        description: 'Vacuum, steam cleaning, leather conditioning, and odor elimination',
        price: '$129',
        duration: '2-3 hours',
      },
      {
        name: 'Full Detail Package',
        description: 'Complete interior and exterior detailing with paint correction',
        price: '$249',
        duration: '4-6 hours',
      },
      {
        name: 'Ceramic Coating',
        description: 'Professional-grade ceramic coating for long-lasting protection',
        price: '$799+',
        duration: 'Full day',
      },
    ],
    reviews: [
      {
        name: 'Michael Chen',
        rating: 5,
        text: 'Absolutely incredible service! My car looks better than the day I bought it. The team was professional, on-time, and the attention to detail was outstanding.',
        date: '2024-01-15',
      },
      {
        name: 'Sarah Johnson',
        rating: 5,
        text: 'Best detailing service in Austin! They came to my office and had my SUV looking brand new in just a few hours. Highly recommend the ceramic coating.',
        date: '2024-01-10',
      },
      {
        name: 'Robert Davis',
        rating: 5,
        text: 'Worth every penny. The convenience of mobile service plus the quality of work makes this a no-brainer. My Tesla has never looked better!',
        date: '2024-01-05',
      },
    ],
    faqs: [
      {
        question: 'How long does a full detail take?',
        answer: 'A complete detail typically takes 4-6 hours depending on the vehicle size and condition. We work efficiently while maintaining our high quality standards.',
      },
      {
        question: 'Do I need to provide water or electricity?',
        answer: 'No! We are completely self-contained with our own water tanks and power generators. We can detail your vehicle anywhere.',
      },
      {
        question: 'What areas do you service?',
        answer: 'We service the greater Austin metro area including Round Rock, Cedar Park, Pflugerville, and surrounding communities.',
      },
      {
        question: 'How often should I detail my car?',
        answer: 'We recommend a full detail every 3-6 months, with basic washes monthly to maintain that showroom appearance.',
      },
    ],
  },
  
  'maid-service': {
    businessName: 'Sparkle Clean Maids',
    phone: '(555) 234-5678',
    email: 'hello@sparklecleanmaids.com',
    city: 'Portland',
    state: 'OR',
    industry: 'maid-service',
    tagline: 'Your Home, Sparkling Clean',
    description: 'Professional residential and commercial cleaning services. We bring sparkle back to your space with eco-friendly products and meticulous attention to detail.',
    services: [
      {
        name: 'Standard House Cleaning',
        description: 'Dusting, vacuuming, mopping, bathroom & kitchen cleaning',
        price: '$129',
        duration: '2-3 hours',
      },
      {
        name: 'Deep Clean Service',
        description: 'Intensive cleaning including baseboards, inside cabinets, and appliances',
        price: '$249',
        duration: '4-5 hours',
      },
      {
        name: 'Move In/Out Cleaning',
        description: 'Complete top-to-bottom cleaning for moving transitions',
        price: '$299',
        duration: '5-6 hours',
      },
      {
        name: 'Recurring Weekly Service',
        description: 'Regular weekly cleaning to maintain a consistently clean home',
        price: '$99/week',
        duration: '2 hours',
      },
    ],
    reviews: [
      {
        name: 'Jennifer Martinez',
        rating: 5,
        text: 'The team is amazing! They are thorough, reliable, and use eco-friendly products which is important to me. My house has never been cleaner.',
        date: '2024-01-18',
      },
      {
        name: 'David Thompson',
        rating: 5,
        text: 'Sparkle Clean has been cleaning our home for over a year. Always on time, always professional, and the quality is consistently excellent.',
        date: '2024-01-12',
      },
      {
        name: 'Amanda Rodriguez',
        rating: 5,
        text: 'Best cleaning service in Portland! They did our move-out cleaning and the landlord was so impressed. Got our full deposit back!',
        date: '2024-01-08',
      },
    ],
    faqs: [
      {
        question: 'Are your cleaning products safe for pets and children?',
        answer: 'Yes! We use eco-friendly, non-toxic cleaning products that are safe for your entire family, including pets and children.',
      },
      {
        question: 'Do I need to be home during the cleaning?',
        answer: 'Not at all! Many of our clients provide us with a key or garage code. We are fully insured and bonded for your peace of mind.',
      },
      {
        question: 'What if I need to reschedule?',
        answer: 'We understand life happens! Just give us 24 hours notice and we will happily reschedule your appointment.',
      },
      {
        question: 'How do you price your services?',
        answer: 'Pricing depends on the size of your home, the type of cleaning, and frequency. Contact us for a free, no-obligation quote!',
      },
    ],
  },
  
  'lawncare': {
    businessName: 'Green Valley Lawn Care',
    phone: '(555) 345-6789',
    email: 'service@greenvalleylawn.com',
    city: 'Charlotte',
    state: 'NC',
    industry: 'lawncare',
    tagline: 'Your Lawn, Our Passion',
    description: 'Professional lawn care and landscaping services. From weekly mowing to complete landscape design, we keep your outdoor spaces looking their absolute best.',
    services: [
      {
        name: 'Weekly Lawn Mowing',
        description: 'Mowing, edging, trimming, and blowing off hard surfaces',
        price: '$45/week',
        duration: '30-45 min',
      },
      {
        name: 'Fertilization Program',
        description: 'Seasonal fertilization and weed control for a lush, green lawn',
        price: '$89/treatment',
        duration: 'Every 6 weeks',
      },
      {
        name: 'Landscape Design & Install',
        description: 'Custom landscape design with professional installation',
        price: 'Custom quote',
        duration: 'Varies',
      },
      {
        name: 'Seasonal Cleanup',
        description: 'Spring and fall cleanup including leaf removal and bed maintenance',
        price: '$199',
        duration: 'Half day',
      },
    ],
    reviews: [
      {
        name: 'Tom Anderson',
        rating: 5,
        text: 'Green Valley has been taking care of our lawn for 3 years. Always reliable, great communication, and our yard looks fantastic year-round.',
        date: '2024-01-20',
      },
      {
        name: 'Lisa Brown',
        rating: 5,
        text: 'They transformed our boring yard into a beautiful landscape! The design was exactly what we wanted and the installation was flawless.',
        date: '2024-01-14',
      },
      {
        name: 'Mark Wilson',
        rating: 5,
        text: 'Best lawn service in Charlotte. Fair pricing, excellent work, and they genuinely care about the quality of their service.',
        date: '2024-01-09',
      },
    ],
    faqs: [
      {
        question: 'How often should I mow my lawn?',
        answer: 'During growing season (spring/summer), we recommend weekly mowing. In fall, bi-weekly is usually sufficient.',
      },
      {
        question: 'Do you service commercial properties?',
        answer: 'Yes! We handle both residential and commercial properties of all sizes. Contact us for a commercial quote.',
      },
      {
        question: 'What happens if it rains on my scheduled day?',
        answer: 'We will reschedule to the next available day. We never mow wet grass as it can damage your lawn.',
      },
      {
        question: 'Are you licensed and insured?',
        answer: 'Absolutely. We are fully licensed, insured, and certified. Your property is in safe hands.',
      },
    ],
  },
  
  'pet-grooming': {
    businessName: 'Pampered Paws Grooming',
    phone: '(555) 456-7890',
    email: 'woof@pamperedpaws.com',
    city: 'Seattle',
    state: 'WA',
    industry: 'pet-grooming',
    tagline: 'Where Every Pet Gets the Royal Treatment',
    description: 'Professional pet grooming services for dogs and cats. Our certified groomers provide gentle, caring service to keep your furry friends looking and feeling their best.',
    services: [
      {
        name: 'Basic Bath & Brush',
        description: 'Bath, blow-dry, brushing, nail trim, and ear cleaning',
        price: '$45-75',
        duration: '1-2 hours',
      },
      {
        name: 'Full Grooming Package',
        description: 'Bath, haircut, styling, nail trim, ear cleaning, and teeth brushing',
        price: '$75-125',
        duration: '2-3 hours',
      },
      {
        name: 'De-Shedding Treatment',
        description: 'Special treatment to reduce shedding with conditioning bath',
        price: '$65-95',
        duration: '1.5-2 hours',
      },
      {
        name: 'Teeth Cleaning',
        description: 'Professional teeth cleaning for better dental health',
        price: '$35',
        duration: '30 min',
      },
    ],
    reviews: [
      {
        name: 'Emily Parker',
        rating: 5,
        text: 'My anxious rescue dog always comes home happy! The groomers are so patient and gentle. She actually gets excited when we pull into the parking lot now!',
        date: '2024-01-16',
      },
      {
        name: 'James Mitchell',
        rating: 5,
        text: 'Best grooming salon in Seattle! They did an amazing job on our Golden Retriever. He looked like a show dog when we picked him up!',
        date: '2024-01-11',
      },
      {
        name: 'Rachel Green',
        rating: 5,
        text: 'I have been bringing my two cats here for years. They handle them with such care and patience. Highly recommend for both dogs and cats!',
        date: '2024-01-06',
      },
    ],
    faqs: [
      {
        question: 'How often should I groom my dog?',
        answer: 'Most dogs benefit from grooming every 4-8 weeks depending on breed and coat type. We can recommend a schedule based on your pet.',
      },
      {
        question: 'Do you groom cats?',
        answer: 'Yes! We have experience grooming cats and provide a calm, gentle experience for our feline friends.',
      },
      {
        question: 'What if my pet has special needs or is anxious?',
        answer: 'We specialize in working with anxious and special needs pets. Let us know ahead of time and we will take extra care.',
      },
      {
        question: 'Do I need an appointment?',
        answer: 'Yes, we work by appointment only to ensure each pet gets our full attention. Book online or call us!',
      },
    ],
  },
  
  'barber': {
    businessName: 'Classic Cuts Barbershop',
    phone: '(555) 567-8901',
    email: 'bookings@classiccuts.com',
    city: 'Brooklyn',
    state: 'NY',
    industry: 'barber',
    tagline: 'Timeless Style, Modern Service',
    description: 'Traditional barbershop services with a modern twist. From classic cuts to contemporary styles, our master barbers deliver precision cuts and exceptional service.',
    services: [
      {
        name: 'Classic Haircut',
        description: 'Precision cut with hot towel service and styling',
        price: '$35',
        duration: '30 min',
      },
      {
        name: 'Haircut & Beard Trim',
        description: 'Complete haircut with beard shaping and styling',
        price: '$50',
        duration: '45 min',
      },
      {
        name: 'Traditional Straight Razor Shave',
        description: 'Hot lather shave with pre-shave oil and aftershave',
        price: '$45',
        duration: '30 min',
      },
      {
        name: 'Premium Package',
        description: 'Haircut, beard trim, straight razor neck shave, and facial',
        price: '$85',
        duration: '60 min',
      },
    ],
    reviews: [
      {
        name: 'Marcus Johnson',
        rating: 5,
        text: 'Been coming here for 2 years. Consistently great cuts, professional service, and the atmosphere is perfect. This is a real barbershop.',
        date: '2024-01-17',
      },
      {
        name: 'Alex Rodriguez',
        rating: 5,
        text: 'Best barbershop in Brooklyn! Tony is a master with the clippers and the straight razor shave is incredible. You will not be disappointed.',
        date: '2024-01-13',
      },
      {
        name: 'Chris Thompson',
        rating: 5,
        text: 'Old-school quality with modern convenience. Online booking is easy and the cuts are always on point. Worth the drive from Manhattan!',
        date: '2024-01-07',
      },
    ],
    faqs: [
      {
        question: 'Do you take walk-ins?',
        answer: 'Yes, we accept walk-ins when available, but we recommend booking online to guarantee your preferred time.',
      },
      {
        question: 'How often should I get a haircut?',
        answer: 'Most men benefit from a cut every 3-4 weeks to maintain their style. We can recommend a schedule based on your hair type.',
      },
      {
        question: 'Do you offer kids cuts?',
        answer: 'Absolutely! We love cutting kids hair. Children under 12 receive a $5 discount on haircut services.',
      },
      {
        question: 'What forms of payment do you accept?',
        answer: 'We accept cash, all major credit cards, and digital payments including Apple Pay and Venmo.',
      },
    ],
  },
};

/**
 * Get preview data for a specific industry
 */
export function getPreviewData(industry: string): PreviewData | null {
  return INDUSTRY_PREVIEW_DATA[industry] || null;
}

/**
 * Get all available preview industries
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_PREVIEW_DATA);
}

