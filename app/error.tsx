'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Without this a thrown render error takes the whole page to blank white — on a
 * site whose entire job is to show photographs, that reads as broken rather than
 * as one failed component.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-[80svh] place-items-center px-[var(--gutter)] py-24 text-center">
      <div className="max-w-[46ch]">
        <p className="label text-[var(--accent)]">✦ Something broke</p>
        <h1 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
          That did not load the way it should.
        </h1>
        <p className="body-text mt-5">
          Your selection is saved. Try again, and if it keeps happening send David a message —
          he would rather hear about it than not.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn btn-gold">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to the start
          </Link>
        </div>
      </div>
    </section>
  );
}
