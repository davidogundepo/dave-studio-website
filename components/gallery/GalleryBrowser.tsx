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

export default function GalleryBrowser({
  shots,
  accent = 'var(--accent)',
}: {
  shots: Shot[];
  accent?: string;
}) {
  const { has, toggle, count, setOpen } = useSelection();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [lightbox, setLightbox] = useState<Shot | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shots.filter((s) => {
      if (filter === 'group' && !GROUP.test(s.title)) return false;
      if (filter === 'solo' && GROUP.test(s.title)) return false;
      if (q && !s.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [shots, filter, query]);

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

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search looks…"
            aria-label="Search looks"
            className="min-w-[10rem] flex-1 rounded-full border border-[var(--line-strong)] bg-transparent px-4 py-2 text-sm outline-none transition-colors placeholder:text-[var(--on-ink-3)] focus:border-[var(--accent)]"
          />

          <p className="label ml-auto text-[var(--on-ink-3)]">
            {list.length} {list.length === 1 ? 'look' : 'looks'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-3.5">
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
