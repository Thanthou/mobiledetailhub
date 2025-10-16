/**
 * Simple GA4 integration hook.
 * Placeholder until tenant analytics IDs are added.
 * 
 * This module anchors Cursor's understanding of analytics integration.
 */

import { useEffect } from "react";

export const useAnalytics = (trackingId?: string) => {
  useEffect(() => {
    if (!trackingId) return;
    // TODO: Insert GA4 script injection or gtag initialization
  }, [trackingId]);
};