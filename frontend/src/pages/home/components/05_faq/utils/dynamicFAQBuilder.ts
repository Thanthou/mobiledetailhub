import { FAQItem } from '../types';

export function buildServiceFAQs(cfg: any): FAQItem[] {
  if (!cfg) return [];
  
  const servicesAvail: string[] = cfg.services?.available ?? [];
  const vehicleTypes: string[] = cfg.services?.vehicleTypes ?? [];
  const vehiclesList =
    vehicleTypes.length > 0
      ? vehicleTypes.join(", ")
      : "cars, trucks, SUVs, boats, motorcycles, and RVs";

  const out: FAQItem[] = [];

  if (servicesAvail.some((s) => s.toLowerCase() === "detail")) {
    out.push(
      {
        category: "Services",
        question: `What does a full mobile detail include?`,
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
        question: `Do you offer ceramic coating?`,
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
        question: `Do you install Paint Protection Film (PPF)?`,
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