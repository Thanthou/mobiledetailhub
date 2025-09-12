export const SECTION_IDS = {
  HERO: "hero",
  WHAT: "what-it-is",
  PROCESS: "process",
  RESULTS: "results",
  INFO: "information",
  ACTION: "action",
} as const;
export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];
