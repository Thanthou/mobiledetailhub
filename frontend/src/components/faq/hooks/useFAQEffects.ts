import { useEffect } from 'react';
import { FAQItem } from '../types';

interface UseFAQEffectsProps {
  faqData: FAQItem[];
  isExpanded: boolean;
  autoCollapseOnScroll: boolean;
  resetState: () => void;
  setIsExpanded: (expanded: boolean) => void;
}

export const useFAQEffects = ({
  faqData,
  isExpanded,
  autoCollapseOnScroll,
  resetState,
  setIsExpanded
}: UseFAQEffectsProps) => {
  // JSON-LD schema effect
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

  // Navigation auto-expand effect
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
  }, [setIsExpanded]);

  // Auto-collapse on scroll effect
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
        resetState();
      }
      // Collapse if FAQ is scrolled below viewport (with 100px threshold)
      else if (faqRect.top > windowHeight + 100) {
        resetState();
      }
      // Collapse if user is near the bottom of the page (within 200px)
      else if (scrollTop + windowHeight >= documentHeight - 200) {
        resetState();
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
  }, [isExpanded, resetState]);
};