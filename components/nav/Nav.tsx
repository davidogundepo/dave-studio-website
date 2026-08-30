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
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  // Close the sheet on navigation, or it stays open over the new page.
  useEffect(() => setMenu(false), [path]);

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menu]);

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
        solid || menu
          ? 'border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ink)_92%,transparent)] backdrop-blur-xl'
          : ''
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dave Studio, home">
          <img src="/brand/mark-dark.png" alt="" width={34} height={34} className="rounded-md" />
          <span className="editorial whitespace-nowrap text-[1.15rem] not-italic tracking-tight sm:text-[1.4rem]">
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

        <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="btn btn-gold relative !px-5 !py-2.5 text-[0.82rem]"
          aria-label={`Your selection, ${count} ${count === 1 ? 'look' : 'looks'}`}
        >
          <span className="hidden sm:inline">Selection</span>
          <span className="sm:hidden">Picked</span>
          <span
            aria-hidden
            className={`grid h-6 min-w-6 place-items-center rounded-full bg-[#0A0A0B] px-1.5 text-[0.72rem] font-bold text-[var(--accent)] transition-transform duration-300 ${
              bump ? 'scale-125' : 'scale-100'
            }`}
          >
            {count}
          </span>
        </button>

        <button
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-label={menu ? 'Close menu' : 'Open menu'}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] transition-colors hover:border-[var(--accent)] md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className="absolute inset-x-0 block h-px bg-current transition-transform duration-300"
              style={{ top: menu ? '50%' : 0, transform: menu ? 'rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute inset-x-0 block h-px bg-current transition-transform duration-300"
              style={{ bottom: menu ? '50%' : 0, transform: menu ? 'rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile sheet. The bar has no room for four links beside the selection
          button, and Campus / NYSC are the whole point of the site. */}
      <div
        className={`fixed inset-x-0 top-[var(--nav-h)] z-[390] border-b border-[var(--line)] bg-[var(--ink-2)] transition-all duration-400 md:hidden ${
          menu ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <nav className="shell flex flex-col py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className="display border-b border-[var(--line)] py-4 text-[1.6rem] transition-colors last:border-0 hover:text-[var(--accent)]"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label py-4 text-[var(--accent)]"
          >
            WhatsApp {site.whatsappDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
