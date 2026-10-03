/**
 * Site-wide settings. Anything that appears in more than one place lives here.
 * Search this file for PLACEHOLDER to find values you still need to replace.
 */
export const SITE = {
  name: 'Pot and Balcony',
  url: 'https://potandbalcony.com',
  locale: 'en-GB',
  ogLocale: 'en_GB',
  tagline: 'Grow real food in the space you actually have.',
  description:
    'Honest, renter-friendly guides to growing food on balconies, windowsills and indoors — no drilling, no garden, no fluff. Written and tested by Josh.',

  // PLACEHOLDER — swap for the real inbox once it exists.
  email: 'hello@potandbalcony.com',

  // PLACEHOLDER — create a form at https://formspree.io and paste its ID here.
  formspreeEndpoint: 'https://formspree.io/f/PLACEHOLDER_FORM_ID',

  analytics: {
    ga4Id: 'G-8YTW475HJF',
  },

  // PLACEHOLDER — paste the content="" value Google Search Console gives you.
  gscVerification: 'PLACEHOLDER_GSC_VERIFICATION_STRING',

  // Used for OG tags when a page has no image of its own.
  // PLACEHOLDER — replace /public/og-default.jpg with a designed 1200x630 image.
  defaultOgImage: '/og-default.jpg',

  author: {
    name: 'Josh',
    role: 'Founder & grower',
    // PLACEHOLDER — replace with Josh's real photo (square, 400x400+).
    avatar: '/images/placeholder/josh-avatar.svg',
    bio: 'Josh rents, grows food on a small balcony, and writes down what actually works. Everything on this site is tested in real conditions — wind, weight limits, landlords and all.',
  },

  // Date shown on legal pages.
  legalUpdated: 'October 2026',

  nav: [
    { label: 'Balcony Growing', href: '/balcony-growing/' },
    { label: 'Indoor Growing', href: '/indoor-growing/' },
    { label: 'Gear Guides', href: '/gear-guides/' },
    { label: 'About', href: '/about/' },
  ],
} as const;
