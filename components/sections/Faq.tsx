'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { faqs, urgency } from '@/lib/copy';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <p className="label text-[var(--accent)]">Before you ask</p>
          <h2 className="display mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)]">{urgency.title}</h2>
          <p className="body-text mt-6">{urgency.body}</p>
        </Reveal>

        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.03}>
                <div className="border-b border-[var(--line)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="text-[1.02rem] font-medium">{f.q}</span>
                    <span
                      className="mt-0.5 shrink-0 text-[var(--accent)] transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                      transitionTimingFunction: 'var(--ease)',
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="body-text pb-6 pr-8 text-[0.97rem]">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
