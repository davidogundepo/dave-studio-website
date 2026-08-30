export const site = {
  name: 'Dave Studio',
  url: 'https://dave-studio.web.app',
  tagline: 'Graduation portraits, without the graduation photographer.',
  whatsapp: '2347079693500',
  whatsappDisplay: '+234 707 969 3500',
  instagram: 'https://instagram.com/davestudio.ng',
} as const;

/** The rest of the group — separate businesses, separate sites. */
export const sister = [
  {
    label: 'Dave Architectures',
    note: 'Property films from listing photos',
    href: 'https://dave-architectures.web.app',
    live: true,
  },
  {
    label: 'Dave Websites',
    note: 'Websites & digital products',
    href: 'https://dave-digitals.web.app',
    live: true,
  },
  {
    label: 'Nouvellesoft',
    note: 'The digital yearbook app',
    href: 'https://nouvellesoft.com.ng',
    live: true,
  },
] as const;

/**
 * Bundles. Priced per bundle, not per image — a customer picks looks until they
 * hit a bundle size. Keep `looks` ascending; the cart matches on the largest
 * bundle a selection qualifies for.
 */
export const bundles = [
  { looks: 5,  naira: 10_000, label: 'Starter' },
  { looks: 10, naira: 17_000, label: 'Full set' },
] as const;

/** What the bigger bundle saves against buying the smaller one twice. */
export const savingOn = (i: number) =>
  i === 0 ? 0 : bundles[0].naira * (bundles[i].looks / bundles[0].looks) - bundles[i].naira;

export const MIN_LOOKS = bundles[0].looks;

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

/** The bundle a given count qualifies for, or null if below the minimum. */
export function bundleFor(count: number) {
  let match = null as (typeof bundles)[number] | null;
  for (const b of bundles) if (count >= b.looks) match = b;
  return match;
}

/** What the customer pays right now, and what they'd pay at the next tier. */
export function quote(count: number) {
  const current = bundleFor(count);
  const next = bundles.find((b) => b.looks > count) ?? null;
  return { current, next, remaining: next ? next.looks - count : 0 };
}
