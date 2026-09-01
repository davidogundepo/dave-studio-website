'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, whenVisible } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fades and lifts its children into view once. The hidden starting state is
 * set here in JS (see below), not in CSS — see globals.css for why: a CSS
 * rule that hides content up front depends on JS to ever bring it back.
 */
export default function Reveal({
  children,
  y = 34,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      // Nothing is hidden unless we are certain we can animate it back. If the
      // tab is hidden the rAF clock is stopped, so we leave the content alone.
      if (prefersReducedMotion() || document.hidden) return;

      // useGSAP runs before paint, so this start state never flashes.
      gsap.set(node, { opacity: 0, y });

      return whenVisible(() =>
        gsap.fromTo(
          node,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          },
        ),
      );
    },
    { scope: el },
  );

  return (
    <div ref={el} data-reveal className={className}>
      {children}
    </div>
  );
}
