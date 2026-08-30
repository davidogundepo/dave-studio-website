'use client';

import ShotImage from '@/components/media/ShotImage';
import type { Shot } from '@/lib/types';

/**
 * Two rows drifting in opposite directions. Duplicated once so the translate can
 * loop seamlessly at -50%. Pure CSS — no scroll listener, no rAF.
 */
export default function Marquee({ top, bottom }: { top: Shot[]; bottom: Shot[] }) {
  const Row = ({ shots, reverse }: { shots: Shot[]; reverse?: boolean }) => (
    <div className="flex w-max gap-3" style={{ animation: `${reverse ? 'drift-r' : 'drift-l'} 64s linear infinite` }}>
      {[...shots, ...shots].map((s, i) => (
        <div
          key={`${s.id}-${i}`}
          className="w-[clamp(130px,15vw,215px)] shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--ink-3)]"
          style={{ aspectRatio: '3 / 4' }}
        >
          <ShotImage id={s.id} size="card" alt="" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-y border-[var(--line)] py-4" aria-hidden>
      <style>{`
        @keyframes drift-l { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes drift-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @media (prefers-reduced-motion: reduce) {
          [style*="drift-"] { animation: none !important }
        }
      `}</style>
      <Row shots={top} />
      <div className="h-3" />
      <Row shots={bottom} reverse />
    </section>
  );
}
