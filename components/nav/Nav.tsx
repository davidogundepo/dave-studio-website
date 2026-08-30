'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelection } from '@/components/providers/SelectionProvider';
import { site } from '@/lib/site';

const links = [
  { href: '/campus/', label: 'Campus' },
  { href: '/nysc/', label: 'NYSC' },
  { href: '/#how', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function Nav() {
  const { count, setOpen } = useSelection();
  const [solid, setSolid] = useState(false);
  const [bump, setBump] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pulse the badge whenever the count changes, so a tap far down the grid
  // still registers visually up in the bar.
  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 420);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[400] transition-colors duration-500 ${
        solid ? 'border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_88%,transparent)] backdrop-blur-xl' : ''
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dave Studio, home">
          <img src="/brand/mark-dark.png" alt="" width={34} height={34} className="rounded-md" />
          <span className="editorial text-[1.4rem] not-italic tracking-tight">
            Dave Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`label transition-colors duration-300 hover:text-[var(--accent)] ${
                path === l.href ? 'text-[var(--accent)]' : 'text-[var(--on-ink-2)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="btn btn-gold relative !px-5 !py-2.5 text-[0.82rem]"
          aria-label={`Your selection, ${count} ${count === 1 ? 'look' : 'looks'}`}
        >
          Selection
          <span
            aria-hidden
            className={`grid h-6 min-w-6 place-items-center rounded-full bg-[#0A0A0B] px-1.5 text-[0.72rem] font-bold text-[var(--accent)] transition-transform duration-300 ${
              bump ? 'scale-125' : 'scale-100'
            }`}
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
