'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ShotImage from '@/components/media/ShotImage';
import { hero } from '@/lib/copy';
import { prefersReducedMotion, whenVisible } from '@/lib/motion';
import type { Shot } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A wall of faces behind the headline: six columns drifting vertically at
 * different speeds, alternating direction. The drift is a CSS animation rather
 * than a rAF loop, so a throttled tab pauses it instead of stranding it.
 *
 * On scroll the columns push apart and sink, which hands the page over to the
 * section beneath instead of just scrolling away.
 */
export default function Hero({ columns }: { columns: Shot[][] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cols = gsap.utils.toArray<HTMLElement>('[data-col]');
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');

      if (prefersReducedMotion()) return;

      const stopWaiting = whenVisible(() => {
        gsap.from(lines, {
          yPercent: 108,
          duration: 1.25,
          ease: 'power4.out',
          stagger: 0.085,
        });
        gsap.from('[data-hero-tail]', {
          opacity: 0,
          y: 26,
          duration: 1,
          delay: 0.5,
          ease: 'power3.out',
          stagger: 0.08,
        });
      });

      // Dispersal on scroll: outer columns travel furthest, so the wall opens
      // from the middle out rather than sliding as one slab.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=95%', scrub: 0.65 },
      });

      cols.forEach((col) => {
        const spread = Number(col.dataset.spread);
        tl.to(col, { xPercent: spread, yPercent: 12, scale: 0.9, ease: 'none' }, 0);
      });
      tl.to('[data-wall]', { opacity: 0.25, ease: 'none' }, 0);
      tl.to('[data-hero-copy]', { y: -70, opacity: 0, ease: 'none' }, 0);

      return stopWaiting;
    },
    { scope: root },
  );

  // speed, direction and how far each column flies apart on scroll
  const cfg = [
    { dur: 58, rev: false, spread: -78 },
    { dur: 74, rev: true, spread: -46 },
    { dur: 64, rev: false, spread: -16 },
    { dur: 80, rev: true, spread: 16 },
    { dur: 62, rev: false, spread: 46 },
    { dur: 70, rev: true, spread: 78 },
  ];

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[clamp(2.5rem,6vh,4.5rem)] pt-[var(--nav-h)]"
    >
      <style>{`
        @keyframes wall-up   { from { transform: translateY(0) }    to { transform: translateY(-50%) } }
        @keyframes wall-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          [data-track] { animation: none !important }
        }
      `}</style>

      {/* the wall */}
      <div
        data-wall
        className="pointer-events-none absolute inset-0 z-0 flex justify-center gap-2 sm:gap-3"
        aria-hidden
      >
        {columns.map((col, i) => (
          <div
            key={i}
            data-col
            data-spread={cfg[i].spread}
            /* The outer pair sits off-screen on a phone. `hidden` keeps their
               lazy images from being fetched over mobile data at all. */
            className={`h-full w-[clamp(104px,17vw,240px)] shrink-0 overflow-hidden ${
              i === 0 || i === 5 ? 'hidden sm:block' : ''
            }`}
            style={{ opacity: i === 0 || i === 5 ? 0.5 : i === 1 || i === 4 ? 0.75 : 1 }}
          >
            <div
              data-track
              className="flex flex-col gap-2 sm:gap-3"
              style={{
                animation: `${cfg[i].rev ? 'wall-down' : 'wall-up'} ${cfg[i].dur}s linear infinite`,
              }}
            >
              {[...col, ...col].map((s, j) => (
                <div
                  key={`${s.id}-${j}`}
                  className="w-full shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--ink-3)]"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  <ShotImage id={s.id} size="thumb" alt="" priority={j < 2 && i > 0 && i < 5} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* scrim: dark enough on the left for the headline, open on the right so
          the wall still reads as photographs rather than texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'linear-gradient(to top, var(--ink) 6%, color-mix(in srgb, var(--ink) 86%, transparent) 34%, color-mix(in srgb, var(--ink) 52%, transparent) 68%, color-mix(in srgb, var(--ink) 62%, transparent) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{
          background:
            'radial-gradient(120% 85% at 8% 78%, color-mix(in srgb, var(--ink) 92%, transparent) 0%, transparent 62%)',
        }}
        aria-hidden
      />

      <div className="shell relative z-10" data-hero-copy>
        <p className="label mb-[clamp(1.25rem,2.5vh,2.25rem)] text-[var(--accent)]" data-hero-tail>
          {hero.eyebrow}
        </p>

        <h1 className="display text-[clamp(2.9rem,9vw,8.2rem)]">
          {hero.headline.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="body-text max-w-[46ch]" data-hero-tail>
            {hero.sub}
          </p>
          <div className="flex flex-wrap items-center gap-3" data-hero-tail>
            <Link href="/campus/" className="btn btn-gold">
              {hero.primary}
            </Link>
            <Link href="#how" className="btn btn-ghost">
              {hero.secondary}
            </Link>
          </div>
        </div>

        <p className="label mt-8 text-[0.62rem] leading-relaxed tracking-[0.16em] text-[var(--on-ink-3)] sm:text-[0.6875rem] sm:tracking-[0.2em]" data-hero-tail>
          <span className="text-[var(--accent)]">✦</span> {hero.proof}
        </p>
      </div>
    </section>
  );
}
