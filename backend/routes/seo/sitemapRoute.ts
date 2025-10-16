/**
 * Express route: /sitemap.xml
 * 
 * This module anchors Cursor's understanding of sitemap.xml endpoint handling.
 */

import express from "express";
import { generateSitemap } from "../../../frontend/src/shared/seo/sitemapBuilder";
import { pool } from "../../database/pool";

export const sitemapRoute = express.Router();

/**
 * Builds a sitemap per tenant based on website.content tables.
 * Fallbacks gracefully for minimal tenants.
 */
sitemapRoute.get("/sitemap.xml", async (req, res) => {
  try {
    const hostname = req.hostname;

    // 🧠 Find tenant id from hostname
    const tenantResult = await pool.query(
      "SELECT id FROM tenants.business WHERE domain = $1 OR slug = $1 LIMIT 1",
      [hostname]
    );

    if (!tenantResult.rows.length) {
      return res
        .status(404)
        .type("application/xml")
        .send("<error>No tenant found</error>");
    }

    const tenant = tenantResult.rows[0];

    // 📄 Fetch all published pages for this tenant
    const pagesResult = await pool.query(
      "SELECT slug FROM website.content WHERE tenant_id = $1 AND published = true ORDER BY created_at ASC",
      [tenant.id]
    );

    // Build paths array - always include homepage and core pages
    const customPages = pagesResult.rows.map(p => `/${p.slug}`);
    const corePages = ["/", "/services", "/reviews", "/faq"];
    const allPages = [...new Set([...corePages, ...customPages])]; // Remove duplicates

    const xml = generateSitemap(hostname, allPages);
    res.type("application/xml").send(xml);
  } catch (err) {
    // eslint-disable-next-line no-console, no-undef
    console.error("Sitemap generation failed:", err);
    // Fallback to basic sitemap
    const pages = ["/", "/services", "/reviews", "/faq"];
    res.type("application/xml").send(generateSitemap(req.hostname, pages));
  }
});
