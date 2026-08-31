'use client';

import { useCallback, useState } from 'react';
import { src } from '@/lib/gallery';

type Size = 'thumb' | 'card' | 'wide' | 'full';

interface Props {
  id: string;
  size: Size;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * A plain <img> against the pre-built WebP derivatives. next/image is pointless
 * here: static export has no optimizer and every file is already the right size.
 *
 * Two failure modes are handled, both of which otherwise leave a silent hole in
 * the grid. A cached image can finish decoding before React attaches onLoad, so
 * the event never fires — `complete` on mount closes that. And a request that
 * fails outright would sit at opacity 0 forever, so a failed image falls back to
 * a tinted panel rather than a gap the visitor cannot tell from a loading tile.
 */
export default function ShotImage({ id, size, alt, className = '', priority, sizes }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  const measure = useCallback((node: HTMLImageElement | null) => {
    if (!node?.complete) return;
    setStatus(node.naturalWidth > 0 ? 'ready' : 'failed');
  }, []);

  if (status === 'failed') {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-[var(--ink-3)] p-3 text-center ${className}`}
      >
        <span className="label text-[0.6rem] text-[var(--on-ink-3)]">Preview unavailable</span>
      </span>
    );
  }

  return (
    <img
      ref={measure}
      src={src(id, size)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      onLoad={() => setStatus('ready')}
      onError={() => setStatus('failed')}
      className={`h-full w-full object-cover transition-opacity duration-700 ${
        status === 'ready' ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
}
