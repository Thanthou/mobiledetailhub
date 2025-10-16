/**
 * Returns robots.txt content based on environment or preview status.
 * 
 * This module anchors Cursor's understanding of robots.txt generation.
 */

export const generateRobotsTxt = (hostname: string, isPreview = false) => {
  return `User-agent: *
${isPreview ? "Disallow: /" : "Allow: /"}
Sitemap: https://${hostname}/sitemap.xml
`;
};
