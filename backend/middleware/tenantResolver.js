/**
 * Tenant Resolver Middleware
 * 
 * Detects tenant slug from subdomain and attaches it to the request object.
 * Handles both main domain and subdomain routing for multi-tenant architecture.
 */

export function tenantResolver(req, res, next) {
  const host = req.hostname.toLowerCase();
  
  // Parse the hostname to extract subdomain
  // thatsmartsite.com → main-site
  // testing-mobile-detail.thatsmartsite.com → testing-mobile-detail
  const parts = host.split('.');
  const domain = parts.slice(-2).join('.'); // thatsmartsite.com
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Reserved subdomains that should not be treated as tenant slugs
  const RESERVED_SUBDOMAINS = [
    'www', 'api', 'admin', 'main-site', 'staging', 'dev', 
    'cdn', 'assets', 'static', 'img', 'images', 'media',
    'mail', 'email', 'ftp', 'blog', 'support', 'help',
    'docs', 'status', 'monitoring', 'metrics', 'logs'
  ];
  
  // Determine tenant slug
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    req.tenantSlug = subdomain;
  } else {
    req.tenantSlug = 'main-site'; // Default to main site for admin dashboard
  }

  // Add tenant info to request for logging/debugging
  req.tenantInfo = {
    hostname: host,
    subdomain,
    domain,
    tenantSlug: req.tenantSlug,
    isMainSite: req.tenantSlug === 'main-site'
  };

  next();
}
