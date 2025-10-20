import React from 'react';

import { useViewportStore, Viewport } from '../state/viewportStore';

const OPTIONS: { id: Viewport; label: string }[] = [
  { id: 'full', label: 'Full Width' },
  { id: 'desktop', label: '💻 Desktop (1280)' },
  { id: 'tablet', label: '📱 Tablet (768)' },
  { id: 'mobile', label: '📱 Mobile (390)' },
];

/**
 * Floating viewport switcher - only visible in development mode.
 * Allows developers to quickly test different viewport sizes.
 */
export const ViewportSwitcher: React.FC = () => {
  const { viewport, setViewport } = useViewportStore();

  return (
    <div
      style={{
        position: 'fixed', 
        right: 12, 
        bottom: 12, 
        zIndex: 9999,
        background: 'rgba(17,24,39,.95)', 
        color: 'white', 
        borderRadius: 12, 
        padding: '8px 12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <label htmlFor="viewport-select" style={{ fontSize: 11, opacity: .7, marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Viewport
      </label>
      <select
        id="viewport-select"
        value={viewport}
        onChange={(e) => { setViewport(e.target.value as Viewport); }}
        style={{ 
          background: 'rgba(255,255,255,.1)', 
          color: 'white', 
          border: '1px solid rgba(255,255,255,.2)', 
          borderRadius: 6, 
          padding: '4px 8px',
          fontSize: 13,
          cursor: 'pointer',
        }}
        aria-label="Select viewport size for testing"
      >
        {OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </div>
  );
};

