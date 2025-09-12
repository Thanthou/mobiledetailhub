import { useCallback } from "react";

import type { SectionId } from "../utils/sectionIds";

export function useScrollToSection() {
  return useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
}
