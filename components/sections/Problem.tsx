import Reveal from './Reveal';
import { problem } from '@/lib/copy';

export default function Problem() {
  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell">
        <Reveal>
          <h2 className="display max-w-[18ch] text-[clamp(2.1rem,5.4vw,4.4rem)]">
            {problem.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="body-text mt-7 max-w-[58ch]">{problem.body}</p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
          {problem.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="h-full bg-[var(--ink)] p-8">
                <p className="display text-[clamp(2.4rem,5vw,3.6rem)] text-[var(--accent)]">
                  {s.figure}
                </p>
                <p className="label mt-3 text-[var(--on-ink-3)]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
