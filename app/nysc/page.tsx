import type { Metadata } from 'next';
import GalleryBrowser from '@/components/gallery/GalleryBrowser';
import { nyscShots } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'NYSC looks',
  description:
    'NYSC portraits — camp, parade ground, passing out, studio. The kit is identical in every state, so every look here works wherever you served.',
};

export default function NyscPage() {
  return (
    <section className="pb-24 pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="shell">
        <p className="label" style={{ color: 'var(--amber)' }}>
          NYSC · {nyscShots.length} looks
        </p>
        <h1 className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]">
          One year of service.
          <br />
          Worth more than one photo.
        </h1>
        <p className="body-text mt-5 max-w-[52ch]">
          Camp, parade ground, passing out, studio. The khaki is identical from Sokoto to Bayelsa —
          so every look here works whichever state posted you.
        </p>
        <div className="mt-10">
          <GalleryBrowser shots={nyscShots} accent="var(--amber)" />
        </div>
      </div>
    </section>
  );
}
