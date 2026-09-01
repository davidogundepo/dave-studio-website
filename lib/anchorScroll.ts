'use client';

import type Lenis from 'lenis';

// Set by SmoothScrollProvider once Lenis is running, cleared on unmount —
// lets any client component reach the one instance driving page scroll,
// without threading it through props or context.
let lenis: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenis = instance;
}

// Matches the ease already used for the page's other big motion (see
// lib/motion.ts) — a shared signature so a nav click feels like the same
// hand moving the page, not a different interaction bolted on.
const glide = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Glides to an in-page anchor through the same Lenis instance driving the
 * rest of the scroll, rather than the browser's instant jump-cut — so
 * following "How it works" or "Pricing" feels like part of one continuous
 * page, not a teleport. Honors each section's own `scroll-mt-*` automatically
 * (Lenis reads `scrollMarginTop` off the target). Returns false when Lenis
 * isn't running (prefers-reduced-motion), so the caller can fall back to a
 * plain native jump instead of doing nothing.
 */
export function glideToHash(hash: string): boolean {
  if (!lenis) return false;
  lenis.scrollTo(hash, { duration: 1.4, easing: glide });
  return true;
}

/**
 * Puts the hash in the URL without the browser's own jump — `pushState`
 * alone doesn't fire `hashchange`, so anything reading the hash reactively
 * (Nav's active-link state) would drift out of sync with the address bar.
 * Dispatching the event ourselves keeps the two honest.
 */
export function pushHash(href: string) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
