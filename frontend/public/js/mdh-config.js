// MDH Configuration - Loaded before JSON-LD loader
// This provides instant fallback data for header/footer rendering
window.__MDH__ = {
  // Basic business info
  name: "Mobile Detail Hub",
  url: "https://mobiledetailhub.com/",
  logo: "/icons/logo.webp",
  phone: "(888) 555-1234",
  email: "service@mobiledetailhub.com",
  
  // Social media links
  socials: {
    facebook: "https://www.facebook.com/mobiledetailhub",
    instagram: "https://www.instagram.com/mobiledetailhub",
    youtube: "https://www.youtube.com/@mobiledetailhub",
    tiktok: "https://www.tiktok.com/@mobiledetailhub"
  },
  
  // Display and branding
  header_display: "Mobile Detail Hub",
  tagline: "Mobile Car, Boat & RV Detailing Near You",
  services_description: "Find trusted mobile detailers for cars, boats, and RVs with Mobile Detail Hub. Compare services, read reviews, and book online with verified pros in your area.",
  
  // Assets
  logo: "/icons/logo.webp",
  logo_url: "/icons/logo.webp",
  favicon_url: "/icons/favicon.webp",
  ogImage: "/hero/image1.png",
  
  // Timestamps (will be updated by API)
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
