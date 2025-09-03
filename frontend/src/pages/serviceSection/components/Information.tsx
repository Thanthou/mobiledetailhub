import React from "react";
import type { SectionProps } from "../types/service";
import { SECTION_IDS } from "../utils/sectionIds";

const Row = ({ q, a }: { q: string; a: string }) => (
  <details className="rounded-2xl bg-stone-700 ring-1 ring-white/10 p-4 open:bg-stone-600/60">
    <summary className="cursor-pointer text-white font-semibold">{q}</summary>
    <p className="mt-2 text-slate-300">{a}</p>
  </details>
);

const Information: React.FC<SectionProps> = ({ id = SECTION_IDS.INFO, className, serviceData }) => {
  const faqs = serviceData?.information?.faqs || [
    { question: "Do I need water or power?", answer: "Placeholder answer text for this FAQ item." },
    { question: "How long does it take?", answer: "Placeholder answer text for this FAQ item." },
    { question: "What prep is required?", answer: "Placeholder answer text for this FAQ item." }
  ];

  return (
    <section id={id} className={`bg-stone-900 py-16 ${className ?? ""}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {serviceData?.information?.title || "Information"}
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq, index) => (
            <Row key={index} q={faq.question} a={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Information;
