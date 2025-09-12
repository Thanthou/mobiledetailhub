// Header-specific constants

export interface NavLink {
  name: string;
  href: string;
  isFAQ?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '#top' },
  { name: 'Services', href: '#services' },
  { name: 'FAQ', href: '#faq', isFAQ: true }
];
