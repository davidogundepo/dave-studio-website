import Link from 'next/link';
import ShotImage from '@/components/media/ShotImage';
import Reveal from './Reveal';
import { solution } from '@/lib/copy';
import type { Shot } from '@/lib/types';

/**
 * The bento runs on a fixed row height rather than per-tile aspect ratios —
 * aspect-ratio and row-span fight each other, and the tiles end up sized by
 * whichever wins. Rows are a known height, tiles span them, images fill.
 *
 * Wide tiles use the 16:9 derivative and tall tiles the 3:4, so nothing is
 * letterboxed or stretched to fit its box.
 */
export default function Bento({ wide, tall }: { wide: Shot[]; tall: Shot[] }) {
  const Img = ({ shot, size }: { shot: Shot; size: 'wide' | 'card' }) => (
    <div className="h-full w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--ink-3)]">
      <ShotImage id={shot.id} size={size} alt={shot.title} />
    </div>
  );

  const Card = ({ t, d }: { t: string; d: string }) => (
    <div className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--line)] p-6">
      <span className="text-[var(--accent)]" aria-hidden>
        ✦
      </span>
      <div className="mt-6">
        <p className="display text-lg leading-tight">{t}</p>
        <p className="body-text mt-2 text-[0.86rem] leading-snug">{d}</p>
      </div>
    </div>
  );

  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell">
        <Reveal>
          <p className="label text-[var(--accent)]">{solution.eyebrow}</p>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2.1rem,5.6vw,4.6rem)]">
            {solution.title}
          </h2>
          <p className="body-text mt-6 max-w-[54ch]">{solution.body}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-14 grid grid-cols-2 gap-3 [grid-auto-rows:150px] lg:grid-cols-4 lg:[grid-auto-rows:180px]">
            <div className="col-span-2 row-span-2">
              <Img shot={wide[0]} size="wide" />
            </div>
            <div className="col-span-1 row-span-2">
              <Img shot={tall[0]} size="card" />
            </div>
            <div className="col-span-1 row-span-2">
              <Card t={solution.points[0].t} d={solution.points[0].d} />
            </div>

            <div className="col-span-1 row-span-2">
              <Card t={solution.points[1].t} d={solution.points[1].d} />
            </div>
            <div className="col-span-1 row-span-2">
              <Img shot={tall[1]} size="card" />
            </div>
            <div className="col-span-2 row-span-2">
              <Img shot={wide[1]} size="wide" />
            </div>

            <div className="col-span-2 row-span-2 lg:col-span-1">
              <Card t={solution.points[2].t} d={solution.points[2].d} />
            </div>
            <div className="col-span-2 row-span-2 lg:col-span-3">
              <div className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] bg-[var(--accent)] p-7 text-[#04191D] sm:p-9">
                <p className="display text-[clamp(1.4rem,2.8vw,2.4rem)] leading-tight">
                  529 looks. Two galleries.
                  <br />
                  One face — yours.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link href="/campus/" className="btn bg-[#04191D] !py-3 text-[var(--on-ink)]">
                    Campus · 339
                  </Link>
                  <Link
                    href="/nysc/"
                    className="btn border border-[#04191D]/40 !py-3 text-[#04191D]"
                  >
                    NYSC · 190
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
