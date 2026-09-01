/**
 * Entrance animations are driven by requestAnimationFrame, which browsers
 * throttle to a stop while a tab is hidden. A page opened in a background tab
 * therefore freezes its intro part-way and can leave headings stuck off-screen
 * or at opacity 0 — content the visitor never sees.
 *
 * `whenVisible` runs the animation now if the tab is visible, and otherwise
 * waits for it to become visible before running — BUT never waits longer than
 * `maxWaitMs`. `visibilitychange` is a standard, well-supported event, but the
 * content this gates (everything below the hero) is too important to leave
 * hostage to it: a context that reports hidden and never fires the event —
 * some embedded webviews, some automation, some browser quirk we haven't
 * hit yet — must not be able to leave the page permanently blank. Worst case
 * without a timeout is silence forever; worst case with one is a skipped
 * flourish. `settle` is the escape hatch: the final, safe state to apply when
 * we choose not to animate at all.
 */
export function whenVisible(play: () => void, maxWaitMs = 1200): () => void {
  if (typeof document === 'undefined') return () => {};

  if (!document.hidden) {
    play();
    return () => {};
  }

  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    document.removeEventListener('visibilitychange', onChange);
    clearTimeout(timer);
    play();
  };
  const onChange = () => !document.hidden && fire();
  document.addEventListener('visibilitychange', onChange);
  const timer = setTimeout(fire, maxWaitMs);

  return () => {
    done = true;
    document.removeEventListener('visibilitychange', onChange);
    clearTimeout(timer);
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
