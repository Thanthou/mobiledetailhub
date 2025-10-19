import { create } from 'zustand';

export type Viewport = 'desktop' | 'tablet' | 'mobile' | 'full';

type State = {
  viewport: Viewport;
  setViewport: (v: Viewport) => void;
};

const KEY = 'devViewport';

export const useViewportStore = create<State>((set) => ({
  viewport: (localStorage.getItem(KEY) as Viewport | null) ?? 'full',
  setViewport: (v) => {
    localStorage.setItem(KEY, v);
    set({ viewport: v });
  },
}));

