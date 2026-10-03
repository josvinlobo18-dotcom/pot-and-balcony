/**
 * The three content pillars. The folder name under src/content/articles/
 * must match one of these slugs — that is what decides an article's URL
 * (/<pillar>/<article-slug>/) and which hub page lists it.
 */
export const PILLAR_ORDER = ['balcony-growing', 'indoor-growing', 'gear-guides'] as const;
export type PillarSlug = (typeof PILLAR_ORDER)[number];

export interface Pillar {
  slug: PillarSlug;
  number: string;
  title: string;
  short: string;
  tagline: string;
  /** Meta description for the hub page. */
  description: string;
  /** Intro paragraph on the hub page. */
  intro: string;
  topics: string[];
  emptyMessage: string;
}

export const PILLARS: Record<PillarSlug, Pillar> = {
  'balcony-growing': {
    slug: 'balcony-growing',
    number: '01',
    title: 'Balcony Growing',
    short: 'Balcony',
    tagline: 'No drill. No garden. Plenty of tomatoes.',
    description:
      'Renter-friendly balcony growing: no-drill setups, container weight limits, wind, heat from masonry and what to plant each season.',
    intro:
      'A balcony is not a small garden. It is wind tunnel, heat sink and weight-limited platform with a landlord attached. These guides deal with that reality: what to grow, what to grow it in, and how to set it up without leaving a mark.',
    topics: ['No-drill setups', 'Container weight', 'Wind & heat', 'Seasonal planting'],
    emptyMessage: 'More balcony guides are on the way.',
  },
  'indoor-growing': {
    slug: 'indoor-growing',
    number: '02',
    title: 'Indoor Growing',
    short: 'Indoor',
    tagline: 'Dark winter? Grow anyway.',
    description:
      'Grow food indoors all year: grow lights, microgreens, compact hydroponics and countertop setups for dark winters and tiny flats.',
    intro:
      'When the balcony shuts down for winter, the kitchen counter takes over. Grow lights, microgreens and compact hydroponics — what is worth the space, the electricity and the money, and what is not.',
    topics: ['Grow lights', 'Microgreens', 'Compact hydroponics', 'Countertop setups'],
    emptyMessage: 'The first indoor growing guides are being written. Check back soon.',
  },
  'gear-guides': {
    slug: 'gear-guides',
    number: '03',
    title: 'Gear Guides',
    short: 'Gear',
    tagline: 'Tested on a real balcony. Not unboxed for clicks.',
    description:
      'Honest reviews of the gear actually used on a small balcony: self-watering planters, LED grow lights, balcony greenhouses and elevated raised beds.',
    intro:
      'Gear is where small-space growing gets expensive fast. These are hands-on reviews of the bigger-ticket items — what held up, what did not, and what I would buy again. Where a product has an affiliate link, it is clearly marked.',
    topics: ['Self-watering planters', 'LED grow lights', 'Balcony greenhouses', 'Raised beds'],
    emptyMessage: 'More gear reviews are coming as they are tested.',
  },
};

export const isPillar = (value: string): value is PillarSlug =>
  (PILLAR_ORDER as readonly string[]).includes(value);
