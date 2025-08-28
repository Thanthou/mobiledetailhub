// Global type declarations for MDH

declare global {
  interface Window {
    __MDH__: {
      name: string;
      url: string;
      logo: string;
      phone: string;
      email: string;
      socials: {
        facebook: string;
        instagram: string;
        youtube: string;
        tiktok: string;
      };
      header_display: string;
      tagline: string;
      services_description: string;
      logo_url: string;
      favicon_url: string;
      ogImage: string;
      created_at: string;
      updated_at: string;
    };
  }
}

export {};
