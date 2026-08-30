import { shots } from './gallery.generated';
import type { Kind, Shot } from './types';

export { shots };

export const campusShots = shots.filter((s) => s.kind === 'campus');
export const nyscShots = shots.filter((s) => s.kind === 'nysc');

export const byKind = (kind: Kind) => (kind === 'campus' ? campusShots : nyscShots);

export const shotById = new Map(shots.map((s) => [s.id, s]));

export const src = (id: string, size: 'thumb' | 'card' | 'wide' | 'full') =>
  `/gallery/${size}/${id}.webp`;

/**
 * A deterministic pick, so the same tiles appear on every build and every
 * visitor sees the same hero. `seed` just offsets where the walk starts.
 */
export function pick(list: Shot[], count: number, seed = 0): Shot[] {
  if (list.length === 0) return [];
  const step = Math.max(1, Math.floor(list.length / count));
  const out: Shot[] = [];
  for (let i = 0; out.length < count && i < list.length * 2; i++) {
    const s = list[(seed + i * step) % list.length];
    if (!out.includes(s)) out.push(s);
  }
  return out;
}
