import { shots } from './gallery.generated';
import type { Kind, Shot } from './types';

export { shots };

/**
 * David went through all 529 by hand and picked the ones fit to lead. Those come
 * first in both galleries and are the only ones used on the homepage, the share
 * card, and anywhere else a visitor meets the work before they have chosen to
 * browse — a stride-based pick will cheerfully surface a generation with a
 * displaced arm, and the first impression is not the place to find out.
 */
const leadFirst = (a: Shot, b: Shot) =>
  (a.feat ?? Infinity) - (b.feat ?? Infinity) || a.id.localeCompare(b.id);

export const campusShots = shots.filter((s) => s.kind === 'campus').sort(leadFirst);
export const nyscShots = shots.filter((s) => s.kind === 'nysc').sort(leadFirst);

export const featured = shots.filter((s) => s.feat !== null).sort(leadFirst);
export const featuredCampus = campusShots.filter((s) => s.feat !== null);
export const featuredNysc = nyscShots.filter((s) => s.feat !== null);

export const byKind = (kind: Kind) => (kind === 'campus' ? campusShots : nyscShots);

export const shotById = new Map(shots.map((s) => [s.id, s]));

export const src = (id: string, size: 'thumb' | 'card' | 'wide' | 'full') =>
  `/gallery/${size}/${id}.webp`;

/** Mulberry32 — a small deterministic PRNG so the shuffle is stable per seed. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A shuffled pick that is stable across builds. The order looks arbitrary, which
 * is what keeps the homepage from feeling like a sorted list, but every visitor
 * and every deploy sees the same thing — a genuinely random pick at render time
 * would mean the server and the browser disagreed about the markup.
 */
export function pick(list: Shot[], count: number, seed = 0): Shot[] {
  if (list.length === 0) return [];
  const pool = [...list];
  const rand = rng(seed + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
