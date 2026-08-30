import Link from 'next/link';
import Reveal from './Reveal';
import { bundles, naira, savingOn, site } from '@/lib/site';
import { guarantee } from '@/lib/copy';

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-[clamp(5rem,11vh,9rem)]">
      <div className="shell">
        <Reveal>
          <p className="label text-[var(--accent)]">Pricing</p>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2.1rem,5.6vw,4.6rem)]">
            Two bundles. No session fee. No deposit.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {bundles.map((b, i) => (
            <Reveal key={b.looks} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col justify-between rounded-[var(--radius-lg)] p-8 sm:p-10 ${
                  i === 1
                    ? 'bg-[var(--accent)] text-[#04191D]'
                    : 'border border-[var(--line)]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="label">{b.label}</p>
                    {i === 1 && (
                      <span className="rounded-full bg-[#04191D] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--accent)]">
                        Most picked
                      </span>
                    )}
                  </div>
                  <p className="display mt-5 text-[clamp(3rem,7vw,4.6rem)]">{naira(b.naira)}</p>
                  <p className={`mt-2 text-sm ${i === 1 ? 'text-[#04191D]/75' : 'text-[var(--on-ink-2)]'}`}>
                    {b.looks} finished portraits · {naira(Math.round(b.naira / b.looks))} each
                    {savingOn(i) > 0 && (
                      <>
                        {' · '}
                        <span className="font-semibold">saves {naira(savingOn(i))}</span>
                      </>
                    )}
                  </p>

                  <ul className={`mt-8 flex flex-col gap-3 text-sm ${i === 1 ? 'text-[#04191D]/85' : 'text-[var(--on-ink-2)]'}`}>
                    {[
                      'Print-resolution files, yours to keep',
                      'Back within 24 hours',
                      'Unlimited reshoots until you approve',
                      'Pay only after you have seen them',
                    ].map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <span className={i === 1 ? 'text-[#04191D]' : 'text-[var(--accent)]'}>✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/campus/"
                  className={`btn mt-10 justify-center ${
                    i === 1 ? 'bg-[#04191D] text-[var(--on-ink)]' : 'btn-gold'
                  }`}
                >
                  Pick {b.looks} looks
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--accent)]/35 bg-[var(--accent-soft)] p-8 sm:p-10">
            <p className="label text-[var(--accent)]">{guarantee.eyebrow}</p>
            <p className="display mt-4 max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.6rem)]">
              {guarantee.title}
            </p>
            <p className="body-text mt-4 max-w-[62ch]">{guarantee.body}</p>
            <p className="label mt-5 text-[var(--on-ink-3)]">{guarantee.small}</p>
          </div>
        </Reveal>

        <p className="mt-6 text-center text-sm text-[var(--on-ink-3)]">
          Questions first?{' '}
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Message David on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
