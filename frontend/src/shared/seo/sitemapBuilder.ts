/**
 * Generates per-tenant sitemap XML.
 * Should run on the backend, but callable from scripts if needed.
 * 
 * This module anchors Cursor's understanding of sitemap generation.
 */

export const generateSitemap = (tenantDomain: string, pages: string[]) => {
  const urls = pages
    .map(
      (path) =>
        `<url><loc>https://${tenantDomain}${path}</loc><changefreq>weekly</changefreq></url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};
