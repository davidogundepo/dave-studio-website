'use client';

import { useEffect } from 'react';
import ShotImage from '@/components/media/ShotImage';
import { useSelection } from '@/components/providers/SelectionProvider';
import type { Shot } from '@/lib/types';

export default function Lightbox({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  const { has, toggle } = useSelection();

  useEffect(() => {
    if (!shot) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [shot, onClose]);

  if (!shot) return null;
  const on = has(shot.id);

  return (
    <div
      className="fixed inset-0 z-[800] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={shot.title}
    >
      <div
        className="flex max-h-full w-full max-w-[min(92vw,560px)] flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--ink-3)]"
          style={{ aspectRatio: '3 / 4' }}
        >
          <ShotImage id={shot.id} size="full" alt={shot.title} priority />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm text-[var(--on-ink)]">{shot.title}</p>
            <p className="label mt-1 text-[var(--on-ink-3)]">
              {shot.kind === 'nysc' ? 'NYSC' : 'Campus'}
              {shot.ref !== null && ` · ${String(shot.ref).padStart(3, '0')}`}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => toggle(shot.id)}
              className={`btn ${on ? 'btn-ghost' : 'btn-gold'} !px-5 !py-2.5 text-[0.82rem]`}
            >
              {on ? 'Remove' : 'Choose this'}
            </button>
            <button
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
