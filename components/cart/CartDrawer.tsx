'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSelection } from '@/components/providers/SelectionProvider';
import ShotImage from '@/components/media/ShotImage';
import { shotById } from '@/lib/gallery';
import { MIN_LOOKS, naira, priceFor, quote, site } from '@/lib/site';

/**
 * Builds the WhatsApp message.
 *
 * Each line names the file the studio actually opens — `campus-047.png` — not
 * the prompt number, which is ambiguous (82 prompt numbers cover more than one
 * image), and not the internal id, which is a content hash nobody can find on
 * disk. Unresolvable ids are dropped rather than sent as a row that cannot be
 * fulfilled.
 */
function whatsappHref(ids: string[]) {
  const lines = ids
    .map((id) => shotById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s, i) => {
      const file = s.ref !== null ? `${s.kind}-${String(s.ref).padStart(3, '0')}` : s.id;
      return `${i + 1}. ${file}  ·  ${s.title}`;
    });
  const q = quote(ids.length);
  const price = q.price !== null ? `\n\nTotal: ${naira(q.price)}${q.label ? ` (${q.label})` : ''}` : '';
  const text =
    `Hi David, I'd like these ${lines.length} looks from Dave Studio:\n\n` +
    lines.join('\n') +
    price +
    `\n\nI'll send my photos next.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function CartDrawer() {
  const { ids, count, remove, clear, open, setOpen } = useSelection();
  const q = quote(count);
  const enough = count >= MIN_LOOKS;

  // Lock the page behind the drawer and allow Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[600] bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your selection"
        className={`fixed right-0 top-0 z-[700] flex h-dvh w-full max-w-[460px] flex-col border-l border-[var(--line)] bg-[var(--ink-2)] transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
          <div>
            <p className="label text-[var(--accent)]">Your selection</p>
            <p className="mt-1 text-sm text-[var(--on-ink-2)]">
              {count} {count === 1 ? 'look' : 'looks'} chosen
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] text-lg transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* min-h-0 is load-bearing: a flex child defaults to min-height:auto, which
            lets it grow past the flex parent's bound instead of clipping — so
            without it overflow-y-auto never actually engages, and a full list
            just pushes the price/CTA footer off-screen. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {count === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="editorial text-2xl text-[var(--on-ink)]">Nothing picked yet.</p>
              <p className="body-text mt-3 max-w-[26ch]">
                Tap any portrait in the gallery and it lands here.
              </p>
              <Link
                href="/campus/"
                onClick={() => setOpen(false)}
                className="btn btn-ghost mt-7"
              >
                Browse Campus
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {ids.map((id, i) => {
                const s = shotById.get(id);
                return (
                  <li key={id} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-right text-xs text-[var(--on-ink-3)]">
                      {i + 1}
                    </span>
                    <div className="h-[68px] w-[52px] shrink-0 overflow-hidden rounded-md bg-[var(--ink-3)]">
                      <ShotImage id={id} size="thumb" alt={s?.title ?? ''} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--on-ink)]">{s?.title}</p>
                      <p className="label mt-0.5 text-[var(--on-ink-3)]">
                        {s?.kind === 'nysc' ? 'NYSC' : 'Campus'}
                        {s?.ref != null && ` · ${String(s.ref).padStart(3, '0')}`}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(id)}
                      className="shrink-0 text-xs text-[var(--on-ink-3)] transition-colors hover:text-[var(--accent)]"
                      aria-label={`Remove ${s?.title}`}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--line)] px-6 py-5">
          {/* Every count from 5 up has its own real price — see lib/site.ts
              priceFor(). The nudge just points at the next round number, since
              10 is still the best per-look rate even though nothing in between
              is free. */}
          {!enough && (
            <p className="mb-3 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-center text-xs text-[var(--accent)]">
              {MIN_LOOKS - count} more to unlock pricing — starts at {naira(priceFor(MIN_LOOKS) ?? 0)} for {MIN_LOOKS}
            </p>
          )}
          {enough && q.next && (
            <p className="mb-3 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-center text-xs text-[var(--accent)]">
              Add {q.remaining} more to reach {q.next.looks} for {naira(q.next.naira)} total
            </p>
          )}

          <div className="mb-4 flex items-baseline justify-between">
            <span className="label text-[var(--on-ink-2)]">
              {q.label ?? (enough ? `${count} looks` : `Minimum ${MIN_LOOKS}`)}
            </span>
            <span className="display text-2xl text-[var(--on-ink)]">
              {q.price !== null ? naira(q.price) : '—'}
            </span>
          </div>

          <a
            href={enough ? whatsappHref(ids) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!enough}
            onClick={(e) => !enough && e.preventDefault()}
            className={`btn w-full justify-center ${
              enough ? 'btn-gold' : 'cursor-not-allowed border border-[var(--line)] text-[var(--on-ink-3)]'
            }`}
          >
            {enough ? 'Send to David on WhatsApp' : `Pick ${MIN_LOOKS - count} more`}
          </a>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[0.7rem] text-[var(--on-ink-3)]">
              You approve before you pay.
            </p>
            {count > 0 && (
              <button
                onClick={clear}
                className="text-[0.7rem] text-[var(--on-ink-3)] underline transition-colors hover:text-[var(--accent)]"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
