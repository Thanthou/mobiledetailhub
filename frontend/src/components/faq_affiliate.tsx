import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBusinessConfig } from "../hooks/useBusinessConfig";

/** =============================================
 * Affiliate FAQ (SEO-optimized + Modularized)
 * - Mirrors faq_mdh structure: per-category arrays -> master list
 * - Heavily localized copy: city/state/ZIP/nearby areas injected
 * - Long-tail keywords included naturally (no stuffing)
 * - JSON-LD FAQPage schema injected
 * ============================================= */

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

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
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

// ===== Helpers for geo/context =====
function getGeoParts(cfg: any) {
  const business = cfg?.business ?? {};
  const serviceLocations: string[] = cfg?.serviceLocations ?? [];

  // Prefer structured geo if present; fall back to address string.
  const city = business.city || business.locality || "Your City";
  const state = business.state || business.region || "Your State";
  const zip = business.zip || business.postalCode || "Your ZIP";
  const address = business.address || `${city}, ${state} ${zip}`;

  const primaryArea = address;
  const nearbyList = serviceLocations?.length
    ? serviceLocations.slice(0, 7).join(", ")
    : `${city}, ${state}`;

  // Human variants for natural insertion
  const cityState = `${city}, ${state}`;

  return { city, state, zip, address, primaryArea, nearbyList, cityState };
}

// ===== Category: Services =====
const AFFILIATE_FAQ_SERVICES = (cfg: any): FAQItem[] => {
  const { city, state, zip, cityState } = getGeoParts(cfg);
  return [
    {
      category: "Services",
      question: `What mobile detailing services do you offer in ${cityState} (${zip})?`,
      answer:
        `We provide full-service mobile car detailing in ${cityState} — exterior wash, decon (iron/tar/clay), paint-safe drying, wheel & tire cleaning, interior vacuuming and crevice work, interior glass, and protectants. Add-ons include one-step & multi-step machine polishing, ceramic coating, headlight restoration, odor removal, and paint protection film (PPF).`,
    },
    {
      category: "Services",
      question: `Do you offer ceramic coating in ${city}, ${state}?`,
      answer:
        `Yes — professional-grade ceramic coatings that enhance gloss, resist chemicals, and make maintenance washes faster. We prep the paint properly (wash, decon, optional correction) and offer durability packages from ~1–5+ years with care guides tailored to ${cityState}.`,
    },
    {
      category: "Services",
      question: `Do you install Paint Protection Film (PPF) near ${zip}?`,
      answer:
        `We install self-healing urethane PPF on high-impact areas (front bumper, hood, fenders, mirrors) or full panels. PPF helps prevent rock chips and road rash on ${city} highways and local roads, and can be combined with a ceramic top coat for easier cleaning.`,
    },
    {
      category: "Services",
      question: `Do you detail boats and RVs in ${cityState}?`,
      answer:
        `Yes — marine & RV detailing including wash, oxidation removal, machine polish, and long-term protection (gelcoat-safe sealants, coatings). We tailor workflow to large surfaces, seams, and ladders common to RVs and watercraft in ${cityState}.`,
    },
    {
      category: "Services",
      question: `Is your process safe for modern paint, interior leather, and touchscreens?`,
      answer:
        `Absolutely. We use pH-appropriate soaps, contact wash with premium mitts, microfiber drying, measured machine polishing, leather-safe cleaners/conditioners, and screen-safe interior products recommended for today’s OEM finishes.`,
    },
  ];
};

// ===== Category: Pricing & Quotes =====
const AFFILIATE_FAQ_PRICING = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "Pricing & Quotes",
      question: `How much does mobile detailing cost in ${cityState}?`,
      answer:
        `Pricing depends on vehicle size, condition, and selected services. Basic interior or exterior details typically start around $100–$160, full details $180–$320+, machine polishing from $200+, ceramic coating from ~$500+, and PPF is quoted by coverage. You’ll see a clear estimate during online booking.`,
    },
    {
      category: "Pricing & Quotes",
      question: `Can I get an instant quote online?`,
      answer:
        `Yes. Choose vehicle type, services, and your ${cityState} location to see an instant estimate or connect for a custom quote if your project needs inspection (heavy pet hair, stains, correction, PPF templates).`,
    },
    {
      category: "Pricing & Quotes",
      question: `Do you have bundled packages or promotions?`,
      answer:
        `We offer bundles (interior + exterior, add headlight restoration or odor removal) and seasonal promos for ${cityState}. Check the booking flow or ask for current deals.`,
    },
  ];
};

// ===== Category: Scheduling & Weather =====
const AFFILIATE_FAQ_SCHEDULING = (cfg: any): FAQItem[] => {
  const { city, state } = getGeoParts(cfg);
  return [
    {
      category: "Scheduling & Weather",
      question: `How do I book a mobile detail in ${city}, ${state}?`,
      answer:
        `Book 24/7 online — pick your vehicle, services, and a time that fits your schedule. You’ll receive confirmation and day-of updates so you know exactly when we’re en route.`,
    },
    {
      category: "Scheduling & Weather",
      question: `What if it’s raining or too hot on my appointment day?`,
      answer:
        `We monitor local weather in ${city}, ${state}. For rain, we may reschedule or work under cover; for extreme heat or cold, we may adjust timing or postpone coatings/correction to protect results. We’ll coordinate the best option with you.`,
    },
    {
      category: "Scheduling & Weather",
      question: `Do you offer weekend or evening appointments?`,
      answer:
        `Yes — limited weekend and evening slots are available. The calendar shows current openings for ${city}, ${state}.`,
    },
  ];
};

// ===== Category: Locations =====
const AFFILIATE_FAQ_LOCATIONS = (cfg: any): FAQItem[] => {
  const { primaryArea, nearbyList, cityState } = getGeoParts(cfg);
  return [
    {
      category: "Locations",
      question: `Which areas do you service around ${cityState}?`,
      answer:
        `We’re fully mobile in ${primaryArea} and nearby communities (${nearbyList}). Enter your address during booking to confirm availability and any travel fees beyond the standard radius.`,
    },
    {
      category: "Locations",
      question: `Can you detail at my home, apartment, or workplace?`,
      answer:
        `Yes — driveway, garage, or office parking lots are ideal as long as property rules allow mobile services and there’s safe access to the vehicle. For apartments/gated communities, please confirm access with management.`,
    },
    {
      category: "Locations",
      question: `Do you bring water and power?`,
      answer:
        `Most jobs are self-contained. If we’ll need on-site water or power for a specialty service, we’ll flag that before your appointment.`,
    },
  ];
};

// ===== Category: Preparation =====
const AFFILIATE_FAQ_PREPARATION = (_cfg: any): FAQItem[] => [
  {
    category: "Preparation",
    question: "How should I prepare my vehicle for a mobile detail?",
    answer:
      "Please remove personal items and valuables, and ensure we have space to open all doors. Parking in shade or a garage helps keep panels cool, which improves wash, correction, and coating results.",
  },
  {
    category: "Preparation",
    question: "Do I need to wash the car first?",
    answer:
      "No — thorough exterior cleaning is part of every detail. If there’s excessive mud or debris, a quick rinse beforehand can reduce service time.",
  },
  {
    category: "Preparation",
    question: "Can I leave the vehicle during service?",
    answer:
      "Yes — as long as we have keys/access at the scheduled time. We’ll text updates and confirm when finished.",
  },
];

// ===== Category: Payments & Deposits =====
const AFFILIATE_FAQ_PAYMENTS = (_cfg: any): FAQItem[] => [
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
    question: "What’s your cancellation policy?",
    answer:
      "You can modify or cancel up to 24 hours in advance without penalty. Late changes may incur a fee due to reserved time and prep for your appointment.",
  },
];

// ===== Category: Warranty & Guarantee =====
const AFFILIATE_FAQ_WARRANTY = (_cfg: any): FAQItem[] => [
  {
    category: "Warranty & Guarantee",
    question: "Do you guarantee your work?",
    answer:
      "Yes — we stand behind our results. If something isn’t right, contact us within 24 hours so we can review photos and make it right.",
  },
  {
    category: "Warranty & Guarantee",
    question: "Are ceramic coatings and PPF covered by warranty?",
    answer:
      "Professional ceramic coatings often include written warranties (1–5+ years) when maintained per care guidelines. Most premium PPFs include manufacturer warranties against yellowing, cracking, and delamination (typically 5–10 years), plus installer workmanship coverage.",
  },
];

// ===== Category: Aftercare & Maintenance =====
const AFFILIATE_FAQ_AFTERCARE = (_cfg: any): FAQItem[] => [
  {
    category: "Aftercare & Maintenance",
    question: "How should I maintain my vehicle after detailing?",
    answer:
      "Use pH-neutral shampoo, premium wash mitts, and microfiber drying towels. Avoid brush tunnels. Consider a maintenance plan for regular light details.",
  },
  {
    category: "Aftercare & Maintenance",
    question: "Ceramic coating care tips",
    answer:
      "Wash in shade, dry thoroughly, and avoid harsh chemicals. Apply a ceramic topper every 3–6 months to boost hydrophobics. We provide a simple owner’s care sheet.",
  },
  {
    category: "Aftercare & Maintenance",
    question: "PPF care tips",
    answer:
      "Avoid blasting film edges with pressure washers, use gentle soaps, and optionally apply a coating or sealant to make film easier to keep clean.",
  },
];

// ===== Category: Fleet & Commercial =====
const AFFILIATE_FAQ_FLEET = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "Fleet & Commercial",
      question: `Do you service fleets in ${cityState}?`,
      answer:
        `Yes — on-site fleet washing and detailing for cars, vans, and light trucks. We offer recurring schedules, consolidated billing, and consistent standards across vehicles.`,
    },
    {
      category: "Fleet & Commercial",
      question: "Can you support dealerships or commercial accounts?",
      answer:
        "Absolutely. We coordinate multi-vehicle days, add paint correction or coatings for showcase units, and align hours to reduce downtime.",
    },
  ];
};

// ===== Category: General =====
const AFFILIATE_FAQ_GENERAL = (cfg: any): FAQItem[] => {
  const { cityState } = getGeoParts(cfg);
  return [
    {
      category: "General",
      question: `Why choose a mobile detailer in ${cityState}?`,
      answer:
        `We come to you — save time vs. shop drop-offs. You get pro results with transparent pricing and vetted techs familiar with ${cityState} weather and road conditions.`,
    },
    {
      category: "General",
      question: "How long does a typical appointment take?",
      answer:
        "Standard details take ~2–4 hours; machine polishing/coatings can take 4–8+ hours. PPF install time varies by coverage. We’ll estimate the window during booking.",
    },
  ];
};

// ===== Master builder (per-category + optional dynamic adds) =====
function buildAffiliateItems(cfg: any): FAQItem[] {
  const items: FAQItem[] = [
    ...AFFILIATE_FAQ_SERVICES(cfg),
    ...AFFILIATE_FAQ_PRICING(cfg),
    ...AFFILIATE_FAQ_SCHEDULING(cfg),
    ...AFFILIATE_FAQ_LOCATIONS(cfg),
    ...AFFILIATE_FAQ_PREPARATION(cfg),
    ...AFFILIATE_FAQ_PAYMENTS(cfg),
    ...AFFILIATE_FAQ_WARRANTY(cfg),
    ...AFFILIATE_FAQ_AFTERCARE(cfg),
    ...AFFILIATE_FAQ_FLEET(cfg),
    ...AFFILIATE_FAQ_GENERAL(cfg),
  ];
  return items;
}

export const AFFILIATE_FAQ_ITEMS = (cfg: any): FAQItem[] => buildAffiliateItems(cfg);

// ===== Component =====
const FAQAffiliateOptimized = React.forwardRef<FAQRef, FAQProps>(
  (
    { autoExpand = false, onRequestQuote, autoCollapseOnScroll = false },
    ref
  ) => {
    const { businessConfig, isLoading, error } = useBusinessConfig();

    const [isExpanded, setIsExpanded] = useState(autoExpand);
    const [openItems, setOpenItems] = useState<number[]>([]);
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    React.useImperativeHandle(ref, () => ({
      expand: () => setIsExpanded(true),
    }));

    // Build data
    const faqData: FAQItem[] = useMemo(() => {
      if (!businessConfig) return [];
      return AFFILIATE_FAQ_ITEMS(businessConfig);
    }, [businessConfig]);

    // JSON-LD FAQPage schema
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
          acceptedAnswer: { "@type": "Answer", text: item.answer },
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

    // Optional auto-collapse on scroll
    useEffect(() => {
      if (!autoCollapseOnScroll || typeof window === "undefined") return;
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const faqSection = document.getElementById("faq");
        if (!faqSection) return;
        const r = faqSection.getBoundingClientRect();
        if (scrollTop + windowHeight >= documentHeight - 50 || r.top > windowHeight * 0.95) {
          setIsExpanded(false);
          setOpenItems([]);
          setOpenCategories([]);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [autoCollapseOnScroll]);

    // UI helpers
    const toggleExpanded = () => setIsExpanded((v) => !v);
    const toggleItem = (index: number) =>
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    const toggleCategory = (category: string) =>
      setOpenCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );

    // Grouping for display
    const groupedFAQs = useMemo(() => {
      return faqData.reduce((acc, item, index) => {
        (acc[item.category] ||= []).push({ ...item, originalIndex: index });
        return acc;
      }, {} as Record<string, FAQItemWithIndex[]>);
    }, [faqData]);

    const categories = useMemo(() => Object.keys(groupedFAQs), [groupedFAQs]);

    // Dynamic heading bits
    const geo = getGeoParts(businessConfig || {});

    if (isLoading || !businessConfig) {
      return (
        <section id="faq" className="bg-stone-800 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center text-white">Loading FAQ...</div>
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section id="faq" className="bg-stone-800 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center text-white">Error loading FAQ: {error}</div>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-stone-700 py-16" id="faq" aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto px-4">
          {!isExpanded ? (
            <div className="text-center flex justify-center items-center">
              <button
                onClick={toggleExpanded}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-12 py-6 md:px-24 md:py-8 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg text-xl md:text-2xl"
                aria-label="View Frequently Asked Questions about mobile detailing services"
                style={{ minWidth: '340px' }}
              >
                <span className="font-bold">Frequently Asked Questions</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <header className="text-center">
                <h2
                  id="faq-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
                >
                  Frequently Asked Questions — Mobile Detailing in {geo.cityState}
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Professional detailing, ceramic coating, and PPF in {geo.nearbyList}.
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
                    <button
                      onClick={onRequestQuote}
                      className="text-orange-400 hover:text-orange-300 underline font-medium"
                    >
                      Request an instant quote
                    </button>
                    {" "}or book online in minutes.
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

export default FAQAffiliateOptimized;
