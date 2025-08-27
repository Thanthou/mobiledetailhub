// MDH JSON-LD Loader - Loads all structured data
// Ensures DOM is ready and config is loaded
(function () {
  const d = document;
  
  // Wait for DOM and config to be ready
  function init() {
    const b = window.__MDH__;
    
    if (!b) {
      console.warn('MDH config not loaded, retrying...');
      setTimeout(init, 100);
      return;
    }

  // Organization JSON-LD
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": b.url + "#org",
    "name": b.name,
    "url": b.url,
    "logo": b.logo,
    "contactPoint": b.phone ? { 
      "@type": "ContactPoint", 
      "telephone": b.phone, 
      "contactType": "customer service", 
      "availableLanguage": "English" 
    } : undefined,
    "sameAs": Object.values(b.socials || {}).filter(Boolean)
  };
  
  // Website JSON-LD
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": b.url + "#website",
    "name": b.name,
    "url": b.url,
    "publisher": { "@type": "Organization", "@id": b.url + "#org" }
  };

  // Set the JSON-LD content
  const orgElement = d.getElementById("org-jsonld");
  const websiteElement = d.getElementById("website-jsonld");
  
  if (orgElement) orgElement.textContent = JSON.stringify(org);
  if (websiteElement) websiteElement.textContent = JSON.stringify(website);

  // Load directory data if available
  fetch('/detailers.json', { credentials: 'omit' })
    .then(r => r.ok ? r.json() : [])
    .then(list => {
      if (!Array.isArray(list) || !list.length) return;
      
      const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Mobile Detail Hub Directory",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": list.length,
        "itemListElement": list.map((d, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": d.url,
          "name": d.name
        }))
      };
      
      const directoryElement = document.getElementById('directory-jsonld');
      if (directoryElement) directoryElement.textContent = JSON.stringify(itemList);
    })
    .catch(() => {});
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
