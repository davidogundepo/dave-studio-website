'use client';

import { useEffect } from 'react';

/**
 * Freezes the page behind a modal (drawer, lightbox) while it's open.
 *
 * Just setting `overflow: hidden` on body isn't enough — on this layout `html`
 * is the actual scrolling element, so that left the page behind fully
 * scrollable, and a wheel/trackpad gesture over the modal scrolled the page
 * instead of the modal's own content. Also, hiding overflow on the scrolling
 * element itself resets its scroll offset to 0 in most browsers — so a naive
 * fix that adds `overflow: hidden` to html snaps the page to the top and
 * never gives it back, which is worse than the bug it fixes.
 *
 * The reliable pattern: pin the body at its current scroll offset with
 * `position: fixed`, so it structurally cannot scroll no matter what the
 * input device does, then release the pin and restore the exact scroll
 * position on close.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
    };

    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
