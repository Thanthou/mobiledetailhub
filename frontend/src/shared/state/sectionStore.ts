import { create } from 'zustand';

export type SectionId = 'top' | 'services' | 'services-desktop' | 'reviews' | 'faq' | 'gallery' | 'footer' | 'gallery-desktop';

interface SectionState {
  current: SectionId | null;
  setCurrent: (id: SectionId | null) => void;
}

// Map actual section IDs to navigation IDs
export const getNavId = (sectionId: SectionId | null): SectionId | null => {
  if (!sectionId) return null;
  if (sectionId === 'services-desktop') return 'services';
  if (sectionId === 'gallery-desktop' || sectionId === 'gallery') return 'footer';
  return sectionId;
};

export const useSectionStore = create<SectionState>((set) => ({
  current: null,
  setCurrent: (id) => { set({ current: id }); },
}));

