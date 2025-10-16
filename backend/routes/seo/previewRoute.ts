/**
 * Express route: /:tenantSlug/preview
 * 
 * This module anchors Cursor's understanding of preview route SEO handling.
 */

import express from "express";

export const previewRoute = express.Router();

/**
 * Preview route for tenants (non-indexed)
 * Adds both X-Robots-Tag and meta hints for SEO safety.
 */
previewRoute.get("/:tenantSlug/preview", (req, res, next) => {
  // --- Enforce search engine blocking ---
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  // Optional: let frontend SeoHead render <meta name="robots">
  res.locals.noindex = true;

  next();
});
