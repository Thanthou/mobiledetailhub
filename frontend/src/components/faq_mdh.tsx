import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBusinessConfig } from "../hooks/useBusinessConfig";

// ===== Types =====
type FAQCategory =
  | "Services"
  | "Pricing & Quotes"
  | "Scheduling & Weather"
  | "Locations"
  | "Preparation"
  | "Payments & Deposits"
  | "Warranty & Guarantee"
  | "Aftercare & Maintenance"
  | "Fleet & Commercial"
  | "General";

type ServiceTag =
  | "Auto"
  | "Marine"
  | "RV"
  | "Motorcycle"
  | "Ceramic Coating"
  | "PPF"
  | "Headlight Restore"
  | "Odor Removal";

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  services?: ServiceTag[];
}

interface FAQItemWithIndex extends FAQItem {
  originalIndex: number;
}

interface FAQProps {
  autoExpand?: boolean;
  onRequestQuote?: () => void;
  /** Optional UX toggle — defaults to false for better engagement/SEO */
  autoCollapseOnScroll?: boolean;
}

interface FAQRef {
  expand: () => void;
}

// ===== Category: Services =====
const MDH_FAQ_SERVICES: FAQItem[] = [
  {
    category: "Services",
    question: "What services does Mobile Detail Hub offer?",
    answer:
      "Mobile Detail Hub connects you with vetted detailing partners for exterior and interior detailing, paint decontamination, machine polishing, ceramic coating, paint protection film (PPF), headlight restoration, odor removal, and RV/boat detailing. You can compare options and book online through one platform.",
  },
  {
    category: "Services",
    question: "How does mobile detailing through Mobile Detail Hub work?",
    answer:
      "You choose a service package and appointment time, and a verified detailing partner comes to your driveway or workplace. Our partners bring professional equipment and products, perform the service on-site, and confirm completion in the MDH system.",
  },
  {
    category: "Services",
    question: "Do I need water or power at my location?",
    answer:
      "Most MDH partners are fully mobile and can provide their own water and power. If a provider requires access, we'll show that note during booking so there are no surprises on service day.",
  },
  {
    category: "Services",
    question: "What's included in a standard full detail?",
    answer:
      "A typical full detail includes foam pre-wash, hand wash, iron/tar removal, clay bar decontamination, paint-safe drying, wheel and tire cleaning, interior vacuuming, crevice and surface cleaning, interior glass, and a protectant. You can add machine polishing, ceramic coating, or specialty services at checkout.",
  },
  {
    category: "Services",
    question: "Do you offer machine polishing and paint correction?",
    answer:
      "Yes. You can add single-stage or multi-stage machine polishing to remove oxidation and swirl marks and restore gloss. For the best long-term result, many clients pair polishing with ceramic coating.",
  },
  {
    category: "Services",
    question: "Can I book ceramic coating through Mobile Detail Hub?",
    answer:
      "Absolutely. MDH partners install professional-grade ceramic coatings that boost gloss, add chemical resistance, and make maintenance washes easier. Durability options typically range from 1–5+ years, depending on prep and product.",
  },
  {
    category: "Services",
    question: "Do you install Paint Protection Film (PPF)?",
    answer:
      "Yes. Many MDH partners install self-healing PPF on high-impact areas (bumper, hood, mirrors) or full panels. PPF protects against rock chips and road rash and can be combined with ceramic coating for easier maintenance.",
  },
  {
    category: "Services",
    question: "Do you service RVs, boats, and specialty vehicles?",
    answer:
      "Yes. We support RV and marine detailing including wash, oxidation removal, polishing, gelcoat protection, and coatings. Larger or specialty vehicles may require a custom quote to account for size and surfaces.",
  },
  {
    category: "Services",
    question: "Are products and methods safe for modern finishes and interiors?",
    answer:
      "MDH partners use professional, surface-safe methods: pH-appropriate washes, microfiber drying, proper decontamination, measured machine polishing, and interior-safe cleaners for leather, fabric, vinyl, and sensitive screens.",
  },
  {
    category: "Services",
    question: "Can I request eco-friendly or low-odor products?",
    answer:
      "Yes. Many partners offer eco-friendly soaps, reduced-VOC options, water-saving methods, and interior products with low fragrance. Add your preference in the booking notes and we'll match you appropriately.",
  },
  {
    category: "Services",
    question: "How long does a typical appointment take?",
    answer:
      "Standard details take about 2–4 hours; polishing and ceramic coating can take 4–8+ hours. PPF installs vary by coverage. Your booking confirms an estimated time window and we'll update you if scope changes.",
  },
  {
    category: "Services",
    question: "How do you vet detailing partners?",
    answer:
      "MDH verifies experience, portfolio quality, customer reviews, insurance (where applicable), and commitment to professional standards. We continually monitor feedback to keep only trusted providers on the platform.",
  },
  {
    category: "Services",
    question: "Do you offer fleet or commercial detailing?",
    answer:
      "Yes. MDH can coordinate multi-vehicle and recurring fleet services through a single point of contact, with consolidated scheduling and invoicing. Tell us your fleet size and service frequency when requesting a quote.",
  },
  {
    category: "Services",
    question: "Can I combine services in one visit?",
    answer:
      "Yes. During booking you can bundle interior/exterior detailing, machine polishing, ceramic coating, PPF on high-impact areas, headlight restoration, and odor removal. The system calculates time and cost before you confirm.",
  },
];

// ===== Category: Prcing =====
const MDH_FAQ_PRICING: FAQItem[] = [
    {
      category: "Pricing & Quotes",
      question: "How do I get a quote?",
      answer:
        "You can request a quote online by selecting your vehicle type, service package, and location. The system instantly shows estimated mobile detailing prices or connects you with a verified provider for a custom quote.",
    },
    {
      category: "Pricing & Quotes",
      question: "How much does mobile detailing cost?",
      answer:
        "Prices vary based on vehicle size, condition, and chosen services. Basic exterior or interior details start around $75–$150, full details typically range from $150–$300, and premium services like ceramic coating or paint protection film are priced separately.",
    },
    {
      category: "Pricing & Quotes",
      question: "Are ceramic coating and paint protection film priced differently?",
      answer:
        "Yes. Ceramic coating packages usually range from $500–$2,000 depending on the number of prep steps, coating durability, and warranty. Paint protection film (PPF) is priced by coverage area — from partial front-end packages to full-vehicle wraps.",
    },
    {
      category: "Pricing & Quotes",
      question: "Do you offer fleet or commercial discounts?",
      answer:
        "Yes. We provide competitive rates and volume discounts for fleets, dealerships, and commercial clients. Multi-vehicle packages can be customized to your needs with one invoice and centralized scheduling.",
    },
    {
      category: "Pricing & Quotes",
      question: "Are there any extra fees I should know about?",
      answer:
        "Some providers may charge extra for excessive dirt, pet hair, biohazard cleanup, or long-distance travel outside their service area. All potential fees are shown before you confirm your booking.",
    },
    {
      category: "Pricing & Quotes",
      question: "Do you offer package deals or bundled services?",
      answer:
        "Yes. You can bundle interior and exterior detailing, add headlight restoration, odor removal, or polishing, and save compared to booking each service separately. Seasonal promotions may also be available.",
    },
  ];
  
// ===== Category: Scheduling & Weather =====
const MDH_FAQ_SCHEDULING: FAQItem[] = [
    {
      category: "Scheduling & Weather",
      question: "How do I book a mobile detailing appointment?",
      answer:
        "You can book online 24/7 by selecting your vehicle type, location, and preferred service package. Choose an available time slot and confirm instantly — no phone call required.",
    },
    {
      category: "Scheduling & Weather",
      question: "How far in advance should I schedule my service?",
      answer:
        "For the best availability, book at least 3–5 days in advance. Same-day or next-day mobile car detailing may be available depending on your area and provider schedules.",
    },
    {
      category: "Scheduling & Weather",
      question: "What happens if it rains on my appointment day?",
      answer:
        "If inclement weather is expected, we’ll contact you to reschedule or move the service to a covered location. Some providers can work under mobile canopies in light rain, but heavy rain or storms may require rescheduling.",
    },
    {
      category: "Scheduling & Weather",
      question: "Do you work in extreme heat or cold?",
      answer:
        "Yes, but certain services like ceramic coating or paint correction may be postponed if temperatures fall outside optimal application ranges. We’ll work with you to find the best time for your vehicle’s needs.",
    },
    {
      category: "Scheduling & Weather",
      question: "Can I change or cancel my booking?",
      answer:
        "Yes. You can modify or cancel your appointment up to 24 hours in advance without penalty. Late changes or cancellations may incur a fee, depending on the provider’s policy.",
    },
    {
      category: "Scheduling & Weather",
      question: "Do you offer weekend or evening appointments?",
      answer:
        "Many of our detailing partners offer weekend and limited evening availability. Check the booking calendar for open slots in your area.",
    },
  ];

const MDH_FAQ_LOCATIONS: FAQItem[] = [
{
    category: "Locations",
    question: "Where does Mobile Detail Hub operate?",
    answer:
    "Mobile Detail Hub connects you with professional detailers in multiple cities and regions across the U.S. Enter your zip code on our booking page to see available mobile detailing near you.",
},
{
    category: "Locations",
    question: "Can you detail my car at my home or workplace?",
    answer:
    "Yes. Our providers can perform detailing at your driveway, garage, or office parking lot — anywhere with safe, legal access to your vehicle.",
},
{
    category: "Locations",
    question: "Do you charge travel fees?",
    answer:
    "Travel is typically included within a provider’s service radius. If you are outside that range, a small travel fee may apply, which will be shown during booking.",
},
{
    category: "Locations",
    question: "Do you service apartment complexes or gated communities?",
    answer:
    "Yes, as long as the property allows mobile detailing and grants our providers access. Please confirm with your property manager before booking.",
},
{
    category: "Locations",
    question: "Can you service vehicles in public parking lots?",
    answer:
    "In most cases, mobile detailing in public lots is not permitted unless prior authorization is obtained. We recommend a private or residential location for best results.",
},
{
    category: "Locations",
    question: "How can I check if you serve my area?",
    answer:
    "Simply enter your address or zip code during the online booking process. The system will instantly confirm availability and show estimated travel times.",
},
];
  
const MDH_FAQ_PREPARATION: FAQItem[] = [
    {
      category: "Preparation",
      question: "How should I prepare my vehicle before a mobile detailing appointment?",
      answer:
        "Remove personal items, valuables, and loose trash from the interior so the detailer can access all surfaces. If possible, park in a shaded area or garage to help maintain ideal working conditions.",
    },
    {
      category: "Preparation",
      question: "Do I need to wash my car before the appointment?",
      answer:
        "No. Our detailing partners handle all exterior cleaning and preparation as part of the service. However, removing heavy debris (like excessive mud) can help speed up the process.",
    },
    {
      category: "Preparation",
      question: "Should I clear space around my vehicle?",
      answer:
        "Yes. Please make sure there is enough room for the detailer to walk around the vehicle and open all doors fully. This helps ensure a thorough and efficient detail.",
    },
    {
      category: "Preparation",
      question: "Do I need to provide water or electricity?",
      answer:
        "Most Mobile Detail Hub partners are fully self-contained with their own water tanks and generators. If a specific service requires access to your utilities, we’ll notify you before the appointment.",
    },
    {
      category: "Preparation",
      question: "Can I leave my vehicle unattended during the service?",
      answer:
        "Yes, as long as the vehicle is unlocked or keys are accessible to the detailer at the scheduled time. Please arrange this in advance if you won’t be present.",
    },
    {
      category: "Preparation",
      question: "Will the detailer need access to my garage or workspace?",
      answer:
        "Only if the service requires a covered area or special conditions, such as ceramic coating or paint protection film installation. We’ll note this in your booking confirmation.",
    },
  ];
 
const MDH_FAQ_PAYMENTS: FAQItem[] = [
{
    category: "Payments & Deposits",
    question: "What payment methods do you accept?",
    answer:
    "Mobile Detail Hub providers accept major credit cards, debit cards, and in many cases, digital wallets like Apple Pay or Google Pay. Some may also accept cash upon completion.",
},
{
    category: "Payments & Deposits",
    question: "Is a deposit required to book an appointment?",
    answer:
    "Many services require a small deposit to secure your booking. This deposit is applied toward your total service cost and helps ensure appointment availability.",
},
{
    category: "Payments & Deposits",
    question: "Is my payment information secure?",
    answer:
    "Yes. All online payments through Mobile Detail Hub are processed via secure, PCI-compliant payment gateways. We do not store your sensitive card information.",
},
{
    category: "Payments & Deposits",
    question: "When is the remaining balance due?",
    answer:
    "Unless paid in full at booking, the remaining balance is typically due immediately upon service completion. Your provider will confirm the total before starting work.",
},
{
    category: "Payments & Deposits",
    question: "Can I get a refund if I cancel?",
    answer:
    "Refund eligibility depends on the provider’s cancellation policy, which is displayed before you confirm your booking. Many allow full refunds for cancellations made at least 24 hours in advance.",
},
{
    category: "Payments & Deposits",
    question: "Do you offer payment plans for larger services?",
    answer:
    "Some providers may offer split or installment payments for premium services like multi-stage paint correction, ceramic coating, or paint protection film. Ask during your quote request.",
},
];

const MDH_FAQ_WARRANTY: FAQItem[] = [
    {
      category: "Warranty & Guarantee",
      question: "Do you offer a satisfaction guarantee?",
      answer:
        "Yes. Mobile Detail Hub stands behind the work of our detailing partners. If you’re not satisfied with the quality of service, contact us within 24 hours so we can review and, if necessary, arrange a re-service.",
    },
    {
      category: "Warranty & Guarantee",
      question: "Are ceramic coatings covered by a warranty?",
      answer:
        "Many MDH providers offer written warranties on professional ceramic coatings, ranging from 1 to 5+ years depending on the product and maintenance requirements. Warranty details will be provided at installation.",
    },
    {
      category: "Warranty & Guarantee",
      question: "Does Paint Protection Film (PPF) come with a warranty?",
      answer:
        "Yes. PPF installations from our providers typically include manufacturer warranties covering yellowing, cracking, and delamination for 5–10 years, as well as workmanship coverage from the installer.",
    },
    {
      category: "Warranty & Guarantee",
      question: "What is not covered under warranty?",
      answer:
        "Warranties do not cover damage from neglect, improper maintenance, accidents, or environmental fallout. All warranty terms are explained before installation or service completion.",
    },
    {
      category: "Warranty & Guarantee",
      question: "How do I make a warranty claim?",
      answer:
        "To start a claim, contact Mobile Detail Hub with your service details and photos of the issue. We’ll connect you with the original provider or a qualified local partner to assess and resolve the concern.",
    },
  ];

const MDH_FAQ_AFTERCARE: FAQItem[] = [
{
    category: "Aftercare & Maintenance",
    question: "How should I maintain my vehicle after a detail?",
    answer:
    "We recommend regular maintenance washes using pH-neutral car shampoo, microfiber mitts, and drying towels to preserve your finish. Avoid automated car washes with brushes, as they can introduce scratches and swirl marks.",
},
{
    category: "Aftercare & Maintenance",
    question: "How do I care for a ceramic-coated vehicle?",
    answer:
    "Wash with a pH-balanced soap, avoid harsh chemicals, and dry thoroughly after each wash. Boost hydrophobic performance with a ceramic spray topper every 3–6 months. Many providers offer discounted maintenance plans.",
},
{
    category: "Aftercare & Maintenance",
    question: "How do I care for Paint Protection Film (PPF)?",
    answer:
    "Use gentle wash methods, avoid high-pressure nozzles directly at film edges, and apply a ceramic coating or sealant to extend the film’s life. PPF can be hand-waxed with non-abrasive products if desired.",
},
{
    category: "Aftercare & Maintenance",
    question: "When should I schedule my next detail?",
    answer:
    "We recommend a professional maintenance detail every 2–3 months, depending on driving habits and environment. Regular upkeep helps protect your investment and keeps your vehicle looking showroom-ready.",
},
{
    category: "Aftercare & Maintenance",
    question: "Do you offer maintenance plans?",
    answer:
    "Yes. Many MDH providers offer ongoing maintenance packages that include scheduled washes, light interior cleaning, and periodic protective treatments at discounted rates.",
},
];

const MDH_FAQ_FLEET: FAQItem[] = [
    {
      category: "Fleet & Commercial",
      question: "Do you offer fleet vehicle detailing services?",
      answer:
        "Yes. Mobile Detail Hub coordinates professional detailing for fleets of cars, trucks, vans, and specialty vehicles. We provide consistent service quality across all locations, with flexible scheduling to minimize downtime.",
    },
    {
      category: "Fleet & Commercial",
      question: "Can you service large commercial or municipal fleets?",
      answer:
        "Absolutely. We work with corporate, government, and municipal clients to maintain large fleets. Services can be performed on-site at your facility or at multiple locations as needed.",
    },
    {
      category: "Fleet & Commercial",
      question: "Do you offer recurring fleet maintenance plans?",
      answer:
        "Yes. We can set up weekly, bi-weekly, or monthly detailing schedules to keep your fleet vehicles clean, protected, and ready for use year-round. Plans can be tailored to your budget and usage patterns.",
    },
    {
      category: "Fleet & Commercial",
      question: "How does pricing work for fleet and commercial accounts?",
      answer:
        "Fleet pricing is based on the number of vehicles, service frequency, and specific detailing needs. We provide volume discounts for larger fleets and can create custom quotes for ongoing contracts.",
    },
    {
      category: "Fleet & Commercial",
      question: "Do you provide a single point of contact for fleet accounts?",
      answer:
        "Yes. Each fleet account is assigned a dedicated account manager who oversees scheduling, quality control, and invoicing, ensuring a streamlined experience for your business.",
    },
  ];

  const MDH_FAQ_GENERAL: FAQItem[] = [
    {
      category: "General",
      question: "What is Mobile Detail Hub?",
      answer:
        "Mobile Detail Hub is an online platform that connects customers with trusted, vetted mobile detailing professionals. We make it easy to compare services, read reviews, get transparent pricing, and book detailing right to your location.",
    },
    {
      category: "General",
      question: "How does Mobile Detail Hub work?",
      answer:
        "Simply select your location, choose a service package, and pick a time that works for you. We match you with a verified mobile detailer who arrives with professional equipment and products to service your vehicle on-site.",
    },
    {
      category: "General",
      question: "Why choose Mobile Detail Hub over booking directly?",
      answer:
        "We verify each detailing partner for quality, reliability, and professionalism. Our platform ensures transparent pricing, secure booking, and a consistent customer experience across all providers.",
    },
    {
      category: "General",
      question: "Is Mobile Detail Hub available nationwide?",
      answer:
        "We’re rapidly expanding. Enter your ZIP code on our homepage to see available detailers in your area. If we’re not there yet, you can request to be notified when services launch nearby.",
    },
    {
      category: "General",
      question: "Are Mobile Detail Hub services insured?",
      answer:
        "Yes. We require our detailing partners to carry appropriate insurance coverage for their services, giving you peace of mind when booking through our platform.",
    },
  ];
  
  
  


export const MDH_FAQ_ITEMS: FAQItem[] = [
...MDH_FAQ_SERVICES,
...MDH_FAQ_PRICING,
...MDH_FAQ_SCHEDULING,
...MDH_FAQ_LOCATIONS,
...MDH_FAQ_PREPARATION,
...MDH_FAQ_PAYMENTS,
...MDH_FAQ_WARRANTY,
...MDH_FAQ_AFTERCARE,
...MDH_FAQ_FLEET,
...MDH_FAQ_GENERAL,
];
  


// ===== Helpers (optional MDH dynamic additive based on config) =====
function buildServiceFAQs(cfg: any): FAQItem[] {
  if (!cfg) return [];
  const servicesAvail: string[] = cfg.services?.available ?? [];
  const vehicleTypes: string[] = cfg.services?.vehicleTypes ?? [];
  const primaryArea: string =
    cfg.business?.address ||
    (cfg.serviceLocations && cfg.serviceLocations[0]) ||
    "your area";
  const vehiclesList =
    vehicleTypes.length > 0
      ? vehicleTypes.join(", ")
      : "cars, trucks, SUVs, boats, motorcycles, and RVs";

  const out: FAQItem[] = [];

  if (servicesAvail.some((s) => s.toLowerCase() === "detail")) {
    out.push(
      {
        category: "Services",
        question: `What does a full mobile detail include in ${primaryArea}?`,
        answer:
          "Our standard mobile detail covers a hand wash, decontamination, paint-safe drying, wheels/tires, interior vacuum, crevice cleaning, interior glass, and wipe-down. Heavier stains, pet hair, or polishing can be added as upgrades.",
      },
      {
        category: "Services",
        question: `Do you detail ${vehiclesList.toLowerCase()}?`,
        answer: `Yes. We service ${vehiclesList}. If you have a unique setup, just mention it when you book so we arrive with the right tools.`,
      }
    );
  }

  if (servicesAvail.some((s) => s.toLowerCase().includes("ceramic"))) {
    out.push(
      {
        category: "Services",
        question: `Do you offer ceramic coating in ${primaryArea}?`,
        answer:
          "Yes. We install professional ceramic coatings for long-lasting gloss and easier washes. Packages vary by durability; we'll prep the paint properly before application.",
      },
      {
        category: "Services",
        question: "Is ceramic coating better than wax?",
        answer:
          "Coatings last far longer, resist chemicals better, and keep gloss high with simple maintenance. Wax is short-term protection.",
      }
    );
  }

  if (
    servicesAvail.some(
      (s) =>
        s.toLowerCase().includes("paint protection film") ||
        s.toLowerCase() === "ppf"
    )
  ) {
    out.push(
      {
        category: "Services",
        question: `Do you install Paint Protection Film (PPF) in ${primaryArea}?`,
        answer:
          "Yes. PPF protects against rock chips and road rash. It's a self-healing urethane film applied to high-impact areas or full panels.",
      },
      {
        category: "Services",
        question: "Can PPF be removed or replaced later?",
        answer:
          "Absolutely—quality films remove cleanly from OEM paint when installed correctly. Individual panels can be re-done as needed.",
      }
    );
  }

  if (vehicleTypes.map((v) => v.toLowerCase()).includes("marine")) {
    out.push({
      category: "Services",
      question: "Do you service boats and personal watercraft?",
      answer:
        "Yes. Gelcoat often needs stronger oxidation removal and UV protection. We handle wash, oxidation correction, polish, and protective coatings.",
    });
  }
  if (vehicleTypes.map((v) => v.toLowerCase()).includes("rv")) {
    out.push({
      category: "Services",
      question: "Do you detail RVs and travel trailers?",
      answer:
        "Yes. We offer wash, oxidation removal, polish, and long-term protection options tailored to RV surfaces and size.",
    });
  }

  return out;
}

// ===== Component =====
const FAQMDH = React.forwardRef<FAQRef, FAQProps>(
    ({ autoExpand = false, onRequestQuote, autoCollapseOnScroll = false }, ref) => {
      const { businessConfig, isLoading, error } = useBusinessConfig();
  
      // ---- state
      const [isExpanded, setIsExpanded] = useState(autoExpand);
      const [openItems, setOpenItems] = useState<number[]>([]);
      const [openCategories, setOpenCategories] = useState<string[]>([]);
  
      // ---- imperative handle (always call, even if ref is null)
      React.useImperativeHandle(ref, () => ({
        expand: () => setIsExpanded(true),
      }), []);
  
      // ---- data building (unconditional hooks; guard inside)
      const dynamicServiceItems = useMemo(() => {
        return buildServiceFAQs(businessConfig);
      }, [businessConfig]);
  
      const faqData: FAQItem[] = useMemo(() => {
        // If nothing yet, still return a stable array
        return [...MDH_FAQ_ITEMS, ...dynamicServiceItems];
      }, [dynamicServiceItems]);
  
      // ---- JSON-LD schema (unconditional effect; guard inside)
      useEffect(() => {
        if (!faqData.length || typeof window === "undefined") return;
  
        const url = `${window.location.origin}${window.location.pathname}`;
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": url + "#faq",
          mainEntity: faqData.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        };
  
        let script = document.querySelector(
          "script[data-faq-schema]"
        ) as HTMLScriptElement | null;
  
        if (!script) {
          script = document.createElement("script");
          script.type = "application/ld+json";
          script.setAttribute("data-faq-schema", "true");
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
      }, [faqData]);
  
      // ---- navigation auto-expand (always register; guard inside)
      useEffect(() => {
        if (typeof window === "undefined") return;
  
        const handleHashChange = () => {
          if (window.location.hash === "#faq") {
            setIsExpanded(true);
            setTimeout(() => setIsExpanded(true), 100);
          }
        };
  
        const handleFAQNavigation = () => setIsExpanded(true);
  
        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("faq-navigation", handleFAQNavigation);
        return () => {
          window.removeEventListener("hashchange", handleHashChange);
          window.removeEventListener("faq-navigation", handleFAQNavigation);
        };
      }, []);
  
      // ---- optional auto-collapse on scroll (always mount; no conditional hook)
      useEffect(() => {
        if (!autoCollapseOnScroll || typeof window === "undefined") return;
  
        const handleScroll = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const faqSection = document.getElementById("faq");
          if (!faqSection) return;
  
          const faqRect = faqSection.getBoundingClientRect();
          const faqTop = faqRect.top;
  
          if (scrollTop + windowHeight >= documentHeight - 50) {
            setIsExpanded(false);
            setOpenItems([]);
          } else if (faqTop > windowHeight * 0.95) {
            setIsExpanded(false);
            setOpenItems([]);
          }
        };
  
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [autoCollapseOnScroll]);

      // ---- auto-collapse when FAQ is scrolled out of view
      useEffect(() => {
        if (typeof window === "undefined" || !isExpanded) return;

        const handleScroll = () => {
          const faqSection = document.getElementById("faq");
          if (!faqSection) return;

          const faqRect = faqSection.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const documentHeight = document.documentElement.scrollHeight;

          // Collapse if FAQ is scrolled above viewport (with 100px threshold)
          if (faqRect.bottom < -100) {
            setIsExpanded(false);
            setOpenItems([]);
            setOpenCategories([]);
          }
          // Collapse if FAQ is scrolled below viewport (with 100px threshold)
          else if (faqRect.top > windowHeight + 100) {
            setIsExpanded(false);
            setOpenItems([]);
            setOpenCategories([]);
          }
          // Collapse if user is near the bottom of the page (within 200px)
          else if (scrollTop + windowHeight >= documentHeight - 200) {
            setIsExpanded(false);
            setOpenItems([]);
            setOpenCategories([]);
          }
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener("scroll", throttledScroll);
        return () => window.removeEventListener("scroll", throttledScroll);
      }, [isExpanded]);
  
      // ---- UI helpers (plain functions)
      const toggleExpanded = () => setIsExpanded((v) => !v);
      const toggleItem = (index: number) =>
        setOpenItems((prev) =>
          prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
      const toggleCategory = (category: string) => {
        setOpenCategories((prev) =>
          prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]
        );
      };
  
      // ---- dynamic headings (compute safely even when config empty)
      const locations: string[] = businessConfig?.serviceLocations ?? [];
      const nearbyList = locations.slice(0, 7).join(", ");
      const offeredServices: string[] = businessConfig?.services?.available ?? [];
      const servicesLine =
        offeredServices.length > 0
          ? offeredServices.join(", ")
          : "auto detailing, boat & RV detailing, ceramic coating, and PPF";
  
      // ---- grouping (unconditional hook)
      const groupedFAQs = useMemo(() => {
        return faqData.reduce((acc, item, index) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push({ ...item, originalIndex: index });
          return acc;
        }, {} as Record<string, FAQItemWithIndex[]>);
      }, [faqData]);
  
      const categories = useMemo(() => Object.keys(groupedFAQs), [groupedFAQs]);
  
      // ---- render (no early returns; branch in JSX)
      return (
        <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading || !businessConfig ? (
              <div className="text-center text-white">Loading FAQ...</div>
            ) : error ? (
              <div className="text-center text-white">Error loading FAQ: {error}</div>
            ) : !isExpanded ? (
              <div className="text-center flex justify-center items-center">
                <button
                  onClick={toggleExpanded}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-12 py-6 md:px-16 md:py-8 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                  aria-label="View Frequently Asked Questions about mobile detailing services"
                >
                  <span className="text-2xl md:text-3xl font-bold">FAQ</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <header className="text-center">
                  <h2
                    id="faq-heading"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
                  >
                    Frequently Asked Questions About Mobile Detailing
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Professional {servicesLine.toLowerCase()}
                    {nearbyList ? <> in {nearbyList}</> : null}.
                  </p>
                  <button
                    onClick={toggleExpanded}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
                    aria-label="Hide FAQ section"
                  >
                    <ChevronUp className="h-5 w-5" />
                    Hide FAQ
                  </button>
                </header>
  
                <div className="space-y-8" role="region" aria-labelledby="faq-heading">
                  {categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <div className="text-center">
                        <button
                          className="w-full flex items-center justify-center gap-2 text-2xl font-bold text-orange-500 mb-6 focus:outline-none"
                          onClick={() => toggleCategory(category)}
                          aria-expanded={openCategories.includes(category)}
                          aria-controls={`faq-category-${category}`}
                        >
                          {category}
                          {openCategories.includes(category) ? (
                            <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {openCategories.includes(category) && (
                        <div className="space-y-4" id={`faq-category-${category}`}>
                          {groupedFAQs[category].map((item) => (
                            <article
                              key={item.originalIndex}
                              className="bg-stone-700 rounded-lg shadow-sm border border-stone-600 overflow-hidden"
                              itemScope
                              itemProp="mainEntity"
                              itemType="https://schema.org/Question"
                            >
                              <button
                                onClick={() => toggleItem(item.originalIndex)}
                                className="w-full text-left p-6 flex justify-between items-center hover:bg-stone-600 transition-colors"
                                aria-expanded={openItems.includes(item.originalIndex)}
                                aria-controls={`faq-answer-${item.originalIndex}`}
                              >
                                <h4 className="text-lg font-semibold text-white pr-4" itemProp="name">
                                  {item.question}
                                </h4>
                                {openItems.includes(item.originalIndex) ? (
                                  <ChevronUp className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-orange-400 flex-shrink-0" aria-hidden="true" />
                                )}
                              </button>
  
                              {openItems.includes(item.originalIndex) && (
                                <div
                                  id={`faq-answer-${item.originalIndex}`}
                                  className="px-6 pb-6"
                                  itemScope
                                  itemProp="acceptedAnswer"
                                  itemType="https://schema.org/Answer"
                                >
                                  <div className="border-t border-stone-600 pt-4">
                                    <p className="text-gray-300 leading-relaxed" itemProp="text">
                                      {item.answer}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
  
                <div className="text-center py-8">
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      {businessConfig?.business?.phone ? (
                        <>
                          <span className="text-orange-400 font-medium">
                            Call us at {businessConfig.business.phone}
                          </span>{" "}
                        </>
                      ) : null}
                      {onRequestQuote ? (
                        <>
                          or{" "}
                          <button
                            onClick={onRequestQuote}
                            className="text-orange-400 hover:text-orange-300 underline font-medium"
                          >
                            request a quote online
                          </button>{" "}
                          to get started.
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }
  );
  
  export default FAQMDH;
  
