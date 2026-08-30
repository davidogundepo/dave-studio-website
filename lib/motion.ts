/**
 * Entrance animations are driven by requestAnimationFrame, which browsers
 * throttle to a stop while a tab is hidden. A page opened in a background tab
 * therefore freezes its intro part-way and can leave headings stuck off-screen
 * or at opacity 0 — content the visitor never sees.
 *
 * `whenVisible` runs the animation now if the tab is visible, and otherwise
 * waits for it to become visible before running. `settle` is the escape hatch:
 * the final, safe state to apply when we choose not to animate at all.
 */
export function whenVisible(play: () => void): () => void {
  if (typeof document === 'undefined') return () => {};

  if (!document.hidden) {
    play();
    return () => {};
  }

  const onChange = () => {
    if (document.hidden) return;
    document.removeEventListener('visibilitychange', onChange);
    play();
  };
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
