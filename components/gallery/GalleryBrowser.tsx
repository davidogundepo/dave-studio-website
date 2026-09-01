'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ShotImage from '@/components/media/ShotImage';
import Lightbox from '@/components/gallery/Lightbox';
import { useSelection } from '@/components/providers/SelectionProvider';
import { MIN_LOOKS } from '@/lib/site';
import type { Shot } from '@/lib/types';

const PAGE = 48;

/** Group shots are worth filtering for — most people arrive wanting either
 *  "just me" or "me and my mum". Derived from the title, which already says. */
const GROUP = /\b(two|three|four|five|nine|family|mother|father|couple|friends|parents|group|press)\b/i;

type Filter = 'all' | 'solo' | 'group';

/**
 * The search box doubles as a catalogue lookup. An order arrives naming files —
 * campus-004, campus-006, campus-011 — and pasting those numbers back in shows
 * exactly those looks, in the order they were typed, so a selection can be
 * checked against the grid without hunting.
 *
 * Number mode engages only when every token is a number (optionally with its
 * campus-/nysc- prefix); anything else stays an ordinary title search.
 */
function parseNumbers(query: string): number[] | null {
  if (!query) return null;

  // A whole order pasted out of WhatsApp — numbering, titles, prices and all —
  // still filters correctly, because a prefixed name is unambiguous wherever it
  // appears in the text.
  const prefixed = [...query.matchAll(/\b(?:campus|nysc)-0*(\d{1,4})\b/gi)];
  if (prefixed.length > 0) {
    return [...new Set(prefixed.map((m) => Number(m[1])))];
  }

  // Otherwise a bare list — "4, 6, 11" — but only if that is all it is, so an
  // ordinary word search is never hijacked.
  const tokens = query.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0) return null;

  const numbers: number[] = [];
  for (const tok of tokens) {
    const m = /^0*(\d{1,4})$/.exec(tok);
    if (!m) return null;
    numbers.push(Number(m[1]));
  }
  return [...new Set(numbers)];
}

export default function GalleryBrowser({
  shots,
  accent = 'var(--accent)',
  kindLabel = 'this gallery',
}: {
  shots: Shot[];
  accent?: string;
  kindLabel?: string;
}) {
  const { has, toggle, count, setOpen } = useSelection();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [lightbox, setLightbox] = useState<Shot | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const wanted = useMemo(() => parseNumbers(query.trim()), [query]);

  const { list, missing } = useMemo(() => {
    const byFilter = shots.filter((s) => {
      if (filter === 'group' && !GROUP.test(s.title)) return false;
      if (filter === 'solo' && GROUP.test(s.title)) return false;
      return true;
    });

    if (wanted) {
      const byRef = new Map(byFilter.map((s) => [s.ref, s]));
      const found = wanted.map((n) => byRef.get(n)).filter((s): s is Shot => Boolean(s));
      return { list: found, missing: wanted.filter((n) => !byRef.has(n)) };
    }

    const q = query.trim().toLowerCase();
    return {
      list: q ? byFilter.filter((s) => s.title.toLowerCase().includes(q)) : byFilter,
      missing: [] as number[],
    };
  }, [shots, filter, query, wanted]);

  // Reset the window whenever the result set changes, or "load more" would be
  // showing a page count from the previous filter.
  useEffect(() => setShown(PAGE), [filter, query]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setShown((n) => Math.min(n + PAGE, list.length)),
      { rootMargin: '900px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [list.length]);

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Everything' },
    { id: 'solo', label: 'Just me' },
    { id: 'group', label: 'With people' },
  ];

  return (
    <>
      <div className="sticky top-[var(--nav-h)] z-[300] -mx-[var(--gutter)] border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_92%,transparent)] px-[var(--gutter)] py-3.5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className="label rounded-full px-3.5 py-2 transition-colors duration-300"
                style={
                  filter === f.id
                    ? { background: accent, color: '#0A0A0B' }
                    : { border: '1px solid var(--line-strong)', color: 'var(--on-ink-2)' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[12rem] flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search looks, or paste numbers: 4, 6, 11"
              aria-label="Search looks by name, or filter by catalogue number"
              className="w-full rounded-full border bg-transparent py-2 pl-4 pr-9 text-sm outline-none transition-colors placeholder:text-[var(--on-ink-3)]"
              style={{ borderColor: wanted ? accent : 'var(--line-strong)' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[var(--on-ink-3)] transition-colors hover:text-[var(--accent)]"
              >
                ×
              </button>
            )}
          </div>

          <p className="label ml-auto text-[var(--on-ink-3)]">
            {list.length} {list.length === 1 ? 'look' : 'looks'}
          </p>
        </div>
      </div>

      {wanted && (
        <div
          className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius)] border px-4 py-3"
          style={{ borderColor: accent, background: 'color-mix(in srgb, var(--ink-2) 70%, transparent)' }}
        >
          <p className="text-sm">
            <span className="font-semibold" style={{ color: accent }}>
              {list.length} of {wanted.length}
            </span>{' '}
            <span className="text-[var(--on-ink-2)]">
              found in {kindLabel}
            </span>
          </p>

          {missing.length > 0 && (
            <p className="text-sm text-[var(--on-ink-3)]">
              Not here:{' '}
              <span className="text-[var(--on-ink-2)]">
                {missing.map((n) => String(n).padStart(3, '0')).join(', ')}
              </span>
            </p>
          )}

          {list.length > 0 && (
            <button
              onClick={() => list.forEach((s) => !has(s.id) && toggle(s.id))}
              className="label ml-auto rounded-full px-3.5 py-1.5 transition-colors"
              style={{ background: accent, color: '#04191D' }}
            >
              Select all {list.length}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-3.5">
        {list.slice(0, shown).map((s, i) => {
          const on = has(s.id);
          return (
            <div key={s.id} className="group/tile relative">
              <button
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                aria-label={`${on ? 'Remove' : 'Choose'} ${s.title}`}
                className="relative block w-full overflow-hidden rounded-[var(--radius)] bg-[var(--ink-3)]"
                style={{ aspectRatio: '3 / 4' }}
              >
                <ShotImage
                  id={s.id}
                  size="card"
                  alt={s.title}
                  priority={i < 8}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="transition-transform duration-700 group-hover/tile:scale-[1.04]"
                />

                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-[var(--radius)] transition-all duration-300 ${
                    on ? 'ring-[3px] ring-inset' : 'ring-0'
                  }`}
                  style={on ? { boxShadow: `inset 0 0 0 3px ${accent}` } : undefined}
                />

                {/* The catalogue number, always visible — not just on hover. This
                    is the number an order names and the number the search box
                    matches; without it a photo has no number while browsing
                    normally, and "the fourth one I'm looking at" silently means
                    something different from "look 4". */}
                {s.ref !== null && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-1 font-mono text-[0.68rem] tracking-wide text-white/90 backdrop-blur-sm"
                  >
                    {String(s.ref).padStart(3, '0')}
                  </span>
                )}

                <span
                  aria-hidden
                  className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${
                    on
                      ? 'scale-100 opacity-100'
                      : 'scale-75 opacity-0 group-hover/tile:scale-100 group-hover/tile:opacity-100'
                  }`}
                  style={{
                    background: on ? accent : 'rgba(10,10,11,0.6)',
                    color: on ? '#0A0A0B' : 'var(--on-ink)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {on ? '✓' : '+'}
                </span>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-left opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
                  aria-hidden
                >
                  <span className="block truncate text-xs text-white">{s.title}</span>
                </span>
              </button>

              <button
                onClick={() => setLightbox(s)}
                aria-label={`Enlarge ${s.title}`}
                className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-xs text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/tile:opacity-100"
              >
                ⤢
              </button>
            </div>
          );
        })}
      </div>

      <div ref={sentinel} className="h-20" />

      {shown < list.length && (
        <div className="flex justify-center pb-4">
          <button onClick={() => setShown((n) => n + PAGE)} className="btn btn-ghost">
            Show more ({list.length - shown} left)
          </button>
        </div>
      )}

      {list.length === 0 && (
        <p className="body-text py-24 text-center">Nothing matches that. Try a different word.</p>
      )}

      {/* A floating bar so the selection is always one tap away deep in the grid. */}
      {count > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[350] flex justify-center px-4">
          <button
            onClick={() => setOpen(true)}
            className="btn btn-gold pointer-events-auto shadow-2xl"
          >
            {count} {count === 1 ? 'look' : 'looks'} selected
            <span className="opacity-70">
              {count < MIN_LOOKS ? `· ${MIN_LOOKS - count} more` : '· Review'}
            </span>
          </button>
        </div>
      )}

      <Lightbox shot={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
