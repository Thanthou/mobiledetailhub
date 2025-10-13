import React from 'react';

import { useViewportStore } from '../state/viewportStore';

/** 
 * Constrains app width in DEV to simulate devices.
 * Wraps the entire app to provide a visual frame for testing different viewport sizes.
 */
export const ViewportFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewport = useViewportStore(s => s.viewport);

  // Common "logical" widths for testing
  // mobile: iPhone 14 Pro (390px)
  // tablet: iPad (768px)
  // desktop: Typical laptop (1280px)
  const width =
    viewport === 'mobile' ? 390 :
    viewport === 'tablet' ? 768 :
    viewport === 'desktop' ? 1280 :
    undefined;

  const style: React.CSSProperties = width
    ? { 
        width, 
        maxWidth: width,
        minWidth: 0,
        margin: '0 auto', 
        border: '1px solid #e5e7eb', 
        boxShadow: '0 0 0 1px #f3f4f6 inset',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }
    : {};

  return <div style={style} className="@container scrollbar-hide">{children}</div>;
};

