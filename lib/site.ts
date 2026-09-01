export const site = {
  name: 'Dave Studio',
  url: 'https://dave-studio.web.app',
  tagline: 'Graduation portraits, without the graduation photographer.',
  whatsapp: '2347079693500',
  whatsappDisplay: '+234 707 969 3500',
  instagram: 'https://instagram.com/davestudio.ng',
} as const;

/**
 * A wa.me link with no `?text=` opens to a blank compose box — David has no
 * way to tell it apart from a cold message to his personal number. Every
 * WhatsApp link on the site should go through this, not build its own href,
 * so a stray blank link never sneaks back in.
 */
export function waHref(message = "Hi David, I'm reaching out from the Dave Studio website.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

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
 * Two named bundles anchor the price — Starter at 5, Full set at 10 — but a
 * customer isn't limited to exactly those counts. Anything in between or
 * beyond scales in a straight line through the two anchors (see `priceFor`),
 * so 7 looks has its own real price rather than silently costing the same as
 * 5. Keep `looks` ascending.
 */
export const bundles = [
  { looks: 5,  naira: 10_000, label: 'Starter' },
  { looks: 10, naira: 17_000, label: 'Full set' },
] as const;

export const MIN_LOOKS = bundles[0].looks;

/** ₦ per additional look, derived from the two anchor bundles: (17,000-10,000)/(10-5). */
const PER_LOOK = (bundles[1].naira - bundles[0].naira) / (bundles[1].looks - bundles[0].looks);

/** What the bigger bundle saves against buying the smaller one twice. */
export const savingOn = (i: number) =>
  i === 0 ? 0 : bundles[0].naira * (bundles[i].looks / bundles[0].looks) - bundles[i].naira;

// A narrow no-break space after the symbol. Some fonts (Bodoni Moda among
// them) give ₦ tight enough side-bearing that its own double bar overlaps the
// following digit and reads as a strikethrough through the price — this space
// gives the glyph room without visibly separating symbol from amount.
export const naira = (n: number) => '₦\u202F' + n.toLocaleString('en-NG');

/**
 * The price for any count at or above the minimum — exact at both anchors,
 * a straight line between and beyond them. null below the minimum, since
 * there is no price to quote for fewer than 5.
 */
export function priceFor(count: number): number | null {
  if (count < MIN_LOOKS) return null;
  return Math.round(bundles[0].naira + (count - bundles[0].looks) * PER_LOOK);
}

/** The named bundle a count exactly matches — for badges, not for pricing. */
export function bundleFor(count: number) {
  return bundles.find((b) => b.looks === count) ?? null;
}

/** What the customer pays right now, and the next round number worth reaching. */
export function quote(count: number) {
  const price = priceFor(count);
  const label = bundleFor(count)?.label ?? null;
  const next = bundles.find((b) => b.looks > count) ?? null;
  return { price, label, next, remaining: next ? next.looks - count : 0 };
}
