'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { glideToHash, pushHash } from '@/lib/anchorScroll';

/**
 * A Link to an in-page anchor ("/#pricing") that glides there through Lenis
 * instead of the browser's instant jump-cut, when we're already on the page
 * the section lives on. From anywhere else it's a plain navigation — the
 * section doesn't exist to scroll to until the new page has loaded.
 */
export default function AnchorLink({
  href,
  className,
  children,
}: {
  href: `/#${string}`;
  className?: string;
  children: ReactNode;
}) {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (path !== '/') return;
        const hash = href.slice(1);
        e.preventDefault();
        if (glideToHash(hash)) pushHash(href);
        else window.location.hash = hash;
      }}
    >
      {children}
    </Link>
  );
}
