import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export to Firebase Hosting, same as the other two sites.
  output: 'export',
  // No image optimizer on static hosting; every gallery image is a pre-built
  // WebP derivative from scripts/build_media.py and already correctly sized.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
