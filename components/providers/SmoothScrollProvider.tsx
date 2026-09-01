'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '@/lib/anchorScroll';

/**
 * Lenis drives the page scroll so GSAP's ScrollTrigger reads one consistent
 * position. Disabled entirely for reduced-motion users, who get native scroll.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
    setLenisInstance(lenis);
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
