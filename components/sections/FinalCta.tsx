import Link from 'next/link';
import ShotImage from '@/components/media/ShotImage';
import Reveal from './Reveal';
import { finalCta } from '@/lib/copy';
import { site, waHref } from '@/lib/site';
import type { Shot } from '@/lib/types';

export default function FinalCta({ backdrop }: { backdrop: Shot }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.22]" aria-hidden>
        <ShotImage id={backdrop.id} size="wide" alt="" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--ink) 12%, color-mix(in srgb, var(--ink) 60%, transparent) 70%, var(--ink) 100%)',
        }}
        aria-hidden
      />

      <div className="shell relative z-10 py-[clamp(6rem,15vh,11rem)] text-center">
        <Reveal>
          <p className="label text-[var(--accent)]">✦ Ready when you are</p>
          <h2 className="display mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,7vw,6rem)]">
            {finalCta.title}
          </h2>
          <p className="body-text mx-auto mt-6 max-w-[46ch]">{finalCta.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/campus/" className="btn btn-gold">
              Start with Campus
            </Link>
            <Link href="/nysc/" className="btn btn-ghost">
              Start with NYSC
            </Link>
          </div>
          <p className="label mt-8 text-[var(--on-ink-3)]">
            or WhatsApp{' '}
            <a
              href={waHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)]"
            >
              {site.whatsappDisplay}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
