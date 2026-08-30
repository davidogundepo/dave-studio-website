import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Problem from '@/components/sections/Problem';
import Bento from '@/components/sections/Bento';
import Process from '@/components/sections/Process';
import Pricing from '@/components/sections/Pricing';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import { featured, featuredCampus, featuredNysc, pick } from '@/lib/gallery';

export default function Home() {
  // Deterministic picks so the homepage is identical on every build.
  // Every image on this page comes from David's hand-picked set. Nothing here is
  // drawn from the full 529 — the homepage is the first impression, and a
  // generation with a displaced limb is not what it should be made of.
  //
  // The wall deals six columns off one shuffled deck, so no face repeats.
  const deck = pick(featured, featured.length, 12);
  const per = Math.floor(deck.length / 6);
  const heroColumns = Array.from({ length: 6 }, (_, i) => deck.slice(i * per, (i + 1) * per));

  const marqueeTop = pick(featuredCampus, 14, 11);
  const marqueeBottom = pick(featuredNysc, 14, 5);
  const bentoWide = pick(featuredCampus, 2, 41);
  const bentoTall = [...pick(featuredNysc, 1, 23), ...pick(featuredCampus, 1, 67)];
  const ctaBackdrop = pick(featuredCampus, 1, 90)[0];

  return (
    <>
      <Hero columns={heroColumns} />
      <Marquee top={marqueeTop} bottom={marqueeBottom} />
      <Problem />
      <Bento wide={bentoWide} tall={bentoTall} />
      <Process />
      <Pricing />
      <Faq />
      <FinalCta backdrop={ctaBackdrop} />
    </>
  );
}
