import type { Metadata } from 'next';
import GalleryBrowser from '@/components/gallery/GalleryBrowser';
import { campusShots } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Campus & convocation looks',
  description:
    'Every graduation look in the Dave Studio catalogue — gowns, hoods, stoles, family groups, magazine covers. Pick the ones you want.',
};

export default function CampusPage() {
  return (
    <section className="pb-24 pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="shell">
        <p className="label text-[var(--accent)]">Campus · {campusShots.length} looks</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]">
          Every gown you never
          <br />
          got to wear twice.
        </h1>
        <p className="body-text mt-5 max-w-[52ch]">
          Convocation, induction, matriculation, doctoral. Tap any portrait to add it to your
          selection — five for ₦10,000, ten for ₦20,000.
        </p>
        <div className="mt-10">
          <GalleryBrowser shots={campusShots} />
        </div>
      </div>
    </section>
  );
}
