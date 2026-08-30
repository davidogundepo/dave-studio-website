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
 * A cached image can finish decoding before React attaches onLoad, so the event
 * never fires and the tile would stay invisible. Checking `complete` on mount
 * closes that gap.
 */
export default function ShotImage({ id, size, alt, className = '', priority, sizes }: Props) {
  const [ready, setReady] = useState(false);

  const measure = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setReady(true);
  }, []);

  return (
    <img
      ref={measure}
      src={src(id, size)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      onLoad={() => setReady(true)}
      className={`h-full w-full object-cover transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
}
