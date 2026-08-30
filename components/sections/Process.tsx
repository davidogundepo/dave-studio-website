import Reveal from './Reveal';
import { process } from '@/lib/copy';

export default function Process() {
  return (
    <section id="how" className="scroll-mt-24 bg-[var(--paper)] py-[clamp(5rem,11vh,9rem)] text-[var(--on-paper)]">
      <div className="shell">
        <Reveal>
          <p className="label" style={{ color: 'var(--accent-deep)' }}>
            {process.eyebrow}
          </p>
          <h2 className="display mt-5 max-w-[15ch] text-[clamp(2.1rem,5.6vw,4.6rem)]">
            {process.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {process.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="border-t pt-6" style={{ borderColor: 'var(--line-paper)' }}>
                <p className="display text-[clamp(2.6rem,5vw,3.4rem)]" style={{ color: 'var(--accent-deep)' }}>
                  {s.n}
                </p>
                <p className="display mt-4 text-xl">{s.t}</p>
                <p
                  className="mt-3 text-[0.98rem] leading-relaxed"
                  style={{ color: 'var(--on-paper-2)' }}
                >
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
