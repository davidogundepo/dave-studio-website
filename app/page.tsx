import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Problem from '@/components/sections/Problem';
import Bento from '@/components/sections/Bento';
import Process from '@/components/sections/Process';
import Pricing from '@/components/sections/Pricing';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import { campusShots, nyscShots, pick } from '@/lib/gallery';

export default function Home() {
  // Deterministic picks so the homepage is identical on every build.
  // Six columns of eight, drawn from both galleries so the wall shows the whole
  // catalogue rather than only convocation gowns.
  const pool = [...campusShots, ...nyscShots];
  const heroColumns = Array.from({ length: 6 }, (_, i) => pick(pool, 8, 7 + i * 37));
  const marqueeTop = pick(campusShots, 14, 11);
  const marqueeBottom = pick(nyscShots, 14, 5);
  const bentoWide = pick(campusShots, 2, 41);
  const bentoTall = [...pick(nyscShots, 1, 23), ...pick(campusShots, 1, 67)];
  const ctaBackdrop = pick(campusShots, 1, 90)[0];

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
